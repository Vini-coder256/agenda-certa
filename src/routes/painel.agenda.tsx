import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, Ban, Check, Clock, UserX } from "lucide-react";
import { useState } from "react";

import { PainelShell } from "@/components/painel/painel-shell";
import { OriginBadge, StatusBadge } from "@/components/painel/status-badge";
import { Button } from "@/components/ui/button";
import {
  appointments as seedAppointments,
  activeProfessionals,
  brl,
  business,
  getProfessional,
  getService,
  nextDays,
  type Appointment,
  type AppointmentStatus,
} from "@/lib/mock";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/painel/agenda")({
  head: () => ({
    meta: [
      { title: "Agenda do dia | Agenda Certa" },
      {
        name: "description",
        content:
          "Veja a agenda do dia com agendamentos online e manuais, marque presença, falta ou cancele em um toque.",
      },
      { property: "og:title", content: "Agenda do dia | Agenda Certa" },
      {
        property: "og:description",
        content: "Controle os atendimentos do dia por profissional, com aviso de tolerância de atraso.",
      },
    ],
  }),
  component: Agenda,
});

function Agenda() {
  const [items, setItems] = useState<Appointment[]>(seedAppointments);
  const [proFilter, setProFilter] = useState<string>("todos");
  const [dayIndex, setDayIndex] = useState(0);

  const update = (id: string, status: AppointmentStatus) =>
    setItems((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));

  const visible = items.filter((a) => proFilter === "todos" || a.professionalId === proFilter);

  return (
    <PainelShell
      title="Agenda"
      subtitle="Agendamentos online e manuais no mesmo lugar"
      action={
        <Link to="/painel/novo-agendamento">
          <Button>Agendamento manual</Button>
        </Link>
      }
    >
      <div className="surface-card p-4">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {nextDays.map((d, i) => (
            <button
              key={d.date}
              onClick={() => setDayIndex(i)}
              className={cn(
                "min-w-18 shrink-0 rounded-xl border px-4 py-2 text-center transition-colors",
                i === dayIndex
                  ? "border-primary bg-primary text-primary-foreground"
                  : "bg-card hover:bg-muted",
              )}
            >
              <span className="block text-xs font-medium opacity-80">{d.weekday}</span>
              <span className="block font-display text-lg font-bold">{d.day}</span>
              <span className="block text-xs opacity-80">{d.month}</span>
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 border-t pt-4">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Profissional
          </span>
          <button
            onClick={() => setProFilter("todos")}
            className={cn(
              "rounded-full border px-3 py-1 text-sm transition-colors",
              proFilter === "todos" ? "border-primary bg-primary-soft text-primary" : "hover:bg-muted",
            )}
          >
            Todos
          </button>
          {activeProfessionals.map((p) => (
            <button
              key={p.id}
              onClick={() => setProFilter(p.id)}
              className={cn(
                "rounded-full border px-3 py-1 text-sm transition-colors",
                proFilter === p.id ? "border-primary bg-primary-soft text-primary" : "hover:bg-muted",
              )}
            >
              {p.name.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {visible.map((a) => {
          const service = getService(a.serviceId);
          const pro = getProfessional(a.professionalId);
          const late = a.status === "agendado" && (a.lateMinutes ?? 0) > business.toleranceMin;

          return (
            <article
              key={a.id}
              className={cn(
                "surface-card p-4 sm:p-5",
                late && "border-warning/60",
                a.status === "cancelado" && "opacity-70",
              )}
            >
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:items-center">
                <div className="hidden w-20 shrink-0 flex-col items-start sm:flex">
                  <span className="flex items-center gap-1 font-display text-xl font-bold">
                    <Clock className="size-4 text-muted-foreground" />
                    {a.time}
                  </span>
                  <span className="text-xs text-muted-foreground">{service.durationMin} min</span>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-display text-lg font-bold sm:hidden">{a.time}</span>
                    <p className="min-w-0 truncate font-semibold">{a.clientName}</p>
                    <OriginBadge origin={a.origin} />
                    <StatusBadge status={a.status} />
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {service.name} · {brl(a.price)} · com{" "}
                    <span className="font-medium text-foreground">{pro.name}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">{a.whatsapp}</p>
                  {a.note && (
                    <p className="mt-2 rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
                      Obs.: {a.note}
                    </p>
                  )}
                </div>

                {a.status === "agendado" && (
                  <div className="col-span-2 flex flex-wrap gap-2 sm:col-auto sm:shrink-0">
                    <Button size="sm" onClick={() => update(a.id, "concluido")}>
                      <Check className="mr-1 size-4" /> Concluído
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => update(a.id, "nao_compareceu")}
                    >
                      <UserX className="mr-1 size-4" /> Não veio
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => update(a.id, "cancelado")}>
                      <Ban className="mr-1 size-4" /> Cancelar
                    </Button>
                  </div>
                )}
              </div>

              {late && (
                <div className="mt-4 flex items-start gap-2 rounded-lg border border-warning/40 bg-warning-soft p-3 text-sm text-warning-foreground">
                  <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                  <p>
                    Passou da tolerância de {business.toleranceMin} minutos ({a.lateMinutes} min de
                    atraso). Você já pode liberar este horário para outro cliente.
                  </p>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </PainelShell>
  );
}
