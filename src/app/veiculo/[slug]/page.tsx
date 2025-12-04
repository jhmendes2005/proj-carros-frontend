"use client";

import { useEffect, useState } from "react";
import { api } from "../../../lib/api";
import { useParams } from "next/navigation";
import { trackEvent } from "../../../components/AnalyticsTracker";
import Link from "next/link";
import {
  Calendar,
  Gauge,
  Paintbrush2,
  DollarSign,
  MessageCircle,
  Share2,
  Fuel,
  Cog,
  Star,
  ChevronsRight,
  MapPin,
  CheckCircle2
} from "lucide-react";

// --- Interfaces ---

interface Veiculo {
  id: number;
  slug: string;
  marca: string;
  modelo: string;
  versao: string | null;
  anoFabricacao: number | null;
  anoModelo: number | null;
  preco: number;
  quilometragem: number | null;
  placa: string | null;
  chassi: string | null;
  cor: string | null;
  portas: number | null;
  tipo: string | null;
  motor: string | null;
  potencia: string | null;
  cilindrada: string | null;
  combustivel: string | null;
  cambio: string | null;
  cidade: string | null;
  destaque: number | null;
  descricao: string | null;
  opcionais: string[];
  fotos: string[];
}

// --- Componentes Auxiliares ---

function LoadingSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
        <span className="text-lg font-medium text-gray-500 animate-pulse">Carregando detalhes...</span>
      </div>
    </div>
  );
}

function SpecItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-4 border border-gray-100 transition-all hover:bg-white hover:shadow-md">
      <div className="flex-shrink-0 text-blue-600 p-2 bg-blue-50 rounded-lg">{icon}</div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{label}</p>
        <p className="text-base font-bold text-gray-900 line-clamp-1" title={String(value)}>{value}</p>
      </div>
    </div>
  );
}

// Componente de Card para os Destaques (Versão Client-Side)
function VehicleCard({ vehicle }: { vehicle: Veiculo }) {
  return (
    <Link
      href={`/veiculo/${vehicle.slug}`}
      className="group block overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-xl hover:-translate-y-1"
    >
      <div className="relative h-48 w-full overflow-hidden bg-gray-200">
        {vehicle.fotos && vehicle.fotos.length > 0 ? (
            <img
            src={vehicle.fotos[0]}
            alt={`${vehicle.marca} ${vehicle.modelo}`}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
        ) : (
            <div className="flex h-full w-full items-center justify-center text-gray-400">
                Sem Foto
            </div>
        )}
        <span className="absolute top-2 left-2 z-10 bg-blue-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
          <Star size={10} fill="currentColor" />
          Destaque
        </span>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors truncate">
          {vehicle.marca} {vehicle.modelo}
        </h3>
        
        <div className="mt-2 flex gap-4 text-xs font-medium text-gray-500">
          <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
            <Calendar size={12} /> {vehicle.anoModelo || "-"}
          </span>
          <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
            <Gauge size={12} /> {vehicle.quilometragem ? `${Number(vehicle.quilometragem).toLocaleString("pt-BR")} KM` : "N/A"}
          </span>
        </div>

        <div className="mt-4 flex items-end justify-between border-t border-gray-100 pt-3">
            <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold">Valor</p>
                <p className="text-xl font-bold text-blue-700">
                    {vehicle.preco.toLocaleString("pt-BR", { style: 'currency', currency: 'BRL' })}
                </p>
            </div>
            <div className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <ChevronsRight size={18} />
            </div>
        </div>
      </div>
    </Link>
  );
}

// --- Componente Principal ---

