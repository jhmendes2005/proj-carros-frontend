"use client";

import Link from "next/link";
import { CarFront, Bike, Truck, Bus, Tractor, Car, ArrowRight } from "lucide-react";

const categories = [
  { name: "Carros", icon: CarFront, slug: "Carro" },
  { name: "Motos", icon: Bike, slug: "Moto" },
  { name: "Caminhonetes", icon: Car, slug: "Caminhonete" },
  { name: "Caminhões", icon: Truck, slug: "Caminhao" },
  { name: "Vans", icon: Bus, slug: "Van" },
  { name: "Utilitários", icon: Tractor, slug: "Utilitario" },
];

export default function CategoryIcons() {
  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Título da Seção com detalhe visual */}
        <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-blue-950 uppercase tracking-wide">
              Navegue por Categoria
            </h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mt-4 rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((cat) => (
            <Link 
              key={cat.name}
              href={`/estoque?tipo=${encodeURIComponent(cat.slug)}`}
              className="group relative flex flex-col items-center justify-center gap-4 p-6 h-48 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden"
            >
              {/* Círculo decorativo de fundo (efeito sutil) */}
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 rounded-full bg-blue-50 group-hover:bg-blue-100/50 transition-colors z-0"></div>
              
              {/* Ícone com círculo de fundo */}
              <div className="relative z-10 p-4 bg-blue-50 text-blue-600 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-inner">
                <cat.icon size={36} strokeWidth={1.5} />
              </div>
              
              {/* Nome da Categoria */}
              <span className="relative z-10 text-lg font-bold text-gray-700 group-hover:text-blue-900 transition-colors">
                {cat.name}
              </span>
              
              {/* Texto indicativo que aparece no hover (apenas desktop) */}
              <div className="hidden lg:flex items-center gap-1 absolute bottom-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 text-blue-500 text-xs font-bold uppercase tracking-wider">
                Ver estoque <ArrowRight size={12} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}