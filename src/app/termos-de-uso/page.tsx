"use client";

import Link from "next/link";
import { FileText, ShieldCheck, AlertCircle, Scale, Phone } from "lucide-react";

export default function TermosDeUso() {
  const lastUpdate = "01 de Outubro de 2025"; // Data da última atualização

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* Header / Hero Simplificado */}
      <div className="bg-blue-950 py-16 text-center text-white">
        <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Termos de Uso</h1>
            <p className="text-blue-200 text-sm">
                Última atualização: {lastUpdate}
            </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl -mt-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 md:p-12 space-y-10">
          
          {/* Introdução */}
          <section>
            <div className="flex items-center gap-3 mb-4 text-blue-800">
                <FileText size={28} />
                <h2 className="text-2xl font-bold">1. Aceitação dos Termos</h2>
            </div>
            <p className="text-gray-600 leading-relaxed text-justify">
              Ao acessar e utilizar o site da <strong>Bom Jesus Automóveis</strong>, você concorda em cumprir e estar vinculado aos seguintes termos e condições de uso. Se você não concordar com qualquer parte destes termos, por favor, não utilize nosso site.
            </p>
          </section>

          <hr className="border-gray-100" />

          {/* Informações dos Veículos */}
          <section>
            <div className="flex items-center gap-3 mb-4 text-blue-800">
                <AlertCircle size={28} />
                <h2 className="text-2xl font-bold">2. Informações sobre Veículos</h2>
            </div>
            <div className="space-y-4 text-gray-600 leading-relaxed text-justify">
              <p>
                A Bom Jesus Automóveis se esforça para garantir que todas as informações (preços, especificações, fotos e descrições) exibidas no site sejam precisas e atualizadas. No entanto, erros podem ocorrer.
              </p>
              <ul className="list-disc pl-5 space-y-2 marker:text-blue-500">
                <li>
                  <strong>Preços:</strong> Os preços exibidos estão sujeitos a alteração sem aviso prévio e podem variar de acordo com negociações presenciais.
                </li>
                <li>
                  <strong>Disponibilidade:</strong> A disponibilidade dos veículos no site não é garantida em tempo real. Recomendamos confirmar se o veículo ainda está em estoque entrando em contato conosco.
                </li>
                <li>
                  <strong>Imagens:</strong> As fotos são meramente ilustrativas e podem não refletir com exatidão detalhes específicos de cor ou acabamento devido a variações de monitores.
                </li>
              </ul>
            </div>
          </section>

          <hr className="border-gray-100" />

          {/* Garantias */}
          <section>
            <div className="flex items-center gap-3 mb-4 text-blue-800">
                <ShieldCheck size={28} />
                <h2 className="text-2xl font-bold">3. Garantias e Responsabilidades</h2>
            </div>
            <p className="text-gray-600 leading-relaxed text-justify mb-4">
              Todos os veículos vendidos pela Bom Jesus Automóveis seguem rigorosamente as determinações do Código de Defesa do Consumidor (Lei nº 8.078/1990).
            </p>
            <p className="text-gray-600 leading-relaxed text-justify">
              Garantimos a procedência legal de todos os veículos do estoque. A garantia legal de motor e caixa é de 90 dias, conforme previsto em lei, salvo condições especiais negociadas contratualmente no momento da compra.
            </p>
          </section>

          <hr className="border-gray-100" />

          {/* Financiamento */}
          <section>
            <div className="flex items-center gap-3 mb-4 text-blue-800">
                <Scale size={28} />
                <h2 className="text-2xl font-bold">4. Financiamentos e Propostas</h2>
            </div>
            <p className="text-gray-600 leading-relaxed text-justify">
              As simulações de financiamento e propostas enviadas através do site ou WhatsApp não constituem uma obrigação de venda ou aprovação de crédito. Todas as propostas estão sujeitas à análise de crédito pelas instituições financeiras parceiras e à aprovação final da gerência da loja.
            </p>
          </section>

          <hr className="border-gray-100" />

          {/* Contato */}
          <section className="bg-blue-50 p-6 rounded-xl border border-blue-100">
            <div className="flex items-center gap-3 mb-3 text-blue-800">
                <Phone size={24} />
                <h2 className="text-xl font-bold">Ficou com dúvidas?</h2>
            </div>
            <p className="text-gray-700 mb-4">
              Se você tiver qualquer dúvida sobre estes Termos de Uso, entre em contato conosco pelos nossos canais oficiais.
            </p>
            <div className="flex flex-wrap gap-4">
               <Link href="/contato" className="text-sm font-bold text-blue-600 hover:underline">
                 Ir para página de Contato &rarr;
               </Link>
               <a href="mailto:contato@bomjesusautomoveis.com" className="text-sm font-bold text-blue-600 hover:underline">
                 contato@bomjesusautomoveis.com
               </a>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}