import { TaskStatus } from '../task-status.enum';
import { IsEnum } from 'class-validator';

export class ChangeTaskStatusDTO {
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
