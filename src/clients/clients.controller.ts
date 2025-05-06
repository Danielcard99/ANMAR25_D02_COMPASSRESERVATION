import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { ClientService } from './clients.service';
import { UpdateClientDto } from './dto/update-client.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Status } from 'generated/prisma';

@UsePipes(new ValidationPipe())
@UseGuards(JwtAuthGuard)
@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  async create(@Body() data: CreateClientDto) {
    return this.clientService.create(data);
  }

  @Patch(':id')
  async update(
    @Body() data: UpdateClientDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.clientService.update(id, data);
  }

  @Get()
  async list(@Query() query: PaginationDto & { status?: string; name?: string; cpf?: string }) {
    const { status, name, cpf, ...pagination } = query;
    let statusEnum: Status | undefined;
    if (status) {
      const upperStatus = status.toUpperCase();
      if (upperStatus === 'ACTIVE') {
        statusEnum = Status.active;
      } else if (upperStatus === 'INACTIVE') {
        statusEnum = Status.inactive;
      }
    }

    return this.clientService.list({ ...pagination, status: statusEnum, name, cpf });
  }

  @Get(':id')
  async listById(@Param('id', ParseIntPipe) id: number) {
    return this.clientService.listById(id);
  }

  @Delete(':id')
  async inactivate(@Param('id', ParseIntPipe) id: number) {
    return this.clientService.inactivate(id);
  }
}
