import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Delete,
  Patch,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import { CreateTaskDTO } from './dto/create-task.dto';
import { ChangeTaskStatusDTO } from './dto/change-task-status.dto';
import { TasksQueryDTO } from './dto/tasks-query.dto';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post()
  createTask(@Body() createTaskDTO: CreateTaskDTO): Promise<Task> {
    return this.tasksService.createTask(createTaskDTO);
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string): Promise<Task> {
    return this.tasksService.getTaskById(id);
  }

  @Delete('/:id')
  deleteTaskById(@Param('id') id: string): Promise<void> {
    return this.tasksService.deleteTask(id);
  }

  @Patch('/:id/status')
  changeTaskStatus(
    @Param('id') id: string,
    @Body() changeTaskStatusDTO: ChangeTaskStatusDTO,
  ): Promise<Task> {
    const { status } = changeTaskStatusDTO;
    return this.tasksService.changeTaskStatus(id, status);
  }

  @Get()
  getTasks(@Query() tasksQueryDTO: TasksQueryDTO): Promise<Task[]> {
    return this.tasksService.getAllTasks(tasksQueryDTO);
  }
}
