import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { PrismaService } from '../src/prisma/prisma.service';
import { createE2eContext, removeTestTasks } from './e2e-test-context';

describe('PATCH /tasks/:id', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let taskId: string;

  beforeAll(async () => ({ app, prisma } = await createE2eContext()));
  beforeEach(() => { taskId = ''; });
  afterEach(async () => {
    if (taskId) await prisma.task.deleteMany({ where: { id: taskId } });
  });
  afterAll(async () => { await removeTestTasks(prisma); await app.close(); });

  it('actualiza una tarea', async () => {
    const created = await prisma.task.create({
      data: { title: 'Prueba de edición', responsible: 'TEST-Diana', dueDate: new Date('2026-12-23T18:00:00.000Z') },
    });
    taskId = created.id;

    const response = await request(app.getHttpServer()).patch(`/tasks/${created.id}`).send({
      status: 'HECHA', responsible: 'TEST-Diana Actualizada',
    }).expect(200);

    expect(response.body.status).toBe('HECHA');
    expect(response.body.responsible).toBe('TEST-Diana Actualizada');
  });

  it('rechaza actualización vacía con 400', async () => {
    const created = await prisma.task.create({
      data: { title: 'Prueba de edición vacía', responsible: 'TEST-Elena', dueDate: new Date('2026-12-24T18:00:00.000Z') },
    });
    taskId = created.id;

    await request(app.getHttpServer()).patch(`/tasks/${created.id}`).send({}).expect(400);
  });
});
