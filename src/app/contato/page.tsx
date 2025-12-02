"use client";

import { useState } from "react";
import { Phone, Mail, Clock, Navigation, MessageCircle, MapPin } from "lucide-react";
import { useWhatsApp } from "@/src/context/WhatsAppContext";

// Coordenadas exatas extraídas dos iframes que você mandou
const LOJAS = [
  {
    id: 1,
    nome: "Unidade Centro",
    endereco: "Av. Pref. Moacyr Júlio Silvestri, 23 - Centro",
    lat: -25.3937246,
    lng: -51.4795365,
    mapsUrl: "https://maps.app.goo.gl/1oiSvyrrNSWcqBKy7",
    iframeSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d22376.88902774553!2d-51.47953652265267!3d-25.393724641357768!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ef37004dc796f1%3A0x1b4f7699a74a45ed!2sBom%20Jesus%20Autom%C3%B3veis!5e1!3m2!1spt-BR!2sbr!4v1764628821257!5m2!1spt-BR!2sbr"
  },
  {
    id: 2,
    nome: "Unidade Santa Cruz",
    endereco: "R. Prof. Becker, 3371 - Santa Cruz",
    lat: -25.4041934,
    lng: -51.4728781,
    mapsUrl: "https://maps.app.goo.gl/rYGwfPQQ8xSQHg84A",
    iframeSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5593.736951918482!2d-51.47287812315529!3d-25.404193377578473!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ef372ca5a3cec5%3A0xe59f1ded06a55dba!2sBom%20Jesus%20Autom%C3%B3veis!5e1!3m2!1spt-BR!2sbr!4v1764628834704!5m2!1spt-BR!2sbr"
  }
];

export default function Contato() {
  const { openModal } = useWhatsApp();
  const [nearestStore, setNearestStore] = useState<number | null>(null);
  const [loadingGeo, setLoadingGeo] = useState(false);

  // Fórmula de Haversine para calcular distância entre dois pontos de GPS
  function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Raio da terra em km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  const handleFindNearest = () => {
    if (!navigator.geolocation) {
      alert("Seu navegador não suporta geolocalização.");
      return;
    }

    setLoadingGeo(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        let minDistance = Infinity;
        let closestStoreId = null;

        LOJAS.forEach(loja => {
          const dist = calculateDistance(latitude, longitude, loja.lat, loja.lng);
          if (dist < minDistance) {
            minDistance = dist;
            closestStoreId = loja.id;
          }
        });

        setNearestStore(closestStoreId);
        setLoadingGeo(false);
        
        // Scroll suave até a loja encontrada
        if (closestStoreId) {
            const element = document.getElementById(`loja-${closestStoreId}`);
            element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      },
      (error) => {
        console.error(error);
        alert("Para encontrar a loja mais próxima, precisamos da sua permissão de localização.");
        setLoadingGeo(false);
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* Header */}
      <div className="bg-blue-950 py-16 text-center text-white">
        <h1 className="text-4xl font-bold mb-4">Fale Conosco</h1>
        <p className="text-blue-200">Estamos prontos para atender você da melhor forma.</p>
      </div>

      <div className="container mx-auto px-4 -mt-10">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* --- COLUNA ESQUERDA: Informações de Contato --- */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Card WhatsApp */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Atendimento Online</h3>
              <p className="text-gray-500 text-sm mb-6">
                Fale com nossos consultores agora mesmo pelo WhatsApp.
              </p>
              
              {/* BOTÃO ATUALIZADO COM O ESTILO DA PÁGINA DE VEÍCULO */}
              <button 
                onClick={openModal}
                className="flex w-full items-center justify-center gap-3 rounded-lg bg-green-500 px-6 py-4 text-lg font-bold text-white shadow-lg transition-transform hover:scale-105 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
              >
                <MessageCircle size={24} />
                Iniciar Conversa
              </button>
            </div>

            {/* Card Telefone e Email */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Telefone</h4>
                  <p className="text-gray-600 text-sm">(42) 98421-3935</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">E-mail</h4>
                  <p className="text-gray-600 text-sm">contato@bomjesusautomoveis.com</p>
                </div>
              </div>
            </div>

            {/* Card Horário */}
            <div className="bg-blue-600 p-6 rounded-2xl shadow-lg text-white">
              <div className="flex items-center gap-3 mb-4">
                <Clock size={24} className="text-blue-200" />
                <h3 className="font-bold text-lg">Horário de Funcionamento</h3>
              </div>
              <ul className="space-y-3 text-sm text-blue-100">
                <li className="flex justify-between border-b border-blue-500 pb-2">
                  <span>Segunda a Sexta</span>
                  <span className="font-bold text-white">08:00 - 18:00</span>
                </li>
                <li className="flex justify-between border-b border-blue-500 pb-2">
                  <span>Sábado</span>
                  <span className="font-bold text-white">08:00 - 13:00</span>
                </li>
                <li className="flex justify-between">
                  <span>Domingo</span>
                  <span className="font-bold text-blue-300">Fechado</span>
                </li>
              </ul>
            </div>

          </div>

          {/* --- COLUNA DIREITA: Lojas e Mapa --- */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Ferramenta de Loja Mais Próxima */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <Navigation size={20} className="text-blue-600" />
                  Qual loja está mais perto de mim?
                </h3>
                <p className="text-sm text-gray-500">Use sua localização para encontrar a unidade mais próxima.</p>
              </div>
              <button 
                onClick={handleFindNearest}
                disabled={loadingGeo}
                className="bg-blue-50 text-blue-700 font-semibold px-6 py-2 rounded-lg hover:bg-blue-100 transition-colors whitespace-nowrap disabled:opacity-50 flex items-center gap-2"
              >
                {loadingGeo ? "Calculando..." : "Encontrar Loja Próxima"}
              </button>
            </div>

            {/* Lista de Lojas */}
            <div className="space-y-8">
              {LOJAS.map((loja) => (
                <div 
                  key={loja.id} 
                  id={`loja-${loja.id}`}
                  className={`bg-white rounded-2xl shadow-sm border overflow-hidden transition-all duration-500 ${
                    nearestStore === loja.id ? 'border-green-500 ring-2 ring-green-100 scale-[1.01] shadow-xl' : 'border-gray-100'
                  }`}
                >
                  <div className="grid md:grid-cols-2">
                    {/* Mapa Embutido */}
                    <div className="h-72 md:h-auto bg-gray-200 relative">
                        <iframe 
                            src={loja.iframeSrc}
                            width="100%" 
                            height="100%" 
                            style={{ border: 0 }} 
                            allowFullScreen 
                            loading="lazy" 
                            className="absolute inset-0"
                        ></iframe>
                    </div>

                    {/* Detalhes */}
                    <div className="p-8 flex flex-col justify-center">
                      {nearestStore === loja.id && (
                        <span className="inline-block bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full mb-3 self-start animate-pulse">
                          MAIS PRÓXIMA DE VOCÊ
                        </span>
                      )}
                      
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{loja.nome}</h3>
                      <p className="text-gray-600 mb-6 flex items-start gap-2">
                        <MapPin className="mt-1 flex-shrink-0 text-blue-600" size={18} />
                        {loja.endereco}, Guarapuava - PR
                      </p>
                      
                      <div className="flex flex-col gap-3">
                          <a 
                            href={loja.mapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 border-2 border-blue-600 text-blue-600 font-bold py-3 rounded-xl hover:bg-blue-50 transition-colors"
                          >
                            <Navigation size={18} />
                            Traçar Rota no Google Maps
                          </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}