import { Controller, Get, Post, Body, Param, Delete, Patch, Query } from '@nestjs/common';
import { SpaceService } from './space.service';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Status } from 'generated/prisma';

@Controller('spaces')
@UseGuards(AuthGuard('jwt')) 
export class SpaceController {
  constructor(private readonly spaceService: SpaceService) {}

  @Post()
  create(@Body() createSpaceDto: CreateSpaceDto) {
    return this.spaceService.create(createSpaceDto);
  }

  @Get()
  findAll(@Query() query: PaginationDto & { status?: string; name?: string }) {
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

    return this.spaceService.findAll({ ...pagination, status: statusEnum, name });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.spaceService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSpaceDto: UpdateSpaceDto) {
    return this.spaceService.update(id, updateSpaceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.spaceService.remove(id);
  }
}
