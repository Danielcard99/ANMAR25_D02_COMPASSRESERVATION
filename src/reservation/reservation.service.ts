import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { OrderStatus } from 'generated/prisma';

@Injectable()
export class ReservationService {
  constructor(private prisma: PrismaService) {}

  async create(createReservationDto: CreateReservationDto) {
    const { clientId, spaceId, resourceIds, startDate, endDate } = createReservationDto;

    const client = await this.prisma.client.findFirst({
      where: { id: clientId, status: 'active' },
    });
    if (!client) {
      throw new NotFoundException('Client not found or inactive');
    }

    const space = await this.prisma.space.findFirst({
      where: { id: spaceId, status: 'active' },
    });
    if (!space) {
      throw new NotFoundException('Space not found or inactive');
    }

    const resources = await this.prisma.resource.findMany({
      where: {
        id: { in: resourceIds },
        status: 'active',
      },
    });
    if (resources.length !== resourceIds.length) {
      throw new NotFoundException('One or more resources not found or inactive');
    }

    const overlappingReservation = await this.prisma.order.findFirst({
      where: {
        spaceId,
        status: { in: [OrderStatus.OPEN, OrderStatus.APPROVED] },
        OR: [
          {
            AND: [
              { startDate: { lte: startDate } },
              { endDate: { gt: startDate } },
            ],
          },
          {
            AND: [
              { startDate: { lt: endDate } },
              { endDate: { gte: endDate } },
            ],
          },
        ],
      },
    });

    if (overlappingReservation) {
      throw new BadRequestException('There is already a reservation for this time slot');
    }

    const reservation = await this.prisma.order.create({
      data: {
        clientId,
        spaceId,
        startDate,
        endDate,
        status: OrderStatus.OPEN,
        resources: {
          create: resourceIds.map(resourceId => ({
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

    await Promise.all(
      resources.map(resource =>
        this.prisma.resource.update({
          where: { id: resource.id },
          data: {
            quantity: resource.quantity - 1,
          },
        }),
      ),
    );

    return reservation;
  }

  async update(id: number, updateReservationDto: UpdateReservationDto) {
    const { startDate, endDate, status } = updateReservationDto;

    const reservation = await this.prisma.order.findUnique({
      where: { id },
      include: {
        space: true,
      },
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    if (status) {
      if (status === OrderStatus.CANCELED) {
        throw new BadRequestException('Cannot cancel a reservation through update');
      }

      if (status === OrderStatus.APPROVED && reservation.status !== OrderStatus.OPEN) {
        throw new BadRequestException('Only open reservations can be approved');
      }

      if (status === OrderStatus.DELIVERED && reservation.status !== OrderStatus.APPROVED) {
        throw new BadRequestException('Only approved reservations can be delivered');
      }
    }

    if (startDate || endDate) {
      const newStartDate = startDate || reservation.startDate;
      const newEndDate = endDate || reservation.endDate;

      const overlappingReservation = await this.prisma.order.findFirst({
        where: {
          spaceId: reservation.spaceId,
          id: { not: id },
          status: { in: [OrderStatus.OPEN, OrderStatus.APPROVED] },
          OR: [
            {
              AND: [
                { startDate: { lte: newStartDate } },
                { endDate: { gt: newStartDate } },
              ],
            },
            {
              AND: [
                { startDate: { lt: newEndDate } },
                { endDate: { gte: newEndDate } },
              ],
            },
          ],
        },
      });

      if (overlappingReservation) {
        throw new BadRequestException('There is already a reservation for this time slot');
      }
    }

    const updatedReservation = await this.prisma.order.update({
      where: { id },
      data: {
        startDate,
        endDate,
        status,
        updatedAt: new Date(),
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

    return updatedReservation;
  }

  async findAll(page: number = 1, cpf?: string, status?: OrderStatus) {
    const take = 10;
    const skip = (page - 1) * take;

    const where = {
      ...(cpf && {
        client: {
          cpf,
        },
      }),
      ...(status && { status }),
    };

    const [reservations, total] = await Promise.all([
      this.prisma.order.findMany({
        skip,
        take,
        where,
        include: {
          client: true,
          space: true,
          resources: {
            include: {
              resource: true,
            },
          },
        },
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      data: reservations,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / take),
      },
    };
  }

  async findOne(id: number) {
    const reservation = await this.prisma.order.findUnique({
      where: { id },
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

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    return reservation;
  }

  async remove(id: number) {
    const reservation = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    if (reservation.status !== OrderStatus.OPEN) {
      throw new BadRequestException('Only open reservations can be canceled');
    }

    const updatedReservation = await this.prisma.order.update({
      where: { id },
      data: {
        status: OrderStatus.CANCELED,
        updatedAt: new Date(),
      },
    });

    const resources = await this.prisma.orderResource.findMany({
      where: { orderId: id },
      include: { resource: true },
    });

    await Promise.all(
      resources.map(({ resource }) =>
        this.prisma.resource.update({
          where: { id: resource.id },
          data: {
            quantity: resource.quantity + 1,
          },
        }),
      ),
    );

    return updatedReservation;
  }
}
