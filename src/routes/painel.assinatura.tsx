import { createFileRoute } from "@tanstack/react-router";
import { Check, Sparkles } from "lucide-react";
import { useState } from "react";

import { PainelShell } from "@/components/painel/painel-shell";
import { Button } from "@/components/ui/button";
import { brl, plans, trial } from "@/lib/mock";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/painel/assinatura")({
  head: () => ({
    meta: [
      { title: "Assinatura e teste grátis | Agenda Certa" },
      {
        name: "description",
        content:
          "15 dias grátis para testar. Depois escolha o plano Essencial de R$39/mês ou Equipe de R$49/mês.",
      },
      { property: "og:title", content: "Assinatura e teste grátis | Agenda Certa" },
      {
        property: "og:description",
        content: "Veja quantos dias de teste restam e escolha o plano ideal para o seu negócio.",
      },
    ],
  }),
  component: Assinatura,
});

function Assinatura() {
  const [selected, setSelected] = useState("equipe");
  const usedPct = ((trial.totalDays - trial.daysLeft) / trial.totalDays) * 100;

  return (
    <PainelShell title="Assinatura" subtitle="Seu teste grátis e os planos disponíveis">
      <section className="surface-card gradient-hero overflow-hidden p-6 text-primary-foreground">
        <div className="flex flex-wrap items-center gap-2">
          <Sparkles className="size-5 shrink-0" />
          <p className="text-sm font-semibold uppercase tracking-wide opacity-90">
            Teste grátis de {trial.totalDays} dias
          </p>
        </div>
        <p className="mt-3 font-display text-3xl font-bold sm:text-4xl">
          Faltam {trial.daysLeft} dias
        </p>
        <p className="mt-1 text-sm opacity-90">
          Começou em {trial.startedAt} · termina em {trial.endsAt}
        </p>
        <div className="mt-4 h-2 w-full max-w-md overflow-hidden rounded-full bg-primary-foreground/25">
          <div className="h-full rounded-full bg-primary-foreground" style={{ width: `${usedPct}%` }} />
        </div>
        <p className="mt-3 text-xs opacity-80">
          Nenhuma cobrança será feita agora — este é um protótipo, sem pagamento real.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {plans.map((p) => (
          <article
            key={p.id}
            className={cn(
              "surface-card flex flex-col p-6 transition-shadow",
              selected === p.id && "border-primary shadow-lift",
            )}
          >
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
              <div className="min-w-0">
                <h2 className="truncate text-lg font-bold">{p.name}</h2>
                <p className="text-sm text-muted-foreground">{p.description}</p>
              </div>
              {p.highlight && (
                <span className="shrink-0 rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-semibold text-accent-foreground">
                  Mais escolhido
                </span>
              )}
            </div>

            <p className="mt-5 font-display text-3xl font-bold">
              {brl(p.price)}
              <span className="text-sm font-medium text-muted-foreground">/mês</span>
            </p>

            <ul className="mt-5 space-y-2 text-sm">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-success" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 space-y-2">
              <Button
                className="w-full"
                variant={selected === p.id ? "default" : "outline"}
                onClick={() => setSelected(p.id)}
              >
                Assinar agora
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Cancele quando quiser · sem fidelidade
              </p>
            </div>
          </article>
        ))}
      </section>

      <section className="surface-card p-5">
        <h2 className="text-base font-bold">Perguntas rápidas</h2>
        <dl className="mt-3 space-y-3 text-sm">
          <div>
            <dt className="font-medium">O que acontece quando o teste acabar?</dt>
            <dd className="text-muted-foreground">
              Sua página pública fica pausada até você escolher um plano. Nenhum dado é apagado.
            </dd>
          </div>
          <div>
            <dt className="font-medium">Posso trocar de plano depois?</dt>
            <dd className="text-muted-foreground">
              Sim. Se contratar mais profissionais, você muda para o plano Equipe a qualquer momento.
            </dd>
          </div>
        </dl>
      </section>
    </PainelShell>
  );
}
