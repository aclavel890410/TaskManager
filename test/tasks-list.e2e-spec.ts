import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { PrismaService } from '../src/prisma/prisma.service';
import { createE2eContext, removeTestTasks } from './e2e-test-context';

describe('GET /tasks', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let taskId: string;

  beforeAll(async () => ({ app, prisma } = await createE2eContext()));
  beforeEach(() => { taskId = ''; });
  afterEach(async () => {
    if (taskId) await prisma.task.deleteMany({ where: { id: taskId } });
  });
  afterAll(async () => { await removeTestTasks(prisma); await app.close(); });

  it('lista tareas con filtros y paginación', async () => {
    const created = await prisma.task.create({
      data: { title: 'Prueba de listado', responsible: 'TEST-María', status: 'EN_CURSO', dueDate: new Date('2026-12-21T18:00:00.000Z') },
    });
    taskId = created.id;

    const response = await request(app.getHttpServer()).get('/tasks')
      .query({ status: 'EN_CURSO', responsible: 'TEST-M', page: 1, limit: 10 }).expect(200);

    expect(response.body.items).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: created.id, responsible: 'TEST-María' }),
    ]));
    expect(response.body.pagination).toEqual(expect.objectContaining({ page: 1, limit: 10, total: 1 }));
  });

  it('rechaza filtros inválidos con 400', async () => {
    await request(app.getHttpServer()).get('/tasks')
      .query({ status: 'INVALID', page: 0 }).expect(400);
  });
});
