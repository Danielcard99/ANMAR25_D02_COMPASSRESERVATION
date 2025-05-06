import { Test, TestingModule } from '@nestjs/testing';
import { SpaceController } from './space.controller';
import { SpaceService } from './space.service';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';
import { Status } from 'generated/prisma';

describe('SpaceController', () => {
  let controller: SpaceController;
  let service: SpaceService;

  const mockSpaceService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpaceController],
      providers: [
        {
          provide: SpaceService,
          useValue: mockSpaceService,
        },
      ],
    }).compile();

    controller = module.get<SpaceController>(SpaceController);
    service = module.get<SpaceService>(SpaceService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new space', async () => {
      const createSpaceDto: CreateSpaceDto = {
        name: 'Test Space',
        description: 'Test Description',
        capacity: 10,
      };

      const expectedSpace = {
        id: 1,
        ...createSpaceDto,
        status: Status.active,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockSpaceService.create.mockResolvedValue(expectedSpace);

      const result = await controller.create(createSpaceDto);

      expect(result).toEqual(expectedSpace);
      expect(mockSpaceService.create).toHaveBeenCalledWith(createSpaceDto);
    });
  });

  describe('findAll', () => {
    it('should return paginated spaces with filters', async () => {
      const query = {
        page: 1,
        limit: 10,
        name: 'Test',
        status: 'ACTIVE',
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

      mockSpaceService.findAll.mockResolvedValue(expectedSpaces);

      const result = await controller.findAll(query);

      expect(result).toEqual(expectedSpaces);
      expect(mockSpaceService.findAll).toHaveBeenCalledWith({
        ...query,
        status: Status.active,
      });
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

      mockSpaceService.findAll.mockResolvedValue(expectedSpaces);

      const result = await controller.findAll(query);

      expect(result).toEqual(expectedSpaces);
      expect(mockSpaceService.findAll).toHaveBeenCalledWith(query);
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

      mockSpaceService.findOne.mockResolvedValue(expectedSpace);

      const result = await controller.findOne(spaceId);

      expect(result).toEqual(expectedSpace);
      expect(mockSpaceService.findOne).toHaveBeenCalledWith(spaceId);
    });
  });

  describe('update', () => {
    it('should update a space', async () => {
      const spaceId = '1';
      const updateSpaceDto: UpdateSpaceDto = {
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

      mockSpaceService.update.mockResolvedValue(expectedSpace);

      const result = await controller.update(spaceId, updateSpaceDto);

      expect(result).toEqual(expectedSpace);
      expect(mockSpaceService.update).toHaveBeenCalledWith(spaceId, updateSpaceDto);
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

      mockSpaceService.remove.mockResolvedValue(expectedSpace);

      const result = await controller.remove(spaceId);

      expect(result).toEqual(expectedSpace);
      expect(mockSpaceService.remove).toHaveBeenCalledWith(spaceId);
    });
  });
}); 