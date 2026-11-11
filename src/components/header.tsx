"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X, MapPin } from "lucide-react";
import Brand from "./Brand";
import HeaderSearch from "./HeaderSearch";
import { useWhatsApp } from "../context/WhatsAppContext";
const links = [
  { href: "/estoque", label: "Nosso estoque" },
  { href: "/sobre", label: "A Bom Jesus" },
  { href: "/contato", label: "Nossas lojas" },
];
export default function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const { openModal } = useWhatsApp();
  useEffect(() => {
    setOpen(false);
  }, [path]);
  useEffect(() => {
    if (!open) return;
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [open]);
  return (
    <>
      <div className="topline">
        <div className="site-container">
          <span>
            <MapPin size={12} /> Guarapuava, Paraná
          </span>
          <a href="tel:+5542984399009">
            Vamos conversar: (42) 98439-9009 <ArrowUpRight size={12} />
          </a>
        </div>
      </div>
      <header className="site-header">
        <div className="site-container header-inner">
          <Brand />
          <nav aria-label="Navegação principal" className="desktop-nav">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={path === l.href ? "page" : undefined}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="header-actions">
            <div className="header-search-desktop">
              <HeaderSearch onNavigate={() => setOpen(false)} />
            </div>
            <button
              className="button button-small header-contact contact-shine"
              onClick={openModal}
            >
              Fale com a gente <ArrowUpRight size={16} />
            </button>
            <button
              ref={menuButton}
              className="icon-button menu-toggle"
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen(!open)}
            >
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        <div className="site-container header-search-mobile">
          <HeaderSearch onNavigate={() => setOpen(false)} />
        </div>
        {open && (
          <nav
            id="mobile-menu"
            className="mobile-nav"
            aria-label="Navegação móvel"
          >
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
                {l.label}
                <ArrowUpRight size={18} />
              </Link>
            ))}
            <button
              className="button contact-shine"
              onClick={() => {
                setOpen(false);
                openModal();
              }}
            >
              Falar com um consultor <ArrowUpRight size={18} />
            </button>
          </nav>
        )}
      </header>
    </>
  );
}
