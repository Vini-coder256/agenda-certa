import { createFileRoute } from "@tanstack/react-router";
import { Camera, Info, Plus, Users } from "lucide-react";
import { useState } from "react";

import { PainelShell } from "@/components/painel/painel-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { getService, professionals as seedPros, services, type Professional } from "@/lib/mock";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/painel/profissionais")({
  head: () => ({
    meta: [
      { title: "Profissionais da equipe | Agenda Certa" },
      {
        name: "description",
        content:
          "Cadastre os profissionais do seu negócio, defina quais serviços cada um realiza e controle a agenda de todos em um painel.",
      },
      { property: "og:title", content: "Profissionais da equipe | Agenda Certa" },
      {
        property: "og:description",
        content: "Com dois ou mais profissionais ativos, o cliente escolhe com quem quer agendar.",
      },
    ],
  }),
  component: Profissionais,
});

function Profissionais() {
  const [list, setList] = useState<Professional[]>(seedPros);
  const [showForm, setShowForm] = useState(false);

  const toggle = (id: string) =>
    setList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: p.status === "ativo" ? "inativo" : "ativo" } : p)),
    );

  const activeCount = list.filter((p) => p.status === "ativo").length;

  return (
    <PainelShell
      title="Profissionais"
      subtitle="Quem atende no seu negócio — tudo controlado por você"
      action={
        <Button onClick={() => setShowForm((v) => !v)}>
          <Plus className="mr-1 size-4" /> Novo profissional
        </Button>
      }
    >
      <div className="surface-card flex items-start gap-3 border-primary/30 bg-primary-soft/60 p-5">
        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
          <Info className="size-4" />
        </span>
        <div className="min-w-0 text-sm">
          <p className="font-semibold">
            {activeCount <= 1
              ? "Você tem 1 profissional ativo: a etapa “Escolha o profissional” fica escondida."
              : `Você tem ${activeCount} profissionais ativos: o cliente vai escolher com quem agendar.`}
          </p>
          <p className="mt-1 text-muted-foreground">
            Negócios com apenas um profissional ativo não mostram essa etapa na página pública — o
            fluxo do cliente fica mais curto. Os horários sempre respeitam a agenda de cada
            profissional.
          </p>
        </div>
      </div>

      {showForm && (
        <form
          className="surface-card grid gap-4 p-5 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            setShowForm(false);
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="p-nome">Nome</Label>
            <Input id="p-nome" placeholder="Ex.: Ana Souza" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="p-foto">Foto (opcional)</Label>
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" className="w-full justify-start">
                <Camera className="mr-2 size-4" /> Escolher imagem
              </Button>
            </div>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Serviços que realiza</Label>
            <div className="flex flex-wrap gap-2">
              {services.map((s) => (
                <label
                  key={s.id}
                  className="flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-sm hover:bg-muted"
                >
                  <input type="checkbox" className="accent-primary" defaultChecked={s.status === "ativo"} />
                  {s.name}
                </label>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3 sm:col-span-2">
            <Switch id="p-ativo" defaultChecked />
            <Label htmlFor="p-ativo">Profissional ativo</Label>
          </div>
          <div className="flex gap-3 sm:col-span-2">
            <Button type="submit">Salvar profissional</Button>
            <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
              Cancelar
            </Button>
          </div>
        </form>
      )}

      {(["ativo", "inativo"] as const).map((status) => (
        <section key={status} className="space-y-3">
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            <Users className="size-4" /> {status === "ativo" ? "Ativos" : "Inativos"}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {list
              .filter((p) => p.status === status)
              .map((p) => (
                <article
                  key={p.id}
                  className={cn("surface-card p-5", status === "inativo" && "opacity-70")}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid size-12 shrink-0 place-items-center rounded-full bg-primary-soft font-display text-sm font-bold text-primary">
                      {p.initials}
                    </span>
                    <div className="min-w-0">
                      <h3 className="truncate text-base font-bold">{p.name}</h3>
                      <p className="truncate text-xs text-muted-foreground">{p.role}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {p.serviceIds.map((id) => (
                      <span
                        key={id}
                        className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                      >
                        {getService(id).name}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center gap-2 border-t pt-4">
                    <Button size="sm" variant="outline">
                      Editar
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => toggle(p.id)}>
                      {p.status === "ativo" ? "Desativar" : "Ativar"}
                    </Button>
                  </div>
                </article>
              ))}
          </div>
        </section>
      ))}
    </PainelShell>
  );
}
