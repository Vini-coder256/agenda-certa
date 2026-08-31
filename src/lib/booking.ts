/**
 * Dados fictícios do agendamento do cliente (protótipo — sem backend).
 */
export const generateBookingCode = () =>
  `AC-${Math.floor(1000 + Math.random() * 9000)}`;

export type ClientBooking = {
  code: string;
  clientName: string;
  whatsapp: string;
  serviceName: string;
  professionalName?: string;
  dateLabel: string;
  time: string;
  durationMin: number;
  price: number;
};

/** Agendamento simulado retornado na busca por WhatsApp + código. */
export const demoBooking: ClientBooking = {
  code: "AC-4827",
  clientName: "Felipe Rocha",
  whatsapp: "(11) 97777-3131",
  serviceName: "Corte masculino",
  professionalName: "Carlos Andrade",
  dateLabel: "Sexta, 21/ago",
  time: "14:00",
  durationMin: 40,
  price: 40,
};

/** Novos horários fictícios oferecidos na remarcação. */
export const rescheduleDays = [
  {
    date: "2026-09-01",
    weekday: "Seg",
    day: "01",
    month: "set",
    label: "Segunda, 01/set",
    times: ["09:40", "10:20", "13:00", "16:00"],
  },
  {
    date: "2026-09-02",
    weekday: "Ter",
    day: "02",
    month: "set",
    label: "Terça, 02/set",
    times: ["09:00", "11:00", "14:00", "17:30"],
  },
  {
    date: "2026-09-03",
    weekday: "Qua",
    day: "03",
    month: "set",
    label: "Quarta, 03/set",
    times: ["10:00", "13:40", "15:00", "18:00"],
  },
];
