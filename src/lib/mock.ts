export type ServiceStatus = "ativo" | "inativo";

export type Service = {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMin: number;
  status: ServiceStatus;
};

export type Professional = {
  id: string;
  name: string;
  photo?: string;
  initials: string;
  role: string;
  serviceIds: string[];
  status: ServiceStatus;
};

export type AppointmentStatus = "agendado" | "concluido" | "nao_compareceu" | "cancelado";
export type AppointmentOrigin = "online" | "manual";

export type Appointment = {
  id: string;
  time: string;
  clientName: string;
  whatsapp: string;
  serviceId: string;
  professionalId: string;
  price: number;
  durationMin: number;
  origin: AppointmentOrigin;
  status: AppointmentStatus;
  note?: string;
  /** minutos de atraso do cliente (usado para o aviso de tolerância) */
  lateMinutes?: number;
};

export const business = {
  name: "Barbearia do Zé",
  slug: "barbearia-do-ze",
  description:
    "Barbearia de bairro com atendimento no horário marcado. Corte clássico, barba na navalha e aquele café por conta da casa.",
  whatsapp: "(11) 98877-6655",
  address: "Rua das Palmeiras, 128 — Vila Mariana, São Paulo/SP",
  toleranceMin: 15,
  hours: [
    { day: "Segunda", open: "09:00", close: "19:00", active: true },
    { day: "Terça", open: "09:00", close: "19:00", active: true },
    { day: "Quarta", open: "09:00", close: "19:00", active: true },
    { day: "Quinta", open: "09:00", close: "20:00", active: true },
    { day: "Sexta", open: "09:00", close: "20:00", active: true },
    { day: "Sábado", open: "08:00", close: "17:00", active: true },
    { day: "Domingo", open: "—", close: "—", active: false },
  ],
};

export const services: Service[] = [
  {
    id: "s1",
    name: "Corte masculino",
    description: "Máquina, tesoura e finalização com toalha quente.",
    price: 40,
    durationMin: 40,
    status: "ativo",
  },
  {
    id: "s2",
    name: "Barba",
    description: "Navalha, óleo e hidratação da pele.",
    price: 25,
    durationMin: 25,
    status: "ativo",
  },
  {
    id: "s3",
    name: "Corte + barba",
    description: "Combo completo com desconto.",
    price: 65,
    durationMin: 60,
    status: "ativo",
  },
  {
    id: "s4",
    name: "Pezinho",
    description: "Acabamento rápido entre os cortes.",
    price: 15,
    durationMin: 15,
    status: "inativo",
  },
];

export const professionals: Professional[] = [
  {
    id: "p1",
    name: "Carlos Andrade",
    initials: "CA",
    role: "Barbeiro sênior",
    serviceIds: ["s1", "s2", "s3"],
    status: "ativo",
  },
  {
    id: "p2",
    name: "João Freitas",
    initials: "JF",
    role: "Barbeiro",
    serviceIds: ["s1", "s3"],
    status: "ativo",
  },
  {
    id: "p3",
    name: "Marcos Lima",
    initials: "ML",
    role: "Barbeiro (folga)",
    serviceIds: ["s1", "s2"],
    status: "inativo",
  },
];

export const appointments: Appointment[] = [
  {
    id: "a1",
    time: "09:00",
    clientName: "Rafael Souza",
    whatsapp: "(11) 99123-4567",
    serviceId: "s1",
    professionalId: "p1",
    price: 40,
    durationMin: 40,
    origin: "online",
    status: "concluido",
  },
  {
    id: "a2",
    time: "10:00",
    clientName: "Diego Martins",
    whatsapp: "(11) 99555-1122",
    serviceId: "s3",
    professionalId: "p2",
    price: 65,
    durationMin: 60,
    origin: "manual",
    status: "concluido",
    note: "Cliente antigo, prefere tesoura.",
  },
  {
    id: "a3",
    time: "11:30",
    clientName: "Tiago Nunes",
    whatsapp: "(11) 98444-9090",
    serviceId: "s2",
    professionalId: "p1",
    price: 25,
    durationMin: 25,
    origin: "online",
    status: "nao_compareceu",
  },
  {
    id: "a4",
    time: "14:00",
    clientName: "Felipe Rocha",
    whatsapp: "(11) 97777-3131",
    serviceId: "s1",
    professionalId: "p2",
    price: 40,
    durationMin: 40,
    origin: "online",
    status: "agendado",
    lateMinutes: 18,
  },
  {
    id: "a5",
    time: "15:00",
    clientName: "Bruno Alves",
    whatsapp: "(11) 96666-4545",
    serviceId: "s3",
    professionalId: "p1",
    price: 65,
    durationMin: 60,
    origin: "manual",
    status: "agendado",
    note: "Vai trazer o filho depois.",
  },
  {
    id: "a6",
    time: "16:00",
    clientName: "Gustavo Pires",
    whatsapp: "(11) 95555-1212",
    serviceId: "s1",
    professionalId: "p1",
    price: 40,
    durationMin: 40,
    origin: "online",
    status: "agendado",
  },
  {
    id: "a7",
    time: "17:30",
    clientName: "Henrique Dias",
    whatsapp: "(11) 94444-7878",
    serviceId: "s2",
    professionalId: "p2",
    price: 25,
    durationMin: 25,
    origin: "online",
    status: "cancelado",
  },
  {
    id: "a8",
    time: "18:00",
    clientName: "Lucas Bento",
    whatsapp: "(11) 93333-2020",
    serviceId: "s3",
    professionalId: "p2",
    price: 65,
    durationMin: 60,
    origin: "manual",
    status: "agendado",
  },
];

