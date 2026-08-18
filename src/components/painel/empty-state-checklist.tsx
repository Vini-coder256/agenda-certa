import { Link } from "@tanstack/react-router";
import { Clock, Scissors, Share2, Users } from "lucide-react";

import { Button } from "@/components/ui/button";

const items = [
  {
    icon: Scissors,
    title: "Cadastre seu primeiro serviço",
    text: "Nome, preço e duração. É isso que o cliente escolhe na sua página.",
    to: "/painel/servicos",
    cta: "Cadastrar serviço",
  },
  {
    icon: Clock,
    title: "Configure seus períodos de atendimento",
    text: "Defina os dias e horários, com mais de um período por dia se precisar.",
    to: "/painel/configuracoes",
    cta: "Definir horários",
  },
  {
    icon: Users,
    title: "Adicione profissionais, se houver",
    text: "Trabalha sozinho? Já está pronto. Tem equipe? Cada um com sua agenda.",
    to: "/painel/profissionais",
    cta: "Gerenciar equipe",
  },
  {
    icon: Share2,
    title: "Divulgue seu link público",
    text: "Mande no WhatsApp e nas redes para receber agendamentos sozinho.",
    to: "/painel/configuracoes",
    cta: "Ver meu link",
  },
] as const;

export function EmptyStateChecklist() {
  return (
    <section className="space-y-4">
      <div className="rounded-xl border border-info/40 bg-info-soft p-4 text-sm text-info">
        Seu negócio ainda não está configurado. Complete os passos abaixo — leva menos de 5 minutos.
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <article key={item.title} className="surface-card flex flex-col p-5">
            <span className="grid size-10 place-items-center rounded-xl bg-primary-soft text-primary">
              <item.icon className="size-5" />
            </span>
            <h2 className="mt-4 text-base font-bold">{item.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{item.text}</p>
            <Link to={item.to} className="mt-4">
              <Button variant="outline" size="sm">
                {item.cta}
              </Button>
            </Link>
          </article>
        ))}
      </div>

      <div className="surface-card grid gap-3 p-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
        <div className="min-w-0">
          <h2 className="text-base font-bold">Prefere configurar tudo de uma vez?</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Passe pelo guia inicial e cadastre negócio, horários, serviços e equipe em sequência.
          </p>
        </div>
        <Link to="/onboarding" className="shrink-0">
          <Button>Abrir guia inicial</Button>
        </Link>
      </div>
    </section>
  );
}
