import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, MapPin, Handshake, ShieldCheck } from "lucide-react";
import FeaturesSection from "../../components/FeaturesSection";
import ContactBanner from "../../components/ContactBanner";
export default function AboutPage() {
  return (
    <>
      <section className="site-container about-intro">
        <div className="page-intro">
          <div className="breadcrumb">
            <Link href="/">Início</Link>
            <span>/</span>
            <span>A Bom Jesus</span>
          </div>
          <span className="eyebrow">BOM JESUS AUTOMÓVEIS</span>
          <h1>
            Carros aproximam.
            <br />
            <em>Confiança conecta.</em>
          </h1>
          <p>
            Fazemos parte dos caminhos de Guarapuava. E queremos fazer parte do
            seu próximo capítulo.
          </p>
        </div>
        <div className="about-photo">
          <Image
            src="/showroom-hero.jpg"
            alt="Detalhe frontal de automóvel esportivo"
            fill
            sizes="(max-width: 800px) 100vw, 65vw"
          />
          <span>PAIXÃO POR CARROS. RESPEITO POR PESSOAS.</span>
          <small>Imagem ilustrativa</small>
        </div>
        <div className="about-story">
          <span className="eyebrow">PRAZER, SOMOS A BOM JESUS.</span>
          <div>
            <h2>
              Uma escolha importante.
              <br />
              Um atendimento próximo.
            </h2>
            <p>
              Comprar um carro vai além de escolher marca e modelo. É pensar nos
              trajetos do dia a dia, nas viagens e em tudo o que ainda está por
              vir.
            </p>
            <p>
              Por isso, nosso trabalho começa ouvindo você. Apresentamos as
              opções, esclarecemos as condições e ajudamos a encontrar um
              veículo que combine com o seu momento.
            </p>
            <Link href="/contato" className="text-link">
              Venha conhecer nossas lojas <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
        <div className="about-principles">
          {[
            {
              icon: MapPin,
              title: "Perto de você",
              text: "Duas unidades em Guarapuava para conhecer os veículos pessoalmente.",
            },
            {
              icon: Handshake,
              title: "Conversa de verdade",
              text: "Atendimento próximo para entender o que importa na sua escolha.",
            },
            {
              icon: ShieldCheck,
              title: "Clareza para decidir",
              text: "Informações e condições apresentadas com transparência.",
            },
          ].map((p) => (
            <div key={p.title}>
              <p.icon size={29} />
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </div>
          ))}
        </div>
      </section>
      <FeaturesSection />
      <ContactBanner />
    </>
  );
}
