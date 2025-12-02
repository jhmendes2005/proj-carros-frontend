"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "../lib/api";
import { ChevronDown, ArrowUpDown } from "lucide-react";

// Lista de categorias definidas
const vehicleTypes = [
  'Carro', 
  'Moto', 
  'Caminhao', 
  'Van', 
  'Utilitário', 
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

    // Estado Local dos Filtros
    const [filters, setFilters] = useState({
        tipo: "", // <--- Novo Campo
        marca: "",
        modelo: "",
        ano_min: "",
        ano_max: "",
        preco_min: "",
        preco_max: "",
        sort: ""
    });

    // 1. Carregar Marcas e Anos na montagem
    useEffect(() => {
        api.get("/vehicles/filters/brands").then(res => setMarcas(res.data)).catch(console.error);
        api.get("/vehicles/filters/years").then(res => setAnos(res.data)).catch(console.error);
    }, []);

    // 2. Sincronizar estado local com a URL
    useEffect(() => {
        const currentFilters = {
            tipo: searchParams.get("tipo") || "", // <--- Ler da URL
            marca: searchParams.get("marca") || "",
            modelo: searchParams.get("modelo") || "",
            ano_min: searchParams.get("ano_min") || "",
            ano_max: searchParams.get("ano_max") || "",
            preco_min: searchParams.get("preco_min") || "",
            preco_max: searchParams.get("preco_max") || "",
            sort: searchParams.get("sort") || ""
        };
        setFilters(currentFilters);

        if (currentFilters.marca) {
            fetchModelos(currentFilters.marca);
        }
    }, [searchParams]);

    const fetchModelos = (marca: string) => {
        if (!marca) {
            setModelos([]);
            return;
        }
        api.get(`/vehicles/filters/models?brand=${marca}`)
            .then(res => setModelos(res.data))
            .catch(console.error);
    };

    const handleFilterChange = (field: string, value: string) => {
        setFilters(prev => ({ ...prev, [field]: value }));

        if (field === 'marca') {
            setFilters(prev => ({ ...prev, modelo: "" }));
            fetchModelos(value);
        }
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
            tipo: "", // <--- Limpar tipo
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

            {/* Categoria / Tipo (NOVO) */}
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
                        className="w-full rounded-lg border-gray-300 border p-2.5 text-gray-700 bg-white focus:ring-2 focus:ring-blue-500 appearance-none"
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
    );
}