export const trial = {
  totalDays: 15,
  daysLeft: 9,
  startedAt: "06/08/2026",
  endsAt: "21/08/2026",
};

export const plans = [
  {
    id: "essencial",
    name: "Essencial",
    price: 39,
    highlight: false,
    description: "Para quem atende sozinho.",
    features: [
      "1 profissional",
      "Agendamentos online ilimitados",
      "Página pública própria",
      "Agenda e agendamentos manuais",
      "Controle de faltas e tolerância",
    ],
  },
  {
    id: "equipe",
    name: "Equipe",
    price: 49,
    highlight: true,
    description: "Para negócios com mais de um profissional.",
    features: [
      "Profissionais ilimitados",
      "Escolha de profissional na página pública",
      "Agenda separada por profissional",
      "Relatório de ganhos previsto x real",
      "Suporte prioritário no WhatsApp",
    ],
  },
];

export const statusLabels: Record<AppointmentStatus, string> = {
  agendado: "Agendado",
  concluido: "Concluído",
  nao_compareceu: "Não compareceu",
  cancelado: "Cancelado",
};

export const brl = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 });

export const getService = (id: string) => services.find((s) => s.id === id)!;
export const getProfessional = (id: string) => professionals.find((p) => p.id === id)!;

export const activeProfessionals = professionals.filter((p) => p.status === "ativo");
export const activeServices = services.filter((s) => s.status === "ativo");

export const todaySummary = {
  total: appointments.filter((a) => a.status !== "cancelado").length,
  expected: appointments
    .filter((a) => a.status === "agendado" || a.status === "concluido")
    .reduce((sum, a) => sum + a.price, 0),
  earned: appointments.filter((a) => a.status === "concluido").reduce((sum, a) => sum + a.price, 0),
  noShows: appointments.filter((a) => a.status === "nao_compareceu").length,
};

/** Horários fictícios por profissional. false = ocupado (não aparece para o cliente). */
export const availabilityByProfessional: Record<string, Record<string, boolean>> = {
  p1: {
    "09:00": false,
    "09:40": true,
    "10:20": true,
    "11:00": false,
    "11:30": false,
    "13:00": true,
    "14:00": true,
    "15:00": false,
    "16:00": false,
    "17:00": true,
    "18:00": true,
  },
  p2: {
    "09:00": true,
    "09:40": true,
    "10:00": false,
    "11:00": true,
    "11:30": true,
    "13:00": false,
    "14:00": false,
    "15:00": true,
    "16:00": true,
    "17:00": true,
    "18:00": false,
  },
};

export const nextDays = [
  { date: "2026-08-15", label: "Hoje", weekday: "Sáb", day: "15", month: "ago" },
  { date: "2026-08-17", label: "Segunda", weekday: "Seg", day: "17", month: "ago" },
  { date: "2026-08-18", label: "Terça", weekday: "Ter", day: "18", month: "ago" },
  { date: "2026-08-19", label: "Quarta", weekday: "Qua", day: "19", month: "ago" },
  { date: "2026-08-20", label: "Quinta", weekday: "Qui", day: "20", month: "ago" },
  { date: "2026-08-21", label: "Sexta", weekday: "Sex", day: "21", month: "ago" },
];
