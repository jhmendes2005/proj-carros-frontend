"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "../lib/api";
import { ChevronDown, ArrowUpDown, Loader2 } from "lucide-react";

// Lista de categorias definidas
const vehicleTypes = [
  'Carro', 
  'Moto', 
  'Caminhao', 
  'Van', 
  'Utilitario', 
  'Caminhonete'
];

interface VehicleFilterProps {
    onClose?: () => void;
}

export default function VehicleFilter({ onClose }: VehicleFilterProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Estados de Opções (Carregados da API)
    const [marcas, setMarcas] = useState<string[]>([]);
    const [modelos, setModelos] = useState<string[]>([]);
    const [anos, setAnos] = useState<number[]>([]);

    // Estado de Loading Global para bloquear interações
    const [loadingCount, setLoadingCount] = useState(0);
    const isLoading = loadingCount > 0;

    // Estado Local dos Filtros
    const [filters, setFilters] = useState({
        tipo: "",
        marca: "",
        modelo: "",
        ano_min: "",
        ano_max: "",
        preco_min: "",
        preco_max: "",
        sort: ""
    });

    // 1. Sincronizar estado local com a URL na montagem ou navegação
    useEffect(() => {
        const currentFilters = {
            tipo: searchParams.get("tipo") || "",
            marca: searchParams.get("marca") || "",
            modelo: searchParams.get("modelo") || "",
            ano_min: searchParams.get("ano_min") || "",
            ano_max: searchParams.get("ano_max") || "",
            preco_min: searchParams.get("preco_min") || "",
            preco_max: searchParams.get("preco_max") || "",
            sort: searchParams.get("sort") || ""
        };
        setFilters(currentFilters);
    }, [searchParams]);

    // 2. Carregar Marcas (Depende do Tipo)
    useEffect(() => {
        setLoadingCount(prev => prev + 1);
        const params = new URLSearchParams();
        if (filters.tipo) params.append("type", filters.tipo);

        api.get(`/vehicles/filters/brands?${params.toString()}`)
            .then(res => setMarcas(res.data))
            .catch(console.error)
            .finally(() => setLoadingCount(prev => Math.max(0, prev - 1)));
    }, [filters.tipo]);

    // 3. Carregar Modelos (Depende da Marca e Tipo)
    useEffect(() => {
        if (!filters.marca) {
            setModelos([]);
            return;
        }

        setLoadingCount(prev => prev + 1);
        const params = new URLSearchParams();
        if (filters.tipo) params.append("type", filters.tipo);
        if (filters.marca) params.append("brand", filters.marca);

        api.get(`/vehicles/filters/models?${params.toString()}`)
            .then(res => setModelos(res.data))
            .catch(console.error)
            .finally(() => setLoadingCount(prev => Math.max(0, prev - 1)));
    }, [filters.marca, filters.tipo]);

    // 4. Carregar Anos (Depende de Marca, Modelo e Tipo)
    useEffect(() => {
        setLoadingCount(prev => prev + 1);
        const params = new URLSearchParams();
        if (filters.tipo) params.append("type", filters.tipo);
        if (filters.marca) params.append("brand", filters.marca);
        if (filters.modelo) params.append("model", filters.modelo);

        api.get(`/vehicles/filters/years?${params.toString()}`)
            .then(res => setAnos(res.data))
            .catch(console.error)
            .finally(() => setLoadingCount(prev => Math.max(0, prev - 1)));
    }, [filters.marca, filters.modelo, filters.tipo]);


    // Handler de Mudança (Com Reset Lógico)
    const handleFilterChange = (field: string, value: string) => {
        setFilters(prev => {
            const next = { ...prev, [field]: value };

            // Se mudar o Tipo, reseta Marca e Modelo
            if (field === 'tipo') {
                next.marca = "";
                next.modelo = "";
            }
            // Se mudar a Marca, reseta o Modelo
            if (field === 'marca') {
                next.modelo = "";
            }

            return next;
        });
    };

    const applyFilters = () => {
        const params = new URLSearchParams();

        // Mantém a busca textual se existir
        const q = searchParams.get("q");
        if (q) params.set("q", q);

        // Adiciona filtros preenchidos
        Object.entries(filters).forEach(([key, value]) => {
            if (value) params.set(key, value);
        });

        router.push(`/estoque?${params.toString()}`);
        if (onClose) onClose();
    };

    const clearFilters = () => {
        setFilters({
            tipo: "",
            marca: "",
            modelo: "",
            ano_min: "",
            ano_max: "",
            preco_min: "",
            preco_max: "",
            sort: ""
        });
        router.push("/estoque");
        if (onClose) onClose();
    };

    return (
        <div className="relative h-full overflow-y-auto px-1 pt-6 pb-20 custom-scrollbar">
            
            {/* Overlay de Loading */}
            {isLoading && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-[1px] rounded-lg transition-all">
                    <div className="flex flex-col items-center gap-2 bg-white p-4 rounded-xl shadow-lg border border-gray-100">
                        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                        <span className="text-xs font-semibold text-gray-500">Atualizando...</span>
                    </div>
                </div>
            )}

            <div className="space-y-6">
                {/* Ordenação */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                        <ArrowUpDown size={14} className="text-blue-600" /> Ordenar por
                    </label>
                    <div className="relative">
                        <select 
                            className="w-full rounded-lg border-gray-300 border p-2.5 text-gray-700 bg-white focus:ring-2 focus:ring-blue-500 appearance-none"
                            value={filters.sort}
                            onChange={(e) => handleFilterChange('sort', e.target.value)}
                        >
                            <option value="">Mais Recentes</option>
                            <option value="price_asc">Menor Preço</option>
                            <option value="price_desc">Maior Preço</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                <div className="border-t border-gray-100 my-4"></div>

                {/* Categoria / Tipo */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                    <div className="relative">
                        <select 
                            className="w-full rounded-lg border-gray-300 border p-2.5 text-gray-700 bg-white focus:ring-2 focus:ring-blue-500 appearance-none"
                            value={filters.tipo}
                            onChange={(e) => handleFilterChange('tipo', e.target.value)}
                        >
                            <option value="">Todas as Categorias</option>
                            {vehicleTypes.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                {/* Marca */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
                    <div className="relative">
                        <select 
                            className="w-full rounded-lg border-gray-300 border p-2.5 text-gray-700 bg-white focus:ring-2 focus:ring-blue-500 appearance-none disabled:bg-gray-100 disabled:text-gray-400"
                            value={filters.marca}
                            onChange={(e) => handleFilterChange('marca', e.target.value)}
                        >
                            <option value="">Todas as Marcas</option>
                            {marcas.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                {/* Modelo */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
                    <div className="relative">
                        <select 
                            className="w-full rounded-lg border-gray-300 border p-2.5 text-gray-700 bg-white focus:ring-2 focus:ring-blue-500 appearance-none disabled:bg-gray-100 disabled:text-gray-400"
                            value={filters.modelo}
                            onChange={(e) => handleFilterChange('modelo', e.target.value)}
                            disabled={!filters.marca}
                        >
                            <option value="">Todos os Modelos</option>
                            {modelos.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                {/* Ano */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ano</label>
                    <div className="flex gap-2">
                        <select 
                            className="w-1/2 rounded-lg border-gray-300 border p-2 text-gray-700 bg-white"
                            value={filters.ano_min}
                            onChange={(e) => handleFilterChange('ano_min', e.target.value)}
                        >
                            <option value="">De</option>
                            {anos.map(a => <option key={`min-${a}`} value={a}>{a}</option>)}
                        </select>
                        <select 
                            className="w-1/2 rounded-lg border-gray-300 border p-2 text-gray-700 bg-white"
                            value={filters.ano_max}
                            onChange={(e) => handleFilterChange('ano_max', e.target.value)}
                        >
                            <option value="">Até</option>
                            {anos.map(a => <option key={`max-${a}`} value={a}>{a}</option>)}
                        </select>
                    </div>
                </div>

                {/* Preço */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$)</label>
                    <div className="flex gap-2 items-center">
                        <input 
                            type="number" 
                            placeholder="Mín"
                            className="w-full rounded-lg border-gray-300 border p-2 text-gray-700 focus:ring-2 focus:ring-blue-500"
                            value={filters.preco_min}
                            onChange={(e) => handleFilterChange('preco_min', e.target.value)}
                        />
                        <span className="text-gray-400">-</span>
                        <input 
                            type="number" 
                            placeholder="Máx"
                            className="w-full rounded-lg border-gray-300 border p-2 text-gray-700 focus:ring-2 focus:ring-blue-500"
                            value={filters.preco_max}
                            onChange={(e) => handleFilterChange('preco_max', e.target.value)}
                        />
                    </div>
                </div>

                {/* Botões de Ação */}
                <div className="pt-4 flex flex-col gap-2">
                    <button 
                        onClick={applyFilters}
                        className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                    >
                        Aplicar Filtros
                    </button>
                    <button 
                        onClick={clearFilters}
                        className="w-full bg-white text-gray-600 font-medium py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                        Limpar
                    </button>
                </div>
            </div>
        </div>
    );
}