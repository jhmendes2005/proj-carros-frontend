import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';

interface FindAllParams {
  q?: string;
  marca?: string;
  modelo?: string;
  tipo?: string;
  anoMin?: number;
  anoMax?: number;
  precoMin?: number;
  precoMax?: number;
  sort?: string;
}

@Injectable()
export class VehiclesService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: FindAllParams = {}) {
    const { q, marca, modelo, tipo, anoMin, anoMax, precoMin, precoMax, sort } = params;

    let orderBy: any = { criadoem: 'desc' };
    if (sort === 'price_asc') orderBy = { preco: 'asc' };
    else if (sort === 'price_desc') orderBy = { preco: 'desc' };

    return this.prisma.vehicle.findMany({
      where: {
        ...(q && {
          OR: [
            { marca: { contains: q, mode: 'insensitive' } },
            { modelo: { contains: q, mode: 'insensitive' } },
            { versao: { contains: q, mode: 'insensitive' } },
          ],
        }),
        ...(marca && { marca: { contains: marca, mode: 'insensitive' } }),
        ...(modelo && { modelo: { contains: modelo, mode: 'insensitive' } }),
        ...(tipo && { tipo: { contains: tipo, mode: 'insensitive' } }),
        ...((anoMin || anoMax) && {
          anoModelo: {
            ...(anoMin && { gte: anoMin }),
            ...(anoMax && { lte: anoMax }),
          },
        }),
        ...((precoMin || precoMax) && {
          preco: {
            ...(precoMin && { gte: precoMin }),
            ...(precoMax && { lte: precoMax }),
          },
        }),
      },
      orderBy,
    });
  }

  findOne(slug: string) {
    return this.prisma.vehicle.findUnique({ where: { slug } });
  }

  create(data: any) {
    return this.prisma.vehicle.create({ data });
  }

  update(id: number, data: any) {
    return this.prisma.vehicle.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.vehicle.delete({ where: { id } });
  }

  async search(query: string) {
    if (!query || query.length < 3) return [];
    return this.prisma.vehicle.findMany({
      where: {
        OR: [
          { marca: { contains: query, mode: 'insensitive' } },
          { modelo: { contains: query, mode: 'insensitive' } },
          { versao: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: 5,
      select: { slug: true, marca: true, modelo: true, anoModelo: true, fotos: true },
    });
  }

  // --- FILTROS DINÂMICOS ATUALIZADOS ---

  async getFilterBrands(type?: string) {
    const where: any = {};
    if (type) where.tipo = { contains: type, mode: 'insensitive' };

    const brands = await this.prisma.vehicle.findMany({ 
        where,
        select: { marca: true }, 
        distinct: ['marca'], 
        orderBy: { marca: 'asc' } 
    });
    return brands.map(v => v.marca);
  }

  async getFilterModels(brand?: string, type?: string) {
    const where: any = {};
    if (brand) where.marca = { contains: brand, mode: 'insensitive' };
    if (type) where.tipo = { contains: type, mode: 'insensitive' };

    const models = await this.prisma.vehicle.findMany({ 
        where, 
        select: { modelo: true }, 
        distinct: ['modelo'], 
        orderBy: { modelo: 'asc' } 
    });
    return models.map(v => v.modelo);
  }

  async getFilterYears(brand?: string, model?: string, type?: string) {
    const where: any = { anoModelo: { not: null } };
    if (brand) where.marca = { contains: brand, mode: 'insensitive' };
    if (model) where.modelo = { contains: model, mode: 'insensitive' };
    if (type) where.tipo = { contains: type, mode: 'insensitive' };

    const years = await this.prisma.vehicle.findMany({ 
        select: { anoModelo: true }, 
        where, 
        distinct: ['anoModelo'], 
        orderBy: { anoModelo: 'desc' } 
    });
    return years.map(v => v.anoModelo).filter(Boolean) as number[];
  }

  async findFeatured(count = 6) {
    return this.prisma.$queryRawUnsafe(`SELECT "id", "slug", "marca", "modelo", "anoModelo", "preco", "quilometragem", "fotos" FROM "vehicle" ORDER BY RANDOM() LIMIT ${count};`);
  }

  // ================================
  // CLASSIFICAÇÃO VIA WEBHOOK (COM TIMEOUT E LOGS)
  // ================================
  private async classifyVehicle(vehicleData: { marca: string; modelo: string; versao?: string }): Promise<string | null> {
    const webhookUrl = process.env.TYPE_WEBHOOK_URL;
    if (!webhookUrl) {
        // console.warn("[Classificação] Variável TYPE_WEBHOOK_URL não definida no .env");
        return null;
    }

    try {
      // Timeout manual de 5s para não travar o sync
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(vehicleData),
        signal: controller.signal as any
      });
      
      clearTimeout(timeoutId);

      if (response.ok) {
        const result = (await response.json()) as any;
        
        // 🔹 CORREÇÃO AQUI: Tratamento para resposta do n8n que vem como array: [ { output: 'carro' } ]
        // Se for array, pega o primeiro item. Se for objeto, usa ele mesmo.
        const data = Array.isArray(result) ? result[0] : result;
        
        // Busca em várias chaves possíveis: output (n8n padrão), tipo, type
        const tipo = data?.output || data?.tipo || data?.type;

        if (tipo) {
            console.log(`[Classificação] ${vehicleData.modelo} -> ${tipo}`);
            return tipo;
        }
      }
    } catch (error) {
      // Ignora erro de abort (timeout) para não poluir log
      if (!String(error).includes('aborted')) {
          console.warn(`[Classificação] Falha no Webhook para ${vehicleData.modelo}:`, error instanceof Error ? error.message : error);
      }
    }
    return null;
  }

  // ================================
  // IMPORTAÇÃO / SINCRONIZAÇÃO
  // ================================
  async processFromJson(url: string, type: string = 'ALTIMUS', db: Prisma.TransactionClient = this.prisma) {
    const deadline = Date.now() + 240000;
    try {
      console.log(`Iniciando sincronização de estoque: ${type}`);
      const res = await fetch(url, {
        signal: AbortSignal.timeout(20000),
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'application/json, text/plain, */*'
        }
      });

      if (!res.ok) throw new Error(`API de estoque retornou HTTP ${res.status}`);
      const textData = await res.text();
      let rawData;
      try {
        rawData = JSON.parse(textData);
      } catch (e) {
        console.error("API retornou conteúdo inválido (HTML?). Início:", textData.slice(0, 100));
        return { success: false, message: "A API externa retornou erro ou HTML inválido." };
      }

      let items: any[] = [];
      if (type === 'AUTOCERTO') {
        const lista = rawData?.estoque?.veiculo;
        items = Array.isArray(lista) ? lista : lista ? [lista] : [];
      } else {
        items = Array.isArray(rawData.veiculos) ? rawData.veiculos : [];
      }

      if (items.length === 0) return { success: false, message: 'Nenhum veículo encontrado na API.' };

      let inseridos = 0;
      let atualizados = 0;
      const idsExternosPresentes: number[] = [];

      for (const item of items) {
        if (Date.now() > deadline) throw new Error('Sincronização excedeu o limite de tempo. Nenhuma alteração será aplicada.');
        let v: any = {};

        if (type === 'AUTOCERTO') {
          v = {
            id: Number(item.idveiculo),
            marca: item.marca,
            modelo: item.modelo,
            versao: item.versao,
            anoFabricacao: item.anomodelo ? Number(String(item.anomodelo).split('/')[0]) : null,
            anoModelo: item.anomodelo ? Number(String(item.anomodelo).split('/')[1] || String(item.anomodelo).split('/')[0]) : null,
            preco: item.preco ? parseFloat(String(item.preco).replace('R$', '').replace(/\./g, '').replace(',', '.').trim()) : 0,
            quilometragem: Number(item.quilometragem),
            placa: item.placa,
            cor: item.cor,
            combustivel: item.combustivel,
            cambio: item.cambio,
            portas: Number(item.numeroportas),
            observacao: item.observacoes,
            fotos: item.fotos?.foto
              ? Array.isArray(item.fotos.foto)
                ? item.fotos.foto.map((f: any) => f.url)
                : [item.fotos.foto.url]
              : [],
            destaque: item.destaque === 'S',
            tipo: item.tipoveiculo
          };
        } else {
          v = {
            ...item,
            id: item.id,
            preco: item.valorVenda,
            quilometragem: item.km,
            fotos: Array.isArray(item.fotos) ? item.fotos : []
          };
        }

        v.id = Number(v.id);
        if (!Number.isSafeInteger(v.id) || v.id <= 0 || !v.marca || !v.modelo || idsExternosPresentes.includes(v.id)) {
          throw new Error('API retornou veículo inválido ou ID duplicado. Importação cancelada.');
        }

        // --- LÓGICA DE CLASSIFICAÇÃO ATUALIZADA ---
        const tipoClassificado = await this.classifyVehicle({
          marca: v.marca,
          modelo: v.modelo,
          versao: v.versao || ''
        });

        if (tipoClassificado) {
            v.tipo = tipoClassificado;
        }

        if (v.id) idsExternosPresentes.push(v.id);

        const slug = `${v.marca}-${v.modelo}-${v.placa || v.id}`
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '');

        // Busca se já existe no banco
        const existente = await db.vehicle.findFirst({
          where: { OR: [{ idExterno: v.id }, { placa: v.placa || undefined }] }
        });

        // ⚠️ AQUI ESTÁ A CORREÇÃO PRINCIPAL ⚠️
        // Se o Webhook falhar (v.tipo null) E o veículo já existe no banco, 
        // usamos o tipo que já estava salvo (existente.tipo) para não apagar a informação.
        const tipoFinal = v.tipo || existente?.tipo || null;

        const dadosBanco = {
          idExterno: v.id,
          slug: existente ? undefined : slug,
          marca: v.marca,
          modelo: v.modelo,
          versao: v.versao,
          anoFabricacao: v.anoFabricacao,
          anoModelo: v.anoModelo,
          preco: v.preco || 0,
          quilometragem: v.quilometragem,
          placa: v.placa,
          cor: v.cor,
          portas: v.portas,
          
          tipo: tipoFinal, // <--- Usamos a variável segura aqui
          
          combustivel: v.combustivel,
          cambio: v.cambio,
          fotos: v.fotos,
          descricao: v.observacao,
          destaque: v.destaque,
          dadosapi: item,
          atualizadoem: new Date(),
          ...(existente ? {} : { dataEntradaEstoque: new Date() })
        };

        if (existente) {
          await db.vehicle.update({ where: { id: existente.id }, data: dadosBanco });
          atualizados++;
        } else {
          await db.vehicle.create({ data: { ...dadosBanco, slug } });
          inseridos++;
        }
      }

      const deleteResult = await db.vehicle.deleteMany({
        where: {
          idExterno: { not: null },
          NOT: { idExterno: { in: idsExternosPresentes } }
        }
      });

      return {
        success: true,
        message: 'Sincronização concluída!',
        inseridos,
        atualizados,
        removidos: deleteResult.count,
        totalProcessados: items.length
      };
    } catch (error) {
      console.error("Erro no sync:", error);
      return { success: false, message: 'Erro ao processar JSON: ' + (error instanceof Error ? error.message : String(error)) };
    }
  }
}