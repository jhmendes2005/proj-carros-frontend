"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/src/lib/api";
import { Search, SlidersHorizontal, Loader2 } from "lucide-react";

// Categorias definidas (fixas ou vindas do backend, aqui mantive fixas mas enviando para a API)
const vehicleTypes = ["Carro", "Moto", "Caminhao", "Van", "Utilitario", "Caminhonete"];

const priceRanges = [10000, 20000, 30000, 40000, 50000, 75000, 100000, 150000, 200000];

export default function AdvancedSearch() {
  const router = useRouter();

  const [isExpanded, setIsExpanded] = useState(false);
  const [brands, setBrands] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [years, setYears] = useState<number[]>([]);

  // Estado de Loading Global para bloquear interações
  const [loadingCount, setLoadingCount] = useState(0);
  const isLoading = loadingCount > 0;

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedMinYear, setSelectedMinYear] = useState("");
  const [selectedMaxYear, setSelectedMaxYear] = useState("");
  const [selectedMinPrice, setSelectedMinPrice] = useState("");
  const [selectedMaxPrice, setSelectedMaxPrice] = useState("");

  // 1. Carrega Marcas (Depende do Tipo)
  useEffect(() => {
    // Resetar seleções dependentes
    setSelectedBrand("");
    setSelectedModel("");

    setLoadingCount(prev => prev + 1);
    const params = new URLSearchParams();
    if (selectedType) params.append("type", selectedType);

    api.get(`/vehicles/filters/brands?${params.toString()}`)
      .then((res) => setBrands(res.data))
      .catch((err) => console.error("Falha ao buscar marcas:", err))
      .finally(() => setLoadingCount(prev => Math.max(0, prev - 1)));
  }, [selectedType]);

  // 2. Carrega Modelos (Depende da Marca e Tipo)
  useEffect(() => {
    // Resetar modelo
    setSelectedModel("");

    const params = new URLSearchParams();
    if (selectedType) params.append("type", selectedType);
    if (selectedBrand) params.append("brand", selectedBrand);

    // Só busca modelos se houver marca selecionada
    if (selectedBrand) {
        setLoadingCount(prev => prev + 1);
        api.get(`/vehicles/filters/models?${params.toString()}`)
        .then((res) => setModels(res.data))
        .catch((err) => console.error("Falha ao buscar modelos:", err))
        .finally(() => setLoadingCount(prev => Math.max(0, prev - 1)));
    } else {
        setModels([]);
    }
  }, [selectedBrand, selectedType]);

  // 3. Carrega Anos (Depende de Marca, Modelo e Tipo)
  useEffect(() => {
    setLoadingCount(prev => prev + 1);
    const params = new URLSearchParams();
    if (selectedType) params.append("type", selectedType);
    if (selectedBrand) params.append("brand", selectedBrand);
    if (selectedModel) params.append("model", selectedModel);

    api.get(`/vehicles/filters/years?${params.toString()}`)
      .then((res) => setYears(res.data))
      .catch((err) => console.error("Falha ao buscar anos:", err))
      .finally(() => setLoadingCount(prev => Math.max(0, prev - 1)));
  }, [selectedBrand, selectedModel, selectedType]);


  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();

    if (searchTerm) params.append("q", searchTerm);
    if (selectedType) params.append("tipo", selectedType);
    if (selectedBrand) params.append("marca", selectedBrand);
    if (selectedModel) params.append("modelo", selectedModel);
    if (selectedMinYear) params.append("ano_min", selectedMinYear);
    if (selectedMaxYear) params.append("ano_max", selectedMaxYear);
    if (selectedMinPrice) params.append("preco_min", selectedMinPrice.replace("R$ ", "").replace(/\./g, ""));
    if (selectedMaxPrice) params.append("preco_max", selectedMaxPrice.replace("R$ ", "").replace(/\./g, ""));

    router.push(`/estoque?${params.toString()}`);
  };

  const inputClass =
    "rounded-lg border border-white/20 bg-white/60 backdrop-blur-sm p-2 text-black font-medium shadow-sm hover:bg-white/80 transition-all focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <section className="py-12 my-[-60px]">
      <div className="mx-auto max-w-6xl px-4">

        {/* Adicionei 'relative' e 'overflow-hidden' para conter o overlay */}
        <div className="relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-xl p-8 shadow-2xl border border-white/20">

          {/* Overlay de Loading */}
          {isLoading && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-[2px] rounded-2xl transition-all">
                <div className="flex flex-col items-center gap-2 bg-white p-4 rounded-xl shadow-lg border border-gray-100 animate-in fade-in zoom-in duration-200">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                    <span className="text-xs font-semibold text-gray-500">Atualizando filtros...</span>
                </div>
            </div>
          )}

          <h2 className="text-3xl font-extrabold text-center text-blue-950 uppercase mb-8 tracking-wide">
            Encontre seu veículo
          </h2>

          <form onSubmit={handleSearch} className="space-y-8">

            {/* Campo de pesquisa */}
            <div className="relative w-full">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Digite marca, modelo ou versão..."
                className="w-full rounded-xl bg-white/80 border border-white/30 backdrop-blur-md p-4 pl-12 text-lg text-black placeholder-gray-700 shadow-md focus:ring-2 focus:ring-blue-700 transition-all"
              />

              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700" />
            </div>

            {/* Filtros Desktop */}
            <div className="hidden md:grid grid-cols-4 lg:grid-cols-7 gap-4">

              <select className={inputClass} value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                <option value="">Categoria</option>
                {vehicleTypes.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>

              <select 
                className={inputClass} 
                value={selectedBrand} 
                onChange={(e) => setSelectedBrand(e.target.value)}
              >
                <option value="">Marca</option>
                {brands.map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </select>

              <select
                className={`${inputClass} disabled:bg-gray-200/60 disabled:text-gray-500`}
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                disabled={!selectedBrand}
              >
                <option value="">Modelo</option>
                {models.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>

              <select className={inputClass} value={selectedMinYear} onChange={(e) => setSelectedMinYear(e.target.value)}>
                <option value="">Ano De</option>
                {years.map((y) => (
                  <option key={y}>{y}</option>
                ))}
              </select>

              <select className={inputClass} value={selectedMaxYear} onChange={(e) => setSelectedMaxYear(e.target.value)}>
                <option value="">Ano Até</option>
                {years.map((y) => (
                  <option key={y}>{y}</option>
                ))}
              </select>

              <select className={inputClass} value={selectedMinPrice} onChange={(e) => setSelectedMinPrice(e.target.value)}>
                <option value="">R$ Mín</option>
                {priceRanges.map((p) => (
                  <option key={p}>R$ {p.toLocaleString("pt-BR")}</option>
                ))}
              </select>

              <select className={inputClass} value={selectedMaxPrice} onChange={(e) => setSelectedMaxPrice(e.target.value)}>
                <option value="">R$ Máx</option>
                {priceRanges.map((p) => (
                  <option key={p}>R$ {p.toLocaleString("pt-BR")}</option>
                ))}
              </select>
            </div>

            {/* Mobile */}
            <div className="md:hidden grid grid-cols-2 gap-4">

              <select className={inputClass} value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                <option value="">Categoria</option>
                {vehicleTypes.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>

              <select className={inputClass} value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}>
                <option value="">Marca</option>
                {brands.map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="col-span-2 flex items-center justify-center gap-2 rounded-xl bg-white/70 p-3 font-semibold text-gray-800 shadow-md hover:bg-white transition-all"
              >
                <SlidersHorizontal size={18} />
                {isExpanded ? "Menos Filtros" : "Mais Filtros"}
              </button>

              {isExpanded && (
                <>
                  <select
                    className={`${inputClass} col-span-2`}
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    disabled={!selectedBrand}
                  >
                    <option value="">Modelo</option>
                    {models.map((m) => (
                      <option key={m}>{m}</option>
                    ))}
                  </select>

                  <select className={inputClass} value={selectedMinYear} onChange={(e) => setSelectedMinYear(e.target.value)}>
                    <option value="">Ano De</option>
                    {years.map((y) => (
                      <option key={y}>{y}</option>
                    ))}
                  </select>

                  <select className={inputClass} value={selectedMaxYear} onChange={(e) => setSelectedMaxYear(e.target.value)}>
                    <option value="">Ano Até</option>
                    {years.map((y) => (
                      <option key={y}>{y}</option>
                    ))}
                  </select>

                  <select className={inputClass} value={selectedMinPrice} onChange={(e) => setSelectedMinPrice(e.target.value)}>
                    <option value="">R$ Mín</option>
                    {priceRanges.map((p) => (
                      <option key={p}>R$ {p.toLocaleString("pt-BR")}</option>
                    ))}
                  </select>

                  <select className={inputClass} value={selectedMaxPrice} onChange={(e) => setSelectedMaxPrice(e.target.value)}>
                    <option value="">R$ Máx</option>
                    {priceRanges.map((p) => (
                      <option key={p}>R$ {p.toLocaleString("pt-BR")}</option>
                    ))}
                  </select>
                </>
              )}
            </div>

            {/* Botão Buscar */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-blue-700 px-6 py-4 text-lg font-bold text-white shadow-xl 
              hover:bg-blue-800 transition-all hover:scale-[1.03] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                    <Loader2 size={22} className="animate-spin" />
                    Buscando...
                </>
              ) : (
                <>
                    <Search size={22} />
                    Buscar Veículos
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}