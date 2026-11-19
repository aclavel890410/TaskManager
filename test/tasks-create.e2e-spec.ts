import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { PrismaService } from '../src/prisma/prisma.service';
import { createE2eContext, removeTestTasks } from './e2e-test-context';

describe('POST /tasks', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;

  beforeAll(async () => ({ app, prisma } = await createE2eContext()));
  afterEach(async () => removeTestTasks(prisma));
  afterAll(async () => { await removeTestTasks(prisma); await app.close(); });

  it('crea una tarea', async () => {
    const response = await request(app.getHttpServer()).post('/tasks').send({
      title: 'Prueba de creación',
      description: 'Tarea creada desde e2e',
      status: 'PENDIENTE',
      responsible: 'TEST-Andrés',
      dueDate: '2026-12-20T18:00:00.000Z',
    }).expect(201);

    expect(response.body.id).toBeDefined();
    expect(response.body.title).toBe('Prueba de creación');
  });

  it('rechaza datos inválidos con 400', async () => {
    await request(app.getHttpServer()).post('/tasks').send({
      title: '', responsible: 'TEST-Anna', dueDate: 'invalida',
    }).expect(400);
  });
});
