"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Loader2,
} from "lucide-react";
import { stores } from "../../lib/stores";
import { useWhatsApp } from "../../context/WhatsAppContext";
export default function ContactPage() {
  const { openModal } = useWhatsApp();
  const [nearest, setNearest] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [geoError, setGeoError] = useState("");
  const find = () => {
    if (!navigator.geolocation) {
      setGeoError(
        "Seu navegador não oferece localização. Escolha uma das lojas abaixo.",
      );
      return;
    }
    setLoading(true);
    setGeoError("");
    navigator.geolocation.getCurrentPosition(
      (p) => {
        const rad = (v: number) => (v * Math.PI) / 180;
        const distance = (lat: number, lng: number) => {
          const a =
            Math.sin(rad(lat - p.coords.latitude) / 2) ** 2 +
            Math.cos(rad(lat)) *
              Math.cos(rad(p.coords.latitude)) *
              Math.sin(rad(lng - p.coords.longitude) / 2) ** 2;
          return 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        };
        const store = [...stores].sort(
          (a, b) => distance(a.lat, a.lng) - distance(b.lat, b.lng),
        )[0];
        setNearest(store.id);
        setLoading(false);
        document
          .getElementById(`store-${store.id}`)
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      },
      () => {
        setLoading(false);
        setGeoError(
          "Não foi possível acessar sua localização. Você pode abrir a rota de qualquer unidade abaixo.",
        );
      },
      { timeout: 10000 },
    );
  };
  return (
    <div className="contact-page site-container">
      <div className="page-intro">
        <div className="breadcrumb">
          <Link href="/">Início</Link>
          <span>/</span>
          <span>Contato</span>
        </div>
        <span className="eyebrow">DE PERTO É AINDA MELHOR</span>
        <h1>
          Vamos conversar
          <br />
          <em>sobre o seu próximo?</em>
        </h1>
        <p>
          Duas lojas em Guarapuava. Uma equipe pronta para ajudar você a
          escolher.
        </p>
      </div>
      <div className="contact-methods">
        <button className="contact-shine" onClick={openModal}>
          <MessageCircle size={25} />
          <span>
            Seu próximo carro começa aqui<strong>Fale pelo WhatsApp</strong>
          </span>
          <ArrowUpRight size={22} />
        </button>
        <a href="tel:+5542984399009">
          <Phone size={23} />
          <span>
            Prefere uma ligação?<strong>(42) 98439-9009</strong>
          </span>
          <ArrowUpRight size={20} />
        </a>
        <a href="mailto:contato@bomjesusautomoveis.com">
          <Mail size={23} />
          <span>
            Escreva para a gente<strong>contato@bomjesusautomoveis.com</strong>
          </span>
          <ArrowUpRight size={20} />
        </a>
      </div>
      <div className="store-heading">
        <div>
          <span className="eyebrow">NOS ENCONTRAMOS POR AQUI</span>
          <h2>Escolha sua unidade.</h2>
        </div>
        <button
          className="button button-outline"
          onClick={find}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="spin" size={17} />
          ) : (
            <Navigation size={17} />
          )}
          {loading ? "Localizando…" : "Encontrar a mais próxima"}
        </button>
      </div>
      {geoError && (
        <p className="inline-notice" role="status">
          {geoError}
        </p>
      )}
      <div className="store-grid">
        {stores.map((s, i) => (
          <article
            id={`store-${s.id}`}
            className={`store-card ${nearest === s.id ? "is-nearest" : ""}`}
            key={s.id}
          >
            <div className="store-map">
              <iframe
                src={s.iframeSrc}
                title={`Mapa da ${s.nome}`}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="store-body">
              <span className="eyebrow">
                0{i + 1} / GUARAPUAVA · PR{" "}
                {nearest === s.id && "· MAIS PRÓXIMA"}
              </span>
              <h3>{s.nome}</h3>
              <p>
                <MapPin size={16} />
                {s.endereco}
              </p>
              <div className="store-hours">
                <Clock3 size={16} />
                <span>
                  Seg. a sex. · 08h30 às 18h30
                  <br />
                  Sábado · 08h30 às 15h
                </span>
              </div>
              <a
                className="button button-outline"
                href={s.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Traçar rota <ArrowUpRight size={17} />
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
