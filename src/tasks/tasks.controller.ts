import { Body, Controller, Post } from '@nestjs/common';
import { StandardSchemaValidationPipe } from '@nestjs/common';
import {
  createTaskSchema,
  type CreateTaskDto,
} from './create-task.dto';
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
}
