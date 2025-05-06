import { Test, TestingModule } from '@nestjs/testing';
import { ReservationService } from './reservation.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PaginationService } from '../common/services/pagination.service';
import { OrderStatus } from 'generated/prisma';

jest.mock('../common/services/pagination.service', () => ({
  PaginationService: {
    paginate: jest.fn(),
  },
}));

describe('ReservationService', () => {
  let service: ReservationService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    client: {
      findFirst: jest.fn(),
    },
    space: {
      findFirst: jest.fn(),
    },
    resource: {
      findMany: jest.fn(),
      update: jest.fn(),
    },
    order: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
    orderResource: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ReservationService>(ReservationService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createReservationDto = {
      clientId: 1,
      spaceId: 1,
      resourceIds: [1, 2],
      startDate: new Date('2024-01-01T10:00:00Z'),
      endDate: new Date('2024-01-01T12:00:00Z'),
    };

    const mockClient = {
      id: 1,
      status: 'active',
    };

    const mockSpace = {
      id: 1,
      status: 'active',
    };

    const mockResources = [
      { id: 1, quantity: 5 },
      { id: 2, quantity: 3 },
    ];

    it('should create a new reservation successfully', async () => {
      mockPrismaService.client.findFirst.mockResolvedValue(mockClient);
      mockPrismaService.space.findFirst.mockResolvedValue(mockSpace);
      mockPrismaService.resource.findMany.mockResolvedValue(mockResources);
      mockPrismaService.order.findFirst.mockResolvedValue(null);
      mockPrismaService.order.create.mockResolvedValue({
        id: 1,
        clientId: createReservationDto.clientId,
        spaceId: createReservationDto.spaceId,
        startDate: createReservationDto.startDate,
        endDate: createReservationDto.endDate,
        status: OrderStatus.OPEN,
        client: mockClient,
        space: mockSpace,
        resources: mockResources.map(r => ({ resource: r })),
      });

      const result = await service.create(createReservationDto);

      expect(mockPrismaService.order.create).toHaveBeenCalledWith({
        data: {
          clientId: createReservationDto.clientId,
          spaceId: createReservationDto.spaceId,
          startDate: createReservationDto.startDate,
          endDate: createReservationDto.endDate,
          status: OrderStatus.OPEN,
          resources: {
            create: createReservationDto.resourceIds.map(resourceId => ({
              resourceId,
            })),
          },
        },
        include: {
          client: true,
          space: true,
          resources: {
            include: {
              resource: true,
            },
          },
        },
      });

      expect(mockPrismaService.resource.update).toHaveBeenCalledTimes(2);
      expect(result).toEqual({
        id: 1,
        clientId: createReservationDto.clientId,
        spaceId: createReservationDto.spaceId,
        startDate: createReservationDto.startDate,
        endDate: createReservationDto.endDate,
        status: OrderStatus.OPEN,
        client: mockClient,
        space: mockSpace,
        resources: mockResources.map(r => ({ resource: r })),
      });
    });

    it('should throw NotFoundException when client is not found or inactive', async () => {
      mockPrismaService.client.findFirst.mockResolvedValue(null);

      await expect(service.create(createReservationDto)).rejects.toThrow(
        new NotFoundException('Client not found or inactive'),
      );
    });

    it('should throw NotFoundException when space is not found or inactive', async () => {
      mockPrismaService.client.findFirst.mockResolvedValue(mockClient);
      mockPrismaService.space.findFirst.mockResolvedValue(null);

      await expect(service.create(createReservationDto)).rejects.toThrow(
        new NotFoundException('Space not found or inactive'),
      );
    });

    it('should throw NotFoundException when resources are not found or inactive', async () => {
      mockPrismaService.client.findFirst.mockResolvedValue(mockClient);
      mockPrismaService.space.findFirst.mockResolvedValue(mockSpace);
      mockPrismaService.resource.findMany.mockResolvedValue([mockResources[0]]);

      await expect(service.create(createReservationDto)).rejects.toThrow(
        new NotFoundException('One or more resources not found or inactive'),
      );
    });

    it('should throw BadRequestException when there is an overlapping reservation', async () => {
      mockPrismaService.client.findFirst.mockResolvedValue(mockClient);
      mockPrismaService.space.findFirst.mockResolvedValue(mockSpace);
      mockPrismaService.resource.findMany.mockResolvedValue(mockResources);
      mockPrismaService.order.findFirst.mockResolvedValue({ id: 2 });

      await expect(service.create(createReservationDto)).rejects.toThrow(
        new BadRequestException('There is already a reservation for this time slot'),
      );
    });
  });

  describe('update', () => {
    const updateReservationDto = {
      startDate: new Date('2024-01-02T10:00:00Z'),
      endDate: new Date('2024-01-02T12:00:00Z'),
      status: OrderStatus.APPROVED,
    };

    const mockReservation = {
      id: 1,
      status: OrderStatus.OPEN,
      spaceId: 1,
      startDate: new Date('2024-01-01T10:00:00Z'),
      endDate: new Date('2024-01-01T12:00:00Z'),
      space: { id: 1 },
    };

    it('should update a reservation successfully', async () => {
      mockPrismaService.order.findUnique.mockResolvedValue(mockReservation);
      mockPrismaService.order.findFirst.mockResolvedValue(null);
      mockPrismaService.order.update.mockResolvedValue({
        ...mockReservation,
        ...updateReservationDto,
      });

      const result = await service.update(1, updateReservationDto);

      expect(mockPrismaService.order.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          ...updateReservationDto,
          updatedAt: expect.any(Date),
        },
        include: {
          client: true,
          space: true,
          resources: {
            include: {
              resource: true,
            },
          },
        },
      });
      expect(result).toEqual({
        ...mockReservation,
        ...updateReservationDto,
      });
    });

    it('should throw NotFoundException when reservation is not found', async () => {
      mockPrismaService.order.findUnique.mockResolvedValue(null);

      await expect(service.update(999, updateReservationDto)).rejects.toThrow(
        new NotFoundException('Reservation not found'),
      );
    });

    it('should throw BadRequestException when trying to cancel through update', async () => {
      mockPrismaService.order.findUnique.mockResolvedValue(mockReservation);

      await expect(
        service.update(1, { status: OrderStatus.CANCELED }),
      ).rejects.toThrow(
        new BadRequestException('Cannot cancel a reservation through update'),
      );
    });

    it('should throw BadRequestException when trying to approve non-open reservation', async () => {
      mockPrismaService.order.findUnique.mockResolvedValue({
        ...mockReservation,
        status: OrderStatus.APPROVED,
      });

      await expect(
        service.update(1, { status: OrderStatus.APPROVED }),
      ).rejects.toThrow(
        new BadRequestException('Only open reservations can be approved'),
      );
    });

    it('should throw BadRequestException when trying to deliver non-approved reservation', async () => {
      mockPrismaService.order.findUnique.mockResolvedValue({
        ...mockReservation,
        status: OrderStatus.OPEN,
      });

      await expect(
        service.update(1, { status: OrderStatus.DELIVERED }),
      ).rejects.toThrow(
        new BadRequestException('Only approved reservations can be delivered'),
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated reservations with filters', async () => {
      const query = {
        page: 1,
        limit: 10,
        cpf: '12345678900',
        status: OrderStatus.OPEN,
      };

      const mockPaginatedResponse = {
        items: [
          {
            id: 1,
            client: { cpf: '12345678900' },
            status: OrderStatus.OPEN,
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

      (PaginationService.paginate as jest.Mock).mockResolvedValue(mockPaginatedResponse);

      const result = await service.findAll(query);

      expect(PaginationService.paginate).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Function),
        query,
      );
      expect(result).toEqual(mockPaginatedResponse);
    });
  });

  describe('findOne', () => {
    it('should return a reservation by id', async () => {
      const mockReservation = {
        id: 1,
        client: { id: 1 },
        space: { id: 1 },
        resources: [{ resource: { id: 1 } }],
      };

      mockPrismaService.order.findUnique.mockResolvedValue(mockReservation);

      const result = await service.findOne(1);

      expect(mockPrismaService.order.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          client: true,
          space: true,
          resources: {
            include: {
              resource: true,
            },
          },
        },
      });
      expect(result).toEqual(mockReservation);
    });

    it('should throw NotFoundException when reservation is not found', async () => {
      mockPrismaService.order.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(
        new NotFoundException('Reservation not found'),
      );
    });
  });

  describe('remove', () => {
    it('should cancel an open reservation successfully', async () => {
      const mockReservation = {
        id: 1,
        status: OrderStatus.OPEN,
      };

      const mockOrderResources = [
        { resource: { id: 1, quantity: 5 } },
        { resource: { id: 2, quantity: 3 } },
      ];

      mockPrismaService.order.findUnique.mockResolvedValue(mockReservation);
      mockPrismaService.orderResource.findMany.mockResolvedValue(mockOrderResources);
      mockPrismaService.order.update.mockResolvedValue({
        ...mockReservation,
        status: OrderStatus.CANCELED,
      });

      const result = await service.remove(1);

      expect(mockPrismaService.order.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          status: OrderStatus.CANCELED,
          updatedAt: expect.any(Date),
        },
      });

      expect(mockPrismaService.resource.update).toHaveBeenCalledTimes(2);
      expect(result).toEqual({
        ...mockReservation,
        status: OrderStatus.CANCELED,
      });
    });

    it('should throw NotFoundException when reservation is not found', async () => {
      mockPrismaService.order.findUnique.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(
        new NotFoundException('Reservation not found'),
      );
    });

    it('should throw BadRequestException when trying to cancel non-open reservation', async () => {
      mockPrismaService.order.findUnique.mockResolvedValue({
        id: 1,
        status: OrderStatus.APPROVED,
      });

      await expect(service.remove(1)).rejects.toThrow(
        new BadRequestException('Only open reservations can be canceled'),
      );
    });
  });
}); 