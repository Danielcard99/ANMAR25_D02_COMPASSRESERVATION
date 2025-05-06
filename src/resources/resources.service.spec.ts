import { Test, TestingModule } from '@nestjs/testing';
import { ResourcesService } from './resources.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { PaginationService } from '../common/services/pagination.service';
import { Status } from 'generated/prisma';

jest.mock('../common/services/pagination.service', () => ({
  PaginationService: {
    paginate: jest.fn(),
  },
}));

describe('ResourcesService', () => {
  let service: ResourcesService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    resource: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResourcesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ResourcesService>(ResourcesService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createResourceDto = {
      name: 'Test Resource',
      quantity: 10,
      description: 'Test Description',
    };

    it('should create a new resource successfully', async () => {
      const expectedResult = {
        id: 1,
        ...createResourceDto,
        status: Status.active,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.resource.create.mockResolvedValue(expectedResult);

      const result = await service.create(createResourceDto);

      expect(mockPrismaService.resource.create).toHaveBeenCalledWith({
        data: createResourceDto,
      });
      expect(result).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    const updateResourceDto = {
      name: 'Updated Resource',
      quantity: 20,
      description: 'Updated Description',
    };

    const mockResource = {
      id: 1,
      name: 'Test Resource',
      quantity: 10,
      description: 'Test Description',
      status: Status.active,
    };

    it('should update a resource successfully', async () => {
      mockPrismaService.resource.findUnique.mockResolvedValue(mockResource);
      mockPrismaService.resource.update.mockResolvedValue({
        ...mockResource,
        ...updateResourceDto,
        updatedAt: new Date(),
      });

      const result = await service.update(1, updateResourceDto);

      expect(mockPrismaService.resource.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          ...updateResourceDto,
          updatedAt: expect.any(Date),
        },
      });
      expect(result).toEqual({
        ...mockResource,
        ...updateResourceDto,
        updatedAt: expect.any(Date),
      });
    });

    it('should throw NotFoundException when resource is not found', async () => {
      mockPrismaService.resource.findUnique.mockResolvedValue(null);

      await expect(service.update(999, updateResourceDto)).rejects.toThrow(
        new NotFoundException('Resource not found'),
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated resources with filters', async () => {
      const query = {
        page: 1,
        limit: 10,
        name: 'Test',
        status: Status.active,
      };

      const expectedResources = {
        items: [
          {
            id: 1,
            name: 'Test Resource',
            description: 'Test Description',
            status: Status.active,
          },
        ],
        meta: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };

      (PaginationService.paginate as jest.Mock).mockResolvedValue(expectedResources);

      const result = await service.findAll(query);

      expect(PaginationService.paginate).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Function),
        query,
      );
      expect(result).toEqual(expectedResources);
    });
  });

  describe('findOne', () => {
    it('should return a resource by id', async () => {
      const mockResource = {
        id: 1,
        name: 'Test Resource',
        quantity: 10,
        description: 'Test Description',
        status: Status.active,
      };

      mockPrismaService.resource.findUnique.mockResolvedValue(mockResource);

      const result = await service.findOne(1);

      expect(mockPrismaService.resource.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockResource);
    });

    it('should throw NotFoundException when resource is not found', async () => {
      mockPrismaService.resource.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(
        new NotFoundException('Resource not found'),
      );
    });
  });

  describe('remove', () => {
    it('should inactivate a resource successfully', async () => {
      const mockResource = {
        id: 1,
        name: 'Test Resource',
        quantity: 10,
        description: 'Test Description',
        status: Status.active,
      };

      mockPrismaService.resource.findUnique.mockResolvedValue(mockResource);
      mockPrismaService.resource.update.mockResolvedValue({
        ...mockResource,
        status: Status.inactive,
        updatedAt: new Date(),
      });

      const result = await service.remove(1);

      expect(mockPrismaService.resource.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          status: Status.inactive,
          updatedAt: expect.any(Date),
        },
      });
      expect(result).toEqual({
        ...mockResource,
        status: Status.inactive,
        updatedAt: expect.any(Date),
      });
    });

    it('should throw NotFoundException when resource is not found', async () => {
      mockPrismaService.resource.findUnique.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(
        new NotFoundException('Resource not found'),
      );
    });
  });
}); 