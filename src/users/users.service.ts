import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './users.model';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async findUsers(): Promise<User[]> {
    const users = await this.userModel.find({});

    if (!users) {
      throw new NotFoundException('Could not find users');
    }

    return users;
  }

  async findUser(id: string): Promise<User> {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException('Could not find user');
    }

    return user;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const newUser = new this.userModel({
      ...createUserDto,
    });

    const createdUser = await newUser.save().catch(() => {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: 'Email adress already taken',
        },
        HttpStatus.CONFLICT,
      );
    });

    return createdUser;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const userToUpdate = await this.findUser(id);

    userToUpdate.email = updateUserDto.email;

    const updatedUser = await userToUpdate.save().catch(() => {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: 'Email adress already taken',
        },
        HttpStatus.CONFLICT,
      );
    });

    return updatedUser;
  }

  async removeUser(id: string): Promise<User> {
    const toBeRemoved = await this.findUser(id);
    toBeRemoved.delete();

    return toBeRemoved;
  }
}
