import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PaginationService } from '../common/services/pagination.service';
import { Status } from 'generated/prisma';

jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashed_password'),
}));

jest.mock('../common/services/pagination.service', () => ({
  PaginationService: {
    paginate: jest.fn(),
  },
}));

describe('UserService', () => {
  let service: UserService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  const mockPrismaService = {
    users: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock_token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
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

    it('should create a new user successfully', async () => {
      const mockUser = {
        id: 1,
        ...createUserDto,
        password: 'hashed_password',
      };

      mockPrismaService.users.create.mockResolvedValue(mockUser);

      const result = await service.create(createUserDto);

      expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 10);
      expect(mockPrismaService.users.create).toHaveBeenCalledWith({
        data: {
          ...createUserDto,
          password: 'hashed_password',
        },
      });
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        id: mockUser.id,
        email: mockUser.email,
      });
      expect(result).toEqual({
        user: mockUser,
        token: 'mock_token',
      });
    });

    it('should throw BadRequestException when required fields are missing', async () => {
      await expect(service.create({} as any)).rejects.toThrow(BadRequestException);
      await expect(service.create({ name: 'Test' } as any)).rejects.toThrow(BadRequestException);
      await expect(service.create({ name: 'Test', email: 'test@example.com' } as any)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return paginated users with filters', async () => {
      const mockUsers = [
        { name: 'User 1', email: 'user1@example.com', telephone: '123' },
        { name: 'User 2', email: 'user2@example.com', telephone: '456' },
      ];

      const mockPaginatedResponse = {
        items: mockUsers,
        meta: {
          page: 1,
          limit: 10,
          total: 2,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };

      (PaginationService.paginate as jest.Mock).mockResolvedValue(mockPaginatedResponse);

      const result = await service.findAll({
        page: 1,
        limit: 10,
        name: 'User',
        email: 'example.com',
        status: Status.active,
      });

      expect(PaginationService.paginate).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Function),
        {
          page: 1,
          limit: 10,
          name: 'User',
          email: 'example.com',
          status: Status.active,
        },
      );

      expect(result).toEqual(mockPaginatedResponse);
    });

    it('should handle empty results', async () => {
      const mockPaginatedResponse = {
        items: [],
        meta: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };

      (PaginationService.paginate as jest.Mock).mockResolvedValue(mockPaginatedResponse);

      const result = await service.findAll({
        page: 1,
        limit: 10,
      });

      expect(PaginationService.paginate).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Function),
        {
          page: 1,
          limit: 10,
        },
      );

      expect(result).toEqual(mockPaginatedResponse);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        telephone: '1234567890',
        status: Status.active,
      };

      mockPrismaService.users.findFirst.mockResolvedValue(mockUser);

      const result = await service.findOne(1);

      expect(mockPrismaService.users.findFirst).toHaveBeenCalledWith({
        where: { id: 1 },
        select: {
          name: true,
          email: true,
          telephone: true,
          status: true,
        },
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException when user is not found', async () => {
      mockPrismaService.users.findFirst.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const updateDto = {
      name: 'Updated Name',
      email: 'updated@example.com',
      telephone: '9876543210',
      password: 'newpassword',
    };

    it('should update a user successfully', async () => {
      const mockUser = {
        id: 1,
        ...updateDto,
        password: 'hashed_password',
      };

      mockPrismaService.users.findFirst.mockResolvedValue({ id: 1 });
      mockPrismaService.users.update.mockResolvedValue(mockUser);

      const result = await service.update(1, updateDto);

      expect(bcrypt.hash).toHaveBeenCalledWith(updateDto.password, 10);
      expect(mockPrismaService.users.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          ...updateDto,
          password: 'hashed_password',
        },
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException when user is not found', async () => {
      mockPrismaService.users.findFirst.mockResolvedValue(null);

      await expect(service.update(999, updateDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should mark a user as inactive', async () => {
      const userId = 1;
      const mockUser = {
        id: userId,
        name: 'Test User',
        email: 'test@example.com',
        status: Status.active,
      };

      jest.spyOn(service as any, 'verifyId').mockResolvedValue(mockUser);
      mockPrismaService.users.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.users.update.mockResolvedValue({
        ...mockUser,
        status: Status.inactive,
      });

      const result = await service.delete(userId);

      expect(result).toBe('success deleting user');
      expect(mockPrismaService.users.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: {
          status: Status.inactive,
          updateAt: expect.any(Date),
        },
      });
    });

    it('should throw NotFoundException when user is not found', async () => {
      const userId = 999;
      jest.spyOn(service as any, 'verifyId').mockRejectedValue(new NotFoundException('User not found'));
      mockPrismaService.users.findUnique.mockResolvedValue(null);

      await expect(service.delete(userId)).rejects.toThrow(NotFoundException);
    });
  });
});
