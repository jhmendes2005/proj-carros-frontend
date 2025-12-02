"use client";

import Link from "next/link";
import { Lock, Eye, Database, Cookie, UserCheck, Phone } from "lucide-react";

export default function Privacidade() {
  const lastUpdate = "01 de Outubro de 2025";

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* Header / Hero Simplificado */}
      <div className="bg-blue-950 py-16 text-center text-white">
        <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Política de Privacidade</h1>
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
                <Lock size={28} />
                <h2 className="text-2xl font-bold">1. Nosso Compromisso</h2>
            </div>
            <p className="text-gray-600 leading-relaxed text-justify">
              A <strong>Bom Jesus Automóveis</strong> respeita a sua privacidade e está comprometida em proteger os dados pessoais que você compartilha conosco. Esta política descreve como coletamos, utilizamos e protegemos suas informações ao visitar nosso site ou utilizar nossos serviços.
            </p>
          </section>

          <hr className="border-gray-100" />

          {/* Coleta de Dados */}
          <section>
            <div className="flex items-center gap-3 mb-4 text-blue-800">
                <Database size={28} />
                <h2 className="text-2xl font-bold">2. Informações que Coletamos</h2>
            </div>
            <div className="space-y-4 text-gray-600 leading-relaxed text-justify">
              <p>
                Coletamos informações para fornecer uma melhor experiência de atendimento. Os tipos de dados incluem:
              </p>
              <ul className="list-disc pl-5 space-y-2 marker:text-blue-500">
                <li>
                  <strong>Dados Fornecidos por Você:</strong> Nome, telefone, e-mail e mensagens enviadas através dos nossos formulários de contato ou botões de WhatsApp.
                </li>
                <li>
                  <strong>Dados de Navegação:</strong> Endereço IP, tipo de navegador, páginas visitadas e tempo de permanência, coletados de forma anônima para fins estatísticos.
                </li>
              </ul>
            </div>
          </section>

          <hr className="border-gray-100" />

          {/* Uso das Informações */}
          <section>
            <div className="flex items-center gap-3 mb-4 text-blue-800">
                <Eye size={28} />
                <h2 className="text-2xl font-bold">3. Como Usamos seus Dados</h2>
            </div>
            <p className="text-gray-600 leading-relaxed text-justify mb-4">
              As informações coletadas são utilizadas exclusivamente para:
            </p>
            <ul className="list-disc pl-5 space-y-2 marker:text-blue-500 text-gray-600 text-justify">
              <li>Responder às suas solicitações de contato e propostas comerciais.</li>
              <li>Melhorar a funcionalidade e o conteúdo do nosso site.</li>
              <li>Enviar comunicações sobre novos veículos ou promoções (caso você tenha optado por receber).</li>
              <li>Cumprir obrigações legais e regulatórias.</li>
            </ul>
          </section>

          <hr className="border-gray-100" />

          {/* Cookies */}
          <section>
            <div className="flex items-center gap-3 mb-4 text-blue-800">
                <Cookie size={28} />
                <h2 className="text-2xl font-bold">4. Cookies e Tecnologias</h2>
            </div>
            <p className="text-gray-600 leading-relaxed text-justify">
              Utilizamos cookies para melhorar sua experiência de navegação. Eles nos ajudam a entender como você interage com nosso site. Você pode configurar seu navegador para recusar cookies, mas isso pode limitar algumas funcionalidades da página.
            </p>
          </section>

          <hr className="border-gray-100" />

          {/* Direitos do Usuário */}
          <section>
            <div className="flex items-center gap-3 mb-4 text-blue-800">
                <UserCheck size={28} />
                <h2 className="text-2xl font-bold">5. Seus Direitos (LGPD)</h2>
            </div>
            <p className="text-gray-600 leading-relaxed text-justify">
              Em conformidade com a Lei Geral de Proteção de Dados (LGPD), você tem o direito de solicitar o acesso, correção ou exclusão dos seus dados pessoais armazenados em nossa base. Para exercer esses direitos, basta entrar em contato conosco.
            </p>
          </section>

          <hr className="border-gray-100" />

          {/* Contato */}
          <section className="bg-blue-50 p-6 rounded-xl border border-blue-100">
            <div className="flex items-center gap-3 mb-3 text-blue-800">
                <Phone size={24} />
                <h2 className="text-xl font-bold">Fale com o Encarregado de Dados</h2>
            </div>
            <p className="text-gray-700 mb-4">
              Se tiver dúvidas sobre como tratamos seus dados, entre em contato pelo e-mail abaixo.
            </p>
            <div className="flex flex-wrap gap-4">
               <a href="mailto:privacidade@bomjesusautomoveis.com" className="text-sm font-bold text-blue-600 hover:underline">
                 privacidade@bomjesusautomoveis.com
               </a>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}