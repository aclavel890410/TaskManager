import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { PrismaService } from '../src/prisma/prisma.service';
import { createE2eContext, removeTestTasks } from './e2e-test-context';

describe('GET /tasks/:id', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let taskId: string;

  beforeAll(async () => ({ app, prisma } = await createE2eContext()));
  beforeEach(() => { taskId = ''; });
  afterEach(async () => {
    if (taskId) await prisma.task.deleteMany({ where: { id: taskId } });
  });
  afterAll(async () => { await removeTestTasks(prisma); await app.close(); });

  it('devuelve una tarea específica', async () => {
    const created = await prisma.task.create({
      data: { title: 'Prueba de consulta', responsible: 'TEST-Carlos', dueDate: new Date('2026-12-22T18:00:00.000Z') },
    });
    taskId = created.id;

    const response = await request(app.getHttpServer()).get(`/tasks/${created.id}`).expect(200);
    expect(response.body.id).toBe(created.id);
    expect(response.body.title).toBe('Prueba de consulta');
  });

  it('devuelve 404 si no existe', async () => {
    await request(app.getHttpServer())
      .get('/tasks/00000000-0000-4000-8000-000000000000').expect(404);
  });

  it('rechaza UUID inválido con 400', async () => {
    await request(app.getHttpServer()).get('/tasks/no-es-un-uuid').expect(400);
  });
});
