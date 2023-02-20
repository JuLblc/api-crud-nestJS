import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findUsers() {
    return this.usersService.findUsers();
  }

  @Get(':id')
  findUser(@Param('id', ParseIntPipe) id: number) {
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

  @Put(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) updateUserDto: UpdateUserDto,
  ) {
    try {
      return this.usersService.updateUser(id, updateUserDto);
    } catch (err) {
      throw new NotFoundException();
    }
  }

  @Delete(':id')
  removeUser(@Param('id', ParseIntPipe) id: number) {
    try {
      return this.usersService.removeUser(id);
    } catch (err) {
      throw new NotFoundException();
    }
  }
}
