import Link from "next/link";
import {
  ArrowUpRight,
  ShieldCheck,
  Handshake,
  WalletCards,
} from "lucide-react";
export default function FeaturesSection() {
  return (
    <section className="experience-section">
      <div className="site-container experience-grid">
        <div className="experience-intro">
          <span className="eyebrow">A DIFERENÇA ESTÁ NA CONFIANÇA</span>
          <h2>
            Mais que vender carros.
            <br />
            <span>Conectar histórias.</span>
          </h2>
          <p>
            Uma compra importante merece atenção de verdade. Na Bom Jesus, você
            conhece o veículo, tira suas dúvidas e decide com tranquilidade.
          </p>
          <Link href="/sobre" className="text-link">
            Conheça a nossa história <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="experience-list">
          {[
            {
              icon: ShieldCheck,
              title: "Transparência de ponta a ponta",
              text: "Informações claras sobre o veículo e suas condições para você fazer uma escolha consciente.",
            },
            {
              icon: WalletCards,
              title: "Encontre a sua condição",
              text: "Converse com a equipe sobre financiamento e possibilidades para a sua compra.",
            },
            {
              icon: Handshake,
              title: "Seu usado pode entrar na troca",
              text: "Traga seu veículo para uma avaliação e dê o próximo passo com a gente.",
            },
          ].map((f, i) => (
            <div key={f.title}>
              <span className="feature-number">0{i + 1}</span>
              <f.icon size={25} />
              <div>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
