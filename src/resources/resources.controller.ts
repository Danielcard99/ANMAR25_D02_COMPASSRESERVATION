import {
  Controller,
  Post,
  Body,
  Param,
  Put,
  Get,
  Query,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { Status } from 'generated/prisma';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@Controller('resources')
@UseGuards(JwtAuthGuard)
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Post()
  create(@Body() createResourceDto: CreateResourceDto) {
    return this.resourcesService.create(createResourceDto);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateResourceDto: UpdateResourceDto,
  ) {
    return this.resourcesService.update(id, updateResourceDto);
  }

  @Get()
  findAll(
    @Query('page') page: number,
    @Query('status') status?: string,
    @Query('name') name?: string,
  ) {
    const statusEnum = status
      ? (Status[status.toUpperCase() as keyof typeof Status] as Status)
      : undefined;

    return this.resourcesService.findAll(page, statusEnum, name);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.resourcesService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.resourcesService.remove(id);
  }
}
