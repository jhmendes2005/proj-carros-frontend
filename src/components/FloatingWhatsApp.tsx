"use client";

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle, X } from 'lucide-react';
// 👇 Importante: Importar o hook do contexto
import { useWhatsApp } from '../context/WhatsAppContext';

export default function FloatingWhatsApp() {
  // 👇 Mudança Principal: Usamos o contexto em vez de useState(false)
  const { isOpen, openModal, closeModal } = useWhatsApp();
  
  // Estados locais apenas para os dados do formulário
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const pathname = usePathname();

  const getVehicleNameFromPath = () => {
    if (pathname?.startsWith('/veiculo/')) {
      const slug = pathname.replace('/veiculo/', ''); 
      const formattedName = slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      return formattedName;
    }
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const yourWhatsappNumber = '5542984399009'; // Seu número atualizado

    const vehicleName = getVehicleNameFromPath();
    let message = `Olá, meu nome é ${name} (${phone}).`;

    if (vehicleName) {
      message += `\nTenho interesse no veículo: *${vehicleName}*.`;
    } else {
      message += `\nTenho interesse em seus veículos.`;
    }

    const whatsappUrl = `https://api.whatsapp.com/send?phone=${yourWhatsappNumber}&text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    closeModal(); // Usa a função do contexto para fechar
    setName('');
    setPhone('');
  };

  return (
    <>
      {/* Botão Flutuante (Canto Inferior Direito) */}
      <button
        onClick={openModal} // Usa a função do contexto
        className="fixed bottom-6 right-6 z-50 rounded-full bg-green-500 p-4 text-white shadow-lg transition-transform hover:scale-110 focus:outline-none hover:bg-green-600 flex items-center justify-center"
        aria-label="Falar pelo WhatsApp"
      >
        <MessageCircle size={32} />
      </button>

      {/* Modal de Contato - Controlado pelo Contexto */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-60 p-4 animate-in fade-in duration-200">
          
          <div className="relative w-full max-w-sm rounded-lg bg-white p-6 shadow-xl animate-in zoom-in-95 duration-200">
            
            <button
              onClick={closeModal} // Usa a função do contexto
              className="absolute top-3 right-3 rounded-full p-1 text-gray-500 hover:bg-gray-100"
              aria-label="Fechar"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Quase lá!
            </h3>
            <p className="text-sm text-gray-600 mb-5">
              Por favor, preencha seus dados para um atendimento mais rápido.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="wa-name" className="block text-sm font-medium text-gray-700">
                    Seu nome
                  </label>
                  <input
                    type="text"
                    id="wa-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-green-500 focus:ring-green-500 outline-none text-gray-900"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="wa-phone" className="block text-sm font-medium text-gray-700">
                    Seu WhatsApp (com DDD)
                  </label>
                  <input
                    type="tel"
                    id="wa-phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(42) 99999-9999"
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-green-500 focus:ring-green-500 outline-none text-gray-900"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="mt-6 w-full rounded-lg bg-green-500 px-4 py-2.5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-green-600"
              >
                Iniciar Conversa
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}