"use client"; 

import Link from 'next/link';
import { Search, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { api } from '../lib/api'; 
import Image from 'next/image';

interface SearchResult {
  slug: string;
  marca: string;
  modelo: string;
  anoModelo: number | null;
  fotos: string[]; 
}

export default function Header() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [debouncedTerm, setDebouncedTerm] = useState('');
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Efeito de Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 300); 

    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm]);

  // Efeito de Busca na API
  useEffect(() => {
    if (debouncedTerm.length > 2) {
      api.get(`/vehicles/search?q=${debouncedTerm}`) 
        .then(res => {
          setResults(res.data);
        })
        .catch(err => {
          console.error("Erro na busca:", err);
          setResults([]);
        });
    } else {
      setResults([]);
    }
  }, [debouncedTerm]);
  
  // Função para fechar o menu e limpar a busca
  const clearAndCloseMenu = () => {
    setSearchTerm('');
    setResults([]);
    setIsMenuOpen(false); // Fecha o menu
  }
  
  return (
    <header className="relative sticky top-0 z-50 w-full bg-white shadow-md">
      {/* Container Principal */}
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 p-4">
        
        {/* Logo */}
        <Link href="/" className="flex-shrink-0 items-center" onClick={clearAndCloseMenu}>
          <img 
            src="/bomjesuslogo.png"
            alt="Bom Jesus Automóveis Logo"
            // 2. Tamanho ajustado (10 = 40px mobile, 12 = 48px desktop)
            className="w-12 md:h-12" 
          />
        </Link>

        {/* 3. WRAPPER PARA DESKTOP */}
        {/* Agrupa busca e navegação; aparece apenas em telas 'md' e maiores */}
        <div className="hidden md:flex flex-1 items-center justify-end gap-4">
          
          {/* Barra de Pesquisa (Desktop) */}
          <form 
            action="/estoque"
            method="GET"
            className="relative w-full max-w-md"
          >
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="q"
              placeholder="Buscar por marca, modelo ou ano..."
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 shadow-sm text-black focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onBlur={() => setTimeout(() => setResults([]), 150)}
            />
            
            {/* Dropdown de Resultados (Desktop) */}
            {(results.length > 0 || searchTerm.length > 2) && (
              // 4. CORRIGIDO: Classes preenchidas
              <div className="absolute top-full z-10 mt-1 w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                <ul className="divide-y divide-gray-100">
                  {results.map((vehicle) => (
                    <li key={vehicle.slug}>
                      <Link
                        href={`/veiculo/${vehicle.slug}`}
                        // 4. CORRIGIDO: Classes preenchidas
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-gray-100"
                        onClick={clearAndCloseMenu}
                      >
                        <Image 
                          src={vehicle.fotos[0]}
                          alt={`${vehicle.marca} ${vehicle.modelo}`}
                          width={40} height={40}
                          // 4. CORRIGIDO: Classes preenchidas
                          className="h-10 w-10 flex-shrink-0 rounded-md object-cover"
                        />
                        <div>
                          <span className="block font-semibold">{vehicle.marca} {vehicle.modelo}</span>
                          <span className="block text-black-500">{vehicle.anoModelo}</span>
                        </div>
                      </Link>
                    </li>
                  ))}
                  {searchTerm.length > 2 && (
                    <li key="search-all">
                      <Link
                        href={`/estoque?q=${searchTerm}`}
                        // 4. CORRIGIDO: Classes preenchidas
                        className="flex items-center gap-3 bg-gray-50 px-4 py-3 text-sm font-semibold text-blue-600 transition-colors hover:bg-gray-100"
                        onClick={clearAndCloseMenu}
                      >
                        <Search className="h-4 w-4" />
                        Buscar "{searchTerm}"
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </form>

          {/* Navegação (Desktop) */}
          <nav>
            {/* 5. CORRIGIDO: Links preenchidos */}
            <ul className="flex flex-shrink-0 items-center gap-6 text-sm font-medium text-gray-600">
              <li>
                <Link href="/estoque" className="transition-colors hover:text-blue-600">
                  Estoque
                </Link>
              </li>
              <li>
                <Link href="/sobre" className="transition-colors hover:text-blue-600">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link 
                  href="/contato" 
                  className="whitespace-nowrap rounded-lg bg-blue-600 px-4 py-2 text-white shadow-sm transition-colors hover:bg-blue-700"
                >
                  Contato
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* 6. BOTÃO HAMBURGER (SÓ APARECE EM MOBILE) */}
        <button 
          className="md:hidden text-black" // 'md:hidden' = esconde em telas médias e acima
          onClick={() => setIsMenuOpen(!isMenuOpen)} // Alterna o estado do menu
          aria-label="Abrir menu"
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* 7. MENU DROPDOWN (MOBILE) */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-lg md:hidden">
          <div className="flex flex-col gap-4 p-4">
            
            {/* Barra de Pesquisa (Mobile) */}
            <form 
              action="/estoque"
              method="GET"
              className="relative w-full"
            >
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-5 w-5 text-black-400" />
              </div>
              <input
                type="text"
                name="q"
                placeholder="Buscar por marca, modelo ou ano..."
                className="w-full rounded-lg text-black border border-gray-300 py-2 pl-10 pr-4 shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onBlur={() => setTimeout(() => setResults([]), 150)}
              />
              {/* Dropdown de Resultados (Mobile) */}
              {(results.length > 0 || searchTerm.length > 2) && (
                // 6. CORRIGIDO: Dropdown mobile preenchido
                <div className="absolute top-full z-10 mt-1 w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                  <ul className="max-h-60 overflow-y-auto divide-y divide-gray-100">
                    {/* 7. CORRIGIDO: .map() preenchido */}
                    {results.map((vehicle) => (
                      <li key={vehicle.slug}>
                        <Link
                          href={`/veiculo/${vehicle.slug}`}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-gray-100"
                          onClick={clearAndCloseMenu}
                        >
                          <Image 
                            src={vehicle.fotos[0] || 'https://via.placeholder.com/100x100.png?text=Sem+Foto'}
                            alt={`${vehicle.marca} ${vehicle.modelo}`}
                            width={40} height={40}
                            className="h-10 w-10 flex-shrink-0 rounded-md object-cover"
                          />
                          <div>
                            <span className="block font-semibold">{vehicle.marca} {vehicle.modelo}</span>
                            <span className="block text-gray-500">{vehicle.anoModelo}</span>
                          </div>
                        </Link>
                      </li>
                    ))}
                    {searchTerm.length > 2 && (
                      <li key="search-all">
                        <Link
                          href={`/estoque?q=${searchTerm}`}
                          className="flex items-center gap-3 bg-gray-50 px-4 py-3 text-sm font-semibold text-blue-600 transition-colors hover:bg-gray-100"
                          onClick={clearAndCloseMenu}
                        >
                          <Search className="h-4 w-4" />
                          Buscar "{searchTerm}"
                        </Link>
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </form>

            {/* Navegação (Mobile) - Já estava correta no seu código */}
            <nav>
              <ul className="flex flex-col gap-2">
                <li>
                  <Link 
                    href="/estoque" 
                    className="block rounded-lg px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-100"
                    onClick={clearAndCloseMenu}
                  >
                    Estoque
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/sobre" 
                    className="block rounded-lg px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-100"
                    onClick={clearAndCloseMenu}
                  >
                    Sobre Nós
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/contato" 
                    className="mt-2 block rounded-lg bg-blue-600 px-4 py-3 text-center text-base font-semibold text-white shadow-sm hover:bg-blue-700"
                    onClick={clearAndCloseMenu}
                  >
                    Contato
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}