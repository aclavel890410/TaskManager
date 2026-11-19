import { z } from 'zod';

export const updateTaskSchema = z.object({
  title: z.string().trim().min(1, 'El título es obligatorio').optional(),
  description: z.string().trim().nullable().optional(),
  status: z.enum(['PENDIENTE', 'EN_CURSO', 'HECHA']).optional(),
  responsible: z.string().trim().min(1, 'El responsable es obligatorio').optional(),
  dueDate: z.coerce.date({ error: 'La fecha límite no es válida' }).optional(),
}).strict().refine(
  (data) => Object.keys(data).length > 0,
  'Debe proporcionar al menos un campo para actualizar',
);

export type UpdateTaskDto = z.infer<typeof updateTaskSchema>;
