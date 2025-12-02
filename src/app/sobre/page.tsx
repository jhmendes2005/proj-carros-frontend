"use client";

import Image from "next/image";
import Link from "next/link";
import Hero from "@/src/components/hero"; 
import { Target, Eye, Heart, CheckCircle2, MapPin } from "lucide-react";

export default function SobreNos() {
  return (
    <div className="bg-white min-h-screen pb-12">
      {/* 1. Hero / Cabeçalho */}
      <div className="relative bg-blue-950 text-white py-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-900/20 skew-x-12 transform translate-x-20" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            Nossa História
          </h1>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto">
            Há mais de 25 anos acelerando sonhos e construindo confiança no mercado automotivo.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 space-y-20">
        
        {/* 2. Seção Principal: Texto + Vídeo */}
        <section className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold">
              <CheckCircle2 size={16} />
              Excelência Comprovada
            </div>
            <h2 className="text-3xl font-bold text-gray-900 leading-tight">
              Tradição e Qualidade que você confia.
            </h2>
            <div className="text-gray-600 space-y-4 leading-relaxed text-justify">
              <p>
                Há mais de 25 anos, a <strong className="text-blue-700">Bom Jesus Automóveis</strong> se destaca no mercado nacional pela excelência na venda de veículos. Prezamos pela transparência, qualidade e confiança em cada negociação, garantindo que nossos clientes realizem compras seguras e satisfatórias.
              </p>
              <p>
                Todos os nossos veículos são rigorosamente vistoriados e certificados, assegurando não apenas a procedência, mas também a tranquilidade dos nossos clientes. Nosso compromisso vai além da venda: buscamos proporcionar uma experiência única, alinhada ao estilo de vida e às expectativas de quem confia em nosso trabalho.
              </p>
              <p className="font-medium text-gray-800 italic border-l-4 border-blue-600 pl-4 py-2 bg-gray-50 rounded-r-lg">
                &quot;Viva essa experiência com a Bom Jesus Automóveis!&quot;
              </p>
            </div>
          </div>

          {/* --- O VÍDEO --- */}
          <div className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-black aspect-video">
                <video 
                  className="w-full h-full object-cover" 
                  controls 
                >
                   <source src="/AQPJNcrukQwD1a5KuB1HpBM0CYHdYtEsPXd__JoeGJH8112eEEfUr9ktL5OW5HoIL5hXQwU3cR67zX1HIVtAyLPw0rtR0B6Yd7RO8e0 (1).mp4" type="video/mp4" />
                   Seu navegador não suporta a reprodução de vídeos.
                </video> 
            </div>
          </div>
        </section>

        {/* 3. Pilares */}
        <section className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:-translate-y-2 transition-transform duration-300">
            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
              <Eye size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Visão</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Ser referência nacional na venda de veículos de médio e alto padrão, reconhecida pela confiança, inovação e excelência no atendimento.
            </p>
          </div>

          <div className="bg-blue-600 p-8 rounded-2xl shadow-lg text-white transform md:scale-105 z-10">
            <div className="w-14 h-14 bg-white/20 text-white rounded-xl flex items-center justify-center mb-6 backdrop-blur-sm">
              <Target size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3">Nossa Missão</h3>
            <p className="text-blue-100 text-sm leading-relaxed">
              Oferecer uma experiência de compra segura, transparente e confiável, tornando o sonho do carro ideal uma realidade com qualidade e credibilidade.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:-translate-y-2 transition-transform duration-300">
            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
              <Heart size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Nossos Valores</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Paixão pelo que fazemos. Qualidade em cada detalhe. Respeito aos clientes e colaboradores.
            </p>
          </div>
        </section>

        {/* 4. Equipe */}
        <section className="bg-gray-50 rounded-3xl p-8 md:p-12 overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4 mt-8">
                   <div className="relative h-48 md:h-64 rounded-2xl overflow-hidden shadow-lg">
                      <Image 
                        src="" 
                        alt="Profissional Atendendo"
                        fill
                        className="object-cover hover:scale-110 transition-transform duration-700"
                      />
                   </div>
                </div>
                <div className="space-y-4">
                   <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden shadow-lg">
                      <Image 
                        src="" 
                        alt="Carro Premium"
                        fill
                        className="object-cover hover:scale-110 transition-transform duration-700"
                      />
                   </div>
                </div>
              </div>
              <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-100/50 rounded-full blur-3xl"></div>
            </div>

            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">
                Equipe Qualificada
              </h2>
              <p className="text-gray-600 leading-relaxed text-justify">
                Contamos com profissionais altamente qualificados e comprometidos com a satisfação dos nossos clientes. Nossa equipe compartilha a paixão pelo setor automotivo e o compromisso com a excelência, garantindo um atendimento diferenciado e personalizado.
              </p>
              <p className="text-gray-600 leading-relaxed text-justify">
                Acreditamos na força do trabalho em equipe e na colaboração como pilares do sucesso. Juntos, transformamos cada compra em uma experiência memorável, proporcionando não apenas um carro de alto padrão, mas também segurança, confiança e satisfação.
              </p>
              <div className="pt-4">
                <Link 
                  href="/estoque"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-700 hover:shadow-blue-200 hover:-translate-y-1 transition-all duration-300"
                >
                  Conheça nosso Estoque
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Nossas Unidades (Endereços com Google Maps) */}
        <section>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Venha nos visitar</h2>
            <p className="text-gray-500">Estamos presentes em dois endereços estratégicos em Guarapuava.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Loja 1 */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col hover:-translate-y-1 transition-transform duration-300">
              <div className="h-64 w-full bg-gray-200">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d22376.88902774553!2d-51.47953652265267!3d-25.393724641357768!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ef37004dc796f1%3A0x1b4f7699a74a45ed!2sBom%20Jesus%20Autom%C3%B3veis!5e1!3m2!1spt-BR!2sbr!4v1764628821257!5m2!1spt-BR!2sbr" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg text-blue-600 flex-shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Unidade Centro (Loja 1)</h3>
                    <address className="not-italic text-gray-600 text-sm space-y-1">
                      <p>Av. Pref. Moacyr Júlio Silvestri, 23</p>
                      <p>Centro, Guarapuava - PR</p>
                      <p className="text-blue-600 font-medium mt-2">CEP: 85010-090</p>
                    </address>
                  </div>
                </div>
              </div>
            </div>

            {/* Loja 2 */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col hover:-translate-y-1 transition-transform duration-300">
              <div className="h-64 w-full bg-gray-200">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5593.736951918482!2d-51.47287812315529!3d-25.404193377578473!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ef372ca5a3cec5%3A0xe59f1ded06a55dba!2sBom%20Jesus%20Autom%C3%B3veis!5e1!3m2!1spt-BR!2sbr!4v1764628834704!5m2!1spt-BR!2sbr" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg text-blue-600 flex-shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Unidade Santa Cruz (Loja 2)</h3>
                    <address className="not-italic text-gray-600 text-sm space-y-1">
                      <p>R. Prof. Becker, 3371</p>
                      <p>Santa Cruz, Guarapuava - PR</p>
                      <p className="text-blue-600 font-medium mt-2">CEP: 85015-230</p>
                    </address>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}