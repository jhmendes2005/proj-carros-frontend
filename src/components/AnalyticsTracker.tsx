"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { api } from "../lib/api"; // Ajuste o import conforme seu projeto

interface ScriptItem {
  code: string;
  type: "GTM" | "PIXEL";
}

interface ConfigResponse {
  scripts: ScriptItem[];
}

// Helper para eventos manuais (clique em botão, whatsapp, etc)
export const trackEvent = (eventName: string, params = {}) => {
  if (typeof window !== "undefined" && (window as any).fbq) {
    (window as any).fbq('track', eventName, params);
  }
};

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const [scripts, setScripts] = useState<ScriptItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  // 1. Busca configurações na API
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const { data } = await api.get<ConfigResponse>("/config");
        if (data && Array.isArray(data.scripts)) {
          setScripts(data.scripts);
          setLoaded(true);
        }
      } catch (error) {
        console.error("Erro ao buscar scripts:", error);
      }
    };
    fetchConfig();
  }, []);

  // 2. Dispara PageView automaticamente nas trocas de rota (SPA)
  useEffect(() => {
    if (!loaded) return;

    // Aguarda um pequeno delay para garantir que o fbq esteja carregado
    const timeout = setTimeout(() => {
      if ((window as any).fbq) {
        console.log(`📡 [Pixel] Disparando PageView para: ${pathname}`);
        (window as any).fbq('track', 'PageView');
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [pathname, loaded]);

  // 3. Injeta o Código Base (Loader + Init + Noscript)
  useEffect(() => {
    if (!loaded || scripts.length === 0) return;

    scripts.forEach(script => {
      const scriptId = `script-${script.type}-${script.code}`;
      
      // Se já existe, não injeta novamente
      if (document.getElementById(scriptId)) return;

      if (script.type === "PIXEL") {
        console.log(`🔧 [Pixel] Inicializando ID: ${script.code}`);

        // A. Injeta o Script JS (Baseado no seu exemplo)
        const s = document.createElement("script");
        s.id = scriptId;
        s.innerHTML = `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${script.code}');
        `;
        document.head.appendChild(s);

        // B. Injeta o NoScript (Imagem) para garantir rastreamento sem JS
        const ns = document.createElement("noscript");
        const img = document.createElement("img");
        img.height = 1;
        img.width = 1;
        img.style.display = "none";
        img.src = `https://www.facebook.com/tr?id=${script.code}&ev=PageView&noscript=1`;
        ns.appendChild(img);
        document.body.appendChild(ns);
      }
      
      // (Opcional) Mantive a lógica do GTM caso você use também
      else if (script.type === "GTM") {
        const s = document.createElement("script");
        s.id = scriptId;
        s.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${script.code}');`;
        document.head.appendChild(s);
      }
    });
  }, [scripts, loaded]);

  return null;
}