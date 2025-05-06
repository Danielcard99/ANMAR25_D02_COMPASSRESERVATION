import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateClientDto } from './dto/update-client.dto';
import { FilterClientDto } from './dto/filter-client.dto';
import { Status, Prisma } from 'generated/prisma';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginationService } from '../common/services/pagination.service';

@Injectable()
export class ClientService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateClientDto) {
    const { email, birthDate, cpf, ...rest } = data;

    const existingClient = await this.prisma.client.findFirst({
      where: {
        OR: [{ cpf }, { email }],
      },
    });

    if (existingClient) {
      if (existingClient.cpf === cpf) {
        throw new BadRequestException('cpf already registered');
      }

      if (existingClient.email === email) {
        throw new BadRequestException('email already registered');
      }
    }

    return this.prisma.client.create({
      data: {
        ...rest,
        cpf,
        email,
        birthDate: new Date(birthDate),
      },
    });
  }

  async update(id: number, data: UpdateClientDto) {
    await this.exists(id);

    const { birthDate, ...rest } = data;

    return this.prisma.client.update({
      where: { id },
      data: {
        ...rest,
        ...(birthDate && { birthDate: new Date(birthDate) }),
      },
    });
  }

  async list(filters: FilterClientDto & PaginationDto) {
    const whereConditions: any = {};

    if (filters.email) {
      whereConditions.email = { contains: filters.email };
    }

    if (filters.name) {
      whereConditions.name = { contains: filters.name };
    }

    if (filters.cpf) {
      whereConditions.cpf = { contains: filters.cpf };
    }

    if (filters.status) {
      whereConditions.status = filters.status;
    }

    return PaginationService.paginate(
      () => this.prisma.client.findMany({
        skip: (filters.page - 1) * filters.limit,
        take: filters.limit,
        where: whereConditions,
      }),
      () => this.prisma.client.count({ where: whereConditions }),
      filters,
    );
  }

  async listById(id: number) {
    return this.exists(id);
  }

  async inactivate(id: number) {
    const client = await this.prisma.client.findUnique({
      where: { id },
      include: { orders: true },
    });

    if (!client) {
      throw new NotFoundException(`client ${id} does not exist`);
    }

    const hasOpenOrApprovedOrders = client.orders.some(
      (order) => order.status === 'OPEN' || order.status === 'APPROVED',
    );

    if (hasOpenOrApprovedOrders) {
      throw new BadRequestException(
        `cannot inactivate client ${id} with open or approved orders`,
      );
    }

    return this.prisma.client.update({
      where: { id },
      data: { status: Status.inactive, updatedAt: new Date() },
    });
  }

  async exists(id: number) {
    const client = await this.prisma.client.findUnique({
      where: { id },
    });

    if (!client) {
      throw new NotFoundException(`client ${id} does not exist`);
    }

    return client;
  }
}
