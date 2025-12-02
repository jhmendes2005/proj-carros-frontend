import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

// --- Import CSS ---
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import "./globals.css";

// --- Importações dos Componentes ---
import Header from '@/src/components/header';
import FloatingWhatsApp from "@/src/components/FloatingWhatsApp"; 
import AnalyticsTracker from "@/src/components/AnalyticsTracker";
import Footer from "@/src/components/Footer";
import AIChatButton from "../components/AIChatButton";

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
  title: "Bom Jesus Automóveis - Veículos Novos e Seminovos",
  description: "Qualidade e confiança na compra do seu próximo veículo.",
  icons: { icon: "/favicon.ico" } 
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        {/* Provider para estado do modal funcionar em qualquer lugar */}
        <WhatsAppProvider>
          
          {/* Analytics roda invisível no topo */}
          <AnalyticsTracker />
          
          <Header />

          <main className="min-h-screen">
              {children}
          </main>

          <Footer />
          
          {/* Botões flutuantes */}
          <AIChatButton />
          <FloatingWhatsApp />
          
        </WhatsAppProvider>
      </body>
    </html>
  );
}
