import Link from "next/link";
import { ArrowUpRight, Instagram, MapPin } from "lucide-react";
import Brand from "./Brand";
import { whatsapp } from "../lib/vehicles";
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Brand />
            <p>
              O seu próximo destino começa
              <br />
              com uma escolha de confiança.
            </p>
            <a
              href="https://www.instagram.com/bom.jesus_automoveis/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            >
              <Instagram size={18} /> Siga a Bom Jesus{" "}
              <ArrowUpRight size={14} />
            </a>
          </div>
          <div>
            <h3>Explore</h3>
            <Link href="/estoque">Nosso estoque</Link>
            <Link href="/sobre">A Bom Jesus</Link>
            <Link href="/contato">Nossas lojas</Link>
            <a
              href={whatsapp("Olá! Gostaria de conversar sobre financiamento.")}
              target="_blank"
              rel="noopener noreferrer"
            >
              Financiamento <ArrowUpRight size={13} />
            </a>
          </div>
          <div>
            <h3>Venha nos visitar</h3>
            <p>
              <MapPin size={14} /> Guarapuava · PR
            </p>
            <a
              href="https://maps.app.goo.gl/1oiSvyrrNSWcqBKy7"
              target="_blank"
              rel="noopener noreferrer"
            >
              Centro <ArrowUpRight size={13} />
              <small>Av. Pref. Moacyr Júlio Silvestri, 23</small>
            </a>
            <a
              href="https://maps.app.goo.gl/rYGwfPQQ8xSQHg84A"
              target="_blank"
              rel="noopener noreferrer"
            >
              Santa Cruz <ArrowUpRight size={13} />
              <small>R. Prof. Becker, 3371</small>
            </a>
          </div>
          <div>
            <h3>Conte com a gente</h3>
            <a className="footer-phone" href="tel:+5542984399009">
              (42) 98439-9009
            </a>
            <a href="mailto:contato@bomjesusautomoveis.com">
              contato@bomjesusautomoveis.com
            </a>
            <p>
              Seg. a sex. · 08h30 às 18h30
              <br />
              Sábado · 08h30 às 15h
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} Bom Jesus Automóveis. Todos os direitos
            reservados.
          </p>
          <div>
            <Link href="/privacidade">Privacidade</Link>
            <Link href="/termos-de-uso">Termos de uso</Link>
            <Link href="/login">
              Área da equipe <ArrowUpRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
