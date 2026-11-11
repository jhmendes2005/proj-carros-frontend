"use client";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { useWhatsApp } from "../context/WhatsAppContext";
export default function ContactBanner() {
  const { openModal } = useWhatsApp();
  return (
    <section className="site-container contact-banner">
      <div>
        <span className="eyebrow">A GENTE AJUDA VOCÊ A ESCOLHER</span>
        <h2>
          Seu próximo carro.
          <br />
          Uma conversa de distância.
        </h2>
      </div>
      <button className="button contact-shine" onClick={openModal}>
        <MessageCircle size={19} /> Fale com um consultor{" "}
        <ArrowUpRight size={19} />
      </button>
    </section>
  );
}
