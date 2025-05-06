import { Test, TestingModule } from '@nestjs/testing';
import { ClientController } from './clients.controller';
import { ClientService } from './clients.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { Status } from 'generated/prisma';

describe('ClientController', () => {
  let controller: ClientController;
  let clientService: ClientService;

  const mockClientService = {
    create: jest.fn(),
    update: jest.fn(),
    list: jest.fn(),
    listById: jest.fn(),
    inactivate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientController],
      providers: [
        {
          provide: ClientService,
          useValue: mockClientService,
        },
      ],
    })
    .overrideGuard(JwtAuthGuard)
    .useValue({ canActivate: () => true })
    .compile();

    controller = module.get<ClientController>(ClientController);
    clientService = module.get<ClientService>(ClientService);
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

    it('should create a new client', async () => {
      const expectedResult = {
        id: 1,
        ...createClientDto,
        birthDate: new Date(createClientDto.birthDate),
      };

      mockClientService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createClientDto);

      expect(clientService.create).toHaveBeenCalledWith(createClientDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    const updateClientDto = {
      name: 'Updated Client',
      email: 'updated@example.com',
      birthDate: '1991-01-01',
    };

    it('should update a client', async () => {
      const expectedResult = {
        id: 1,
        ...updateClientDto,
        birthDate: new Date(updateClientDto.birthDate),
      };

      mockClientService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(updateClientDto, 1);

      expect(clientService.update).toHaveBeenCalledWith(1, updateClientDto);
      expect(result).toEqual(expectedResult);
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

      const expectedResponse = {
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

      mockClientService.list.mockResolvedValue(expectedResponse);

      const result = await controller.list(filters);

      expect(clientService.list).toHaveBeenCalledWith(filters);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('listById', () => {
    it('should return a client by id', async () => {
      const expectedClient = {
        id: 1,
        name: 'Test Client',
        email: 'test@example.com',
        cpf: '12345678900',
      };

      mockClientService.listById.mockResolvedValue(expectedClient);

      const result = await controller.listById(1);

      expect(clientService.listById).toHaveBeenCalledWith(1);
      expect(result).toEqual(expectedClient);
    });
  });

  describe('inactivate', () => {
    it('should inactivate a client', async () => {
      const expectedResult = {
        id: 1,
        status: Status.inactive,
      };

      mockClientService.inactivate.mockResolvedValue(expectedResult);

      const result = await controller.inactivate(1);

      expect(clientService.inactivate).toHaveBeenCalledWith(1);
      expect(result).toEqual(expectedResult);
    });
  });
}); 