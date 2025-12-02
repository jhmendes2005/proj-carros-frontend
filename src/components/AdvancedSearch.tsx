"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/src/lib/api";
import { Search, SlidersHorizontal } from "lucide-react";

// Categorias definidas
const vehicleTypes = ["Carro", "Moto", "Caminhao", "Van", "Utilitario", "Caminhonete"];

const priceRanges = [10000, 20000, 30000, 40000, 50000, 75000, 100000, 150000, 200000];

export default function AdvancedSearch() {
  const router = useRouter();

  const [isExpanded, setIsExpanded] = useState(false);
  const [brands, setBrands] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [years, setYears] = useState<number[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedMinYear, setSelectedMinYear] = useState("");
  const [selectedMaxYear, setSelectedMaxYear] = useState("");
  const [selectedMinPrice, setSelectedMinPrice] = useState("");
  const [selectedMaxPrice, setSelectedMaxPrice] = useState("");

  useEffect(() => {
    async function fetchFilters() {
      try {
        const [brandsRes, yearsRes] = await Promise.all([
          api.get("/vehicles/filters/brands"),
          api.get("/vehicles/filters/years"),
        ]);
        setBrands(brandsRes.data);
        setYears(yearsRes.data);
      } catch (error) {
        console.error("Falha ao buscar filtros:", error);
      }
    }
    fetchFilters();
  }, []);

  useEffect(() => {
    if (selectedBrand) {
      api
        .get(`/vehicles/filters/models?brand=${selectedBrand}`)
        .then((res) => setModels(res.data))
        .catch((err) => console.error("Falha ao buscar modelos:", err));
    } else {
      setModels([]);
    }
    setSelectedModel("");
  }, [selectedBrand]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();

    if (searchTerm) params.append("q", searchTerm);
    if (selectedType) params.append("tipo", selectedType);
    if (selectedBrand) params.append("marca", selectedBrand);
    if (selectedModel) params.append("modelo", selectedModel);
    if (selectedMinYear) params.append("ano_min", selectedMinYear);
    if (selectedMaxYear) params.append("ano_max", selectedMaxYear);
    if (selectedMinPrice) params.append("preco_min", selectedMinPrice);
    if (selectedMaxPrice) params.append("preco_max", selectedMaxPrice);

    router.push(`/estoque?${params.toString()}`);
  };

  const inputClass =
    "rounded-lg border border-white/20 bg-white/60 backdrop-blur-sm p-2 text-black font-medium shadow-sm hover:bg-white/80 transition-all focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer";

  return (
    <section className="py-12 my-[-60px]">
      <div className="mx-auto max-w-6xl px-4">

        <div className="rounded-2xl bg-white/10 backdrop-blur-xl p-8 shadow-2xl border border-white/20">

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

              <select className={inputClass} value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}>
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
              className="w-full rounded-xl bg-blue-700 px-6 py-4 text-lg font-bold text-white shadow-xl 
              hover:bg-blue-800 transition-all hover:scale-[1.03] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Search size={22} />
              Buscar Veículos
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
