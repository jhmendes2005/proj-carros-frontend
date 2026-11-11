import Link from "next/link";
import { ArrowUpRight, CalendarDays, Gauge, Cog } from "lucide-react";
import { Vehicle, money, number, photo } from "../lib/vehicles";
export default function VehicleCard({ vehicle: v }: { vehicle: Vehicle }) {
  return (
    <article className="vehicle-card">
      <Link
        href={`/veiculo/${v.slug}`}
        className="vehicle-card-image"
        aria-label={`Ver ${v.marca} ${v.modelo}`}
      >
        <img
          src={photo(v.fotos?.[0])}
          alt={`${v.marca} ${v.modelo}`}
          loading="lazy"
        />
        {v.destaque && <span className="image-badge">SELEÇÃO BOM JESUS</span>}
        <span className="image-arrow">
          <ArrowUpRight size={21} />
        </span>
      </Link>
      <div className="vehicle-card-body">
        <span className="eyebrow">{v.marca}</span>
        <Link href={`/veiculo/${v.slug}`}>
          <h3>{v.modelo}</h3>
        </Link>
        <p className="vehicle-version">
          {v.versao || "Conheça os detalhes deste veículo"}
        </p>
        <div className="vehicle-spec-line">
          <span>
            <CalendarDays size={14} />
            {v.anoModelo || "—"}
          </span>
          <span>
            <Gauge size={14} />
            {v.quilometragem == null
              ? "Consulte"
              : `${number(v.quilometragem)} km`}
          </span>
          {v.cambio && (
            <span>
              <Cog size={14} />
              {v.cambio}
            </span>
          )}
        </div>
        <div className="vehicle-price-row">
          <strong>{money(v.preco)}</strong>
          <Link
            href={`/veiculo/${v.slug}`}
            aria-label={`Detalhes do ${v.modelo}`}
          >
            Ver veículo <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>
    </article>
  );
}
