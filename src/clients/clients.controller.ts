import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { ClientService } from './clients.service';

@UsePipes(new ValidationPipe())
@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  create(@Body() data: CreateClientDto) {
    return this.clientService.create(data);
  }
}
