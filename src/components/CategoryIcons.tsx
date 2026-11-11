import Link from "next/link";
import { CarFront, Bike, Truck, BusFront, ArrowUpRight } from "lucide-react";
const categories = [
  {
    name: "Carros",
    type: "Carro",
    icon: CarFront,
    detail: "Para todos os seus caminhos",
  },
  {
    name: "Caminhonetes",
    type: "Caminhonete",
    icon: Truck,
    detail: "Força para ir além",
  },
  {
    name: "Motos",
    type: "Moto",
    icon: Bike,
    detail: "Liberdade em duas rodas",
  },
  {
    name: "Utilitários",
    type: "Utilitario",
    icon: BusFront,
    detail: "Parceiros do seu trabalho",
  },
];
export default function CategoryIcons() {
  return (
    <section className="category-section">
      <div className="site-container">
        <div className="section-heading compact">
          <span className="eyebrow">QUAL É O SEU ESTILO?</span>
          <span className="muted">Um caminho para cada momento.</span>
        </div>
        <div className="category-grid">
          {categories.map((c) => (
            <Link key={c.type} href={`/estoque?tipo=${c.type}`}>
              <c.icon size={38} strokeWidth={1.2} />
              <div>
                <h3>{c.name}</h3>
                <p>{c.detail}</p>
              </div>
              <ArrowUpRight size={18} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
