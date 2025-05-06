import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { Status } from 'generated/prisma';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginationService } from '../common/services/pagination.service';

@Injectable()
export class ResourcesService {
  constructor(private prisma: PrismaService) {}

  async create(createResourceDto: CreateResourceDto) {
    const { name, quantity, description } = createResourceDto;
    const resource = await this.prisma.resource.create({
      data: {
        name,
        quantity,
        description,
      },
    });
    return resource;
  }

  async update(id: number, updateResourceDto: UpdateResourceDto) {
    const resource = await this.prisma.resource.findUnique({
      where: { id },
    });
    if (!resource) {
      throw new NotFoundException('Resource not found');
    }

    const updatedResource = await this.prisma.resource.update({
      where: { id },
      data: {
        ...updateResourceDto,
        updatedAt: new Date(),
      },
    });
    return updatedResource;
  }

  async findAll(query: PaginationDto & { status?: Status; name?: string }) {
    const { status, name } = query;

    return PaginationService.paginate(
      () => this.prisma.resource.findMany({
        where: {
          status,
          name: name ? { contains: name } : undefined,
        },
        orderBy: { createdAt: 'desc' },
      }),
      () => this.prisma.resource.count({
        where: {
          status,
          name: name ? { contains: name } : undefined,
        },
      }),
      query,
    );
  }

  async findOne(id: number) {
    const resource = await this.prisma.resource.findUnique({
      where: { id },
    });
    if (!resource) {
      throw new NotFoundException('Resource not found');
    }
    return resource;
  }

  async remove(id: number) {
    const resource = await this.prisma.resource.findUnique({
      where: { id },
    });
    if (!resource) {
      throw new NotFoundException('Resource not found');
    }

    const updatedResource = await this.prisma.resource.update({
      where: { id },
      data: {
        status: Status.inactive,
        updatedAt: new Date(),
      },
    });
    return updatedResource;
  }
}
