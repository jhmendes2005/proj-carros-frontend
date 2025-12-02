"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "../../lib/api";
import Hero from "@/src/components/hero";
import VehicleFilter from "@/src/components/FilterSidebar"; 
import { Calendar, Gauge, Fuel, ArrowRight, Star, Filter, X } from "lucide-react";

export default function Estoque() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // Estados de Dados
    const [veiculos, setVeiculos] = useState<any[]>([]);
    // 1. Novo estado para controlar o carregamento (inicia true)
    const [isLoading, setIsLoading] = useState(true);
    
    // Estado para controlar a abertura do filtro no Mobile
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    // Buscar Veículos sempre que a URL (filtros) mudar
    useEffect(() => {
        // 2. Garante que o loading apareça ao trocar filtros
        setIsLoading(true);

        const params = {
            q: searchParams.get("q"),
            ...Object.fromEntries(searchParams.entries())
        };

        api.get("/vehicles", { params })
            .then(res => setVeiculos(res.data))
            .catch(err => console.error("Erro ao buscar veículos:", err))
            .finally(() => {
                // 3. Remove o loading quando a requisição terminar (com sucesso ou erro)
                setIsLoading(false);
            });
    }, [searchParams]);

    // Função auxiliar para limpar filtros (usada no estado vazio)
    const clearFilters = () => {
         router.push("/estoque");
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <Hero />

            <div className="container mx-auto px-4 py-8">
                {/* Cabeçalho da Seção + Botão Mobile */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <h1 className="text-3xl font-bold text-gray-800">Nosso Estoque</h1>
                    
                    {/* Botão "Filtrar" (Só aparece no Mobile) */}
                    <button 
                        onClick={() => setIsMobileFilterOpen(true)}
                        className="md:hidden w-full flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-3 rounded-lg font-medium shadow-sm active:bg-gray-50 hover:bg-gray-50 transition-colors"
                    >
                        <Filter size={20} />
                        Filtrar Veículos
                    </button>
                </div>

                <div className="flex flex-col md:flex-row gap-8 items-start">
                    
                    {/* --- SIDEBAR DESKTOP --- */}
                    <aside className="hidden md:block w-72 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                        <div className="flex items-center gap-2 mb-6 text-gray-800 border-b border-gray-100 pb-4">
                            <Filter size={20} className="text-blue-600" />
                            <h2 className="font-bold text-lg">Filtrar</h2>
                        </div>
                        {/* Desabilita visualmente o filtro enquanto carrega */}
                        <div className={isLoading ? "opacity-50 pointer-events-none" : ""}>
                            <VehicleFilter />
                        </div>
                    </aside>

                    {/* --- MENU MOBILE (Modal/Drawer) --- */}
                    {isMobileFilterOpen && (
                        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4 md:hidden animate-in fade-in duration-200">
                            <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl animate-in slide-in-from-bottom-10 duration-300">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold text-gray-800">Filtrar Veículos</h2>
                                    <button 
                                        onClick={() => setIsMobileFilterOpen(false)} 
                                        className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                                <VehicleFilter onClose={() => setIsMobileFilterOpen(false)} />
                            </div>
                        </div>
                    )}

                    {/* --- CONTEÚDO PRINCIPAL (GRID) --- */}
                    <div className="flex-1 w-full">
                        
                        {/* 4. VERIFICAÇÃO DE LOADING */}
                        {isLoading ? (
                            // --- CARRO ANIMADO (LOADER) ---
                            <div className="flex items-center justify-center min-h-[400px] w-full">
                                <style jsx>{`
                                    .car__body {
                                        animation: shake 0.2s ease-in-out infinite alternate;
                                    }
                                    .car__line {
                                        transform-origin: center right;
                                        stroke-dasharray: 22;
                                        animation: line 0.8s ease-in-out infinite;
                                        animation-fill-mode: both;
                                    }
                                    .car__line--top { animation-delay: 0s; }
                                    .car__line--middle { animation-delay: 0.2s; }
                                    .car__line--bottom { animation-delay: 0.4s; }
                                    @keyframes shake {
                                        0% { transform: translateY(-1%); }
                                        100% { transform: translateY(3%); }
                                    }
                                    @keyframes line {
                                        0% { stroke-dashoffset: 22; }
                                        25% { stroke-dashoffset: 22; }
                                        50% { stroke-dashoffset: 0; }
                                        51% { stroke-dashoffset: 0; }
                                        80% { stroke-dashoffset: -22; }
                                        100% { stroke-dashoffset: -22; }
                                    }
                                `}</style>
                                <svg className="car" width="102" height="40" xmlns="http://www.w3.org/2000/svg">
                                    <g transform="translate(2 1)" stroke="#002742" fill="none" fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round">
                                        <path className="car__body" d="M47.293 2.375C52.927.792 54.017.805 54.017.805c2.613-.445 6.838-.337 9.42.237l8.381 1.863c2.59.576 6.164 2.606 7.98 4.531l6.348 6.732 6.245 1.877c3.098.508 5.609 3.431 5.609 6.507v4.206c0 .29-2.536 4.189-5.687 4.189H36.808c-2.655 0-4.34-2.1-3.688-4.67 0 0 3.71-19.944 14.173-23.902zM36.5 15.5h54.01" strokeWidth="3"/>
                                        <ellipse className="car__wheel--left" strokeWidth="3.2" fill="#FFF" cx="83.493" cy="30.25" rx="6.922" ry="6.808"/>
                                        <ellipse className="car__wheel--right" strokeWidth="3.2" fill="#FFF" cx="46.511" cy="30.25" rx="6.922" ry="6.808"/>
                                        <path className="car__line car__line--top" d="M22.5 16.5H2.475" strokeWidth="3"/>
                                        <path className="car__line car__line--middle" d="M20.5 23.5H.4755" strokeWidth="3"/>
                                        <path className="car__line car__line--bottom" d="M25.5 9.5h-19" strokeWidth="3"/>
                                    </g>
                                </svg>
                            </div>
                        ) : veiculos.length === 0 ? (
                            // 5. Estado Vazio (Só aparece se NÃO estiver carregando)
                            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[400px]">
                                <div className="text-gray-300 mb-4">
                                    <SearchIconFallback />
                                </div>
                                <p className="text-gray-500 text-lg font-medium">Nenhum veículo encontrado.</p>
                                <p className="text-sm text-gray-400">Tente ajustar seus filtros ou termos de busca.</p>
                                <button onClick={clearFilters} className="mt-4 text-blue-600 font-medium hover:underline">
                                    Limpar todos os filtros
                                </button>
                            </div>
                        ) : (
                            // 6. Grid de Veículos Real (Quando tem dados)
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {veiculos.map((v: any) => (
                                    <div 
                                        key={v.id} 
                                        className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full"
                                    >
                                        {/* Imagem */}
                                        <div className="relative h-56 overflow-hidden bg-gray-100">
                                            {v.destaque && (
                                                <div className="absolute top-4 left-4 z-10 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md uppercase tracking-wide">
                                                    <Star size={10} fill="currentColor" /> Destaque
                                                </div>
                                            )}
                                            
                                            <Link href={`/veiculo/${v.slug}`}>
                                                {v.fotos && v.fotos.length > 0 ? (
                                                    <img
                                                        src={v.fotos[0]}
                                                        alt={`${v.marca} ${v.modelo}`}
                                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out cursor-pointer"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                                                        <div className="text-4xl mb-2">📷</div>
                                                        <span className="text-sm">Sem foto</span>
                                                    </div>
                                                )}
                                            </Link>
                                            
                                            <Link href={`/veiculo/${v.slug}`} className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                                        </div>

                                        {/* Conteúdo do Card */}
                                        <div className="p-5 flex flex-col flex-1">
                                            <h3 className="text-blue-600 text-xs font-bold uppercase tracking-wider mb-2">
                                                {v.marca}
                                            </h3>

                                            <Link href={`/veiculo/${v.slug}`} className="block">
                                                <h2 className="text-lg font-bold text-gray-900 leading-tight mb-1 group-hover:text-blue-700 transition-colors cursor-pointer line-clamp-2 min-h-[3.5rem]">
                                                    {v.modelo}
                                                </h2>
                                            </Link>
                                            <p className="text-gray-500 text-sm mb-4 line-clamp-1">
                                                {v.versao}
                                            </p>

                                            <div className="grid grid-cols-2 gap-y-2 gap-x-2 mb-5">
                                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                                    <Calendar size={14} className="text-blue-500 flex-shrink-0" />
                                                    <span>{v.anoModelo}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                                    <Gauge size={14} className="text-blue-500 flex-shrink-0" />
                                                    <span className="truncate">{Number(v.quilometragem).toLocaleString('pt-BR')} km</span>
                                                </div>
                                                {v.combustivel && (
                                                    <div className="flex items-center gap-2 text-xs text-gray-600 col-span-2">
                                                        <Fuel size={14} className="text-blue-500 flex-shrink-0" />
                                                        <span className="truncate">{v.combustivel}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="border-t border-gray-100 mt-auto pt-4 flex items-center justify-between">
                                                <div>
                                                    <p className="text-[10px] text-gray-400 font-semibold uppercase mb-0.5">Valor</p>
                                                    <p className="text-xl font-bold text-blue-700">
                                                        {Number(v.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                    </p>
                                                </div>
                                                
                                                <Link 
                                                    href={`/veiculo/${v.slug}`}
                                                    className="bg-blue-600 text-white w-10 h-10 rounded-full shadow-lg shadow-blue-100 hover:bg-blue-700 hover:shadow-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                                                >
                                                    <ArrowRight size={18} />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function SearchIconFallback() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
        </svg>
    )
}