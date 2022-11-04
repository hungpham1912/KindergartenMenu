import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterOperator, paginate, PaginateQuery } from 'nestjs-paginate';
import { Repository } from 'typeorm';
import { CreateDishDto } from './dto/create-dish.dto';
import { Dish, DishStatus } from './entities/dish.entity';

@Injectable()
export class DishsService {
  constructor(
    @InjectRepository(Dish)
    private readonly dishRepository: Repository<Dish>,
  ) {}
  async create(createDishDto: CreateDishDto) {
    return await this.dishRepository.save(createDishDto);
  }

  findAll(query: PaginateQuery) {
    const { limit, page, filter } = query;
    let findClause = {};

    if (filter?.dishStatus) {
      findClause = { dishStatus: [FilterOperator.EQ] };
    }
    const queryBuilder = this.dishRepository.createQueryBuilder('vouchers');

    return paginate(query, queryBuilder, {
      maxLimit: limit,
      defaultLimit: page,
      sortableColumns: ['createdAt'],
      defaultSortBy: [['createdAt', 'DESC']],
      filterableColumns: { ...findClause },
    });
  }

  async add() {
    return await this.dishRepository.find({
      where: { dishStatus: DishStatus.SIDE_DISH },
      select: {
        id: true,
        position: true,
        nameDish: true,
      },
    });
  }

  findOne(id: string) {
    return this.dishRepository.findOne({ where: { id: id } });
  }

  update(id: string, updateDishDto: CreateDishDto) {
    return this.dishRepository.update(id, updateDishDto);
  }

  async superUpdate(id: string, createDishDto: any) {
    await this.dishRepository.update(id, createDishDto);
  }
  remove(id: string) {
    return this.dishRepository.softDelete(id);
  }
}
