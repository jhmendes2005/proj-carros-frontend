"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, RefreshCw } from "lucide-react";
import { api } from "../lib/api";
import { Vehicle } from "../lib/vehicles";
import VehicleCard from "./VehicleCard";
export function VehicleSkeletons({ count = 3 }: { count?: number }) {
  return (
    <div
      className="vehicle-grid"
      aria-label="Carregando veículos"
      role="status"
    >
      {Array.from({ length: count }, (_, i) => (
        <div className="skeleton-card" key={i}>
          <div />
          <span />
          <span />
          <span />
        </div>
      ))}
    </div>
  );
}
export default function FeaturedVehicles({ count = 6 }: { count?: number }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    const c = new AbortController();
    setLoading(true);
    setError(false);
    api
      .get<Vehicle[]>("/vehicles", { signal: c.signal })
      .then((r) => setVehicles(r.data.slice(0, count)))
      .catch(() => {
        if (!c.signal.aborted) setError(true);
      })
      .finally(() => {
        if (!c.signal.aborted) setLoading(false);
      });
    return () => c.abort();
  }, [count, retry]);
  return (
    <section className="site-container section-space">
      <div className="section-heading">
        <div>
          <span className="eyebrow">ESCOLHAS QUE FAZEM SENTIDO</span>
          <h2>
            Seu próximo carro.
            <br />
            <span>Já está por aqui.</span>
          </h2>
        </div>
        <Link className="button button-outline" href="/estoque">
          Ver estoque completo <ArrowUpRight size={18} />
        </Link>
      </div>
      {loading ? (
        <VehicleSkeletons count={count} />
      ) : error ? (
        <div className="empty-state">
          <h3>Não foi possível carregar o estoque.</h3>
          <p>Confira sua conexão e tente novamente.</p>
          <button
            className="button button-outline"
            onClick={() => setRetry(retry + 1)}
          >
            <RefreshCw size={16} /> Tentar novamente
          </button>
        </div>
      ) : vehicles.length ? (
        <div className="vehicle-grid">
          {vehicles.map((v) => (
            <VehicleCard key={v.id} vehicle={v} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>Novidades a caminho.</h3>
          <p>Fale com nossa equipe para encontrar o seu veículo.</p>
          <Link href="/contato" className="button">
            Entre em contato <ArrowUpRight size={17} />
          </Link>
        </div>
      )}
    </section>
  );
}
