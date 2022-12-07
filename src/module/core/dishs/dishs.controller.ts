import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiBody, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { DishsService } from './dishs.service';
import { CreateDishDto } from './dto/create-dish.dto';
import { DishStatus } from './entities/dish.entity';

@ApiTags('Dish')
@Controller('dishs')
export class DishsController {
  constructor(private readonly dishsService: DishsService) {}

  @ApiBody({
    schema: {
      type: 'object',
      example: {
        nameDish: 'Cơm',
        ingredients: [{ name: 'Gao', calories: 100, mass: 0.2 }],
        calories: 100,
        unitPrice: 5000,
        dishStatus: DishStatus.SIDE_DISH,
      },
    },
  })
  @Post()
  async create(@Body() createDishDto: CreateDishDto) {
    return await this.dishsService.create(createDishDto);
  }

  @ApiQuery({
    required: false,
    name: 'limit',
    example: 10,
  })
  @ApiQuery({
    required: false,
    name: 'page',
    example: 1,
  })
  @ApiQuery({
    required: false,
    name: 'filter.dishStatus',
    enum: DishStatus,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 200, description: 'OK' })
  @Get()
  findAll(@Paginate() query: PaginateQuery) {
    return this.dishsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dishsService.findOne(id);
  }

  @Patch('superUpdate')
  async superUpdate() {
    return await this.dishsService.superUpdate();
  }
  @ApiBody({
    schema: {
      type: 'object',
      example: {
        nameDish: 'Cơm',
        ingredients: [{ name: 'Gao', calories: 100, mass: 0.2 }],
        calories: 100,
        unitPrice: 5000,
        dishStatus: DishStatus.SIDE_DISH,
      },
    },
  })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return await this.dishsService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dishsService.remove(id);
  }

  @Post('add')
  async add() {
    return await this.dishsService.add();
  }
}
