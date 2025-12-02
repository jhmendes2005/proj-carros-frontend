import Link from 'next/link';
// 1. Trocamos o ícone para um cone de trânsito
import { TrafficCone } from 'lucide-react'; 

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center bg-gray-50 text-center">
      <div className="rounded-lg bg-white p-8 shadow-xl md:p-12">
        
        {/* Animação: O "404" vai "quicar" (bounce) sutilmente */}
        <h1 className="animate-bounce text-8xl font-extrabold text-blue-600 md:text-9xl">
          404
        </h1>

        {/* Ícone e Título */}
        <div className="mt-4 flex items-center justify-center gap-2">
          {/* 2. Usamos o novo ícone e mudamos a cor */}
          <TrafficCone size={32} className="text-orange-500" />
          {/* 3. Mudamos o título */}
          <h2 className="text-3xl font-bold text-gray-800">
            Ops! Caminho Errado
          </h2>
        </div>
        
        {/* Mensagem de Ajuda */}
        {/* 4. Mudamos as mensagens */}
        <p className="mt-4 text-lg text-gray-600">
          Este caminho não levou a nenhum veículo.
        </p>
        <p className="mt-1 text-gray-500">
          Tente voltar para a home e recalcular a rota.
        </p>

        {/* Botão de Ação (permanece igual) */}
        <Link
          href="/"
          className="mt-8 inline-block rounded-lg bg-blue-600 px-6 py-3 text-lg font-semibold text-white shadow-lg transition-transform hover:scale-105 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
        >
          Voltar para a Home
        </Link>
      </div>
    </div>
  );
}