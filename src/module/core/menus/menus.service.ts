import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, MoreThan, Repository } from 'typeorm';
import { Dish, DishStatus } from '../dishs/entities/dish.entity';
import { DishMeal } from '../dish_meal/entities/dish_meal.entity';
import {
  GAConstant,
  Individual,
  Meal,
  MealStandard,
  TargetMenu,
} from '../meals/entities/meal.entity';
import { Menu } from './entities/menu.entity';

@Injectable()
export class MenusService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
    @InjectRepository(Meal)
    private readonly mealRepository: Repository<Meal>,
    @InjectRepository(DishMeal)
    private readonly dishMealRepository: Repository<DishMeal>,
    @InjectRepository(Dish)
    private readonly dishRepository: Repository<Dish>,
  ) {}
  delete(id: string) {
    return this.menuRepository.softDelete(id);
  }

  async create() {
    const start = new Date('2022-10-03T08:33:50.180Z');
    const end = new Date('2022-10-08T08:33:50.180Z');
    return await this.menuRepository.save({ startTime: start, endTime: end });
  }
  async genKindergarten() {
    const now = new Date();

    const menu = await this.menuRepository.findOne({
      where: {},
      order: { createdAt: 'DESC' },
    });

    /*
     *********Check menu exist*********
     */
    if (menu) {
      if (now < menu.endTime) return menu;
    }

    const current = now.getDay();
    const diff = now.getDate() - current + (current == 0 ? -6 : 1); // adjust when day is sunday
    const month = now.getMonth();
    const startTime = new Date(now.setDate(diff));

    const endTime = new Date(now.setDate(diff + 6));
    endTime.setUTCMonth(month);

    const createMenu = await this.menuRepository.save({
      startTime: startTime,
      endTime: endTime,
    });
    /*
     *********Handle Genetic Algorithm**********
     */

    let data: TargetMenu = {
      total: 0,
      listMainIds: [],
      listDessertsIds: [],
      listSideIds: [],
    };

    while (data.total < GAConstant.daysOfWeek) {
      /*********Create populations**********/
      const dataPopulation = await this.selectionOptimal();
      const population = this.standardizedPopulation(dataPopulation);
      /*
       *********Selection of pairs of parents**********
       */
      const arraySelect = this.rouletteWheel(population);
      /*
       *********Coding an individual's chromosome**********
       */
      const encodingChromosome = this.encodingChromosome(arraySelect);
      /*
       *********Breeding out a set of children**********
       */
      const childChromosome = this.crossBreeding(encodingChromosome);
      /*
       *********Check the duplicate of main dish**********
       */
      data = this.standardizedIndividual(data, childChromosome);
    }

    await this.createMeals(createMenu.id, data);
    return await this.menuRepository.findOne({ where: { id: createMenu.id } });
  }

  async createMeals(menuId: string, data: TargetMenu) {
    const mainDish = await this.dishRepository.find({
      where: {
        position: In(data.listMainIds),
        dishStatus: DishStatus.MAIN_DISH,
      },
    });

    const sideDish = await this.dishRepository.find({
      where: {
        position: In(data.listSideIds),
        dishStatus: DishStatus.SIDE_DISH,
      },
    });

    const desserts = await this.dishRepository.find({
      where: {
        position: In(data.listDessertsIds),
        dishStatus: DishStatus.DESSERTS,
      },
    });

    const mealsDto = [];

    for (let j = 2; j < GAConstant.daysOfWeek + 2; j++) {
      mealsDto.push({ timeOfWeek: j, menuId: menuId });
    }

    const ds: Meal[] = await this.mealRepository.save(mealsDto);

    let mealDishDto = [];

    for (let j = 0; j < GAConstant.daysOfWeek; j++) {
      const main = mainDish.find((item) => {
        return item.position == data.listMainIds[j];
      });

      const side = sideDish.find((item) => {
        return item.position == data.listSideIds[j];
      });

      const dessert = desserts.find((item) => {
        return item.position == data.listDessertsIds[j];
      });

      mealDishDto = mealDishDto.concat([
        { mealId: ds[j].id, dishId: main.id },
        { mealId: ds[j].id, dishId: side.id },
        { mealId: ds[j].id, dishId: dessert.id },
      ]);
    }

    return await this.dishMealRepository.save(mealDishDto);
  }

  crossBreeding(population: Individual[]) {
    const point = Math.floor(
      Math.random() * (GAConstant.numberBitBinary * 3 - 2),
    );

    const child: string[] = [];

    for (let i = 0; i < population.length; i = i + 2) {
      const father = population[i].chromosome;
      const mother = population[i + 1].chromosome;

      const child1 = father.slice(0, point) + mother.slice(point);

      child.push(child1);

      const child2 = mother.slice(0, point) + father.slice(point);
      child.push(child2);
    }

    return child;
  }

  standardizedIndividual(oldData: TargetMenu, newData: string[]) {
    const list1 = oldData.listMainIds;
    const list2 = oldData.listSideIds;
    const list3 = oldData.listDessertsIds;

    newData.forEach((item) => {
      if (list1.length < GAConstant.daysOfWeek) {
        const id1 = parseInt(
          item.slice(0, GAConstant.numberBitBinary),
          2,
        ).toString(10);

        if (list1.includes(Number(id1))) return;
        list1.push(Number(id1));

        const id2 = parseInt(
          item.slice(
            GAConstant.numberBitBinary,
            2 * GAConstant.numberBitBinary,
          ),
          2,
        ).toString(10);
        list2.push(Number(id2));

        const id3 = parseInt(
          item.slice(
            2 * GAConstant.numberBitBinary,
            3 * GAConstant.numberBitBinary,
          ),
          2,
        ).toString(10);
        list3.push(Number(id3));
      }
    });

    const result: TargetMenu = {
      total: list1.length,
      listMainIds: list1,
      listSideIds: list2,
      listDessertsIds: list3,
    };

    return result;
  }

  standardizedPopulation(data: Meal[]): Individual[] {
    let sumPopulation = 0;
    let constant = 0;
    return data
      .map((item) => {
        const suitability = this.suitability(item.price, item.calories);
        sumPopulation += suitability;
        const result: Individual = {
          data: item,
          suitability: suitability,
          adaptability: 0,
          isSelected: false,
        };
        return result;
      })
      .map((item) => {
        item.adaptability = Math.round(
          (item.suitability / sumPopulation) * 100,
        );
        const min = constant + 1;
        const max = min + item.adaptability;
        item.spacePercent = { min, max };
        constant = max;
        return item;
      });
  }

  encodingChromosome(population: Individual[]): Individual[] {
    try {
      return population.map((item) => {
        item.chromosome = item.data.dishMeal.reduce(
          (previousValue: string, currentValue: DishMeal) => {
            const positionDish = currentValue.dish.position;
            const str = parseInt(String(positionDish), 10).toString(2);

            switch (true) {
              case str.length < GAConstant.numberBitBinary:
                const ts = GAConstant.numberBitBinary - str.length;
                let strResult = '';
                for (let i = 0; i < ts; i++) {
                  strResult += '0';
                }

                return previousValue + strResult + str;
              case str.length == GAConstant.numberBitBinary:
                return previousValue + str;
              default:
                throw new HttpException(
                  {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: 'INTERNAL_SERVER_ERROR',
                    message: 'Số lượng bản ghi trong bảng món ăn > 31',
                  },
                  HttpStatus.INTERNAL_SERVER_ERROR,
                );
            }
          },
          '',
        );
        return item;
      });
    } catch (error) {
      console.log(
        '🚀 ~ file: menus.service.ts ~ line 273 ~ MenusService ~ encodingChromosome ~ error',
        error,
      );
    }
  }

  rouletteWheel(population: Individual[]): Individual[] {
    const n = GAConstant.sizePopulation;
    const arraySelect: Individual[] = [];

    for (let i = 0; i < n; i++) {
      const numberSelect = Math.floor(Math.random() * 100) + 1;
      const selected = population.find((item) => {
        if (
          item.spacePercent.min <= numberSelect &&
          numberSelect <= item.spacePercent.max
        )
          return item;
      });
      arraySelect.push(selected);
    }

    return arraySelect;
  }

  suitability(price: number, calories: number) {
    return (
      1 /
      (Math.abs(price - MealStandard.price) +
        Math.abs(calories - MealStandard.calories) +
        1)
    );
  }

  async selectionOptimal() {
    return await this.mealRepository.find({
      where: { price: MoreThan(0) },
      order: { priorityLevel: 'DESC' },
      take: GAConstant.sizePopulation,
    });
  }
}
