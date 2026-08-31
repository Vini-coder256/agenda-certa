import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock,
  Phone,
  Search,
  XCircle,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { demoBooking, rescheduleDays } from "@/lib/booking";
import { brl, business } from "@/lib/mock";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/b_/$slug/gerenciar")({
  head: () => ({
    meta: [
      { title: `Gerenciar agendamento — ${business.name}` },
      {
        name: "description",
        content:
          "Busque seu agendamento pelo WhatsApp e código para cancelar ou remarcar seu horário na Barbearia do Zé.",
      },
      { property: "og:title", content: `Gerenciar agendamento — ${business.name}` },
      {
        property: "og:description",
        content: "Cancele ou remarque seu horário usando o código do agendamento.",
      },
    ],
  }),
  component: ManageBooking,
});

type View = "buscar" | "detalhes" | "cancelar" | "cancelado" | "remarcar" | "remarcado";

function ManageBooking() {
  const { slug } = Route.useParams();
  const [view, setView] = useState<View>("buscar");
  const [fields, setFields] = useState({ whatsapp: "", code: "" });
  const [lessThanHour, setLessThanHour] = useState(false);
  const [newDay, setNewDay] = useState(rescheduleDays[0]!);
  const [newTime, setNewTime] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<{ dayLabel: string; time: string } | null>(null);

  const booking = demoBooking;

  const lockNotice = (
    <div className="flex items-start gap-2 rounded-xl border border-warning/50 bg-warning-soft p-4 text-sm text-warning-foreground">
      <AlertTriangle className="mt-0.5 size-4 shrink-0" />
      <p>
        Cancelamentos e remarcações online só podem ser feitos até 1 hora antes do horário. Para
        alterações em cima da hora, fale diretamente com o negócio pelo WhatsApp{" "}
        <strong>{business.whatsapp}</strong>.
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="gradient-hero px-4 pb-12 pt-8 text-primary-foreground sm:px-6">
        <div className="mx-auto max-w-2xl">
          <Link
            to="/b/$slug"
            params={{ slug }}
            className="inline-flex items-center gap-1 text-xs font-medium opacity-85"
          >
            <ArrowLeft className="size-3.5" /> Voltar para a página do negócio
          </Link>
          <h1 className="mt-4 text-2xl font-bold sm:text-3xl">{business.name}</h1>
          <p className="mt-2 text-sm opacity-90">Gerencie seu agendamento na {business.name}.</p>
        </div>
      </header>

      <main className="mx-auto -mt-6 w-full max-w-2xl px-4 pb-16 sm:px-6">
        {view === "buscar" && (
          <section className="surface-card space-y-4 p-5">
            <div className="space-y-2">
              <Label htmlFor="g-zap">WhatsApp</Label>
              <Input
                id="g-zap"
                placeholder="(11) 90000-0000"
                value={fields.whatsapp}
                onChange={(e) => setFields({ ...fields, whatsapp: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="g-cod">Código do agendamento</Label>
              <Input
                id="g-cod"
                placeholder="AC-0000"
                value={fields.code}
                onChange={(e) => setFields({ ...fields, code: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                O código foi mostrado na confirmação do seu agendamento. Ex.: {booking.code}
              </p>
            </div>
            <Button className="w-full" onClick={() => setView("detalhes")}>
              <Search className="mr-1.5 size-4" /> Buscar agendamento
            </Button>

            <div className="flex items-center justify-between gap-3 rounded-xl bg-muted p-3 text-xs text-muted-foreground">
              <span>Simular horário em menos de 1 hora</span>
              <Switch checked={lessThanHour} onCheckedChange={setLessThanHour} />
            </div>
          </section>
        )}

        {view === "detalhes" && (
          <section className="space-y-4">
            <div className="surface-card p-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-bold">Seu agendamento</h2>
                <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
                  Agendado
                </span>
              </div>
              <dl className="mt-4 space-y-2 text-sm">
                <Row label="Negócio" value={business.name} />
                <Row label="Serviço" value={booking.serviceName} />
                {booking.professionalName && (
                  <Row label="Profissional" value={booking.professionalName} />
                )}
                <Row label="Data" value={booking.dateLabel} />
                <Row label="Horário" value={booking.time} />
                <Row label="Duração" value={`${booking.durationMin} min`} />
                <Row label="Cliente" value={booking.clientName} />
                <Row label="WhatsApp" value={booking.whatsapp} />
                <Row label="Código do agendamento" value={booking.code} />
                <div className="flex justify-between gap-3 border-t pt-2">
                  <dt className="font-semibold">Valor</dt>
                  <dd className="font-display text-lg font-bold text-primary">
                    {brl(booking.price)}
                  </dd>
                </div>
              </dl>
            </div>

            {lessThanHour ? (
              lockNotice
            ) : (
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => {
                    setNewTime(null);
                    setView("remarcar");
                  }}
                >
                  <CalendarDays className="mr-1.5 size-4" /> Remarcar
                </Button>
                <Button variant="outline" onClick={() => setView("cancelar")}>
                  Cancelar agendamento
                </Button>
              </div>
            )}
            <Button variant="ghost" onClick={() => setView("buscar")}>
              <ArrowLeft className="mr-1 size-4" /> Buscar outro agendamento
            </Button>
          </section>
        )}

        {view === "cancelar" && (
          <section className="surface-card p-6 text-center">
            <span className="mx-auto grid size-14 place-items-center rounded-full bg-warning-soft text-warning-foreground">
              <AlertTriangle className="size-7" />
            </span>
            <h2 className="mt-4 text-xl font-bold">Tem certeza que deseja cancelar este horário?</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Ao cancelar, este horário poderá voltar a ficar disponível para outros clientes.
            </p>
            <p className="mt-3 text-sm font-medium">
              {booking.serviceName} · {booking.dateLabel} às {booking.time}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <Button variant="outline" onClick={() => setView("detalhes")}>
                Manter agendamento
              </Button>
              <Button onClick={() => setView("cancelado")}>Confirmar cancelamento</Button>
            </div>
          </section>
        )}

        {view === "cancelado" && (
          <section className="surface-card p-6 text-center">
            <span className="mx-auto grid size-14 place-items-center rounded-full bg-muted text-muted-foreground">
              <XCircle className="size-7" />
            </span>
            <h2 className="mt-4 text-xl font-bold">Agendamento cancelado com sucesso.</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              O horário de {booking.dateLabel} às {booking.time} foi liberado.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <Link to="/b/$slug" params={{ slug }}>
                <Button>Agendar um novo horário</Button>
              </Link>
              <Button variant="ghost" onClick={() => setView("buscar")}>
                Gerenciar outro agendamento
              </Button>
            </div>
          </section>
        )}

        {view === "remarcar" && (
          <section className="space-y-4">
            <h2 className="text-lg font-bold">Escolha o novo horário</h2>
            <p className="text-sm text-muted-foreground">
              Mantendo {booking.serviceName}
              {booking.professionalName ? ` com ${booking.professionalName}` : ""}.
            </p>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {rescheduleDays.map((d) => (
                <button
                  key={d.date}
                  onClick={() => {
                    setNewDay(d);
                    setNewTime(null);
                  }}
                  className={cn(
                    "min-w-18 shrink-0 rounded-xl border px-4 py-2 text-center transition-colors",
                    newDay.date === d.date
                      ? "border-primary bg-primary text-primary-foreground"
                      : "bg-card hover:bg-muted",
                  )}
                >
                  <span className="block text-xs opacity-80">{d.weekday}</span>
                  <span className="block font-display text-lg font-bold">{d.day}</span>
                  <span className="block text-xs opacity-80">{d.month}</span>
                </button>
              ))}
            </div>

            <div className="surface-card p-5">
              <p className="text-sm font-semibold">Horários livres · {newDay.label}</p>
              <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                {newDay.times.map((t) => (
                  <button
                    key={t}
                    onClick={() => setNewTime(t)}
                    className={cn(
                      "rounded-lg border py-2.5 text-sm font-medium transition-colors",
                      newTime === t
                        ? "border-primary bg-primary text-primary-foreground"
                        : "hover:bg-muted",
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Só aparecem os horários realmente livres neste negócio.
              </p>
            </div>

            <div className="surface-card p-5">
              <h3 className="text-base font-bold">Resumo da remarcação</h3>
              <dl className="mt-3 space-y-2 text-sm">
                <Row label="Horário antigo" value={`${booking.dateLabel} às ${booking.time}`} />
                <Row
                  label="Novo horário"
                  value={newTime ? `${newDay.label} às ${newTime}` : "Selecione um horário"}
                />
              </dl>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="ghost" onClick={() => setView("detalhes")}>
                <ArrowLeft className="mr-1 size-4" /> Voltar
              </Button>
              <Button
                disabled={!newTime}
                onClick={() => {
                  setConfirmed({ dayLabel: newDay.label, time: newTime! });
                  setView("remarcado");
                }}
              >
                Confirmar remarcação
              </Button>
            </div>
          </section>
        )}

        {view === "remarcado" && (
          <section className="surface-card p-6 text-center">
            <span className="mx-auto grid size-14 place-items-center rounded-full bg-success-soft text-success">
              <CheckCircle2 className="size-7" />
            </span>
            <h2 className="mt-4 text-xl font-bold">Agendamento remarcado com sucesso.</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              O horário antigo foi liberado e o novo horário ficou reservado.
            </p>
            <dl className="mx-auto mt-6 max-w-sm space-y-2 rounded-xl bg-muted p-4 text-left text-sm">
              <Row label="Negócio" value={business.name} />
              <Row label="Serviço" value={booking.serviceName} />
              <Row label="Horário antigo" value={`${booking.dateLabel} às ${booking.time}`} />
              <Row
                label="Novo horário"
                value={`${confirmed?.dayLabel} às ${confirmed?.time}`}
              />
              <Row label="Código do agendamento" value={booking.code} />
            </dl>
            <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="size-3.5" /> Tolerância de {business.toleranceMin} minutos de atraso.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <Link to="/b/$slug" params={{ slug }}>
                <Button variant="outline">Voltar para a página do negócio</Button>
              </Link>
              <Button variant="ghost" onClick={() => setView("detalhes")}>
                Ver meu agendamento
              </Button>
            </div>
          </section>
        )}

        <p className="mt-8 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
          <Phone className="size-3.5" /> Dúvidas? Fale com a {business.name}: {business.whatsapp}
        </p>
      </main>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}
