export interface Vehicle {
  id: number;
  slug: string;
  marca: string;
  modelo: string;
  versao?: string | null;
  anoFabricacao?: number | null;
  anoModelo: number | null;
  preco: number;
  quilometragem: number | null;
  combustivel?: string | null;
  cambio?: string | null;
  cor?: string | null;
  portas?: number | null;
  tipo?: string | null;
  motor?: string | null;
  destaque?: boolean;
  descricao?: string | null;
  opcionais?: string[];
  fotos: string[];
}
export const money = (value: number) =>
  value > 0
    ? value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
        maximumFractionDigits: 0,
      })
    : "Sob consulta";
export const number = (value: number) => value.toLocaleString("pt-BR");
export const whatsapp = (
  message = "Olá! Gostaria de conhecer os veículos da Bom Jesus Automóveis.",
) => `https://wa.me/5542984399009?text=${encodeURIComponent(message)}`;
export function photo(url?: string) {
  return url?.replace(/^http:/, "https:") || "/vehicle-placeholder.svg";
}
