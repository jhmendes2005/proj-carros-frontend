"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Gauge,
  Fuel,
  Cog,
  Palette,
  CarFront,
  Check,
  MapPin,
  MessageCircle,
  Share2,
  Expand,
  X,
  ShieldCheck,
  ImageIcon,
  RefreshCw,
} from "lucide-react";
import { api } from "../../../lib/api";
import { Vehicle, money, number, photo, whatsapp } from "../../../lib/vehicles";
import { useDialog } from "../../../lib/useDialog";
import FeaturedVehicles from "../../../components/FeaturedVehicles";
import { trackEvent } from "../../../components/AnalyticsTracker";
export default function VehiclePage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);
  const [index, setIndex] = useState(0);
  const [gallery, setGallery] = useState(false);
  const [shareMessage, setShareMessage] = useState("");
  const dialog = useDialog(gallery, () => setGallery(false));
  useEffect(() => {
    if (!slug) return;
    const c = new AbortController();
    setLoading(true);
    setError(false);
    setIndex(0);
    api
      .get<Vehicle | null>(`/vehicles/${encodeURIComponent(slug)}`, {
        signal: c.signal,
      })
      .then((r) => {
        setVehicle(r.data);
        if (r.data)
          trackEvent("ViewContent", {
            content_name: `${r.data.marca} ${r.data.modelo}`,
            content_ids: [r.data.id],
            content_type: "product",
            value: r.data.preco,
            currency: "BRL",
          });
      })
      .catch(() => {
        if (!c.signal.aborted) setError(true);
      })
      .finally(() => {
        if (!c.signal.aborted) setLoading(false);
      });
    return () => c.abort();
  }, [slug, retry]);
  const photos = vehicle?.fotos?.length
    ? vehicle.fotos.map(photo)
    : ["/vehicle-placeholder.svg"];
  const move = (direction: number) =>
    setIndex((i) => (i + direction + photos.length) % photos.length);
  useEffect(() => {
    if (!gallery) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft")
        setIndex((i) => (i - 1 + photos.length) % photos.length);
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % photos.length);
    };
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, [gallery, photos.length]);
  if (loading)
    return (
      <div
        className="site-container detail-loading"
        role="status"
        aria-label="Carregando veículo"
      >
        <div className="skeleton" />
        <div className="skeleton" />
      </div>
    );
  if (error || !vehicle)
    return (
      <div className="site-container empty-state">
        <CarFront size={44} />
        <span className="eyebrow">
          {error ? "TENTE NOVAMENTE" : "NOVOS CAMINHOS ESPERAM POR VOCÊ"}
        </span>
        <h1>
          {error
            ? "Não conseguimos carregar este veículo."
            : "Este veículo não está disponível."}
        </h1>
        <p>
          {error
            ? "Verifique sua conexão e tente mais uma vez."
            : "Ele pode ter encontrado um novo dono. Veja outras opções no estoque."}
        </p>
        {error && (
          <button className="button" onClick={() => setRetry(retry + 1)}>
            <RefreshCw size={17} /> Tentar novamente
          </button>
        )}
        <Link className="button button-outline" href="/estoque">
          Voltar ao estoque <ArrowUpRight size={18} />
        </Link>
      </div>
    );
  const name = `${vehicle.marca} ${vehicle.modelo}`;
  const contact = (financing = false) =>
    whatsapp(
      `Olá! Tenho interesse no ${name}, ${vehicle.anoModelo || ""}, anunciado por ${money(vehicle.preco)}. ${financing ? "Gostaria de conhecer as condições de financiamento." : "Podemos conversar?"} ${typeof window !== "undefined" ? window.location.href : ""}`,
    );
  const share = async () => {
    try {
      if (navigator.share)
        await navigator.share({ title: name, url: window.location.href });
      else {
        await navigator.clipboard.writeText(window.location.href);
        setShareMessage("Link copiado!");
      }
      trackEvent("Lead", {
        content_name: "Compartilhar",
        content_category: "User Action",
      });
    } catch (e) {
      if (!(e instanceof DOMException && e.name === "AbortError"))
        setShareMessage("Copie o endereço da página para compartilhar.");
    }
  };
  const specs = [
    {
      icon: CalendarDays,
      name: "Ano",
      value:
        vehicle.anoFabricacao && vehicle.anoModelo
          ? `${vehicle.anoFabricacao} / ${vehicle.anoModelo}`
          : vehicle.anoModelo,
    },
    {
      icon: Gauge,
      name: "Quilometragem",
      value:
        vehicle.quilometragem == null
          ? null
          : `${number(vehicle.quilometragem)} km`,
    },
    { icon: Fuel, name: "Combustível", value: vehicle.combustivel },
    { icon: Cog, name: "Câmbio", value: vehicle.cambio },
    { icon: Palette, name: "Cor", value: vehicle.cor },
    { icon: CarFront, name: "Portas", value: vehicle.portas },
  ];
  return (
    <div className="detail-page">
      <div className="site-container">
        <div className="detail-top">
          <div className="breadcrumb">
            <Link href="/estoque">Estoque</Link>
            <span>/</span>
            <span>{name}</span>
          </div>
          <button className="subtle-link" onClick={share}>
            <Share2 size={15} />
            Compartilhar
          </button>
          <span role="status" className="share-feedback">
            {shareMessage}
          </span>
        </div>
        <div className="detail-grid">
          <div className="vehicle-gallery">
            <div className="main-photo">
              <img
                src={photos[index]}
                alt={`${name} — foto ${index + 1}`}
                fetchPriority="high"
              />
              <button className="photo-expand" onClick={() => setGallery(true)}>
                <Expand size={16} /> Ampliar fotos
              </button>
              <span className="photo-counter">
                <ImageIcon size={14} /> {index + 1} / {photos.length}
              </span>
              {photos.length > 1 && (
                <>
                  <button
                    className="gallery-prev"
                    onClick={() => move(-1)}
                    aria-label="Foto anterior"
                  >
                    <ArrowLeft size={19} />
                  </button>
                  <button
                    className="gallery-next"
                    onClick={() => move(1)}
                    aria-label="Próxima foto"
                  >
                    <ArrowRight size={19} />
                  </button>
                </>
              )}
            </div>
            <div className="photo-thumbnails">
              {photos.map((src, i) => (
                <button
                  key={`${src}-${i}`}
                  onClick={() => setIndex(i)}
                  aria-label={`Ver foto ${i + 1}`}
                  aria-pressed={index === i}
                >
                  <img src={src} alt="" loading="lazy" />
                </button>
              ))}
            </div>
          </div>
          <aside className="vehicle-summary">
            <div className="summary-kicker">
              <span className="eyebrow">{vehicle.marca}</span>
              <span>
                <MapPin size={12} /> GUARAPUAVA · PR
              </span>
            </div>
            <h1>{vehicle.modelo}</h1>
            <p className="summary-version">{vehicle.versao}</p>
            <div className="summary-tags">
              <span>{vehicle.anoModelo || "Ano sob consulta"}</span>
              <span>
                {vehicle.quilometragem == null
                  ? "KM sob consulta"
                  : `${number(vehicle.quilometragem)} km`}
              </span>
              {vehicle.cambio && <span>{vehicle.cambio}</span>}
            </div>
            <div className="summary-price">
              <span>SEU PRÓXIMO PASSO</span>
              <strong>{money(vehicle.preco)}</strong>
              <p>Consulte disponibilidade e condições com nossa equipe.</p>
            </div>
            <a
              className="button"
              href={contact()}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={18} /> Tenho interesse{" "}
              <ArrowUpRight size={18} />
            </a>
            <a
              className="button button-outline"
              href={contact(true)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Consultar financiamento <ArrowUpRight size={17} />
            </a>
            <div className="summary-trust">
              <ShieldCheck size={19} />
              <p>
                Uma boa escolha começa com informação.
                <br />
                <strong>Tire suas dúvidas com quem entende.</strong>
              </p>
            </div>
          </aside>
        </div>
        <div className="detail-information">
          <section>
            <span className="eyebrow">CADA DETALHE IMPORTA</span>
            <h2>Conheça de perto.</h2>
            <div className="spec-grid">
              {specs.map((s) => (
                <div key={s.name}>
                  <s.icon size={21} />
                  <span>
                    {s.name}
                    <strong>{s.value || "Sob consulta"}</strong>
                  </span>
                </div>
              ))}
            </div>
            {vehicle.descricao && (
              <div className="vehicle-description">
                <h3>Sobre este veículo</h3>
                <p>{vehicle.descricao.replace(/<[^>]*>/g, " ")}</p>
              </div>
            )}
            {!!vehicle.opcionais?.length && (
              <div className="vehicle-options">
                <h3>Equipamentos e conforto</h3>
                <ul>
                  {vehicle.opcionais.map((o, i) => (
                    <li key={`${o}-${i}`}>
                      <Check size={15} />
                      {o}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <p className="vehicle-disclaimer">
              Informações e disponibilidade sujeitas a confirmação. Consulte
              nossa equipe para conhecer todos os detalhes e condições.
            </p>
          </section>
          <div className="visit-panel">
            <MapPin size={28} />
            <span className="eyebrow">O PRÓXIMO PASSO É PESSOALMENTE</span>
            <h3>
              Vamos marcar
              <br />
              uma visita?
            </h3>
            <p>
              Conheça o veículo, sinta cada detalhe e tire suas dúvidas com a
              nossa equipe.
            </p>
            <Link href="/contato" className="text-link">
              Encontre nossas lojas <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
      </div>
      <FeaturedVehicles count={3} />
      <div className="mobile-interest">
        <div>
          <span>{name}</span>
          <strong>{money(vehicle.preco)}</strong>
        </div>
        <a
          href={contact()}
          target="_blank"
          rel="noopener noreferrer"
          className="button"
        >
          <MessageCircle size={17} />
          Tenho interesse
        </a>
      </div>
      {gallery && (
        <div className="modal-backdrop lightbox-backdrop">
          <div
            ref={dialog}
            role="dialog"
            aria-modal="true"
            aria-label={`Fotos do ${name}`}
            className="lightbox"
          >
            <div className="lightbox-header">
              <span>
                {name} · {index + 1} / {photos.length}
              </span>
              <button
                className="icon-button"
                onClick={() => setGallery(false)}
                aria-label="Fechar galeria"
              >
                <X />
              </button>
            </div>
            <img src={photos[index]} alt={`${name} — foto ${index + 1}`} />
            <div className="lightbox-controls">
              <button
                className="icon-button"
                onClick={() => move(-1)}
                aria-label="Foto anterior"
              >
                <ArrowLeft />
              </button>
              <span aria-live="polite">
                {index + 1} / {photos.length}
              </span>
              <button
                className="icon-button"
                onClick={() => move(1)}
                aria-label="Próxima foto"
              >
                <ArrowRight />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
