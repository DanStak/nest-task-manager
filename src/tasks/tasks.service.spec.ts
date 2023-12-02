import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { CreateTaskDTO } from './dto/create-task.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';
import { TaskStatus } from './task-status.enum';
import { NotFoundException } from '@nestjs/common';

const mockedTasksRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findOneBy: jest.fn(),
};

const mockedUser = {
  username: 'User1',
  id: 'someId',
  password: 'somePassword',
  tasks: [],
};

describe('TasksService', () => {
  let service: TasksService;
  let tasksRepository: Repository<Task>;

  const TASK_REPO_TOKEN = getRepositoryToken(Task);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: TASK_REPO_TOKEN,
          useValue: mockedTasksRepository,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    tasksRepository = module.get<Repository<Task>>(TASK_REPO_TOKEN);
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  it('tasksRepository should be defined', () => {
    expect(tasksRepository).toBeDefined();
  });

  describe('createTask', () => {
    const createTaskDTO: CreateTaskDTO = {
      title: 'Some title',
      description: 'Some description',
    };
    it('should call tasksRepository.create with correct params', async () => {
      await service.createTask(createTaskDTO, mockedUser);

      expect(tasksRepository.create).toHaveBeenCalledWith({
        ...createTaskDTO,
        status: TaskStatus.IN_PROGRESS,
        user: mockedUser,
      });
    });

    it('should call tasksRepository.save with correct task value', async () => {
      jest.spyOn(tasksRepository, 'save').mockResolvedValueOnce({
        ...createTaskDTO,
        status: TaskStatus.IN_PROGRESS,
        id: 'someId',
        user: mockedUser,
      });

      const task = await service.createTask(createTaskDTO, mockedUser);

      expect(tasksRepository.save).toHaveBeenCalledWith(task);
    });
  });

  describe('getTaskById', () => {
    const mockedTask = {
      title: 'Test title',
      description: 'Test desc',
      id: 'someId',
      status: TaskStatus.IN_PROGRESS,
      user: mockedUser,
    };

    it('should returned value based on ID', async () => {
      jest
        .spyOn(tasksRepository, 'findOneBy')
        .mockResolvedValueOnce(mockedTask);
      const result = await service.getTaskById('someId', mockedUser);

      expect(result).toEqual(mockedTask);
    });

    it('should throw NotFoundException if not found matched task', async () => {
      jest
        .spyOn(tasksRepository, 'findOneBy')
        .mockResolvedValueOnce(mockedTask);
      await service.getTaskById('someOtherId', mockedUser);

      expect(service.getTaskById).rejects.toThrow(NotFoundException);
    });
  });
});
