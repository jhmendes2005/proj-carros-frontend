"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  X,
  ArrowUpRight,
  RefreshCw,
} from "lucide-react";
import VehicleFilter from "../../components/FilterSidebar";
import VehicleCard from "../../components/VehicleCard";
import { VehicleSkeletons } from "../../components/FeaturedVehicles";
import { api } from "../../lib/api";
import { Vehicle } from "../../lib/vehicles";
import { useDialog } from "../../lib/useDialog";
function Stock() {
  const search = useSearchParams();
  const router = useRouter();
  const query = search?.toString() || "";
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState(search?.get("q") || "");
  const [visible, setVisible] = useState(18);
  const dialog = useDialog(open, () => setOpen(false));
  useEffect(() => {
    setTerm(search?.get("q") || "");
  }, [search]);
  useEffect(() => {
    const c = new AbortController();
    setLoading(true);
    setError(false);
    setVisible(18);
    api
      .get<Vehicle[]>(`/vehicles?${query}`, { signal: c.signal })
      .then((r) => setVehicles(r.data))
      .catch(() => {
        if (!c.signal.aborted) setError(true);
      })
      .finally(() => {
        if (!c.signal.aborted) setLoading(false);
      });
    return () => c.abort();
  }, [query, retry]);
  const update = (key: string, value: string) => {
    const p = new URLSearchParams(query);
    if (value) p.set(key, value);
    else p.delete(key);
    router.push(`/estoque?${p}`);
  };
  const chips = [...new URLSearchParams(query)].filter(([k]) => k !== "sort");
  return (
    <div className="stock-page">
      <div className="site-container">
        <div className="page-intro">
          <div className="breadcrumb">
            <Link href="/">Início</Link>
            <span>/</span>
            <span>Estoque</span>
          </div>
          <span className="eyebrow">ENCONTRE SUA PRÓXIMA CONQUISTA</span>
          <h1>
            O próximo é <em>seu.</em>
          </h1>
          <p>
            Explore nosso estoque e encontre o veículo que faz sentido para
            você.
          </p>
        </div>
        <div className="stock-toolbar">
          <form
            className="stock-search"
            onSubmit={(e) => {
              e.preventDefault();
              update("q", term.trim());
            }}
          >
            <Search size={19} />
            <input
              aria-label="Buscar no estoque"
              placeholder="Busque por marca, modelo ou versão"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
            />
            <button type="submit" aria-label="Pesquisar">
              <ArrowUpRight size={20} />
            </button>
          </form>
          <button
            className="button button-outline filter-toggle"
            onClick={() => setOpen(true)}
          >
            <SlidersHorizontal size={17} /> Filtros{" "}
            {chips.length > 0 && <span>{chips.length}</span>}
          </button>
          <label className="sort-control">
            Ordenar por
            <select
              aria-label="Ordenar veículos"
              value={search?.get("sort") || ""}
              onChange={(e) => update("sort", e.target.value)}
            >
              <option value="">Mais recentes</option>
              <option value="price_asc">Menor preço</option>
              <option value="price_desc">Maior preço</option>
            </select>
          </label>
        </div>
        <div className="stock-layout">
          <aside className="stock-sidebar">
            <div className="sidebar-heading">
              <SlidersHorizontal size={18} />
              <h2>Refine sua busca</h2>
            </div>
            <VehicleFilter />
          </aside>
          <section className="stock-results" aria-busy={loading}>
            <div className="result-meta">
              <p aria-live="polite">
                {loading ? (
                  "Buscando seus próximos caminhos…"
                ) : error ? (
                  "Estoque indisponível no momento"
                ) : (
                  <>
                    <strong>{vehicles.length}</strong>{" "}
                    {vehicles.length === 1
                      ? "veículo encontrado"
                      : "veículos encontrados"}
                  </>
                )}
              </p>
              <span>GUARAPUAVA · PR</span>
            </div>
            {chips.length > 0 && (
              <div className="filter-chips">
                {chips.map(([k, v]) => (
                  <button
                    key={k}
                    onClick={() => update(k, "")}
                    aria-label={`Remover filtro ${v}`}
                  >
                    {k.startsWith("preco")
                      ? `R$ ${Number(v).toLocaleString("pt-BR")}`
                      : v}
                    <X size={13} />
                  </button>
                ))}
                <Link href="/estoque">Limpar tudo</Link>
              </div>
            )}
            {loading ? (
              <VehicleSkeletons count={6} />
            ) : error ? (
              <div className="empty-state">
                <Search size={34} />
                <h2>Uma pausa no caminho.</h2>
                <p>
                  Não conseguimos carregar os veículos. Tente novamente em
                  instantes.
                </p>
                <button className="button" onClick={() => setRetry(retry + 1)}>
                  <RefreshCw size={16} /> Tentar novamente
                </button>
              </div>
            ) : vehicles.length ? (
              <>
                <div className="vehicle-grid stock-grid">
                  {vehicles.slice(0, visible).map((v) => (
                    <VehicleCard key={v.id} vehicle={v} />
                  ))}
                </div>
                {visible < vehicles.length && (
                  <div className="load-more">
                    <p>
                      Você viu {Math.min(visible, vehicles.length)} de{" "}
                      {vehicles.length} veículos
                    </p>
                    <button
                      className="button button-outline"
                      onClick={() => setVisible(visible + 18)}
                    >
                      Explorar mais veículos <ArrowUpRight size={18} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="empty-state">
                <Search size={36} />
                <h2>Ainda não encontramos essa combinação.</h2>
                <p>
                  Experimente outra marca ou ajuste os filtros para ver mais
                  opções.
                </p>
                <Link className="button" href="/estoque">
                  Ver todos os veículos <ArrowUpRight size={18} />
                </Link>
              </div>
            )}
          </section>
        </div>
      </div>
      {open && (
        <div
          className="modal-backdrop filter-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div
            ref={dialog}
            className="filter-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="filter-title"
          >
            <div className="dialog-heading">
              <h2 id="filter-title">Encontre o seu próximo.</h2>
              <button
                className="icon-button"
                aria-label="Fechar filtros"
                onClick={() => setOpen(false)}
              >
                <X />
              </button>
            </div>
            <VehicleFilter onClose={() => setOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
export default function StockPage() {
  return (
    <Suspense
      fallback={
        <div className="site-container section-space">
          <VehicleSkeletons />
        </div>
      }
    >
      <Stock />
    </Suspense>
  );
}
