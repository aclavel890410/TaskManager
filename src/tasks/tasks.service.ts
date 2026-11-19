import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './create-task.dto';
import { ListTasksDto } from './list-tasks.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateTaskDto) {
    return this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        status: dto.status,
        responsible: dto.responsible,
        dueDate: dto.dueDate,
      },
    });
  }

  async findAll(dto: ListTasksDto) {
    const where = {
      ...(dto.status ? { status: dto.status } : {}),
      ...(dto.responsible
        ? { responsible: { contains: dto.responsible, mode: 'insensitive' as const } }
        : {}),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.task.findMany({
        where,
        skip: (dto.page - 1) * dto.limit,
        take: dto.limit,
        orderBy: { dueDate: 'asc' },
      }),
      this.prisma.task.count({ where }),
    ]);

    return {
      items,
      pagination: {
        page: dto.page,
        limit: dto.limit,
        total,
        totalPages: Math.ceil(total / dto.limit),
      },
    };
  }
}
