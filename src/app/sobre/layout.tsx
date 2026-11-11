import type { Metadata } from "next";
export const metadata: Metadata = { title: "Conheça a Bom Jesus" };
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