export default function DetalheVeiculo() {
  const params = useParams();
  const slug = params.slug as string;

  const [veiculo, setVeiculo] = useState<Veiculo | null>(null);
  const [destaques, setDestaques] = useState<Veiculo[]>([]);
  const [fotoPrincipal, setFotoPrincipal] = useState<string>("");

  // Busca Dados do Veículo Principal
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (slug) {
      api.get(`/vehicles/${slug}`)
        .then((res) => {
          setVeiculo(res.data);
          
          // 📊 TRACKING: ViewContent (Visualização do Produto)
          trackEvent('ViewContent', {
            content_name: `${res.data.marca} ${res.data.modelo}`,
            content_ids: [res.data.id], 
            content_type: 'product',
            value: res.data.preco,
            currency: 'BRL'
          });

          if (res.data.fotos && res.data.fotos.length > 0) {
            setFotoPrincipal(res.data.fotos[0]);
          }
        })
        .catch((err) => console.error("Erro ao buscar veículo:", err));
    }
  }, [slug]);

  // Busca Destaques (Carros Relacionados)
  useEffect(() => {
    api.get(`/vehicles/featured?count=3`)
      .then((res) => setDestaques(res.data))
      .catch((err) => console.error("Erro ao buscar destaques:", err));
  }, []);

  // Handler de Compartilhamento
  const handleShare = async () => {
    // 📊 TRACKING: Lead (Ação de Compartilhar)
    trackEvent('Lead', { 
        content_name: 'Compartilhar',
        content_category: 'User Action'
    });

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${veiculo?.marca} ${veiculo?.modelo}`,
          text: `Confira este ${veiculo?.marca} ${veiculo?.modelo} incrível!`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Compartilhamento cancelado');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copiado para a área de transferência!");
    }
  };

  if (!veiculo) return <LoadingSpinner />;

  const whatsappText = encodeURIComponent(
    `Olá! Vi o *${veiculo.marca} ${veiculo.modelo}* no site e tenho interesse. Preço: R$ ${veiculo.preco.toLocaleString("pt-BR")}`
  );

  return (
    <div className="min-h-screen bg-gray-100 pb-12">
      {/* Header/Breadcrumb Simplificado */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-4 text-sm text-gray-500">
            <Link href="/" className="hover:text-blue-600">Home</Link> / 
            <Link href="/estoque" className="hover:text-blue-600 ml-1">Estoque</Link> / 
            <span className="font-semibold text-gray-900 ml-1">{veiculo.marca} {veiculo.modelo}</span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* --- COLUNA ESQUERDA (FOTOS) --- */}
          <div className="lg:col-span-8 space-y-4">
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100">
                {/* Foto Principal */}
                <div className="relative h-[400px] md:h-[500px] w-full bg-gray-200">
                    <img
                        src={fotoPrincipal || "https://via.placeholder.com/800x600.png?text=Sem+Foto"}
                        alt={`${veiculo.marca} ${veiculo.modelo}`}
                        className="h-full w-full object-cover"
                    />
                    {veiculo.destaque === 1 && (
                        <div className="absolute top-4 left-4 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                            <Star size={14} fill="currentColor" /> DESTAQUE
                        </div>
                    )}
                </div>
            </div>

            {/* Galeria de Miniaturas (Se houver mais de uma foto) */}
            {veiculo.fotos && veiculo.fotos.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {veiculo.fotos.map((foto, index) => (
                        <button
                            key={index}
                            onClick={() => setFotoPrincipal(foto)}
                            className={`relative h-20 w-24 flex-shrink-0 overflow-hidden rounded-lg border-2 ${fotoPrincipal === foto ? 'border-blue-600 ring-2 ring-blue-100' : 'border-transparent opacity-70 hover:opacity-100'} transition-all`}
                        >
                            <img src={foto} alt={`Foto ${index + 1}`} className="h-full w-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
            {/* A descrição foi movida daqui para baixo */}
          </div>

          {/* --- COLUNA DIREITA (DETALHES E CTA) --- */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-50 sticky top-24">
                
                {/* Título e Preço */}
                <div className="mb-6">
                    <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">
                        {veiculo.marca} <span className="text-blue-600">{veiculo.modelo}</span>
                    </h1>
                    <p className="text-gray-500 font-medium mt-1">{veiculo.versao}</p>
                    
                    <div className="mt-6 flex items-baseline gap-1">
                        <span className="text-sm font-semibold text-gray-400">R$</span>
                        <span className="text-4xl font-extrabold text-gray-900 tracking-tight">
                            {veiculo.preco.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                    </div>
                </div>

                {/* Grid de Specs */}
                <div className="grid grid-cols-2 gap-3 mb-8">
                    <SpecItem icon={<Calendar size={20} />} label="Ano" value={`${veiculo.anoFabricacao || ""}/${veiculo.anoModelo || ""}`} />
                    <SpecItem icon={<Gauge size={20} />} label="KM" value={veiculo.quilometragem ? `${Number(veiculo.quilometragem).toLocaleString("pt-BR")}` : "N/A"} />
                    <SpecItem icon={<Fuel size={20} />} label="Combustível" value={veiculo.combustivel || "-"} />
                    <SpecItem icon={<Cog size={20} />} label="Câmbio" value={veiculo.cambio || "-"} />
                    <SpecItem icon={<Paintbrush2 size={20} />} label="Cor" value={veiculo.cor || "-"} />
                </div>

                {/* Botões de Ação */}
                <div className="space-y-3">
                    <a
                        href={`https://api.whatsapp.com/send?phone=5542984399009&text=${whatsappText}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        // 📊 TRACKING: Contact (Clique no WhatsApp)
                        onClick={() => {
                            trackEvent('Contact', {
                                content_name: 'WhatsApp',
                                content_category: 'Lead',
                                value: veiculo.preco,
                                currency: 'BRL'
                            });
                        }}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-4 text-white font-bold shadow-green-200 shadow-lg transition-all hover:bg-green-700 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                    >
                        <MessageCircle size={22} />
                        Conversar no WhatsApp
                    </a>
                    
                    <button
                        onClick={handleShare}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-6 py-3 text-gray-700 font-bold transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                    >
                        <Share2 size={20} />
                        Compartilhar Veículo
                    </button>
                </div>
            </div>
          </div>

          {/* --- DESCRIÇÃO E OPCIONAIS (Reposicionado) --- */}
          {/* Agora é o 3º filho do Grid. No mobile aparece por último (Abaixo de tudo). No Desktop, ocupa a coluna da esquerda (col-span-8). */}
          <div className="lg:col-span-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Sobre este veículo</h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {veiculo.descricao || "Entre em contato para mais informações sobre este veículo."}
              </p>

              {veiculo.opcionais && veiculo.opcionais.length > 0 && (
                  <div className="mt-8">
                      <h4 className="font-bold text-gray-900 mb-3">Opcionais</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {veiculo.opcionais.map((opc, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                                  <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />
                                  <span>{opc}</span>
                              </div>
                          ))}
                      </div>
                  </div>
              )}
          </div>

        </div>

        {/* --- SEÇÃO DE DESTAQUES (OUTROS VEÍCULOS) --- */}
        {destaques.length > 0 && (
            <div className="mt-16 border-t border-gray-200 pt-12">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">Também pode te interessar</h2>
                    <Link href="/estoque" className="text-blue-600 font-semibold hover:underline flex items-center gap-1">
                        Ver todo estoque <ChevronsRight size={18} />
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {destaques.filter(d => d.id !== veiculo.id).slice(0, 3).map((destaque) => (
                        <VehicleCard key={destaque.id} vehicle={destaque} />
                    ))}
                </div>
            </div>
        )}
      </div>
    </div>
  );
}