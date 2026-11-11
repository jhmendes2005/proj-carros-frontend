"use client";
import { usePathname } from "next/navigation";
import Header from "./header";
import Footer from "./Footer";
import FloatingWhatsApp from "./FloatingWhatsApp";
export default function SiteFrame({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const admin = path?.startsWith("/admin");
  const legal = path === "/privacidade" || path === "/termos-de-uso";
  const Content = admin ? "div" : "main";
  return (
    <>
      <a className="skip-link" href="#main-content">
        Pular para o conteúdo
      </a>
      {!admin && <Header />}
      <Content
        id="main-content"
        className={`${legal || admin ? "legacy-theme" : ""} ${admin ? "admin-theme" : ""}`}
        tabIndex={-1}
      >
        {children}
      </Content>
      {!admin && (
        <>
          <Footer />
          <FloatingWhatsApp />
        </>
      )}
    </>
  );
}
