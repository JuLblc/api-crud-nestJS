import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthenticatedGuard } from 'src/auth/guard/authenticated.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { User } from './users.model';

export interface CustomRequest extends Request {
  user: User;
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findUsers() {
    return this.usersService.findUsers();
  }

  @Get(':id')
  findUser(@Param('id') id: string) {
    try {
      return this.usersService.findUser(id);
    } catch (err) {
      throw new NotFoundException();
    }
  }

  @Post()
  createUser(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @UseGuards(AuthenticatedGuard)
  @Put()
  updateUser(
    @Request() req: CustomRequest,
    @Body(new ValidationPipe()) updateUserDto: UpdateUserDto,
  ) {
    try {
      return this.usersService.updateUser(req.user, updateUserDto);
    } catch (err) {
      throw new NotFoundException();
    }
  }

  @Delete(':id')
  removeUser(@Param('id') id: string) {
    try {
      return this.usersService.removeUser(id);
    } catch (err) {
      throw new NotFoundException();
    }
  }
}
