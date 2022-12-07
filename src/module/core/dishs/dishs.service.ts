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
    const result = await this.dishRepository.find({
      where: { dishStatus: DishStatus.SIDE_DISH },
      select: {
        id: true,
        position: true,
        nameDish: true,
      },
    });
    return result.sort((a, b) => {
      const nameA = a.position; // ignore upper and lowercase
      const nameB = b.position; // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }

      // names must be equal
      return 0;
    });
  }

  findOne(id: string) {
    return this.dishRepository.findOne({ where: { id: id } });
  }

  update(id: string, updateDishDto: CreateDishDto) {
    return this.dishRepository.update(id, updateDishDto);
  }

  async superUpdate() {
    const t = await this.dishRepository.findOne({
      where: { position: 13 },
    });

    await this.dishRepository.update(t.id, {
      nameDish: 'Canh bầu nấu tôm',
      calories: 110,
      unitPrice: 25000,
      position: 3,
    });
  }
  remove(id: string) {
    return this.dishRepository.softDelete(id);
  }
}
