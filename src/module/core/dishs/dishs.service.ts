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
    const name = `Kem
    Dưa hấu
    Dưa lê
    Dưa gang
    Vải
    Nhãn
    Sữa bò tươi
    Váng sữa
    Sữa chua
    Sinh tố đu đủ
    Sinh tố bơ
    Sinh tố xoài
    Nho 
    Chuối
    Mận
    Lê
    Quýt
    Nước dừa
    Nước chanh tươi
    Nước cam tươi
    Kẹo
    Bánh ngọt
    Bánh quy Cosy
    Omai
    Thạch rau câu
    Vú sữa
    Sữa đậu nành
    Dứa
    Mít dai
    Na
    Chôm chôm
    Hồng xiêm
    Mơ
    Mít mật`
      .split('\n')
      .map((item) => {
        return item.trim();
      });
    console.log(
      '🚀 ~ file: dishs.service.ts ~ line 48 ~ DishsService ~ add ~ name',
      name,
    );

    const Kcal = `175
    16
    23
    20
    43
    48
    74
    100
    61
    35
    80
    69
    14
    66
    20
    45
    38
    19
    23
    37
    385
    400
    480
    355
    50
    42
    28
    29
    48
    64
    72
    48
    46
    62`
      .split('\n')
      .map((item) => {
        return Number(item.trim());
      });
    console.log(
      '🚀 ~ file: dishs.service.ts ~ line 48 ~ DishsService ~ add ~ name',
      Kcal,
    );
    const price = `10
    6
    5
    10
    6
    6
    8
    9
    8
    12
    15
    13
    19
    5
    6
    7
    6
    15
    12
    15
    10
    15
    10
    12
    10
    9
    7
    9
    15
    12
    13
    12
    11
    18`
      .split('\n')
      .map((item) => {
        return Number(item.trim()) * 1000;
      });

    console.log(
      '🚀 ~ file: dishs.service.ts ~ line 48 ~ DishsService ~ add ~ name',
      price,
    );

    const status = DishStatus.DESSERTS;

    const dataDto = [];

    for (let i = 0; i < 31; i++) {
      const ts = {
        nameDish: name[i],
        calories: Kcal[i],
        unitPrice: price[i],
        position: i + 1,
        dishStatus: status,
      };
      dataDto.push(ts);
    }
    console.log(
      '🚀 ~ file: dishs.service.ts ~ line 176 ~ DishsService ~ add ~ dataDto',
      dataDto,
    );
    // return await this.dishRepository.save(dataDto);
  }

  findOne(id: string) {
    return this.dishRepository.findOne({ where: { id: id } });
  }

  update(id: string, updateDishDto: CreateDishDto) {
    return this.dishRepository.update(id, updateDishDto);
  }

  async superUpdate() {
    const list = await this.dishRepository.find({
      where: { dishStatus: DishStatus.SIDE_DISH },
    });
    console.log(
      '🚀 ~ file: dishs.service.ts ~ line 209 ~ DishsService ~ Update ~ list',
    );
    for (let i = 1; i <= list.length; i++) {
      await this.dishRepository.update(list[i - 1].id, { position: i });
    }
  }
  remove(id: string) {
    return this.dishRepository.softDelete(id);
  }
}
