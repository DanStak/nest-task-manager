import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body() authCredentialsDTO: AuthCredentialsDTO): Promise<void> {
    return this.authService.signUp(authCredentialsDTO);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/signin')
  async login(@Request() req) {
    return this.authService.logIn(req.user);
  }
}
