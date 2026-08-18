import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, CalendarCheck } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trial } from "@/lib/mock";

export const Route = createFileRoute("/cadastro")({
  head: () => ({
    meta: [
      { title: "Criar conta grátis | Agenda Certa" },
      {
        name: "description",
        content:
          "Crie sua conta no Agenda Certa e comece com 15 dias grátis para receber agendamentos online no seu negócio.",
      },
      { property: "og:title", content: "Criar conta grátis | Agenda Certa" },
      {
        property: "og:description",
        content: "Cadastro rápido: nome, e-mail, senha e WhatsApp. 15 dias grátis.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Cadastro,
});

function Cadastro() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", whatsapp: "" });

  const valid = form.name && form.email && form.password.length >= 6 && form.whatsapp;

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
            <CalendarCheck className="size-5" />
          </span>
          <h1 className="mt-4 text-2xl font-bold">Criar sua conta no Agenda Certa</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Comece com {trial.totalDays} dias grátis. Sem cartão de crédito.
          </p>

          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              navigate({ to: "/onboarding" });
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="nome">Seu nome</Label>
              <Input
                id="nome"
                placeholder="Ex.: Ana Ribeiro"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="voce@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="senha">Senha</Label>
              <Input
                id="senha"
                type="password"
                placeholder="Mínimo de 6 caracteres"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                id="whatsapp"
                placeholder="(11) 90000-0000"
                value={form.whatsapp}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
              />
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={!valid}>
              Criar conta grátis
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Já tem conta?{" "}
            <Link to="/entrar" className="font-semibold text-primary">
              Entrar
            </Link>
          </p>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Protótipo visual: nenhum dado é enviado para servidores.
        </p>
      </div>
    </div>
  );
}
