import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';
import { CreateTaskDTO } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { TasksQueryDTO } from './dto/tasks-query.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async createTask(createTaskDTO: CreateTaskDTO): Promise<Task> {
    const { title, description } = createTaskDTO;
    const task = this.taskRepository.create({
      title,
      description,
      status: TaskStatus.IN_PROGRESS,
    });

    await this.taskRepository.save(task);

    return task;
  }

  async getTaskById(id: string): Promise<Task> {
    const foundTask = this.taskRepository.findOne({ where: { id } });

    if (!foundTask) throw new NotFoundException(`Task with id ${id} not found`);

    return foundTask;
  }

  async deleteTask(id: string): Promise<void> {
    const removed = await this.taskRepository.delete(id);

    if (removed.affected === 0)
      throw new NotFoundException(`Task with id ${id} not found`);
  }

  async changeTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    const found = await this.getTaskById(id);

    found.status = status;

    await this.taskRepository.save(found);

    return found;
  }

  async getAllTasks(tasksQueryDTO: TasksQueryDTO): Promise<Task[]> {
    const { status, search } = tasksQueryDTO;

    console.log(typeof search);

    const query = this.taskRepository.createQueryBuilder('task');

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
