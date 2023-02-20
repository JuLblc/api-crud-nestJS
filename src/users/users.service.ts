import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private users = [
    { id: 0, name: 'Bob' },
    { id: 1, name: 'John' },
  ];

  findUsers() {
    return this.users;
  }

  findUser(id: number) {
    const user = this.users.find((user) => user.id === id);

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  createUser(createUserDto: CreateUserDto) {
    const newUser = {
      ...createUserDto,
      id: Date.now(),
    };

    return [...this.users, newUser];
  }

  updateUser(id: number, updateUserDto: UpdateUserDto) {
    this.users = this.users.map((user) => {
      if (user.id === id) {
        return { ...user, ...updateUserDto };
      }

      return user;
    });

    return this.findUser(id);
  }

  removeUser(id: number) {
    const toBeRemoved = this.findUser(id);
    this.users = this.users.filter((user) => user.id !== id);

    return toBeRemoved;
  }
}
