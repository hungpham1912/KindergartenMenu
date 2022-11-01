import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dish, DishStatus } from '../dishs/entities/dish.entity';
import { DishMeal } from '../dish_meal/entities/dish_meal.entity';
import { Meal } from './entities/meal.entity';

@Injectable()
export class MealsService {
  constructor(
    @InjectRepository(Meal)
    private readonly mealRepository: Repository<Meal>,
    @InjectRepository(DishMeal)
    private readonly mealDishRepository: Repository<DishMeal>,
    @InjectRepository(Dish)
    private readonly dishRepository: Repository<Dish>,
  ) {}
  async create() {
    const menuId = 'f21a00dd-0c37-470b-9047-6a578d06bed9';

    const sideDish = await this.dishRepository.find({
      where: { dishStatus: DishStatus.SIDE_DISH },
    });

    const mainDish = await this.dishRepository.find({
      where: { dishStatus: DishStatus.MAIN_DISH },
    });

    const desserts = await this.dishRepository.find({
      where: { dishStatus: DishStatus.DESSERTS },
    });

    const dto = [];

    for (let i = 2; i < 8; i++) {
      const ms = {
        menuId: menuId,
        calories:
          sideDish[i + 3].calories +
          mainDish[i + 3].calories +
          desserts[i + 3].calories,
        price:
          sideDish[i + 3].unitPrice +
          mainDish[i + 3].unitPrice +
          desserts[i + 3].unitPrice,
        timeOfWeek: i,
      };
      dto.push(ms);
      const meal = await this.mealRepository.save(ms);
      await this.mealDishRepository.save([
        {
          dishId: sideDish[i + 3].id,
          mealId: meal.id,
        },
        {
          dishId: mainDish[i + 3].id,
          mealId: meal.id,
        },
        {
          dishId: desserts[i + 3].id,
          mealId: meal.id,
        },
      ]);
    }
  }

  findAll() {
    return this.mealRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} meal`;
  }
}
