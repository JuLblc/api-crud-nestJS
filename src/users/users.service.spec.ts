/* eslint-disable @typescript-eslint/ban-ts-comment */
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { User } from './users.model';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let userModel: Model<User>;

  const mockUserModel = {
    find: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(),
    constructor: jest.fn(function (email, password) {
      this.email = email;
      this.password = password;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken('User'),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userModel = module.get<Model<User>>(getModelToken('User'));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findUser', () => {
    const id = '63f781b3a20';

    const expected = {
      email: 'email@email.com',
      password: '$2b$10$NLVw',
      _id: '63f781b3a20',
    };

    it('should return a user', async () => {
      jest.spyOn(userModel, 'findById').mockResolvedValue(expected);

      const actual = await service.findUser(id);

      expect(userModel.findById).toHaveBeenCalledWith(id);
      expect(actual).toEqual(expected);
    });

    it('should throw a HttpException if user is not found', async () => {
      jest.spyOn(userModel, 'findById').mockResolvedValue(null);

      await expect(service.findUser(id)).rejects.toThrow(HttpException);
    });
  });

  describe('findUsers', () => {
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

    it('should return an array of users', async () => {
      jest.spyOn(userModel, 'find').mockResolvedValue(expected);

      const actual = await service.findUsers();

      expect(userModel.find).toHaveBeenCalled();
      expect(actual).toEqual(expected);
    });

    it('should throw a NotFoundException if no user is found', async () => {
      jest.spyOn(userModel, 'find').mockResolvedValue(null);

      await expect(service.findUsers()).rejects.toThrow(NotFoundException);
    });
  });

  describe('findUserByEmail', () => {
    const email = 'email@example.com';

    const expected = {
      email,
      password: '$2b$10$oofUpui',
      _id: '63f781ada208',
    };
    it('should return a user with matching email', async () => {
      jest.spyOn(userModel, 'findOne').mockResolvedValue(expected);

      const actual = await service.findUserByEmail(email);

      expect(userModel.findOne).toHaveBeenCalledWith({ email });
      expect(actual).toEqual(expected);
    });

    it('should throw a HttpException if user is not found', async () => {
      jest.spyOn(userModel, 'findOne').mockResolvedValue(null);

      await expect(service.findUserByEmail(email)).rejects.toThrow(
        new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: `No user with email: ${email}`,
          },
          HttpStatus.NOT_FOUND,
        ),
      );
    });
  });

  describe.skip('createUser', () => {
    const createUserDto: CreateUserDto = {
      email: 'email@email.com',
      password: 'Password!!1234',
    };

    const expected = {
      _id: expect.any(String),
      email: 'email@email.com',
      password: expect.any(String),
    };

    it('should create a new user and return it', async () => {
      jest.spyOn(mockUserModel, 'findOne').mockResolvedValue(null);

      const actual = await service.createUser(createUserDto);

      expect(userModel.findOne).toHaveBeenCalledWith({
        email: createUserDto.email,
      });
      expect(actual).toEqual(expected);
    });

    it('should throw an HttpException if email is already taken', async () => {
      const userWithSameEmail = {
        id: '61438b0dece65a729bfbc152',
        email: 'email@email.com',
        password: '$2b$10$q.v/',
      };

      jest.spyOn(userModel, 'findOne').mockResolvedValue(userWithSameEmail);

      await expect(service.createUser(createUserDto)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('updateUser', () => {
    const signedInUser = {
      _id: '61438b0dece',
    };

    const userToUpdate = {
      _id: '61438b0dece',
      email: 'jdoe@email.com',
      password: '$2b$10$q.v/',
      save: jest.fn(),
    };

    const updateUserDto: UpdateUserDto = {
      email: 'jane.doe@email.com',
      password: 'Password!!1234',
    };

    const expected = {
      _id: '61438b0dece',
      email: 'jane.doe@email.com',
      password: expect.any(String),
    };

    it('should update an existing user and return the updated user', async () => {
      //@ts-expect-error
      jest.spyOn(service, 'findUser').mockResolvedValue(userToUpdate);

      jest.spyOn(mockUserModel, 'findOne').mockResolvedValue(null);

      const actual = await service.updateUser(
        signedInUser as User,
        updateUserDto,
      );

      expect(service.findUser).toHaveBeenCalledWith(signedInUser._id);
      expect(userModel.findOne).toHaveBeenCalledWith({
        email: userToUpdate.email,
      });
      expect(userToUpdate.save).toHaveBeenCalled();

      expect(actual._id).toEqual(expected._id);
      expect(actual.email).toEqual(expected.email);
      expect(actual.password).toEqual(expected.password);
    });

    it('should throw a HttpException if the email Adress is already used by another user', async () => {
      const userWithSameEmail = {
        _id: '63f781b3a20',
        email: 'jane.doe@email.com',
        password: '$2b$10$NLVw',
      };
      //@ts-expect-error
      jest.spyOn(service, 'findUser').mockResolvedValue(userToUpdate);
      jest.spyOn(mockUserModel, 'findOne').mockResolvedValue(userWithSameEmail);

      await expect(
        service.updateUser(signedInUser as User, updateUserDto),
      ).rejects.toThrow(
        new HttpException(
          {
            status: HttpStatus.CONFLICT,
            error: 'Email adress already taken',
          },
          HttpStatus.CONFLICT,
        ),
      );
    });
  });

  describe('removeUser', () => {
    it('should remove a user', async () => {
      const id = '63f781b3a20';

      const expected = {
        email: 'jdoe@email.com',
        password: '$2b$10$oofUpui',
        _id: '63f781b3a20',
        delete: jest.fn().mockResolvedValue(true),
      };

      //@ts-expect-error
      jest.spyOn(service, 'findUser').mockResolvedValue(expected);
      jest.spyOn(expected, 'delete').mockResolvedValue(null);

      const actual = await service.removeUser(id);

      expect(service.findUser).toHaveBeenCalledWith(id);
      expect(expected.delete).toHaveBeenCalled();
      expect(actual).toEqual(expected);
    });

    it('should throw a HttpException if user is not found', async () => {
      const id = '63f781b3a20';

      jest.spyOn(service, 'findUser').mockResolvedValue(null);

      await expect(service.removeUser(id)).rejects.toThrow(HttpException);
    });
  });
});
