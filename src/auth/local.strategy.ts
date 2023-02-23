import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { validate } from 'class-validator';
import { User } from 'src/users/users.model';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' }); // config
  }

  async validate(email: string, password: string): Promise<User> {
    const createAuthDto = new CreateAuthDto();
    createAuthDto.email = email;
    createAuthDto.password = password;

    const errors = await validate(createAuthDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    const user = await this.authService.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
