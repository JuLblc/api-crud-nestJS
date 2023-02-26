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
import * as bcrypt from 'bcrypt';

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
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: `No user with id: ${id}`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return user;
  }

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: `No user with email: ${email}`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return user;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const hashPassword = await bcrypt.hash(createUserDto.password, 10);

    const newUser = new this.userModel({
      email: createUserDto.email,
      password: hashPassword,
    });

    const userWithSameEmail = await this.userModel.findOne({
      email: newUser.email,
    });

    if (userWithSameEmail) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: 'Email adress already taken',
        },
        HttpStatus.CONFLICT,
      );
    }

    await newUser.save();
    return newUser;
  }

  async updateUser(user: User, updateUserDto: UpdateUserDto): Promise<User> {
    const userToUpdate = await this.findUser(user._id);
    const hashPassword = updateUserDto.password
      ? await bcrypt.hash(updateUserDto.password, 10)
      : user.password;

    userToUpdate.email = updateUserDto.email || user.email;
    userToUpdate.password = hashPassword;

    const userWithSameEmail = await this.userModel.findOne({
      email: userToUpdate.email,
    });

    if (userWithSameEmail && userWithSameEmail.id !== user._id) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: 'Email adress already taken',
        },
        HttpStatus.CONFLICT,
      );
    }

    await userToUpdate.save();
    return userToUpdate;
  }

  async removeUser(id: string): Promise<User> {
    const toBeRemoved = await this.findUser(id);

    if (!toBeRemoved) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: `No user with id: ${id}`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    toBeRemoved.delete();

    return toBeRemoved;
  }
}
