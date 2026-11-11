"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowUpRight, MessageCircle, X } from "lucide-react";
import { useWhatsApp } from "../context/WhatsAppContext";
import { useDialog } from "../lib/useDialog";
import { whatsapp } from "../lib/vehicles";
export default function FloatingWhatsApp() {
  const { isOpen, openModal, closeModal } = useWhatsApp();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const path = usePathname();
  const dialog = useDialog(isOpen, closeModal);
  return (
    <>
      <button
        className={`whatsapp-float ${path?.startsWith("/veiculo/") ? "on-detail" : ""}`}
        onClick={openModal}
        aria-label="Falar pelo WhatsApp"
      >
        <MessageCircle size={25} />
        <span>Vamos conversar?</span>
      </button>
      {isOpen && (
        <div
          className="modal-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div
            className="contact-dialog"
            ref={dialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-title"
          >
            <button
              className="icon-button dialog-close"
              onClick={closeModal}
              aria-label="Fechar contato"
            >
              <X size={20} />
            </button>
            <MessageCircle className="dialog-symbol" size={32} />
            <span className="eyebrow">BOM JESUS AUTOMÓVEIS</span>
            <h2 id="contact-title">
              Seu próximo caminho
              <br />
              começa na conversa.
            </h2>
            <p>
              Conte como podemos chamar você. A conversa continua no WhatsApp.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const interest = path?.startsWith("/veiculo/")
                  ? `\nTenho interesse neste veículo: ${window.location.href}`
                  : "\nGostaria de saber mais sobre os veículos.";
                window.open(
                  whatsapp(
                    `Olá! Meu nome é ${name.trim()} e meu WhatsApp é ${phone}.${interest}`,
                  ),
                  "_blank",
                  "noopener,noreferrer",
                );
                closeModal();
              }}
            >
              <label htmlFor="wa-name">
                Seu nome
                <input
                  autoComplete="name"
                  id="wa-name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Como podemos chamar você?"
                />
              </label>
              <label htmlFor="wa-phone">
                Seu WhatsApp com DDD
                <input
                  autoComplete="tel"
                  type="tel"
                  id="wa-phone"
                  required
                  minLength={10}
                  maxLength={20}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(42) 99999-9999"
                />
              </label>
              <button className="button" type="submit">
                Continuar no WhatsApp <ArrowUpRight size={18} />
              </button>
              <small>
                Ao continuar, seus dados serão enviados pelo WhatsApp para nossa
                equipe. <a href="/privacidade">Saiba mais</a>.
              </small>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
