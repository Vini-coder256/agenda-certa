import { Link } from "@tanstack/react-router";
import {
  CalendarDays,
  CreditCard,
  ExternalLink,
  LayoutDashboard,
  Menu,
  PlusCircle,
  Scissors,
  Settings,
  Users,
} from "lucide-react";
import { useState, type ReactNode } from "react";

import { business, trial } from "@/lib/mock";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const nav = [
  { to: "/painel", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/painel/agenda", label: "Agenda", icon: CalendarDays },
  { to: "/painel/novo-agendamento", label: "Novo agendamento", icon: PlusCircle },
  { to: "/painel/servicos", label: "Serviços", icon: Scissors },
  { to: "/painel/profissionais", label: "Profissionais", icon: Users },
  { to: "/painel/configuracoes", label: "Configurações", icon: Settings },
  { to: "/painel/assinatura", label: "Assinatura", icon: CreditCard },
] as const;

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1">
      {nav.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          activeOptions={{ exact: "exact" in item ? item.exact : false }}
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          activeProps={{
            className:
              "bg-sidebar-accent text-sidebar-accent-foreground shadow-[inset_3px_0_0_0_var(--color-sidebar-primary)]",
          }}
        >
          <item.icon className="size-4 shrink-0" />
          <span className="truncate">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col gap-6 bg-sidebar p-4">
      <div className="flex min-w-0 items-center gap-3 px-1 pt-1">
        <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-sidebar-primary font-display text-base font-bold text-sidebar-primary-foreground">
          AC
        </div>
        <div className="min-w-0">
          <p className="truncate font-display text-sm font-bold text-sidebar-accent-foreground">
            Agenda Certa
          </p>
          <p className="truncate text-xs text-sidebar-foreground/70">{business.name}</p>
        </div>
      </div>

      <NavLinks onNavigate={onNavigate} />

      <div className="mt-auto space-y-3">
        <div className="rounded-xl border border-sidebar-border bg-sidebar-accent/60 p-3">
          <p className="text-xs font-semibold text-sidebar-accent-foreground">
            Teste grátis — {trial.daysLeft} dias restantes
          </p>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-sidebar-border">
            <div
              className="h-full rounded-full bg-sidebar-primary"
              style={{ width: `${((trial.totalDays - trial.daysLeft) / trial.totalDays) * 100}%` }}
            />
          </div>
          <Link to="/painel/assinatura" onClick={onNavigate}>
            <Button variant="secondary" size="sm" className="mt-3 w-full">
              Assinar agora
            </Button>
          </Link>
        </div>
        <Link
          to="/b/$slug"
          params={{ slug: business.slug }}
          onClick={onNavigate}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-sidebar-foreground/70 transition-colors hover:text-sidebar-accent-foreground"
        >
          <ExternalLink className="size-3.5 shrink-0" />
          <span className="truncate">Ver página pública</span>
        </Link>
      </div>
    </div>
  );
}

export function PainelShell({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[16rem_minmax(0,1fr)]">
      <aside className="hidden lg:block lg:sticky lg:top-0 lg:h-screen">
        <SidebarContent />
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Fechar menu"
            className="absolute inset-0 bg-foreground/40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] shadow-lift">
            <SidebarContent onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b bg-background/90 px-4 py-3 backdrop-blur lg:hidden">
          <Button variant="ghost" size="icon" onClick={() => setOpen(true)} aria-label="Abrir menu">
            <Menu className="size-5" />
          </Button>
          <p className="min-w-0 truncate font-display text-base font-bold">Agenda Certa</p>
        </header>

        <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:py-10">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:flex-wrap sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h1 className="truncate text-2xl font-bold sm:text-3xl">{title}</h1>
              {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
            </div>
            {action && <div className="shrink-0">{action}</div>}
          </div>
          <div className={cn("mt-6 space-y-6")}>{children}</div>
        </main>
      </div>
    </div>
  );
}
