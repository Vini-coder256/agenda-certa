import { cn } from "@/lib/utils";
import { statusLabels, type AppointmentOrigin, type AppointmentStatus } from "@/lib/mock";

const statusStyles: Record<AppointmentStatus, string> = {
  agendado: "bg-info-soft text-info",
  concluido: "bg-success-soft text-success",
  nao_compareceu: "bg-destructive-soft text-destructive",
  cancelado: "bg-muted text-muted-foreground",
};

export function StatusBadge({ status, className }: { status: AppointmentStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        statusStyles[status],
        className,
      )}
    >
      {statusLabels[status]}
    </span>
  );
}

export function OriginBadge({ origin }: { origin: AppointmentOrigin }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        origin === "online"
          ? "border-primary/25 bg-primary-soft text-primary"
          : "border-accent/40 bg-accent-soft text-accent-foreground",
      )}
    >
      {origin === "online" ? "Online" : "Manual"}
    </span>
  );
}
