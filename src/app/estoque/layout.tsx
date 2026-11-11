import type { Metadata } from "next";
export const metadata: Metadata = { title: "Estoque de veículos" };
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
