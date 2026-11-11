import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

// --- Import CSS ---
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./globals.css";

// --- Importações dos Componentes ---
import SiteFrame from "@/src/components/SiteFrame";
import AnalyticsTracker from "@/src/components/AnalyticsTracker";

// --- Importação do Contexto ---
import { WhatsAppProvider } from "@/src/context/WhatsAppContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Bom Jesus Automóveis | Seu próximo carro em Guarapuava",
    template: "%s | Bom Jesus Automóveis",
  },
  description:
    "Encontre seu próximo veículo na Bom Jesus Automóveis. Explore nosso estoque de carros, caminhonetes e motos e visite nossas lojas em Guarapuava, PR.",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Provider para estado do modal funcionar em qualquer lugar */}
        <WhatsAppProvider>
          {/* Analytics roda invisível no topo */}
          <AnalyticsTracker />

          <SiteFrame>{children}</SiteFrame>
        </WhatsAppProvider>
      </body>
    </html>
  );
}
