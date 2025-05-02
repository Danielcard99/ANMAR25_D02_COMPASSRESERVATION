import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { ClientService } from './clients.service';
import { UpdateClientDto } from './dto/update-client.dto';

@UsePipes(new ValidationPipe())
@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  create(@Body() data: CreateClientDto) {
    return this.clientService.create(data);
  }

  @Patch(':id')
  async update(@Body() data: UpdateClientDto, @Param('id') id: number) {
    return this.clientService.update(id, data);
  }
}
