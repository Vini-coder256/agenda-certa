/**
 * Estado local do onboarding (protótipo — apenas localStorage, sem backend).
 */
import { useCallback, useEffect, useState } from "react";

export type SetupPeriod = { from: string; to: string };
export type SetupDay = { day: string; active: boolean; periods: SetupPeriod[] };
export type SetupService = { name: string; price: string; durationMin: string };
export type SetupProfessional = { name: string; role: string };

export type BusinessSetup = {
  owner: { name: string; email: string; whatsapp: string };
  name: string;
  category: string;
  description: string;
  whatsapp: string;
  address: string;
  slug: string;
  days: SetupDay[];
  services: SetupService[];
  teamMode: "solo" | "equipe";
  professionals: SetupProfessional[];
  completedAt: string;
};

export const businessCategories = [
  "Barbearia",
  "Salão de beleza",
  "Manicure e pedicure",
  "Estética e bem-estar",
  "Personal trainer",
  "Aulas particulares",
  "Outro",
];

export const weekdayNames = [
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
  "Domingo",
];

export const defaultDays = (): SetupDay[] =>
  weekdayNames.map((day) => ({
    day,
    active: day !== "Domingo",
    periods: [
      { from: "09:00", to: "12:00" },
      { from: "13:00", to: "18:00" },
    ],
  }));

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const KEY = "agenda-certa:setup";

function read(): BusinessSetup | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as BusinessSetup) : null;
  } catch {
    return null;
  }
}

export function saveSetup(setup: BusinessSetup) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(setup));
  window.dispatchEvent(new Event("agenda-certa:setup"));
}

export function clearSetup() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("agenda-certa:setup"));
}

/** null = ainda carregando / SSR; undefined nunca é retornado. */
export function useSetup() {
  const [state, setState] = useState<{ ready: boolean; setup: BusinessSetup | null }>({
    ready: false,
    setup: null,
  });

  const sync = useCallback(() => setState({ ready: true, setup: read() }), []);

  useEffect(() => {
    sync();
    window.addEventListener("agenda-certa:setup", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("agenda-certa:setup", sync);
      window.removeEventListener("storage", sync);
    };
  }, [sync]);

  return state;
}
