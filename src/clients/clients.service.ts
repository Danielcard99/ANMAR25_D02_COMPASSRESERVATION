import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateClientDto } from './dto/update-client.dto';
import { FilterClientDto } from './dto/filter-client.dto';
import { Prisma } from 'generated/prisma';

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

  async list(filters: FilterClientDto) {
    const page = isNaN(Number(filters.page)) ? 1 : Number(filters.page);
    const limit = isNaN(Number(filters.limit)) ? 5 : Number(filters.limit);

    const skip = (page - 1) * limit;
    const take = limit;

    const whereConditions: Prisma.ClientWhereInput = {};

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

    const [clients, totalCount] = await Promise.all([
      this.prisma.client.findMany({
        skip,
        take,
        where: whereConditions,
      }),
      this.prisma.client.count({ where: whereConditions }),
    ]);

    return {
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
      clients,
    };
  }

  async listById(id: number) {
    return this.exists(id);
  }

  async exists(id: number) {
    const user = await this.prisma.client.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`user ${id} does not exist`);
    }

    return user;
  }
}
