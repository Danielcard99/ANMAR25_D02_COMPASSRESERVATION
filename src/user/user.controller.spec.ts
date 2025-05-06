import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  const mockUserService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock_token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    })
    .overrideGuard(JwtAuthGuard)
    .useValue({ canActivate: () => true })
    .compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createUserDto = {
      name: 'Test User',
      email: 'test@example.com',
      telephone: '1234567890',
      password: 'password123',
    };

    it('should create a new user', async () => {
      const expectedResult = {
        user: { id: 1, ...createUserDto },
        token: 'mock_token',
      };

      mockUserService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createUserDto);

      expect(userService.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should return all users with query parameters', async () => {
      const query = {
        page: 1,
        limit: 10,
        name: 'Test',
        email: 'test@example.com',
        status: 'active',
      };

      const expectedUsers = [
        { name: 'User 1', email: 'user1@example.com', telephone: '123' },
        { name: 'User 2', email: 'user2@example.com', telephone: '456' },
      ];

      mockUserService.findAll.mockResolvedValue(expectedUsers);

      const result = await controller.findAll(query);

      expect(userService.findAll).toHaveBeenCalledWith(query);
      expect(result).toEqual(expectedUsers);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const userId = 1;
      const expectedUser = {
        id: userId,
        name: 'Test User',
        email: 'test@example.com',
        telephone: '1234567890',
        status: 'active',
      };

      mockUserService.findOne.mockResolvedValue(expectedUser);

      const result = await controller.findOne(userId);

      expect(userService.findOne).toHaveBeenCalledWith(userId);
      expect(result).toEqual(expectedUser);
    });
  });

  describe('update', () => {
    const userId = 1;
    const updateDto = {
      name: 'Updated Name',
      email: 'updated@example.com',
      telephone: '9876543210',
      password: 'newpassword',
    };

    it('should update a user', async () => {
      const expectedUser = {
        id: userId,
        ...updateDto,
      };

      mockUserService.update.mockResolvedValue(expectedUser);

      const result = await controller.update(userId, updateDto);

      expect(userService.update).toHaveBeenCalledWith(userId, updateDto);
      expect(result).toEqual(expectedUser);
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      const userId = 1;
      const expectedResult = 'success deleting user';

      mockUserService.delete.mockResolvedValue(expectedResult);

      const result = await controller.remove(userId);

      expect(userService.delete).toHaveBeenCalledWith(userId);
      expect(result).toBe(expectedResult);
    });
  });
});
