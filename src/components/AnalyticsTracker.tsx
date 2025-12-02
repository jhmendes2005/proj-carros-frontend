"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { api } from "../lib/api";

// Função helper para enviar eventos manualmente (ex: clique no whatsapp)
export const trackEvent = (tipo: string, metadata = {}) => {
    // Evita erro se não estiver no browser
    if (typeof window === "undefined") return;

    api.post("/analytics/log", {
        tipo,
        url: window.location.href,
        metadata
    }).catch(err => console.error("Erro ao registrar analytics:", err));
};

export default function AnalyticsTracker({ scripts }: { scripts?: any[] }) {
    const pathname = usePathname();

    // 1. Registra PageView ao mudar de rota
    useEffect(() => {
        trackEvent("page_view");
    }, [pathname]);

    // 2. Injeta os scripts (GTM/Pixel) no <head> ou <body>
    useEffect(() => {
        if (!scripts || scripts.length === 0) return;

        scripts.forEach(script => {
            if (document.getElementById(`script-${script.type}-${script.code}`)) return; // Evita duplicar

            if (script.type === "GTM") {
                // Injeção GTM (Exemplo simplificado)
                const s = document.createElement("script");
                s.id = `script-${script.type}-${script.code}`;
                s.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${script.code}');`;
                document.head.appendChild(s);
            } 
            else if (script.type === "PIXEL") {
                // Injeção Facebook Pixel
                const s = document.createElement("script");
                s.id = `script-${script.type}-${script.code}`;
                s.innerHTML = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init', '${script.code}');fbq('track', 'PageView');`;
                document.head.appendChild(s);
            }
        });
    }, [scripts]);

    return null; // Componente invisível
}