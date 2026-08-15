import { createFileRoute } from "@tanstack/react-router";
import { Copy, Link2 } from "lucide-react";
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

function Configuracoes() {
  const [hours, setHours] = useState(business.hours);
  const [copied, setCopied] = useState(false);

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
              {copied ? "Link copiado! (protótipo)" : "Esse é o endereço que você divulga aos clientes."}
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
            <Input id="b-tol" type="number" defaultValue={business.toleranceMin} />
            <p className="text-xs text-muted-foreground">
              Usada no aviso da página pública e no alerta de atraso da agenda.
            </p>
          </div>
        </section>

        <section className="surface-card p-5 lg:col-span-2">
          <h2 className="text-base font-bold">Horários de funcionamento</h2>
          <div className="mt-4 space-y-3">
            {hours.map((h, i) => (
              <div
                key={h.day}
                className={cn(
                  "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border p-3 sm:flex sm:justify-between",
                  !h.active && "opacity-60",
                )}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <Switch
                    checked={h.active}
                    onCheckedChange={(v) =>
                      setHours((prev) => prev.map((x, xi) => (xi === i ? { ...x, active: v } : x)))
                    }
                  />
                  <span className="truncate font-medium">{h.day}</span>
                </div>
                <div className="col-span-2 flex flex-wrap items-center gap-2 sm:col-auto">
                  <Input defaultValue={h.open} className="w-24" />
                  <span className="text-muted-foreground">às</span>
                  <Input defaultValue={h.close} className="w-24" />
                </div>
              </div>
            ))}
          </div>
          <Button className="mt-5">Salvar configurações</Button>
        </section>
      </div>
    </PainelShell>
  );
}
