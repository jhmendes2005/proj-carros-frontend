"use client";

import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function AIChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Olá! Sou o assistente virtual da Bom Jesus. Posso te ajudar a encontrar o carro ideal no nosso estoque?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Rola para a última mensagem
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Adiciona mensagem do usuário
    const userMsg: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      // --- CONEXÃO COM N8N AQUI ---
      // Você deve criar um workflow no n8n que recebe { "message": "..." } e retorna { "output": "..." }
      // const n8nWebhookUrl = 'https://seu-n8n.com/webhook/chat';
      
      // const response = await fetch(n8nWebhookUrl, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ message: userMsg.text })
      // });
      // const data = await response.json();
      
      // Simulação de resposta (Remova isso quando conectar o n8n)
      await new Promise(resolve => setTimeout(resolve, 1500)); // Delay fake
      const botResponseText = "Estou consultando nosso estoque... (Aqui você conectará seu n8n para responder realmente sobre os carros!)";

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponseText, // Use data.output aqui
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);

    } catch (error) {
      console.error("Erro no chat:", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: "Desculpe, tive um problema técnico. Pode tentar novamente?",
        sender: 'bot',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Botão Flutuante (Acima do WhatsApp) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        // AJUSTADO: Adicionado 'hidden md:flex' para esconder em telas pequenas (mobile)
        className={`hidden md:flex fixed bottom-28 right-6 z-40 items-center justify-center rounded-full p-4 transition-all duration-500 ease-in-out shadow-lg hover:shadow-2xl hover:-translate-y-1 focus:outline-none group ${
          isOpen 
            ? 'bg-gradient-to-br from-gray-700 to-gray-900 text-white rotate-180 hover:shadow-gray-900/50' 
            : 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white hover:shadow-purple-500/50'
        }`}
        aria-label="Chat IA"
      >
        {/* Ícone do Robô com animação de balanço no hover */}
        <div className={`transition-transform duration-500 ${!isOpen ? 'group-hover:rotate-12' : ''}`}>
          {isOpen ? <X size={32} /> : <Bot size={32} />}
        </div>
        
        {/* Badge de notificação (opcional) */}
        {!isOpen && messages.length === 1 && (
           <span className="absolute -top-1 -right-1 flex h-4 w-4">
             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
             <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white"></span>
           </span>
        )}
      </button>

      {/* Janela do Chat */}
      {isOpen && (
        // AJUSTADO: Adicionado 'hidden md:flex' para garantir que a janela também suma se redimensionar
        <div className="hidden md:flex fixed bottom-40 right-6 z-50 w-[90vw] max-w-[380px] rounded-2xl bg-white shadow-2xl border border-gray-200 flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300 h-[500px] max-h-[60vh]">
          
          {/* Header */}
          <div className="bg-blue-600 p-4 text-white flex items-center gap-3 shadow-sm">
            <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                <Sparkles size={20} className="text-yellow-300" />
            </div>
            <div>
                <h3 className="font-bold text-sm md:text-base">Assistente Virtual</h3>
                <p className="text-xs text-blue-100 flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_5px_#4ade80]"/> Online agora
                </p>
            </div>
          </div>

          {/* Área de Mensagens */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed shadow-sm ${
                  msg.sender === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                 <div className="bg-white p-3 rounded-2xl rounded-bl-none border border-gray-100 shadow-sm flex gap-1 items-center h-10">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}/>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}/>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}/>
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-100 flex gap-2 items-center">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Pergunte sobre um carro..." 
              className="flex-1 bg-gray-100 text-gray-900 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
            <button 
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="bg-blue-600 text-white p-2.5 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm hover:shadow-md"
            >
                <Send size={18} className={inputValue.trim() ? 'ml-0.5' : ''} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}