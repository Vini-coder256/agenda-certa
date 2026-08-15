import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeDollarSign,
  CalendarCheck,
  Clock,
  TimerReset,
  UserX,
  Wallet,
} from "lucide-react";

import { PainelShell } from "@/components/painel/painel-shell";
import { OriginBadge, StatusBadge } from "@/components/painel/status-badge";
import { Button } from "@/components/ui/button";
import {
  appointments,
  brl,
  business,
  getProfessional,
  getService,
  todaySummary,
  trial,
} from "@/lib/mock";

export const Route = createFileRoute("/painel/")({
  head: () => ({
    meta: [
      { title: "Dashboard do dia | Agenda Certa" },
      {
        name: "description",
        content:
          "Resumo do dia do seu negócio: agendamentos, ganho previsto, ganho real, faltas e próximos horários.",
      },
      { property: "og:title", content: "Dashboard do dia | Agenda Certa" },
      {
        property: "og:description",
        content: "Acompanhe agendamentos, ganhos e faltas do dia em um só lugar.",
      },
    ],
  }),
  component: Dashboard,
});

const metrics = [
  {
    label: "Agendamentos de hoje",
    value: String(todaySummary.total),
    hint: "2 manuais · 4 online",
    icon: CalendarCheck,
    tone: "bg-primary-soft text-primary",
  },
  {
    label: "Ganho previsto",
    value: brl(todaySummary.expected),
    hint: "Se todos comparecerem",
    icon: BadgeDollarSign,
    tone: "bg-info-soft text-info",
  },
  {
    label: "Ganho real",
    value: brl(todaySummary.earned),
    hint: "Atendimentos concluídos",
    icon: Wallet,
    tone: "bg-success-soft text-success",
  },
  {
    label: "Não compareceram",
    value: String(todaySummary.noShows),
    hint: "Perda de " + brl(25),
    icon: UserX,
    tone: "bg-destructive-soft text-destructive",
  },
  {
    label: "Teste grátis",
    value: `${trial.daysLeft} dias`,
    hint: `Termina em ${trial.endsAt}`,
    icon: TimerReset,
    tone: "bg-accent-soft text-accent-foreground",
  },
];

function Dashboard() {
  const upcoming = appointments.filter((a) => a.status === "agendado");

  return (
    <PainelShell
      title="Bom dia, Zé!"
      subtitle="Sábado, 15 de agosto · veja como está o seu dia"
      action={
        <Link to="/painel/novo-agendamento">
          <Button>Novo agendamento</Button>
        </Link>
      }
    >
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {metrics.map((m) => (
          <div key={m.label} className="surface-card p-4">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
              <p className="min-w-0 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {m.label}
              </p>
              <span className={`grid size-8 shrink-0 place-items-center rounded-lg ${m.tone}`}>
                <m.icon className="size-4" />
              </span>
            </div>
            <p className="mt-3 font-display text-2xl font-bold">{m.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{m.hint}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="surface-card overflow-hidden">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b px-4 py-4 sm:px-5">
            <div className="min-w-0">
              <h2 className="truncate text-base font-bold">Próximos horários de hoje</h2>
              <p className="text-xs text-muted-foreground">{upcoming.length} atendimentos pela frente</p>
            </div>
            <Link to="/painel/agenda" className="shrink-0">
              <Button variant="ghost" size="sm">
                Ver agenda <ArrowRight className="ml-1 size-4" />
              </Button>
            </Link>
          </div>

          <ul className="divide-y">
            {upcoming.map((a) => {
              const service = getService(a.serviceId);
              const pro = getProfessional(a.professionalId);
              return (
                <li key={a.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-4 sm:px-5">
                  <div className="flex w-16 shrink-0 items-center gap-1.5 font-display text-lg font-bold">
                    <Clock className="size-4 text-muted-foreground" />
                    {a.time}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{a.clientName}</p>
                    <p className="truncate text-sm text-muted-foreground">
                      {service.name} · {pro.name} · {service.durationMin} min
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    <span className="font-semibold">{brl(a.price)}</span>
                    <OriginBadge origin={a.origin} />
                    <StatusBadge status={a.status} />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="space-y-6">
          <div className="surface-card p-5">
            <h2 className="text-base font-bold">Seu link público</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Compartilhe no WhatsApp e nas redes para receber agendamentos sozinho.
            </p>
            <div className="mt-3 truncate rounded-lg bg-muted px-3 py-2 font-mono text-xs">
              agendacerta.app/b/{business.slug}
            </div>
            <Link to="/b/$slug" params={{ slug: business.slug }}>
              <Button variant="outline" className="mt-3 w-full">
                Abrir página do cliente
              </Button>
            </Link>
          </div>

          <div className="surface-card p-5">
            <h2 className="text-base font-bold">Tolerância de atraso</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Após {business.toleranceMin} minutos de atraso você pode liberar o horário para outro
              cliente. O aviso aparece automaticamente na agenda.
            </p>
            <div className="mt-3 rounded-lg border border-warning/40 bg-warning-soft p-3 text-sm text-warning-foreground">
              Felipe Rocha está <strong>18 min atrasado</strong> no horário das 14:00.
            </div>
          </div>
        </div>
      </section>
    </PainelShell>
  );
}
