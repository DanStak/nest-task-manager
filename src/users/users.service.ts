import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { AuthCredentialsDTO } from 'src/auth/dto/auth-credentials.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async createUser(authCredentialsDTO: AuthCredentialsDTO): Promise<void> {
    return await this.usersRepository.createUser(authCredentialsDTO);
  }

  async checkIsValidUser(
    authCredentialsDTO: AuthCredentialsDTO,
  ): Promise<User> {
    const found = await this.usersRepository.findOne({
      where: { username: authCredentialsDTO.username },
    });

    if (!found)
      throw new NotFoundException(
        `User "${authCredentialsDTO.username}" not found`,
      );

    return found;
  }
}
