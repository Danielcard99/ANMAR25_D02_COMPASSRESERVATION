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
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { ClientService } from './clients.service';
import { UpdateClientDto } from './dto/update-client.dto';
import { FilterClientDto } from './dto/filter-client.dto';

@UsePipes(new ValidationPipe())
@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  create(@Body() data: CreateClientDto) {
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
  async list(@Query() filters: FilterClientDto) {
    return this.clientService.list(filters);
  }

  @Get(':id')
  async listById(@Param('id', ParseIntPipe) id: number) {
    return this.clientService.listById(id);
  }

  @Delete(':id')
  async inactivate(@Param('id', ParseIntPipe) id: number) {
    await this.clientService.inactivate(id);
  }
}
