import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';
import { CreateTaskDTO } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';

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
}
