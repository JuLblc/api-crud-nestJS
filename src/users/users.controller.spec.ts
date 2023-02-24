import { Test, TestingModule } from '@nestjs/testing';
import { CustomRequest, UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUsersService = {
    findUsers: jest.fn(() => [
      {
        email: 'jdoe@email.com',
        password: '$2b$10$oofUpui',
        _id: '63f781ada208',
      },
      {
        email: 'email@email.com',
        password: '$2b$10$NLVw',
        _id: '63f781b3a20',
      },
    ]),
    findUser: jest.fn((id) => {
      return {
        email: 'email@email.com',
        password: '$2b$10$NLVw',
        _id: id,
      };
    }),
    createUser: jest.fn((dto) => {
      return {
        email: dto.email,
        password: '$2b$10$oofUpui',
        _id: '63f781ada208',
      };
    }),
    updateUser: jest.fn((user, dto) => {
      return {
        email: dto.email,
        password: user.password,
        _id: user._id,
      };
    }),
    removeUser: jest.fn((id) => {
      return {
        email: 'email@email.com',
        password: '$2b$10$NLVw',
        _id: id,
      };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    })
      .overrideProvider(UsersService)
      .useValue(mockUsersService)
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('[FIND_ALL] should find all users', () => {
    const expected = [
      {
        email: 'jdoe@email.com',
        password: '$2b$10$oofUpui',
        _id: '63f781ada208',
      },
      {
        email: 'email@email.com',
        password: '$2b$10$NLVw',
        _id: '63f781b3a20',
      },
    ];

    const actual = controller.findUsers();

    expect(actual).toEqual(expected);

    expect(mockUsersService.findUsers).toHaveBeenCalled();
  });

  it('[FIND_ONE] should find a user', () => {
    const id = '63f781b3a20';

    const expected = {
      email: 'email@email.com',
      password: '$2b$10$NLVw',
      _id: '63f781b3a20',
    };

    const actual = controller.findUser(id);

    expect(actual).toEqual(expected);

    expect(mockUsersService.findUser).toHaveBeenCalledWith(id);
  });

  it('[CREATE] should create a user', () => {
    const createUserDto = {
      email: 'email@email.com',
      password: 'Password!!1234',
    };

    const expected = {
      _id: expect.any(String),
      email: createUserDto.email,
      password: expect.any(String),
    };

    const actual = controller.createUser(createUserDto);

    expect(actual).toEqual(expected);

    expect(mockUsersService.createUser).toHaveBeenCalledWith(createUserDto);
  });

  it('[UPDATE] should update a user', () => {
    const updateUserDto = {
      email: 'email12@email.com',
    };

    const user = {
      _id: '63f781ada208',
      email: 'email@email.com',
      password: '$2b$10$oofUpui',
    };

    const req = { user };

    const expected = {
      _id: user._id,
      email: updateUserDto.email,
      password: user.password,
    };

    const actual = controller.updateUser(req as CustomRequest, updateUserDto);
    expect(actual).toEqual(expected);
  });

  it('[DELETE] should remove a user', () => {
    const id = '63f781b3a20';

    const expected = {
      email: 'email@email.com',
      password: '$2b$10$NLVw',
      _id: '63f781b3a20',
    };

    const actual = controller.removeUser(id);

    expect(actual).toEqual(expected);

    expect(mockUsersService.removeUser).toHaveBeenCalled();
  });
});
