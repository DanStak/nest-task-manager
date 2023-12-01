import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';
import { CreateTaskDTO } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { TasksQueryDTO } from './dto/tasks-query.dto';
import { AuthUser } from 'src/auth/auth-user.interface';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async createTask(
    createTaskDTO: CreateTaskDTO,
    user: AuthUser,
  ): Promise<Task> {
    const { title, description } = createTaskDTO;
    const task = this.taskRepository.create({
      title,
      description,
      status: TaskStatus.IN_PROGRESS,
      user,
    });

    await this.taskRepository.save(task);

    return task;
  }

  async getTaskById(id: string, user: AuthUser): Promise<Task> {
    const foundTask = await this.taskRepository.findOneBy({ id, user });

    if (!foundTask) throw new NotFoundException(`Task with id ${id} not found`);

    return foundTask;
  }

  async deleteTask(id: string, user: AuthUser): Promise<void> {
    const removed = await this.taskRepository.delete({ id, user });

    if (removed.affected === 0)
      throw new NotFoundException(`Task with id ${id} not found`);
  }

  async changeTaskStatus(
    id: string,
    status: TaskStatus,
    user: AuthUser,
  ): Promise<Task> {
    const found = await this.getTaskById(id, user);

    found.status = status;

    await this.taskRepository.save(found);

    return found;
  }

  async getAllTasks(
    tasksQueryDTO: TasksQueryDTO,
    user: AuthUser,
  ): Promise<Task[]> {
    const { status, search } = tasksQueryDTO;

    const query = this.taskRepository.createQueryBuilder('task');
    query.where({ user });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)',
        { search: `%${search}%` },
      );
    }

    return await query.getMany();
  }
}
