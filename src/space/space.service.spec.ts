import { Test, TestingModule } from '@nestjs/testing';
import { SpaceService } from './space.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { Status } from 'generated/prisma';

describe('SpaceService', () => {
  let service: SpaceService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    space: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      findFirst: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SpaceService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<SpaceService>(SpaceService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new space', async () => {
      const createSpaceDto = {
        name: 'Test Space',
        description: 'Test Description',
        capacity: 10,
      };

      const expectedSpace = {
        id: 1,
        ...createSpaceDto,
      };

      mockPrismaService.space.create.mockResolvedValue({
        ...createSpaceDto,
        id: 1,
      });

      const result = await service.create(createSpaceDto);

      expect(result).toEqual(expectedSpace);
      expect(mockPrismaService.space.create).toHaveBeenCalledWith({
        data: {
          ...createSpaceDto,
        },
      });
    });

    it('should throw error if space name already exists', async () => {
      const createSpaceDto = {
        name: 'Existing Space',
        description: 'Test Description',
        capacity: 10,
      };

      mockPrismaService.space.findFirst.mockResolvedValue({ id: 1, ...createSpaceDto });
      mockPrismaService.space.create.mockRejectedValue(new Error('Space name already exists'));

      await expect(service.create(createSpaceDto)).rejects.toThrow('Space name already exists');
    });
  });

  describe('findAll', () => {
    it('should return paginated spaces with filters', async () => {
      const query = {
        page: 1,
        limit: 10,
        name: 'Test',
        status: Status.active,
      };

      const expectedSpaces = {
        items: [
          {
            id: 1,
            name: 'Test Space',
            description: 'Test Description',
            capacity: 10,
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

      mockPrismaService.space.findMany.mockResolvedValue(expectedSpaces.items);
      mockPrismaService.space.count.mockResolvedValue(1);

      const result = await service.findAll(query);

      expect(result).toEqual(expectedSpaces);
      expect(mockPrismaService.space.findMany).toHaveBeenCalled();
    });

    it('should handle empty filters', async () => {
      const query = {
        page: 1,
        limit: 10,
      };

      const expectedSpaces = {
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

      mockPrismaService.space.findMany.mockResolvedValue([]);
      mockPrismaService.space.count.mockResolvedValue(0);

      const result = await service.findAll(query);

      expect(result).toEqual(expectedSpaces);
      expect(mockPrismaService.space.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a space by id', async () => {
      const spaceId = '1';
      const expectedSpace = {
        id: 1,
        name: 'Test Space',
        description: 'Test Description',
        capacity: 10,
        status: Status.active,
      };

      mockPrismaService.space.findUnique.mockResolvedValue(expectedSpace);

      const result = await service.findOne(spaceId);

      expect(result).toEqual(expectedSpace);
      expect(mockPrismaService.space.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException if space not found', async () => {
      const spaceId = '999';

      mockPrismaService.space.findUnique.mockResolvedValue(null);

      await expect(service.findOne(spaceId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a space', async () => {
      const spaceId = '1';
      const updateSpaceDto = {
        name: 'Updated Space',
        description: 'Updated Description',
        capacity: 20,
      };

      const expectedSpace = {
        id: 1,
        ...updateSpaceDto,
        status: Status.active,
        updatedAt: new Date(),
      };

      mockPrismaService.space.findUnique.mockResolvedValue({ id: 1 });
      mockPrismaService.space.update.mockResolvedValue(expectedSpace);

      const result = await service.update(spaceId, updateSpaceDto);

      expect(result).toEqual(expectedSpace);
      expect(mockPrismaService.space.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          ...updateSpaceDto,
          updatedAt: expect.any(Date),
        },
      });
    });

    it('should throw NotFoundException if space not found', async () => {
      const spaceId = '999';
      const updateSpaceDto = {
        name: 'Updated Space',
      };

      mockPrismaService.space.findUnique.mockResolvedValue(null);

      await expect(service.update(spaceId, updateSpaceDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should mark a space as inactive', async () => {
      const spaceId = '1';
      const expectedSpace = {
        id: 1,
        name: 'Test Space',
        description: 'Test Description',
        capacity: 10,
        status: Status.inactive,
        updatedAt: new Date(),
      };

      mockPrismaService.space.findUnique.mockResolvedValue({ id: 1 });
      mockPrismaService.space.update.mockResolvedValue(expectedSpace);

      const result = await service.remove(spaceId);

      expect(result).toEqual(expectedSpace);
      expect(mockPrismaService.space.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          status: Status.inactive,
          updatedAt: expect.any(Date),
        },
      });
    });

    it('should throw NotFoundException if space not found', async () => {
      const spaceId = '999';

      mockPrismaService.space.findUnique.mockResolvedValue(null);

      await expect(service.remove(spaceId)).rejects.toThrow(NotFoundException);
    });
  });
}); 