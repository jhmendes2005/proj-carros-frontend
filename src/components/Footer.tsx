"use client";

import Link from "next/link";
import { Facebook, Instagram, MessageCircle, MapPin, Phone, Mail, ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-blue-950 text-gray-300">
      {/* --- Seção Principal --- */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          
          {/* 1. Sobre a Empresa */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white mb-4">Bom Jesus Automóveis</h2>
            <p className="text-sm leading-relaxed text-gray-400">
              Qualidade, confiança e transparência na compra do seu próximo veículo. 
              Trabalhamos com as melhores marcas e modelos do mercado, todos periciados e com garantia.
            </p>
            <div className="flex gap-4 pt-2">
              <a 
                href="https://www.instagram.com/bom.jesus_automoveis/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-900/50 hover:bg-blue-600 hover:text-white transition-all duration-300"
              >
                <Instagram size={20} />
              </a>
              <a href="#" className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-900/50 hover:bg-blue-600 hover:text-white transition-all duration-300">
                <Facebook size={20} />
              </a>
              <a href="#" className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-900/50 hover:bg-green-600 hover:text-white transition-all duration-300">
                <MessageCircle size={20} />
              </a>
            </div>
          </div>

          {/* 2. Links Rápidos */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6 border-b border-blue-800 pb-2 inline-block">
              Navegação
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                  <ArrowRight size={16} className="text-blue-600" /> Home
                </Link>
              </li>
              <li>
                <Link href="/sobre" className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                  <ArrowRight size={16} className="text-blue-600" /> Sobre Nós
                </Link>
              </li>
              <li>
                <Link href="/contato" className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                  <ArrowRight size={16} className="text-blue-600" /> Contato
                </Link>
              </li>
              <li>
                <Link href="/estoque" className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                  <ArrowRight size={16} className="text-blue-600" /> Estoque
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. Contato */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6 border-b border-blue-800 pb-2 inline-block">
              Onde Estamos
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-6 w-6 text-blue-500 flex-shrink-0 mt-1" />
                <span className="text-sm">
                  R. Prof. Becker, 3377 - Santa Cruz<br />
                  Guarapuava - PR, 85015-230
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-blue-500 flex-shrink-0" />
                <span className="text-sm">(42) 98421-3935</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-blue-500 flex-shrink-0" />
                <span className="text-sm">contato@bomjesusautomoveis.com</span>
              </li>
            </ul>
          </div>

          {/* 4. Newsletter / Horário */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6 border-b border-blue-800 pb-2 inline-block">
              Horário de Atendimento
            </h3>
            <div className="space-y-2 text-sm text-gray-400 mb-6">
              <p className="flex justify-between">
                <span>Segunda a Sexta:</span>
                <span className="text-white">08:00 às 18:00</span>
              </p>
              <p className="flex justify-between">
                <span>Sábado:</span>
                <span className="text-white">08:00 às 13:00</span>
              </p>
              <p className="flex justify-between">
                <span>Domingo:</span>
                <span className="text-blue-400">Fechado</span>
              </p>
            </div>

            <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-900/50">
              <p className="text-xs text-blue-200 mb-2">Cadastre-se para receber ofertas:</p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Seu e-mail" 
                  className="w-full bg-blue-950 border border-blue-800 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 text-white"
                />
                <button className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded text-sm font-medium transition-colors">
                  OK
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* --- Barra Inferior --- */}
      <div className="border-t border-blue-900 bg-blue-950/50">
        <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row gap-1 md:gap-4 text-xs text-gray-500 text-center md:text-left">
            <p>Bom Jesus Automóveis © Copyright. Todos os direitos reservados.</p>
            <span className="hidden md:inline text-gray-700">|</span>
            <p>Developed By TecnoSync Services.</p>
          </div>
          <div className="flex gap-6 text-xs text-gray-500">
            <Link href="/termos-de-uso" className="hover:text-white transition-colors">Termos de Uso</Link>
            <Link href="/privacidade" className="hover:text-white transition-colors">Privacidade</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}