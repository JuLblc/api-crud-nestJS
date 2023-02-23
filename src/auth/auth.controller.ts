import { Controller, Request, Post, UseGuards } from '@nestjs/common';
import { CustomRequest } from 'src/users/users.controller';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local-auth.guards';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('sessions')
  login(@Request() req: CustomRequest) {
    return req.user;
  }
}
