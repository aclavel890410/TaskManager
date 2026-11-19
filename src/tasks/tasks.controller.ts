import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { StandardSchemaValidationPipe } from '@nestjs/common';
import {
  createTaskSchema,
  type CreateTaskDto,
} from './create-task.dto';
import {
  listTasksSchema,
  type ListTasksDto,
} from './list-tasks.dto';
import {
  updateTaskSchema,
  type UpdateTaskDto,
} from './update-task.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
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

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body({
      schema: updateTaskSchema,
      pipes: [new StandardSchemaValidationPipe()],
    })
    dto: UpdateTaskDto,
  ) {
    return this.tasksService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.tasksService.remove(id);
  }
}
