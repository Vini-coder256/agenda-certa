import { createFileRoute } from "@tanstack/react-router";
import { Copy, Link2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import { PainelShell } from "@/components/painel/painel-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { business } from "@/lib/mock";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/painel/configuracoes")({
  head: () => ({
    meta: [
      { title: "Configurações do negócio | Agenda Certa" },
      {
        name: "description",
        content:
          "Edite nome, descrição, link público, WhatsApp, endereço, horários de funcionamento e tolerância de atraso.",
      },
      { property: "og:title", content: "Configurações do negócio | Agenda Certa" },
      {
        property: "og:description",
        content: "Ajuste os dados que o cliente vê na sua página pública de agendamento.",
      },
    ],
  }),
  component: Configuracoes,
});

type Period = {
  from: string;
  to: string;
};

type DayHours = {
  day: string;
  active: boolean;
  periods: Period[];
};

const initialHours: DayHours[] = business.hours.map((hours, index) => ({
  day: hours.day,
  active: hours.active,
  periods: hours.active
    ? index === 0
      ? [
          { from: "09:00", to: "12:00" },
          { from: "13:00", to: "18:00" },
        ]
      : [{ from: hours.open, to: hours.close }]
    : [],
}));

function Configuracoes() {
  const [hours, setHours] = useState<DayHours[]>(initialHours);
  const [tolerance, setTolerance] = useState(String(business.toleranceMin || 15));
  const [copied, setCopied] = useState(false);

  const toleranceNumber = Number(tolerance);
  const toleranceTooLow = tolerance !== "" && toleranceNumber < 5;
  const toleranceTooHigh = tolerance !== "" && toleranceNumber > 60;

  const updatePeriod = (dayIndex: number, periodIndex: number, patch: Partial<Period>) =>
    setHours((current) =>
      current.map((day, index) =>
        index === dayIndex
          ? {
              ...day,
              periods: day.periods.map((period, pIndex) =>
                pIndex === periodIndex ? { ...period, ...patch } : period,
              ),
            }
          : day,
      ),
    );

  const addPeriod = (dayIndex: number) =>
    setHours((current) =>
      current.map((day, index) =>
        index === dayIndex
          ? { ...day, periods: [...day.periods, { from: "13:00", to: "18:00" }] }
          : day,
      ),
    );

  const removePeriod = (dayIndex: number, periodIndex: number) =>
    setHours((current) =>
      current.map((day, index) =>
        index === dayIndex && day.periods.length > 1
          ? { ...day, periods: day.periods.filter((_, pIndex) => pIndex !== periodIndex) }
          : day,
      ),
    );

  return (
    <PainelShell title="Configurações do negócio" subtitle="Dados que aparecem para o seu cliente">
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="surface-card space-y-4 p-5">
          <h2 className="text-base font-bold">Identidade</h2>
          <div className="space-y-2">
            <Label htmlFor="b-nome">Nome do negócio</Label>
            <Input id="b-nome" defaultValue={business.name} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="b-desc">Descrição</Label>
            <Textarea id="b-desc" rows={3} defaultValue={business.description} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="b-link">Link público</Label>
            <div className="flex items-center gap-2">
              <span className="hidden shrink-0 items-center gap-1 rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground sm:flex">
                <Link2 className="size-3.5" /> agendacerta.app/b/
              </span>
              <Input id="b-link" defaultValue={business.slug} className="min-w-0" />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setCopied(true)}
                aria-label="Copiar link"
              >
                <Copy className="size-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {copied
                ? "Link copiado! (protótipo)"
                : "Esse é o endereço que você divulga aos clientes."}
            </p>
          </div>
        </section>

        <section className="surface-card space-y-4 p-5">
          <h2 className="text-base font-bold">Contato e endereço</h2>
          <div className="space-y-2">
            <Label htmlFor="b-zap">WhatsApp</Label>
            <Input id="b-zap" defaultValue={business.whatsapp} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="b-end">Endereço</Label>
            <Textarea id="b-end" rows={2} defaultValue={business.address} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="b-tol">Tolerância padrão (minutos)</Label>
            <Input
              id="b-tol"
              type="number"
              inputMode="numeric"
              min={5}
              max={60}
              step={1}
              value={tolerance}
              aria-invalid={toleranceTooLow || toleranceTooHigh}
              onChange={(event) => setTolerance(event.target.value.replace(/\D/g, ""))}
            />
            <p className="text-xs text-muted-foreground">Use um valor entre 5 e 60 minutos.</p>
            {toleranceTooLow && (
              <p className="text-xs font-medium text-destructive">
                A tolerância mínima é de 5 minutos.
              </p>
            )}
            {toleranceTooHigh && (
              <p className="text-xs font-medium text-destructive">
                A tolerância máxima é de 60 minutos.
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              A tolerância afeta apenas avisos e destaque de atraso. O sistema não cancela
              automaticamente. Você decide se marca como não compareceu.
            </p>
          </div>
        </section>

        <section className="surface-card p-5 lg:col-span-2">
          <h2 className="text-base font-bold">Horários de funcionamento</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Pausas como almoço não aparecem para o cliente. Esses horários simplesmente ficam
            indisponíveis.
          </p>
          <div className="mt-4 space-y-3">
            {hours.map((h, i) => (
              <div
                key={h.day}
                className={cn("rounded-xl border p-4", !h.active && "bg-muted/40 opacity-60")}
              >
                <div className="flex items-center gap-3">
                  <Switch
                    checked={h.active}
                    onCheckedChange={(v) =>
                      setHours((current) =>
                        current.map((day, index) =>
                          index === i
                            ? {
                                ...day,
                                active: v,
                                periods:
                                  v && day.periods.length === 0
                                    ? [{ from: "09:00", to: "18:00" }]
                                    : day.periods,
                              }
                            : day,
                        ),
                      )
                    }
                  />
                  <span className="truncate font-medium">{h.day}</span>
                  {!h.active && <span className="text-xs text-muted-foreground">Fechado</span>}
                </div>

                {h.active && (
                  <div className="mt-4 space-y-3">
                    {h.periods.map((period, periodIndex) => (
                      <div
                        key={`${h.day}-${periodIndex}`}
                        className="flex flex-wrap items-center gap-2"
                      >
                        <Input
                          type="time"
                          step={900}
                          value={period.from}
                          onChange={(event) =>
                            updatePeriod(i, periodIndex, { from: event.target.value })
                          }
                          className="w-32"
                        />
                        <span className="text-sm text-muted-foreground">às</span>
                        <Input
                          type="time"
                          step={900}
                          value={period.to}
                          onChange={(event) =>
                            updatePeriod(i, periodIndex, { to: event.target.value })
                          }
                          className="w-32"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          disabled={h.periods.length === 1}
                          onClick={() => removePeriod(i, periodIndex)}
                        >
                          <Trash2 className="mr-1 size-4" /> Remover período
                        </Button>
                      </div>
                    ))}

                    <Button type="button" variant="outline" size="sm" onClick={() => addPeriod(i)}>
                      <Plus className="mr-1 size-4" /> Adicionar período
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
          <Button className="mt-5">Salvar configurações</Button>
        </section>
      </div>
    </PainelShell>
  );
}

