import { Test, TestingModule } from '@nestjs/testing';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { OrderStatus } from 'generated/prisma';

describe('ReservationController', () => {
  let controller: ReservationController;
  let service: ReservationService;

  const mockReservationService = {
    create: jest.fn(),
    update: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationController],
      providers: [
        {
          provide: ReservationService,
          useValue: mockReservationService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ReservationController>(ReservationController);
    service = module.get<ReservationService>(ReservationService);
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

    it('should create a new reservation', async () => {
      const expectedResult = {
        id: 1,
        ...createReservationDto,
        status: OrderStatus.OPEN,
      };

      mockReservationService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createReservationDto);

      expect(service.create).toHaveBeenCalledWith(createReservationDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    const updateReservationDto = {
      startDate: new Date('2024-01-02T10:00:00Z'),
      endDate: new Date('2024-01-02T12:00:00Z'),
      status: OrderStatus.APPROVED,
    };

    it('should update a reservation', async () => {
      const expectedResult = {
        id: 1,
        ...updateReservationDto,
      };

      mockReservationService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(1, updateReservationDto);

      expect(service.update).toHaveBeenCalledWith(1, updateReservationDto);
      expect(result).toEqual(expectedResult);
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

      const expectedResult = {
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

      mockReservationService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll(query);

      expect(service.findAll).toHaveBeenCalledWith(query);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should return a reservation by id', async () => {
      const expectedResult = {
        id: 1,
        client: { id: 1 },
        space: { id: 1 },
        resources: [{ resource: { id: 1 } }],
      };

      mockReservationService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('remove', () => {
    it('should cancel a reservation', async () => {
      const expectedResult = {
        id: 1,
        status: OrderStatus.CANCELED,
      };

      mockReservationService.remove.mockResolvedValue(expectedResult);

      const result = await controller.remove(1);

      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual(expectedResult);
    });
  });
}); 