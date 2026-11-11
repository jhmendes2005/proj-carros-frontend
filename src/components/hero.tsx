import Link from "next/link";
import { ArrowUpRight, ArrowDown, ShieldCheck } from "lucide-react";
import Image from "next/image";
export default function Hero() {
  return (
    <section className="hero">
      <Image
        src="/showroom-hero.jpg"
        alt="Vista frontal de automóvel esportivo"
        fill
        priority
        sizes="100vw"
        className="hero-image"
      />
      <div className="hero-shade" />
      <div className="site-container hero-content">
        <div className="hero-kicker">
          <span /> BOM JESUS AUTOMÓVEIS · GUARAPUAVA
        </div>
        <h1>
          A próxima
          <br />
          conquista tem
          <br />
          <em>a sua direção.</em>
        </h1>
        <p>
          Seu próximo carro começa com uma boa escolha.
          <br className="desktop-only" /> Encontre o veículo que combina com a
          sua vida.
        </p>
        <div className="hero-actions">
          <Link className="button" href="/estoque">
            Explore o estoque <ArrowUpRight size={19} />
          </Link>
          <Link className="text-link" href="/sobre">
            Conheça a Bom Jesus <ArrowUpRight size={17} />
          </Link>
        </div>
        <div className="hero-assurance">
          <ShieldCheck size={18} /> Transparência em cada etapa. Do primeiro
          contato à chave na mão.
        </div>
      </div>
      <div className="hero-bottom site-container">
        <span>SEU PRÓXIMO CAPÍTULO COMEÇA AQUI</span>
        <a href="#encontre" aria-label="Ir para a busca">
          <ArrowDown size={18} />
        </a>
        <span className="hero-photo-note">Imagem ilustrativa</span>
      </div>
    </section>
  );
}
