import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { PrismaService } from '../src/prisma/prisma.service';
import { createE2eContext, removeTestTasks } from './e2e-test-context';

describe('DELETE /tasks/:id', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;

  beforeAll(async () => ({ app, prisma } = await createE2eContext()));
  afterEach(async () => removeTestTasks(prisma));
  afterAll(async () => { await removeTestTasks(prisma); await app.close(); });

  it('elimina una tarea', async () => {
    const created = await prisma.task.create({
      data: { title: 'Prueba de eliminación', responsible: 'TEST-Fernando', dueDate: new Date('2026-12-25T18:00:00.000Z') },
    });

    const response = await request(app.getHttpServer()).delete(`/tasks/${created.id}`).expect(200);
    expect(response.body).toEqual({ id: created.id, deleted: true });

    const deleted = await prisma.task.findUnique({ where: { id: created.id } });
    expect(deleted).toBeNull();
  });

  it('devuelve 404 si no existe', async () => {
    await request(app.getHttpServer())
      .delete('/tasks/00000000-0000-4000-8000-000000000000').expect(404);
  });
});
