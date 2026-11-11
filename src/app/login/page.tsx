"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  LockKeyhole,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import { api } from "../../lib/api";
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  return (
    <div className="login-page site-container">
      <div className="login-editorial">
        <span className="eyebrow">BOM JESUS · ÁREA DA EQUIPE</span>
        <h1>
          Por trás de cada
          <br />
          nova <em>conquista.</em>
        </h1>
        <p>Gerencie o estoque e cuide dos próximos caminhos da Bom Jesus.</p>
        <Link className="text-link" href="/">
          <ArrowLeft size={17} />
          Voltar ao site
        </Link>
      </div>
      <form
        className="login-form"
        onSubmit={async (e) => {
          e.preventDefault();
          setError("");
          setLoading(true);
          try {
            const r = await api.post("/auth/login", { email, senha });
            localStorage.setItem("token", r.data.access_token);
            localStorage.setItem("user", JSON.stringify(r.data.user));
            router.push("/admin");
          } catch {
            setError(
              "Não foi possível entrar. Confira seu e-mail e senha e tente novamente.",
            );
          } finally {
            setLoading(false);
          }
        }}
      >
        <LockKeyhole size={25} />
        <h2>Acesse sua conta.</h2>
        <p>Use suas credenciais para entrar no painel.</p>
        {error && (
          <div className="inline-notice" role="alert">
            {error}
          </div>
        )}
        <label htmlFor="login-email">
          E-mail
          <input
            id="login-email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            required
          />
        </label>
        <label htmlFor="login-password">
          Senha
          <div className="password-input">
            <input
              id="login-password"
              type={show ? "text" : "password"}
              autoComplete="current-password"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Sua senha"
            />
            <button
              type="button"
              aria-label={show ? "Ocultar senha" : "Mostrar senha"}
              onClick={() => setShow(!show)}
            >
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </label>
        <button className="button" type="submit" disabled={loading}>
          {loading ? <Loader2 className="spin" size={18} /> : null}
          {loading ? "Entrando…" : "Entrar no painel"}
          <ArrowUpRight size={18} />
        </button>
      </form>
    </div>
  );
}
