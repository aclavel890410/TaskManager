import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { StandardSchemaValidationPipe } from '@nestjs/common';
import {
  createTaskSchema,
  type CreateTaskDto,
} from './create-task.dto';
import {
  listTasksSchema,
  type ListTasksDto,
} from './list-tasks.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(
    @Body({
      schema: createTaskSchema,
      pipes: [new StandardSchemaValidationPipe()],
    })
    dto: CreateTaskDto,
  ) {
    return this.tasksService.create(dto);
  }

  @Get()
  findAll(
    @Query({
      schema: listTasksSchema,
      pipes: [new StandardSchemaValidationPipe()],
    })
    filters: ListTasksDto,
  ) {
    return this.tasksService.findAll(filters);
  }
}
