import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UseGuards
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Status } from 'generated/prisma';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  

  @Post()
  async create(@Body() { name, email, telephone, password }) {
    const result = await this.userService.create({ name, email, telephone, password });
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() query: PaginationDto & { name?: string; email?: string; status?: string }) {
    const { status, name, email, ...pagination } = query;
    let statusEnum: Status | undefined;
    if (status) {
      const upperStatus = status.toUpperCase();
      if (upperStatus === 'ACTIVE') {
        statusEnum = Status.active;
      } else if (upperStatus === 'INACTIVE') {
        statusEnum = Status.inactive;
      }
    }

    return this.userService.findAll({ ...pagination, status: statusEnum, name, email });
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() { name, email, telephone, password },
  ) {
    return this.userService.update(id, { name, email, telephone, password });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.delete(+id);
  }
}
