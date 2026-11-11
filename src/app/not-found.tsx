import Link from "next/link";
import { ArrowUpRight, Route } from "lucide-react";
export default function NotFound() {
  return (
    <div className="site-container section-space">
      <div className="empty-state">
        <Route size={40} />
        <span className="eyebrow">404 · VAMOS RECALCULAR A ROTA</span>
        <h1>Este caminho não existe.</h1>
        <p>Mas seu próximo veículo pode estar a poucos cliques daqui.</p>
        <Link href="/estoque" className="button">
          Explore o estoque <ArrowUpRight size={18} />
        </Link>
        <Link href="/" className="subtle-link">
          Voltar ao início
        </Link>
      </div>
    </div>
  );
}
