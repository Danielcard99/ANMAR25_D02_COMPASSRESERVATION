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
import { PaginationDto } from '../common/dto/pagination.dto';

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
    @Query() query: PaginationDto & { status?: string; name?: string },
  ) {
    const { status, name, ...pagination } = query;
    let statusEnum: Status | undefined;
    if (status) {
      const upperStatus = status.toUpperCase();
      if (upperStatus === 'ACTIVE') {
        statusEnum = Status.active;
      } else if (upperStatus === 'INACTIVE') {
        statusEnum = Status.inactive;
      }
    }

    return this.resourcesService.findAll({ ...pagination, status: statusEnum, name });
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
