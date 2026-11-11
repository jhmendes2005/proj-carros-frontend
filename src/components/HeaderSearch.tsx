"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { ArrowUpRight, Loader2, Search } from "lucide-react";
import { api } from "../lib/api";
import { photo } from "../lib/vehicles";

type Suggestion = {
  slug: string;
  marca: string;
  modelo: string;
  anoModelo: number | null;
  fotos: string[];
};

export default function HeaderSearch({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  const router = useRouter();
  const path = usePathname();
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const [term, setTerm] = useState("");
  const [results, setResults] = useState<Suggestion[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [active, setActive] = useState(-1);
  const query = term.trim();
  const show = expanded && query.length > 0;
  const close = () => {
    setExpanded(false);
    setActive(-1);
  };
  const navigate = (href: string) => {
    close();
    onNavigate?.();
    router.push(href);
  };
  const searchHref = `/estoque?q=${encodeURIComponent(query)}`;

  useEffect(() => {
    setTerm("");
    close();
  }, [path]);
  useEffect(() => {
    const outside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) close();
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    setResults([]);
    setActive(-1);
    setError(false);
    if (query.length < 3) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const timer = setTimeout(() => {
      api
        .get<Suggestion[]>("/vehicles/search", {
          params: { q: query },
          signal: controller.signal,
        })
        .then(({ data }) => {
          if (!controller.signal.aborted) setResults(data);
        })
        .catch(() => {
          if (!controller.signal.aborted) setError(true);
        })
        .finally(() => {
          if (!controller.signal.aborted) setLoading(false);
        });
    }, 300);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  return (
    <div
      className="header-search"
      ref={root}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null))
          close();
      }}
    >
      <form
        role="search"
        aria-label="Busca rápida de veículos"
        onSubmit={(event) => {
          event.preventDefault();
          if (query) navigate(searchHref);
        }}
      >
        <Search size={16} aria-hidden="true" />
        <input
          role="combobox"
          aria-label="Buscar veículos no header"
          aria-autocomplete="list"
          aria-expanded={show}
          aria-controls={`${id}-results`}
          aria-activedescendant={
            show && active >= 0 ? `${id}-option-${active}` : undefined
          }
          autoComplete="off"
          name="q"
          maxLength={120}
          placeholder="Encontre seu próximo carro"
          value={term}
          onChange={(event) => {
            setTerm(event.target.value);
            setExpanded(true);
            if (event.target.value.trim() !== query) {
              setActive(-1);
              setResults([]);
            }
          }}
          onFocus={() => setExpanded(true)}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.stopPropagation();
              close();
            }
            if (event.key === "ArrowDown" && results.length) {
              event.preventDefault();
              setExpanded(true);
              setActive((i) => (i + 1) % results.length);
            }
            if (event.key === "ArrowUp" && results.length) {
              event.preventDefault();
              setExpanded(true);
              setActive((i) => (i <= 0 ? results.length - 1 : i - 1));
            }
            if (
              event.key === "Enter" &&
              show &&
              active >= 0 &&
              results[active]
            ) {
              event.preventDefault();
              navigate(`/veiculo/${results[active].slug}`);
            }
          }}
        />
        <button type="submit" aria-label="Pesquisar no estoque">
          <ArrowUpRight size={17} />
        </button>
      </form>
      {show && (
        <div className="header-search-dropdown">
          <div
            className="header-search-status"
            role="status"
            aria-live="polite"
          >
            {query.length < 3 ? (
              "Digite pelo menos 3 caracteres para ver sugestões."
            ) : loading ? (
              <>
                <Loader2 className="spin" size={13} /> Buscando veículos…
              </>
            ) : error ? (
              "Não foi possível carregar as sugestões. Tente novamente."
            ) : results.length ? (
              "VEÍCULOS ENCONTRADOS"
            ) : (
              "Nenhum veículo encontrado para esta busca."
            )}
          </div>
          <ul
            id={`${id}-results`}
            role="listbox"
            aria-label="Veículos sugeridos"
          >
            {!loading &&
              results.map((vehicle, i) => (
                <li key={vehicle.slug} role="presentation">
                  <Link
                    id={`${id}-option-${i}`}
                    role="option"
                    aria-selected={active === i}
                    href={`/veiculo/${vehicle.slug}`}
                    onClick={() => {
                      close();
                      onNavigate?.();
                    }}
                    className={active === i ? "is-active" : ""}
                  >
                    <img
                      src={photo(vehicle.fotos?.[0])}
                      alt=""
                      width={66}
                      height={48}
                    />
                    <span>
                      <strong>
                        {vehicle.marca} {vehicle.modelo}
                      </strong>
                      <small>{vehicle.anoModelo || "Ano sob consulta"}</small>
                    </span>
                    <ArrowUpRight size={15} />
                  </Link>
                </li>
              ))}
          </ul>
          <Link
            className="header-search-all"
            href={searchHref}
            onClick={() => {
              close();
              onNavigate?.();
            }}
          >
            Ver resultados para “{query}” <ArrowUpRight size={15} />
          </Link>
        </div>
      )}
    </div>
  );
}
