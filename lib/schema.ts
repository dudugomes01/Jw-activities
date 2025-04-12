
import { z } from "zod";

// User roles
export const UserRole = {
  PUBLICADOR: "publicador",
  PIONEIRO_AUXILIAR: "pioneiro-auxiliar",
  PIONEIRO_REGULAR: "pioneiro-regular",
} as const;

// Activity types
export const ActivityType = {
  CAMPO: "campo",
  TESTEMUNHO: "testemunho",
  CARTAS: "cartas",
  ESTUDO: "estudo",
} as const;

export const userSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  role: z.enum([UserRole.PUBLICADOR, UserRole.PIONEIRO_AUXILIAR, UserRole.PIONEIRO_REGULAR]),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const activitySchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: z.enum([ActivityType.CAMPO, ActivityType.TESTEMUNHO, ActivityType.CARTAS, ActivityType.ESTUDO]),
  hours: z.number().min(0.5).max(24),
  date: z.date(),
  notes: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const reminderSchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string().min(1, "Título é obrigatório"),
  date: z.date(),
  description: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type User = z.infer<typeof userSchema>;
export type Activity = z.infer<typeof activitySchema>;
export type Reminder = z.infer<typeof reminderSchema>;
