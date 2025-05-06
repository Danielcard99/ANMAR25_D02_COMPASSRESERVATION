import { Test, TestingModule } from '@nestjs/testing';
import { ResourcesController } from './resources.controller';
import { ResourcesService } from './resources.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { Status } from 'generated/prisma';
import { PaginationDto } from '../common/dto/pagination.dto';

describe('ResourcesController', () => {
  let controller: ResourcesController;
  let service: ResourcesService;

  const mockResourcesService = {
    create: jest.fn(),
    update: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResourcesController],
      providers: [
        {
          provide: ResourcesService,
          useValue: mockResourcesService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ResourcesController>(ResourcesController);
    service = module.get<ResourcesService>(ResourcesService);
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

    it('should create a new resource', async () => {
      const expectedResult = {
        id: 1,
        ...createResourceDto,
        status: Status.active,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockResourcesService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createResourceDto);

      expect(service.create).toHaveBeenCalledWith(createResourceDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    const updateResourceDto = {
      name: 'Updated Resource',
      quantity: 20,
      description: 'Updated Description',
    };

    it('should update a resource', async () => {
      const expectedResult = {
        id: 1,
        ...updateResourceDto,
        status: Status.active,
        updatedAt: new Date(),
      };

      mockResourcesService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(1, updateResourceDto);

      expect(service.update).toHaveBeenCalledWith(1, updateResourceDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should return paginated resources with filters', async () => {
      const query = {
        page: 1,
        limit: 10,
        status: 'active',
        name: 'Test',
      };

      const expectedResult = {
        items: [
          {
            id: 1,
            name: 'Test Resource',
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

      mockResourcesService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll(query);

      expect(service.findAll).toHaveBeenCalledWith({
        page: query.page,
        limit: query.limit,
        status: Status.active,
        name: query.name,
      });
      expect(result).toEqual(expectedResult);
    });

    it('should handle undefined status', async () => {
      const query = {
        page: 1,
        limit: 10,
        name: 'Test',
      };

      const expectedResult = {
        items: [
          {
            id: 1,
            name: 'Test Resource',
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

      mockResourcesService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll(query);

      expect(service.findAll).toHaveBeenCalledWith({
        page: query.page,
        limit: query.limit,
        status: undefined,
        name: query.name,
      });
      expect(result).toEqual(expectedResult);
    });

    it('should handle invalid status', async () => {
      const query = {
        page: 1,
        limit: 10,
        status: 'invalid',
        name: 'Test',
      };

      const expectedResult = {
        items: [
          {
            id: 1,
            name: 'Test Resource',
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

      mockResourcesService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll(query);

      expect(service.findAll).toHaveBeenCalledWith({
        page: query.page,
        limit: query.limit,
        status: undefined,
        name: query.name,
      });
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should return a resource by id', async () => {
      const expectedResult = {
        id: 1,
        name: 'Test Resource',
        quantity: 10,
        description: 'Test Description',
        status: Status.active,
      };

      mockResourcesService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('remove', () => {
    it('should inactivate a resource', async () => {
      const expectedResult = {
        id: 1,
        name: 'Test Resource',
        quantity: 10,
        description: 'Test Description',
        status: Status.inactive,
        updatedAt: new Date(),
      };

      mockResourcesService.remove.mockResolvedValue(expectedResult);

      const result = await controller.remove(1);

      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual(expectedResult);
    });
  });
}); 