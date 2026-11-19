import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

export interface E2eContext {
  app: INestApplication<App>;
  prisma: PrismaService;
}

export async function createE2eContext(): Promise<E2eContext> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  await app.init();

  return {
    app,
    prisma: app.get(PrismaService),
  };
}

export async function removeTestTasks(prisma: PrismaService): Promise<void> {
  await prisma.task.deleteMany({
    where: { responsible: { startsWith: 'TEST-' } },
  });
}
