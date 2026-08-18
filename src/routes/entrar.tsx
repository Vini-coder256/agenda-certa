import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, LogIn } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/entrar")({
  head: () => ({
    meta: [
      { title: "Entrar na sua conta | Agenda Certa" },
      {
        name: "description",
        content: "Acesse o painel do Agenda Certa para ver sua agenda, serviços e profissionais.",
      },
      { property: "og:title", content: "Entrar na sua conta | Agenda Certa" },
      {
        property: "og:description",
        content: "Login do empreendedor para acompanhar agendamentos do dia.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Entrar,
});

function Entrar() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  return (
    <div className="min-h-screen bg-muted/40 px-4 py-10 sm:px-6">
      <div className="mx-auto w-full max-w-md">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground"
        >
          <ArrowLeft className="size-3.5" /> Voltar para o site
        </Link>

        <div className="surface-card mt-4 p-6 sm:p-8">
          <span className="grid size-11 place-items-center rounded-xl bg-primary-soft text-primary">
            <LogIn className="size-5" />
          </span>
          <h1 className="mt-4 text-2xl font-bold">Entrar no Agenda Certa</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Use o e-mail cadastrado para acessar seu painel.
          </p>

          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              navigate({ to: "/painel" });
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="login-email">E-mail</Label>
              <Input
                id="login-email"
                type="email"
                placeholder="voce@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="login-senha">Senha</Label>
              <Input
                id="login-senha"
                type="password"
                placeholder="Sua senha"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={!form.email || !form.password}>
              Entrar
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Ainda não tem conta?{" "}
            <Link to="/cadastro" className="font-semibold text-primary">
              Criar conta grátis
            </Link>
          </p>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Protótipo visual: qualquer e-mail e senha abrem o painel de demonstração.
        </p>
      </div>
    </div>
  );
}
