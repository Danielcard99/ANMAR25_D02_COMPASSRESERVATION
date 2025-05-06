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
  findAll(
    @Query() paginationDto: PaginationDto,
    @Query('name') name?: string,
    @Query('email') email?: string,
    @Query('status') status?: string,
  ) {
    return this.userService.findAll({
      ...paginationDto,
      name,
      email,
      status,
    });
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
