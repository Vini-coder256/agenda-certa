import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarCheck, Clock, LayoutDashboard, Smartphone, Users, Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";
import { business, trial } from "@/lib/mock";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Agenda Certa — Agendamento online para quem atende por hora marcada" },
      {
        name: "description",
        content:
          "Protótipo de micro SaaS de agendamentos para barbearias, salões, estética, personal trainers e professores. Painel do dono e página pública do cliente.",
      },
      {
        property: "og:title",
        content: "Agenda Certa — Agendamento online para quem atende por hora marcada",
      },
      {
        property: "og:description",
        content: "Página pública própria, agenda por profissional e controle de faltas em um só lugar.",
      },
    ],
  }),
  component: Home,
});

const features = [
  {
    icon: LayoutDashboard,
    title: "Resumo do dia",
    text: "Agendamentos, ganho previsto, ganho real e faltas na primeira tela.",
  },
  {
    icon: Users,
    title: "Vários profissionais",
    text: "Cada barbeiro com sua própria agenda. O cliente escolhe com quem quer ir.",
  },
  {
    icon: Smartphone,
    title: "Link público próprio",
    text: "Compartilhe no WhatsApp e receba agendamentos sem responder mensagem.",
  },
  {
    icon: Clock,
    title: "Tolerância de 15 min",
    text: "Aviso automático quando o cliente atrasa e o horário pode ser liberado.",
  },
  {
    icon: CalendarCheck,
    title: "Agendamento manual",
    text: "Quem chamou no WhatsApp entra na agenda e bloqueia o horário público.",
  },
  {
    icon: Wallet,
    title: "Planos simples",
    text: `${trial.totalDays} dias grátis, depois R$39 ou R$49 por mês. Sem fidelidade.`,
  },
];

function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="gradient-hero px-4 py-16 text-primary-foreground sm:px-6 sm:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
            Protótipo navegável · dados fictícios
          </span>
          <h1 className="mt-5 text-4xl font-bold sm:text-5xl">
            A agenda do seu negócio, sem complicação
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base opacity-90">
            Para barbearias, manicures, salões, estética, personal trainers e professores
            particulares. Você cadastra seus serviços e recebe agendamentos por um link só seu.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/painel">
              <Button size="lg" variant="secondary">
                Ver painel do empreendedor
              </Button>
            </Link>
            <Link to="/b/$slug" params={{ slug: business.slug }}>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/50 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
              >
                Ver página do cliente
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-6">
        <h2 className="text-center text-2xl font-bold">O que já está no protótipo</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <article key={f.title} className="surface-card p-5">
              <span className="grid size-10 place-items-center rounded-xl bg-primary-soft text-primary">
                <f.icon className="size-5" />
              </span>
              <h3 className="mt-4 text-base font-bold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.text}</p>
            </article>
          ))}
        </div>

        <div className="surface-card mt-10 p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Exemplo de negócio cadastrado nesta demonstração
          </p>
          <p className="mt-1 font-display text-xl font-bold">{business.name}</p>
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            agendacerta.app/b/{business.slug}
          </p>
        </div>
      </main>

      <footer className="border-t px-4 py-8 text-center text-xs text-muted-foreground">
        Agenda Certa · protótipo visual sem banco de dados, pagamento ou integrações.
      </footer>
    </div>
  );
}
