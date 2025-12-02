"use client";

import { ShieldCheck, Banknote, Car, Trophy, ArrowRight, Key } from "lucide-react";
import Link from "next/link";

export default function FeaturesSection() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        
        {/* Cabeçalho Centralizado */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-3">
            Experiência Premium
          </h2>
          <h3 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            Muito mais que uma concessionária.
          </h3>
          <p className="mt-4 text-gray-600 text-lg">
            Há mais de 25 anos entregando qualidade e realizando sonhos com segurança total.
          </p>
        </div>

        {/* Grid Principal: Cards e Imagem Central */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          
          {/* Coluna Esquerda - Cards */}
          <div className="space-y-6">
            <div className="group p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <ShieldCheck size={24} />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Garantia Total</h4>
                <p className="text-sm text-gray-600">
                    Veículos periciados com laudo cautelar aprovado. Transparência total no histórico de cada unidade.
                </p>
            </div>

            <div className="group p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-600 group-hover:text-white transition-colors">
                    <Banknote size={24} />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Taxas Especiais</h4>
                <p className="text-sm text-gray-600">
                    Parceria com os principais bancos para garantir as menores taxas de financiamento do mercado.
                </p>
            </div>
          </div>

          {/* Coluna Central - Imagem de Destaque (Carro) */}
          <div className="relative h-[400px] lg:h-[500px] w-full rounded-3xl overflow-hidden shadow-2xl lg:scale-110 z-10 border-4 border-white">
             {/* Imagem de um carro frontal imponente */}
             <img 
               src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=2070&auto=format&fit=crop" 
               alt="Carro Esportivo em destaque na loja" 
               className="w-full h-full object-cover"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-blue-950/80 via-transparent to-transparent flex flex-col justify-end p-8 text-center">
                <p className="text-white font-bold text-xl">Estoque Selecionado</p>
                <Link href="/estoque" className="text-blue-200 text-sm hover:text-white mt-1 inline-flex items-center justify-center gap-1">
                    Ver todos os veículos <ArrowRight size={14} />
                </Link>
             </div>
          </div>

          {/* Coluna Direita - Cards */}
          <div className="space-y-6">
            <div className="group p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    <Car size={24} />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Melhor Avaliação</h4>
                <p className="text-sm text-gray-600">
                    Valorizamos seu usado na troca. Avaliação justa e rápida para você sair de carro novo.
                </p>
            </div>

            <div className="group p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                    <Key size={24} />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Pós-Venda</h4>
                <p className="text-sm text-gray-600">
                    Nosso compromisso continua após a entrega das chaves. Suporte completo para sua tranquilidade.
                </p>
            </div>
          </div>

        </div>

        {/* Barra de Estatísticas (Autoridade) */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-gray-100 pt-12">
            <div className="text-center">
                <p className="text-4xl font-extrabold text-blue-600 mb-1">25+</p>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Anos de História</p>
            </div>
            <div className="text-center">
                <p className="text-4xl font-extrabold text-blue-600 mb-1">5k+</p>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Carros Vendidos</p>
            </div>
             <div className="text-center">
                <p className="text-4xl font-extrabold text-blue-600 mb-1">100%</p>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Laudo Aprovado</p>
            </div>
             <div className="text-center">
                <p className="text-4xl font-extrabold text-blue-600 mb-1">4.9</p>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Estrelas no Google</p>
            </div>
        </div>
      </div>
    </section>
  );
}