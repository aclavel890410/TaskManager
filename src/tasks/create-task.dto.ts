import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, 'El título es obligatorio'),
  description: z.string().trim().optional(),
  status: z.enum(['PENDIENTE', 'EN_CURSO', 'HECHA']).optional(),
  responsible: z.string().trim().min(1, 'El responsable es obligatorio'),
  dueDate: z.coerce.date(),
});

export type CreateTaskDto = z.infer<typeof createTaskSchema>;
