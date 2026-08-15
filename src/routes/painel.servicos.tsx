import { createFileRoute } from "@tanstack/react-router";
import { Clock, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import { PainelShell } from "@/components/painel/painel-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { brl, services as seedServices, type Service } from "@/lib/mock";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/painel/servicos")({
  head: () => ({
    meta: [
      { title: "Serviços e preços | Agenda Certa" },
      {
        name: "description",
        content:
          "Cadastre os serviços do seu negócio com preço, duração e status para o cliente escolher na página pública.",
      },
      { property: "og:title", content: "Serviços e preços | Agenda Certa" },
      {
        property: "og:description",
        content: "Defina nome, descrição, preço e duração de cada serviço em minutos.",
      },
    ],
  }),
  component: Servicos,
});

function Servicos() {
  const [list, setList] = useState<Service[]>(seedServices);
  const [showForm, setShowForm] = useState(false);

  const toggle = (id: string) =>
    setList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: s.status === "ativo" ? "inativo" : "ativo" } : s)),
    );

  return (
    <PainelShell
      title="Serviços"
      subtitle="O que você oferece, quanto custa e quanto tempo leva"
      action={
        <Button onClick={() => setShowForm((v) => !v)}>
          <Plus className="mr-1 size-4" /> Novo serviço
        </Button>
      }
    >
      {showForm && (
        <form
          className="surface-card grid gap-4 p-5 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            setShowForm(false);
          }}
        >
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="s-nome">Nome do serviço</Label>
            <Input id="s-nome" placeholder="Ex.: Corte infantil" />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="s-desc">Descrição</Label>
            <Textarea id="s-desc" rows={2} placeholder="Explique rapidamente o que está incluído." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="s-preco">Preço (R$)</Label>
            <Input id="s-preco" type="number" placeholder="40" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="s-dur">Duração (minutos)</Label>
            <Input id="s-dur" type="number" placeholder="40" />
          </div>
          <div className="flex items-center gap-3 sm:col-span-2">
            <Switch id="s-ativo" defaultChecked />
            <Label htmlFor="s-ativo">Serviço ativo na página pública</Label>
          </div>
          <div className="flex gap-3 sm:col-span-2">
            <Button type="submit">Salvar serviço</Button>
            <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
              Cancelar
            </Button>
          </div>
        </form>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {list.map((s) => (
          <article
            key={s.id}
            className={cn("surface-card p-5", s.status === "inativo" && "opacity-70")}
          >
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
              <div className="min-w-0">
                <h2 className="truncate text-base font-bold">{s.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{s.description}</p>
              </div>
              <span
                className={cn(
                  "shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold",
                  s.status === "ativo" ? "bg-success-soft text-success" : "bg-muted text-muted-foreground",
                )}
              >
                {s.status === "ativo" ? "Ativo" : "Inativo"}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="font-display text-xl font-bold">{brl(s.price)}</span>
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="size-4" /> {s.durationMin} min
              </span>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2 border-t pt-4">
              <Button size="sm" variant="outline">
                <Pencil className="mr-1 size-4" /> Editar
              </Button>
              <Button size="sm" variant="ghost" onClick={() => toggle(s.id)}>
                {s.status === "ativo" ? "Desativar" : "Ativar"}
              </Button>
              <Button size="sm" variant="ghost" className="text-destructive">
                <Trash2 className="size-4" />
              </Button>
            </div>
          </article>
        ))}
      </div>
    </PainelShell>
  );
}
