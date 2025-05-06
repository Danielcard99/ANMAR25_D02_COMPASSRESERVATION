import { Test, TestingModule } from '@nestjs/testing';
import { ClientService } from './clients.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PaginationService } from '../common/services/pagination.service';
import { Status } from 'generated/prisma';

jest.mock('../common/services/pagination.service', () => ({
  PaginationService: {
    paginate: jest.fn(),
  },
}));

describe('ClientService', () => {
  let service: ClientService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    client: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ClientService>(ClientService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createClientDto = {
      name: 'Test Client',
      email: 'test@example.com',
      cpf: '12345678900',
      birthDate: '1990-01-01',
      telephone: '1234567890',
    };

    it('should create a new client successfully', async () => {
      mockPrismaService.client.findFirst.mockResolvedValue(null);
      mockPrismaService.client.create.mockResolvedValue({
        id: 1,
        ...createClientDto,
        birthDate: new Date(createClientDto.birthDate),
      });

      const result = await service.create(createClientDto);

      expect(mockPrismaService.client.create).toHaveBeenCalledWith({
        data: {
          ...createClientDto,
          birthDate: new Date(createClientDto.birthDate),
        },
      });
      expect(result).toEqual({
        id: 1,
        ...createClientDto,
        birthDate: new Date(createClientDto.birthDate),
      });
    });

    it('should throw BadRequestException when CPF is already registered', async () => {
      mockPrismaService.client.findFirst.mockResolvedValue({
        cpf: createClientDto.cpf,
      });

      await expect(service.create(createClientDto)).rejects.toThrow(
        new BadRequestException('cpf already registered'),
      );
    });

    it('should throw BadRequestException when email is already registered', async () => {
      mockPrismaService.client.findFirst.mockResolvedValue({
        email: createClientDto.email,
      });

      await expect(service.create(createClientDto)).rejects.toThrow(
        new BadRequestException('email already registered'),
      );
    });
  });

  describe('update', () => {
    const updateClientDto = {
      name: 'Updated Client',
      email: 'updated@example.com',
      birthDate: '1991-01-01',
    };

    it('should update a client successfully', async () => {
      mockPrismaService.client.findUnique.mockResolvedValue({ id: 1 });
      mockPrismaService.client.update.mockResolvedValue({
        id: 1,
        ...updateClientDto,
        birthDate: new Date(updateClientDto.birthDate),
      });

      const result = await service.update(1, updateClientDto);

      expect(mockPrismaService.client.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          ...updateClientDto,
          birthDate: new Date(updateClientDto.birthDate),
        },
      });
      expect(result).toEqual({
        id: 1,
        ...updateClientDto,
        birthDate: new Date(updateClientDto.birthDate),
      });
    });

    it('should throw NotFoundException when client does not exist', async () => {
      mockPrismaService.client.findUnique.mockResolvedValue(null);

      await expect(service.update(999, updateClientDto)).rejects.toThrow(
        new NotFoundException('client 999 does not exist'),
      );
    });
  });

  describe('list', () => {
    it('should return paginated clients with filters', async () => {
      const filters = {
        page: 1,
        limit: 10,
        name: 'Test',
        email: 'test@example.com',
        cpf: '12345678900',
        status: Status.active,
      };

      const mockPaginatedResponse = {
        items: [
          { name: 'Client 1', email: 'client1@example.com', cpf: '12345678900' },
          { name: 'Client 2', email: 'client2@example.com', cpf: '98765432100' },
        ],
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

      const result = await service.list(filters);

      expect(PaginationService.paginate).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Function),
        filters,
      );
      expect(result).toEqual(mockPaginatedResponse);
    });
  });

  describe('listById', () => {
    it('should return a client by id', async () => {
      const mockClient = {
        id: 1,
        name: 'Test Client',
        email: 'test@example.com',
        cpf: '12345678900',
      };

      mockPrismaService.client.findUnique.mockResolvedValue(mockClient);

      const result = await service.listById(1);

      expect(mockPrismaService.client.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockClient);
    });

    it('should throw NotFoundException when client does not exist', async () => {
      mockPrismaService.client.findUnique.mockResolvedValue(null);

      await expect(service.listById(999)).rejects.toThrow(
        new NotFoundException('client 999 does not exist'),
      );
    });
  });

  describe('inactivate', () => {
    it('should inactivate a client successfully', async () => {
      const mockClient = {
        id: 1,
        orders: [],
      };

      mockPrismaService.client.findUnique.mockResolvedValue(mockClient);
      mockPrismaService.client.update.mockResolvedValue({
        ...mockClient,
        status: Status.inactive,
      });

      const result = await service.inactivate(1);

      expect(mockPrismaService.client.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          status: Status.inactive,
          updatedAt: expect.any(Date),
        },
      });
      expect(result).toEqual({
        ...mockClient,
        status: Status.inactive,
      });
    });

    it('should throw NotFoundException when client does not exist', async () => {
      mockPrismaService.client.findUnique.mockResolvedValue(null);

      await expect(service.inactivate(999)).rejects.toThrow(
        new NotFoundException('client 999 does not exist'),
      );
    });

    it('should throw BadRequestException when client has open or approved orders', async () => {
      const mockClient = {
        id: 1,
        orders: [
          { status: 'OPEN' },
          { status: 'APPROVED' },
        ],
      };

      mockPrismaService.client.findUnique.mockResolvedValue(mockClient);

      await expect(service.inactivate(1)).rejects.toThrow(
        new BadRequestException('cannot inactivate client 1 with open or approved orders'),
      );
    });
  });
}); 