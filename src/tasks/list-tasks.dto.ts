import { z } from 'zod';

export const listTasksSchema = z.object({
  status: z.enum(['PENDIENTE', 'EN_CURSO', 'HECHA']).optional(),
  responsible: z.string().trim().min(1).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type ListTasksDto = z.infer<typeof listTasksSchema>;
