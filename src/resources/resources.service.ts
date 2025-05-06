import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { Status } from 'generated/prisma';

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

  async findAll(page: number = 1, status?: Status, name?: string) {
    const take = 10;
    const skip = (page - 1) * take;

    const resources = await this.prisma.resource.findMany({
      skip,
      take,
      where: {
        status,
        name: {
          contains: name,
        },
      },
    });
    return resources;
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
        status: 'inactive',
        updatedAt: new Date(),
      },
    });
    return updatedResource;
  }
}
