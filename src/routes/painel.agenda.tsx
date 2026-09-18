import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, Ban, Check, Clock, Lock, Pencil, UserX } from "lucide-react";
import { useMemo, useState } from "react";

import { PainelShell } from "@/components/painel/painel-shell";
import { OriginBadge, StatusBadge } from "@/components/painel/status-badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  appointments as seedAppointments,
  activeProfessionals,
  blockReasons,
  brl,
  business,
  getProfessional,
  getService,
  nextDays,
  statusLabels,
  timeBlocks as seedBlocks,
  type Appointment,
  type AppointmentStatus,
  type TimeBlock,
} from "@/lib/mock";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/painel/agenda")({
  head: () => ({
    meta: [
      { title: "Agenda do dia | Agenda Certa" },
      {
        name: "description",
        content:
          "Veja a agenda do dia com resumo, filtros, bloqueios de horário e ações de concluído, falta ou cancelamento.",
      },
      { property: "og:title", content: "Agenda do dia | Agenda Certa" },
      {
        property: "og:description",
        content:
          "Controle os atendimentos do dia por profissional, com aviso de tolerância de atraso.",
      },
    ],
  }),
  component: Agenda,
});

type RangeFilter = "hoje" | "amanha" | "semana" | "data";
type StatusFilter = "todos" | AppointmentStatus;

const rangeLabels: Record<RangeFilter, string> = {
  hoje: "Hoje",
  amanha: "Amanhã",
  semana: "Esta semana",
  data: "Escolher data",
};

