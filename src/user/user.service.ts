import {
  BadRequestException,
  Get,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdatePatchDTO } from './dto/update-patch.dto';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';
import { PaginationService } from '../common/services/pagination.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  private async verifyId(id) {
    const task = await this.prisma.users.findFirst({
      where: {
        id,
      },
    });

    if (!task) {
      throw new NotFoundException('User not found');
    }

    return task;
  }

  async create({ name, email, telephone, password }: CreateUserDto) {
    if (!name) throw new BadRequestException('Please insert name');
    if (!email) throw new BadRequestException('Please insert email');
    if (!telephone) throw new BadRequestException('Please insert telephone');
    if (!password) throw new BadRequestException('Please insert password');

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await this.prisma.users.create({
        data: {
          name,
          email,
          telephone,
          password: hashedPassword,
        },
      });

      const payload = { id: user.id, email: user.email };
      const token = this.jwtService.sign(payload);

      return{
        user,
        token
      }

    } catch (e) {
      throw new InternalServerErrorException('Internal server error');
    }
  }

  async findAll(query: PaginationDto & { name?: string; email?: string; status?: string }) {
    const { name, email, status } = query;

    try {
      const where: any = {};

      if (name) {
        where.name = {
          contains: name,
          mode: 'insensitive',
        };
      }

      if (email) {
        where.email = {
          contains: email,
          mode: 'insensitive',
        };
      }

      if (status) {
        where.status = status;
      }

      return PaginationService.paginate(
        () => this.prisma.users.findMany({
          where,
          select: {
            name: true,
            email: true,
            telephone: true,
          },
          skip: (query.page - 1) * query.limit,
          take: query.limit,
        }),
        () => this.prisma.users.count({ where }),
        query,
      );
    } catch (e) {
      throw new Error('Internal server error');
    }
  }

  async findOne(id: number) {
    await this.verifyId(id);
    try {
      return this.prisma.users.findFirst({
        where: {
          id,
        },
        select: {
          name: true,
          email: true,
          telephone: true,
          status: true,
        },
      });
    } catch (e) {
      throw new InternalServerErrorException('Internal server error');
    }
  }

  async update(
    id: number,
    { name, email, telephone, password }: UpdatePatchDTO,
  ) {
    await this.verifyId(id);

    const updateUser = {
      name,
      email,
      telephone,
      password,
    };

    if (name) updateUser.name = name;
    if (email) updateUser.email = email;
    if (telephone) updateUser.telephone = telephone;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateUser.password = hashedPassword;
    }

    try {
      return this.prisma.users.update({
        where: {
          id,
        },
        data: updateUser,
      });
    } catch (e) {
      throw new InternalServerErrorException('Internal server error');
    }
  }

  async delete(id: number) {
    await this.verifyId(id);

    try {
      const user = await this.prisma.users.findUnique({
        where: { id },
      });

      if (!user) throw new NotFoundException('User not found');

      await this.prisma.users.update({
        where: { id },
        data: {
          status: 'inactive',
          updateAt: new Date(),
        },
      });

      return `success deleting user`;
    } catch (e) {
      throw new InternalServerErrorException('Internal server error');
    }
  }
}
