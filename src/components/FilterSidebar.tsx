"use client";
import { useEffect, useId, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowUpRight, RotateCcw } from "lucide-react";
import { api } from "../lib/api";
const initial = {
  tipo: "",
  marca: "",
  modelo: "",
  ano_min: "",
  ano_max: "",
  preco_min: "",
  preco_max: "",
};
export default function VehicleFilter({ onClose }: { onClose?: () => void }) {
  const router = useRouter();
  const search = useSearchParams();
  const id = useId();
  const [filters, setFilters] = useState(initial);
  const [brands, setBrands] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [years, setYears] = useState<number[]>([]);
  useEffect(() => {
    setFilters(
      Object.fromEntries(
        Object.keys(initial).map((k) => [k, search?.get(k) || ""]),
      ) as typeof initial,
    );
  }, [search]);
  useEffect(() => {
    const c = new AbortController();
    api
      .get<string[]>("/vehicles/filters/brands", {
        params: { type: filters.tipo || undefined },
        signal: c.signal,
      })
      .then((r) => setBrands(r.data))
      .catch(() => {});
    return () => c.abort();
  }, [filters.tipo]);
  useEffect(() => {
    const c = new AbortController();
    setModels([]);
    if (filters.marca)
      api
        .get<string[]>("/vehicles/filters/models", {
          params: { type: filters.tipo || undefined, brand: filters.marca },
          signal: c.signal,
        })
        .then((r) => setModels(r.data))
        .catch(() => {});
    return () => c.abort();
  }, [filters.tipo, filters.marca]);
  useEffect(() => {
    const c = new AbortController();
    api
      .get<number[]>("/vehicles/filters/years", {
        params: {
          type: filters.tipo || undefined,
          brand: filters.marca || undefined,
          model: filters.modelo || undefined,
        },
        signal: c.signal,
      })
      .then((r) => setYears(r.data))
      .catch(() => {});
    return () => c.abort();
  }, [filters.tipo, filters.marca, filters.modelo]);
  const change = (key: keyof typeof initial, value: string) =>
    setFilters((f) => ({
      ...f,
      [key]: value,
      ...(key === "tipo"
        ? { marca: "", modelo: "" }
        : key === "marca"
          ? { modelo: "" }
          : {}),
    }));
  const select = (
    key: keyof typeof initial,
    label: string,
    options: (number | string)[],
    placeholder: string,
    disabled = false,
  ) => (
    <label htmlFor={`${id}-${key}`}>
      {label}
      <select
        id={`${id}-${key}`}
        value={filters[key]}
        disabled={disabled}
        onChange={(e) => change(key, e.target.value)}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
  return (
    <form
      className="filter-form"
      onSubmit={(e) => {
        e.preventDefault();
        const p = new URLSearchParams();
        const q = search?.get("q");
        const sort = search?.get("sort");
        if (q) p.set("q", q);
        if (sort) p.set("sort", sort);
        Object.entries(filters).forEach(([k, v]) => {
          if (v) p.set(k, v);
        });
        router.push(`/estoque?${p}`);
        onClose?.();
      }}
    >
      {select(
        "tipo",
        "Categoria",
        ["Carro", "Caminhonete", "Moto", "Utilitario", "Van", "Caminhao"],
        "Todas as categorias",
      )}
      {select("marca", "Marca", brands, "Todas as marcas")}
      {select("modelo", "Modelo", models, "Todos os modelos", !filters.marca)}
      <fieldset>
        <legend>Ano do modelo</legend>
        <div className="field-pair">
          {select("ano_min", "De", years, "Qualquer")}
          {select("ano_max", "Até", years, "Qualquer")}
        </div>
      </fieldset>
      <fieldset>
        <legend>Faixa de preço</legend>
        <div className="field-pair">
          <label htmlFor={`${id}-min`}>
            De (R$)
            <input
              id={`${id}-min`}
              type="number"
              min="0"
              step="any"
              placeholder="Mínimo"
              value={filters.preco_min}
              onChange={(e) => change("preco_min", e.target.value)}
            />
          </label>
          <label htmlFor={`${id}-max`}>
            Até (R$)
            <input
              id={`${id}-max`}
              type="number"
              min={filters.preco_min || "0"}
              step="any"
              placeholder="Máximo"
              value={filters.preco_max}
              onChange={(e) => change("preco_max", e.target.value)}
            />
          </label>
        </div>
      </fieldset>
      <button className="button" type="submit">
        Aplicar filtros <ArrowUpRight size={17} />
      </button>
      <button
        className="filter-reset"
        type="button"
        onClick={() => {
          setFilters(initial);
          router.push("/estoque");
          onClose?.();
        }}
      >
        <RotateCcw size={14} /> Limpar filtros
      </button>
    </form>
  );
}
