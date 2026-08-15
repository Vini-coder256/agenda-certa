import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Info, Lock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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
          "Adicione um agendamento manual (WhatsApp, telefone ou balcão) e bloqueie o horário na página pública.",
      },
      { property: "og:title", content: "Novo agendamento manual | Agenda Certa" },
      {
        property: "og:description",
        content: "Cadastre atendimentos que chegaram fora do link público sem perder o controle da agenda.",
      },
    ],
  }),
  component: NovoAgendamento;
});

function NovoAgendamento() {
  return null;
}