function Agenda() {
  const [items, setItems] = useState<Appointment[]>(seedAppointments);
  const [blocks, setBlocks] = useState<TimeBlock[]>(seedBlocks);
  const [proFilter, setProFilter] = useState<string>("todos");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("todos");
  const [range, setRange] = useState<RangeFilter>("hoje");
  const [customDate, setCustomDate] = useState(nextDays[0]!.date);
  const [dayIndex, setDayIndex] = useState(0);

  const [editing, setEditing] = useState<Appointment | null>(null);
  const [editForm, setEditForm] = useState({ clientName: "", whatsapp: "", note: "" });

  const [blockOpen, setBlockOpen] = useState(false);
  const [blockForm, setBlockForm] = useState({
    date: nextDays[0]!.date,
    start: "12:00",
    end: "13:00",
    professionalId: "todos",
    reason: "Folga",
  });

  const update = (id: string, status: AppointmentStatus) =>
    setItems((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));

  const openEdit = (a: Appointment) => {
    setEditing(a);
    setEditForm({ clientName: a.clientName, whatsapp: a.whatsapp, note: a.note ?? "" });
  };

  const saveEdit = () => {
    if (!editing) return;
    setItems((prev) =>
      prev.map((a) => {
        if (a.id !== editing.id) return a;

        const updated: Appointment = {
          ...a,
          clientName: editForm.clientName,
          whatsapp: editForm.whatsapp,
        };

        if (editForm.note) updated.note = editForm.note;
        else delete updated.note;

        return updated;
      }),
    );
    setEditing(null);
  };

  const saveBlock = () => {
    setBlocks((prev) => [
      ...prev,
      {
        id: `bl${prev.length + 1}`,
        date: blockForm.date,
        start: blockForm.start,
        end: blockForm.end,
        professionalId: blockForm.professionalId === "todos" ? null : blockForm.professionalId,
        reason: blockForm.reason,
      },
    ]);
    setBlockOpen(false);
  };

  const visible = items.filter(
    (a) =>
      (proFilter === "todos" || a.professionalId === proFilter) &&
      (statusFilter === "todos" || a.status === statusFilter),
  );

  const summary = useMemo(() => {
    const scoped = items.filter((a) => proFilter === "todos" || a.professionalId === proFilter);
    const by = (s: AppointmentStatus) => scoped.filter((a) => a.status === s);
    const sum = (list: Appointment[]) => list.reduce((t, a) => t + a.price, 0);
    return {
      total: scoped.filter((a) => a.status !== "cancelado").length,
      concluidos: by("concluido").length,
      faltas: by("nao_compareceu").length,
      cancelados: by("cancelado").length,
      previsto: sum([...by("agendado"), ...by("concluido")]),
      real: sum(by("concluido")),
      perda: sum(by("nao_compareceu")),
    };
  }, [items, proFilter]);

  const visibleBlocks = blocks.filter(
    (b) => proFilter === "todos" || b.professionalId === null || b.professionalId === proFilter,
  );

  return (
    <PainelShell
      title="Agenda"
      subtitle="Agendamentos online e manuais no mesmo lugar"
      action={
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setBlockOpen(true)}>
            <Lock className="mr-1 size-4" /> Bloquear horário
          </Button>
          <Link to="/painel/novo-agendamento">
            <Button>Agendamento manual</Button>
          </Link>
        </div>
      }
    >
      {/* Resumo do dia */}
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="surface-card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Agendamentos
          </p>
          <p className="mt-1 font-display text-2xl font-bold">{summary.total}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {summary.concluidos} concluídos · {summary.faltas} faltas · {summary.cancelados}{" "}
            cancelados
          </p>
        </div>
        <div className="surface-card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Ganho previsto
          </p>
          <p className="mt-1 font-display text-2xl font-bold">{brl(summary.previsto)}</p>
          <p className="mt-1 text-xs text-muted-foreground">Agendados + concluídos</p>
        </div>
        <div className="surface-card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Ganho real
          </p>
          <p className="mt-1 font-display text-2xl font-bold text-success">{brl(summary.real)}</p>
          <p className="mt-1 text-xs text-muted-foreground">Somente concluídos</p>
        </div>
        <div className="surface-card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Perda por falta
          </p>
          <p className="mt-1 font-display text-2xl font-bold text-destructive">
            {brl(summary.perda)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Cancelados não entram nos ganhos</p>
        </div>
      </section>

      {/* Filtros */}
      <div className="surface-card p-4">
        <div className="flex flex-wrap gap-2">
          {(Object.keys(rangeLabels) as RangeFilter[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={cn(
                "rounded-full border px-3 py-1 text-sm transition-colors",
                range === r ? "border-primary bg-primary-soft text-primary" : "hover:bg-muted",
              )}
            >
              {rangeLabels[r]}
            </button>
          ))}
          {range === "data" && (
            <Input
              type="date"
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
              className="h-8 w-40"
            />
          )}
        </div>

        {range !== "data" && (
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
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
        )}

        <div className="mt-4 flex flex-wrap items-center gap-2 border-t pt-4">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Profissional
          </span>
          <button
            onClick={() => setProFilter("todos")}
            className={cn(
              "rounded-full border px-3 py-1 text-sm transition-colors",
              proFilter === "todos"
                ? "border-primary bg-primary-soft text-primary"
                : "hover:bg-muted",
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
                proFilter === p.id
                  ? "border-primary bg-primary-soft text-primary"
                  : "hover:bg-muted",
              )}
            >
              {p.name.split(" ")[0]}
            </button>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Status
          </span>
          {(
            ["todos", "agendado", "concluido", "nao_compareceu", "cancelado"] as StatusFilter[]
          ).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                "rounded-full border px-3 py-1 text-sm transition-colors",
                statusFilter === s
                  ? "border-primary bg-primary-soft text-primary"
                  : "hover:bg-muted",
              )}
            >
              {s === "todos" ? "Todos" : statusLabels[s as AppointmentStatus]}
            </button>
          ))}
        </div>
      </div>

      {/* Bloqueios */}
      {visibleBlocks.length > 0 && (
        <section className="surface-card p-4">
          <h2 className="text-base font-bold">Horários bloqueados</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Bloqueios não aparecem para o cliente — esses horários simplesmente ficam indisponíveis.
          </p>
          <ul className="mt-3 space-y-2">
            {visibleBlocks.map((b) => (
              <li
                key={b.id}
                className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl border border-dashed p-3 text-sm"
              >
                <span className="flex items-center gap-1 font-semibold">
                  <Lock className="size-4 text-muted-foreground" />
                  {b.start}–{b.end}
                </span>
                <span className="text-muted-foreground">{b.reason ?? "Bloqueio"}</span>
                <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
                  {b.professionalId ? getProfessional(b.professionalId).name : "Negócio inteiro"}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="ml-auto"
                  onClick={() => setBlocks((prev) => prev.filter((x) => x.id !== b.id))}
                >
                  Remover
                </Button>
              </li>
            ))}
          </ul>
        </section>
      )}

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
                    {service.name} · {service.durationMin} min · {brl(a.price)} · com{" "}
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
                    <Button size="sm" variant="ghost" onClick={() => openEdit(a)}>
                      <Pencil className="mr-1 size-4" /> Editar
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

        {visible.length === 0 && (
          <div className="surface-card p-8 text-center text-sm text-muted-foreground">
            Nenhum agendamento com esses filtros.
          </div>
        )}
      </div>

      {/* Editar dados básicos */}
      <Dialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar dados do cliente</DialogTitle>
            <DialogDescription>
              Para mudar data, horário, serviço ou profissional, cancele este agendamento e crie um
              novo.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="e-nome">Nome do cliente</Label>
              <Input
                id="e-nome"
                value={editForm.clientName}
                onChange={(e) => setEditForm({ ...editForm, clientName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="e-zap">WhatsApp</Label>
              <Input
                id="e-zap"
                value={editForm.whatsapp}
                onChange={(e) => setEditForm({ ...editForm, whatsapp: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="e-obs">Observação</Label>
              <Textarea
                id="e-obs"
                rows={3}
                value={editForm.note}
                onChange={(e) => setEditForm({ ...editForm, note: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditing(null)}>
              Cancelar
            </Button>
            <Button onClick={saveEdit}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bloquear horário */}
      <Dialog open={blockOpen} onOpenChange={setBlockOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bloquear horário</DialogTitle>
            <DialogDescription>
              O cliente não vê o bloqueio: o horário apenas fica indisponível na sua página pública.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="bl-data">Data</Label>
              <Input
                id="bl-data"
                type="date"
                value={blockForm.date}
                onChange={(e) => setBlockForm({ ...blockForm, date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bl-ini">Início</Label>
              <Input
                id="bl-ini"
                type="time"
                step={900}
                value={blockForm.start}
                onChange={(e) => setBlockForm({ ...blockForm, start: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bl-fim">Fim</Label>
              <Input
                id="bl-fim"
                type="time"
                step={900}
                value={blockForm.end}
                onChange={(e) => setBlockForm({ ...blockForm, end: e.target.value })}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Aplicar para</Label>
              <div className="flex flex-wrap gap-2">
                {[{ id: "todos", name: "Negócio inteiro" }, ...activeProfessionals].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setBlockForm({ ...blockForm, professionalId: p.id })}
                    className={cn(
                      "rounded-full border px-3 py-1 text-sm transition-colors",
                      blockForm.professionalId === p.id
                        ? "border-primary bg-primary-soft text-primary"
                        : "hover:bg-muted",
                    )}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Motivo (opcional)</Label>
              <div className="flex flex-wrap gap-2">
                {blockReasons.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setBlockForm({ ...blockForm, reason: r })}
                    className={cn(
                      "rounded-full border px-3 py-1 text-sm transition-colors",
                      blockForm.reason === r
                        ? "border-primary bg-primary-soft text-primary"
                        : "hover:bg-muted",
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setBlockOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={saveBlock}>Bloquear</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PainelShell>
  );
}

