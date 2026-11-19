import { z } from 'zod';

export const taskIdSchema = z.string().trim().uuid('El id debe ser un UUID válido');
