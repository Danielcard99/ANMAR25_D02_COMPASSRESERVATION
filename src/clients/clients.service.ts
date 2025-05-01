import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { PrismaService } from 'src/prisma/prisma.service';

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
}
