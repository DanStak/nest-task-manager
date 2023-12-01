import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
// import { JwtPayload } from './jwt-payload.interface';
import { User } from 'src/users/user.entity';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDTO: AuthCredentialsDTO): Promise<void> {
    return this.usersService.createUser(authCredentialsDTO);
  }

  async validateUser(authCredentialsDTO: AuthCredentialsDTO): Promise<User> {
    const user = await this.usersService.checkIsValidUser(authCredentialsDTO);

    if (
      user &&
      (await bcrypt.compare(authCredentialsDTO.password, user.password))
    ) {
      return user;
    }

    throw new UnauthorizedException('Please check your login credentials');
  }

  async logIn(user: User): Promise<{ access_token: string }> {
    const payload: JwtPayload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
