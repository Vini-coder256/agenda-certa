import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Lock } from "lucide-react";
import { useState } from "react";

import { PainelShell } from "@/components/painel/painel-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { activeProfessionals, activeServices, brl, business, getService } from "@/lib/mock";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/painel/novo-agendamento")({
  head: () => ({
    meta: [
      { title: "Novo agendamento manual | Agenda Certa" },
      {
        name: "description",
        content:
          "Adicione um agendamento manual vindo do WhatsApp, telefone ou balcão e bloqueie o horário na página pública.",
      },
      { property: "og:title", content: "Novo agendamento manual | Agenda Certa" },
      {
        property: "og:description",
        content:
          "Cadastre atendimentos que chegaram fora do link público sem perder o controle da agenda.",
      },
    ],
  }),
  component: NovoAgendamento,
});

const horarios = ["09:00", "09:40", "10:20", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

function NovoAgendamento() {
  const [serviceId, setServiceId] = useState(activeServices[0]!.id);
  const [proId, setProId] = useState(activeProfessionals[0]!.id);
  const [time, setTime] = useState("15:00");
  const [saved, setSaved] = useState(false);

  const service = getService(serviceId);
  const eligiblePros = activeProfessionals.filter((p) => p.serviceIds.includes(serviceId));

  return (
    <PainelShell
      title="Novo agendamento manual"
      subtitle="Para clientes que chamaram no WhatsApp ou apareceram no balcão"
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <form
          className="surface-card space-y-5 p-5"
          onSubmit={(e) => {
            e.preventDefault();
            setSaved(true);
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do cliente</Label>
              <Input id="nome" placeholder="Ex.: Bruno Alves" defaultValue="Bruno Alves" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zap">WhatsApp</Label>
              <Input id="zap" placeholder="(11) 90000-0000" defaultValue="(11) 96666-4545" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Serviço</Label>
            <div className="grid gap-2 sm:grid-cols-2">
              {activeServices.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setServiceId(s.id);
                    const first = activeProfessionals.find((p) => p.serviceIds.includes(s.id));
                    if (first) setProId(first.id);
                  }}
                  className={cn(
                    "rounded-xl border p-3 text-left transition-colors",
                    serviceId === s.id ? "border-primary bg-primary-soft" : "hover:bg-muted",
                  )}
                >
                  <span className="block truncate font-semibold">{s.name}</span>
                  <span className="block text-xs text-muted-foreground">
                    {brl(s.price)} · {s.durationMin} min
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Profissional</Label>
            <div className="flex flex-wrap gap-2">
              {eligiblePros.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setProId(p.id)}
                  className={cn(
                    "flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors",
                    proId === p.id ? "border-primary bg-primary-soft text-primary" : "hover:bg-muted",
                  )}
                >
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-secondary text-[10px] font-bold text-secondary-foreground">
                    {p.initials}
                  </span>
                  {p.name}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Só aparecem profissionais que realizam “{service.name}”.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="data">Data</Label>
              <Input id="data" type="date" defaultValue="2026-08-15" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hora">Horário</Label>
              <Input id="hora" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Horários sugeridos livres</Label>
            <div className="flex flex-wrap gap-2">
              {horarios.map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => setTime(h)}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-sm transition-colors",
                    time === h ? "border-primary bg-primary text-primary-foreground" : "hover:bg-muted",
                  )}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="obs">Observação</Label>
            <Textarea id="obs" rows={3} placeholder="Ex.: cliente prefere tesoura, vai trazer o filho." />
          </div>

          <div className="flex flex-wrap gap-3">
            <Button type="submit">Salvar agendamento</Button>
            <Button type="button" variant="ghost" onClick={() => setSaved(false)}>
              Limpar
            </Button>
          </div>

          {saved && (
            <div className="flex items-start gap-2 rounded-xl border border-success/40 bg-success-soft p-4 text-sm text-foreground">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
              <p>
                Agendamento manual criado às <strong>{time}</strong> com{" "}
                <strong>{activeProfessionals.find((p) => p.id === proId)?.name}</strong>. O horário já
                está bloqueado na página pública.
              </p>
            </div>
          )}
        </form>

        <aside className="space-y-6">
          <div className="surface-card p-5">
            <div className="flex items-center gap-2">
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent-foreground">
                <Lock className="size-4" />
              </span>
              <h2 className="text-base font-bold">Este horário fica bloqueado</h2>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Ao salvar, o horário das <strong className="text-foreground">{time}</strong> deixa de
              aparecer na página pública para o profissional escolhido — assim ninguém agenda em cima
              do seu cliente.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Os outros profissionais continuam livres no mesmo horário.
            </p>
          </div>

          <div className="surface-card p-5">
            <h2 className="text-base font-bold">Resumo</h2>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Serviço</dt>
                <dd className="text-right font-medium">{service.name}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Duração</dt>
                <dd className="font-medium">{service.durationMin} min</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Valor</dt>
                <dd className="font-medium">{brl(service.price)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Tolerância</dt>
                <dd className="font-medium">{business.toleranceMin} min</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </PainelShell>
  );
}
