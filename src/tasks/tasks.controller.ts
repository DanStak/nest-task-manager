import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Delete,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import { CreateTaskDTO } from './dto/create-task.dto';
import { ChangeTaskStatusDTO } from './dto/change-task-status.dto';
import { TasksQueryDTO } from './dto/tasks-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import { AuthUser } from '../auth/auth-user.interface';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post()
  createTask(
    @Body() createTaskDTO: CreateTaskDTO,
    @GetUser() user: AuthUser,
  ): Promise<Task> {
    return this.tasksService.createTask(createTaskDTO, user);
  }

  @Get('/:id')
  getTaskById(
    @Param('id') id: string,
    @GetUser() user: AuthUser,
  ): Promise<Task> {
    return this.tasksService.getTaskById(id, user);
  }

  @Delete('/:id')
  deleteTaskById(
    @Param('id') id: string,
    @GetUser() user: AuthUser,
  ): Promise<void> {
    return this.tasksService.deleteTask(id, user);
  }

  @Patch('/:id/status')
  changeTaskStatus(
    @Param('id') id: string,
    @Body() changeTaskStatusDTO: ChangeTaskStatusDTO,
    @GetUser() user: AuthUser,
  ): Promise<Task> {
    const { status } = changeTaskStatusDTO;
    return this.tasksService.changeTaskStatus(id, status, user);
  }

  @Get()
  getTasks(
    @Query() tasksQueryDTO: TasksQueryDTO,
    @GetUser() user: AuthUser,
  ): Promise<Task[]> {
    return this.tasksService.getAllTasks(tasksQueryDTO, user);
  }
}
