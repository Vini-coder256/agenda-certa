import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  activeProfessionals,
  activeServices,
  availabilityByProfessional,
  brl,
  business,
  nextDays,
  type Professional,
  type Service,
} from "@/lib/mock";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/b/$slug")({
  head: () => ({
    meta: [
      { title: `${business.name} — Agende seu horário online` },
      {
        name: "description",
        content:
          "Escolha o serviço, o profissional e o horário livre para agendar na Barbearia do Zé. Confirmação na hora, sem ligação.",
      },
      { property: "og:title", content: `${business.name} — Agende seu horário online` },
      {
        property: "og:description",
        content: "Agendamento online com horários livres em tempo real e confirmação imediata.",
      },
    ],
  }),
  component: PublicBooking,
});

type Step = 1 | 2 | 3 | 4 | 5;

function PublicBooking() {
  const multiPro = activeProfessionals.length > 1;
  const [step, setStep] = useState<Step>(1);
  const [service, setService] = useState<Service | null>(null);
  const [pro, setPro] = useState<Professional | null>(multiPro ? null : activeProfessionals[0]!);
  const [day, setDay] = useState(nextDays[0]!);
  const [time, setTime] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", whatsapp: "", note: "" });

  const steps = multiPro
    ? ["Serviço", "Profissional", "Data e horário", "Seus dados", "Confirmar"]
    : ["Serviço", "Data e horário", "Seus dados", "Confirmar"];

  const stepIndex = multiPro ? step - 1 : Math.max(0, step - 2);

  const slots = pro ? availabilityByProfessional[pro.id] ?? {} : {};
  const freeSlots = Object.entries(slots).filter(([, free]) => free);
  const busySlots = Object.entries(slots).filter(([, free]) => !free);

  const goto = (s: Step) => setStep(s);

  return (
    <div className="min-h-screen bg-background">
      <header className="gradient-hero px-4 pb-14 pt-8 text-primary-foreground sm:px-6">
        <div className="mx-auto max-w-3xl">
          <Link to="/" className="inline-flex items-center gap-1 text-xs font-medium opacity-85">
            <ArrowLeft className="size-3.5" /> agendacerta.app
          </Link>
          <h1 className="mt-4 text-3xl font-bold sm:text-4xl">{business.name}</h1>
          <p className="mt-2 max-w-xl text-sm opacity-90">{business.description}</p>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs opacity-90">
            <span className="flex items-center gap-1.5">
              <MapPin className="size-3.5 shrink-0" /> {business.address}
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="size-3.5 shrink-0" /> {business.whatsapp}
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarDays className="size-3.5 shrink-0" /> Seg a sáb
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto -mt-8 w-full max-w-3xl px-4 pb-16 sm:px-6">
        {step < 5 && (
          <ol className="surface-card mb-6 flex flex-wrap items-center gap-x-4 gap-y-2 p-4 text-xs">
            {steps.map((label, i) => (
              <li key={label} className="flex min-w-0 items-center gap-2">
                <span
                  className={cn(
                    "grid size-6 shrink-0 place-items-center rounded-full font-bold",
                    i <= stepIndex
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {i + 1}
                </span>
                <span
                  className={cn(
                    "truncate font-medium",
                    i === stepIndex ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {label}
                </span>
              </li>
            ))}
          </ol>
        )}

        {step === 1 && (
          <section className="space-y-3">
            <h2 className="text-lg font-bold">Escolha o serviço</h2>
            {activeServices.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setService(s);
                  setPro(multiPro ? null : activeProfessionals[0]!);
                  setTime(null);
                  goto(multiPro ? 2 : 3);
                }}
                className="surface-card grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-4 p-5 text-left transition-shadow hover:shadow-lift"
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold">{s.name}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{s.description}</p>
                  <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="size-3.5" /> {s.durationMin} minutos
                  </p>
                </div>
                <span className="shrink-0 font-display text-xl font-bold text-primary">
                  {brl(s.price)}
                </span>
              </button>
            ))}
          </section>
        )}

        {step === 2 && multiPro && (
          <section className="space-y-3">
            <h2 className="text-lg font-bold">Escolha o profissional</h2>
            <p className="text-sm text-muted-foreground">
              Os horários mudam conforme a agenda de cada profissional.
            </p>
            {activeProfessionals
              .filter((p) => !service || p.serviceIds.includes(service.id))
              .map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setPro(p);
                    setTime(null);
                    goto(3);
                  }}
                  className="surface-card flex w-full items-center gap-4 p-5 text-left transition-shadow hover:shadow-lift"
                >
                  <span className="grid size-12 shrink-0 place-items-center rounded-full bg-primary-soft font-display font-bold text-primary">
                    {p.initials}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-semibold">{p.name}</span>
                    <span className="block truncate text-sm text-muted-foreground">{p.role}</span>
                  </span>
                </button>
              ))}
            <Button variant="ghost" onClick={() => goto(1)}>
              <ArrowLeft className="mr-1 size-4" /> Voltar
            </Button>
          </section>
        )}

        {step === 3 && (
          <section className="space-y-4">
            <h2 className="text-lg font-bold">Escolha a data e o horário</h2>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {nextDays.map((d) => (
                <button
                  key={d.date}
                  onClick={() => setDay(d)}
                  className={cn(
                    "min-w-18 shrink-0 rounded-xl border px-4 py-2 text-center transition-colors",
                    day.date === d.date
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
              <p className="text-sm font-semibold">
                Horários livres {pro ? `com ${pro.name.split(" ")[0]}` : ""} · {day.label}
              </p>
              <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
                {freeSlots.map(([h]) => (
                  <button
                    key={h}
                    onClick={() => setTime(h)}
                    className={cn(
                      "rounded-lg border py-2.5 text-sm font-medium transition-colors",
                      time === h
                        ? "border-primary bg-primary text-primary-foreground"
                        : "hover:bg-muted",
                    )}
                  >
                    {h}
                  </button>
                ))}
              </div>

              <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Já ocupados (indisponíveis)
              </p>
              <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-5">
                {busySlots.map(([h]) => (
                  <span
                    key={h}
                    className="cursor-not-allowed rounded-lg border border-dashed bg-muted py-2.5 text-center text-sm text-muted-foreground line-through"
                  >
                    {h}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="ghost" onClick={() => goto(multiPro ? 2 : 1)}>
                <ArrowLeft className="mr-1 size-4" /> Voltar
              </Button>
              <Button disabled={!time} onClick={() => goto(4)}>
                Continuar
              </Button>
            </div>
          </section>
        )}

        {step === 4 && (
          <section className="space-y-4">
            <h2 className="text-lg font-bold">Seus dados</h2>
            <div className="surface-card space-y-4 p-5">
              <div className="space-y-2">
                <Label htmlFor="c-nome">Nome completo</Label>
                <Input
                  id="c-nome"
                  placeholder="Seu nome"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="c-zap">WhatsApp</Label>
                <Input
                  id="c-zap"
                  placeholder="(11) 90000-0000"
                  value={form.whatsapp}
                  onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="c-obs">Observação (opcional)</Label>
                <Textarea
                  id="c-obs"
                  rows={3}
                  placeholder="Ex.: quero manter o topo mais comprido."
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                />
              </div>
            </div>

            <div className="surface-card p-5">
              <h3 className="text-base font-bold">Revise seu agendamento</h3>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Serviço</dt>
                  <dd className="text-right font-medium">{service?.name}</dd>
                </div>
                {multiPro && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted-foreground">Profissional</dt>
                    <dd className="text-right font-medium">{pro?.name}</dd>
                  </div>
                )}
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Data</dt>
                  <dd className="font-medium">
                    {day.label} · {day.day}/{day.month}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Horário</dt>
                  <dd className="font-medium">{time}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Duração</dt>
                  <dd className="font-medium">{service?.durationMin} min</dd>
                </div>
                <div className="flex justify-between gap-3 border-t pt-2">
                  <dt className="font-semibold">Valor</dt>
                  <dd className="font-display text-lg font-bold text-primary">
                    {service ? brl(service.price) : "—"}
                  </dd>
                </div>
              </dl>

              <div className="mt-4 flex items-start gap-2 rounded-xl border border-warning/50 bg-warning-soft p-4 text-sm text-warning-foreground">
                <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                <p>
                  <strong>Atenção:</strong> seu horário possui tolerância de {business.toleranceMin}{" "}
                  minutos. Caso você não chegue dentro desse prazo, seu horário poderá ser liberado
                  para outro cliente.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="ghost" onClick={() => goto(3)}>
                <ArrowLeft className="mr-1 size-4" /> Voltar
              </Button>
              <Button disabled={!form.name || !form.whatsapp} onClick={() => goto(5)}>
                Confirmar agendamento
              </Button>
            </div>
          </section>
        )}

        {step === 5 && (
          <section className="surface-card p-6 text-center">
            <span className="mx-auto grid size-14 place-items-center rounded-full bg-success-soft text-success">
              <CheckCircle2 className="size-7" />
            </span>
            <h2 className="mt-4 text-xl font-bold">Agendamento confirmado com sucesso.</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Anote o horário — te esperamos na {business.name}.
            </p>

            <dl className="mx-auto mt-6 max-w-sm space-y-2 rounded-xl bg-muted p-4 text-left text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Cliente</dt>
                <dd className="text-right font-medium">{form.name}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">WhatsApp</dt>
                <dd className="font-medium">{form.whatsapp}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Serviço</dt>
                <dd className="text-right font-medium">{service?.name}</dd>
              </div>
              {multiPro && (
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Profissional</dt>
                  <dd className="text-right font-medium">{pro?.name}</dd>
                </div>
              )}
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Data e horário</dt>
                <dd className="font-medium">
                  {day.day}/{day.month} às {time}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Valor</dt>
                <dd className="font-medium">{service ? brl(service.price) : "—"}</dd>
              </div>
              {form.note && (
                <div className="border-t pt-2">
                  <dt className="text-muted-foreground">Observação</dt>
                  <dd className="mt-0.5">{form.note}</dd>
                </div>
              )}
            </dl>

            <p className="mt-4 text-xs text-muted-foreground">
              Tolerância de {business.toleranceMin} minutos de atraso. {business.address}
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setStep(1);
                  setService(null);
                  setTime(null);
                  setPro(multiPro ? null : activeProfessionals[0]!);
                  setForm({ name: "", whatsapp: "", note: "" });
                }}
              >
                Fazer outro agendamento
              </Button>
              <Link to="/painel">
                <Button variant="ghost">Ver o painel do dono</Button>
              </Link>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
