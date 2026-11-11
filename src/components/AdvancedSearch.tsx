"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowUpRight, SlidersHorizontal } from "lucide-react";
import { api } from "../lib/api";
export default function AdvancedSearch() {
  const router = useRouter();
  const [type, setType] = useState("");
  const [brand, setBrand] = useState("");
  const [q, setQ] = useState("");
  const [brands, setBrands] = useState<string[]>([]);
  useEffect(() => {
    const c = new AbortController();
    api
      .get<string[]>("/vehicles/filters/brands", {
        params: { type: type || undefined },
        signal: c.signal,
      })
      .then((r) => setBrands(r.data))
      .catch(() => {});
    return () => c.abort();
  }, [type]);
  return (
    <section id="encontre" className="site-container search-section">
      <div className="search-panel">
        <div className="search-heading">
          <span className="eyebrow">
            <SlidersHorizontal size={14} /> ENCONTRE O SEU PRÓXIMO VEÍCULO
          </span>
          <LinkAdvanced />
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const p = new URLSearchParams();
            if (q.trim()) p.set("q", q.trim());
            if (type) p.set("tipo", type);
            if (brand) p.set("marca", brand);
            router.push(`/estoque?${p}`);
          }}
          className="home-search-form"
        >
          <label>
            O que você procura?
            <span className="search-input-wrap">
              <Search size={18} />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Marca, modelo ou versão"
              />
            </span>
          </label>
          <label>
            Categoria
            <select
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                setBrand("");
              }}
            >
              <option value="">Todas as categorias</option>
              {[
                "Carro",
                "Caminhonete",
                "Moto",
                "Utilitario",
                "Van",
                "Caminhao",
              ].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          <label>
            Marca
            <select value={brand} onChange={(e) => setBrand(e.target.value)}>
              <option value="">Todas as marcas</option>
              {brands.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
          </label>
          <button className="button" type="submit">
            Buscar veículos <ArrowUpRight size={19} />
          </button>
        </form>
      </div>
    </section>
  );
}
function LinkAdvanced() {
  return (
    <a className="subtle-link" href="/estoque">
      Busca avançada <ArrowUpRight size={14} />
    </a>
  );
}
