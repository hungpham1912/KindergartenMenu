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

  async genKindergarten() {
    try {
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
        const dataPopulation = await this.selectionRandom();
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
         *********Mutation**********
         */
        const afterMutation = this.mutation(childChromosome);
        /*
         *********Check the duplicate of main dish and **********
         */
        data = this.standardizedIndividual(data, afterMutation);
      }

      await this.createMeals(createMenu.id, data);
      return await this.menuRepository.findOne({
        where: { id: createMenu.id },
      });
    } catch (error) {
      console.log('🚀 ~ file: menus.service.ts:106  ~ error', error);
    }
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

    const updateMealDto = [];
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

      const calories = main.calories + side.calories + dessert.calories + 200;
      const price = main.unitPrice + side.unitPrice + dessert.unitPrice + 5000;
      const priorityLevel = this.suitability(price, calories);

      updateMealDto.push({ calories, price, priorityLevel, id: ds[j].id });

      mealDishDto = mealDishDto.concat([
        { mealId: ds[j].id, dishId: main.id },
        { mealId: ds[j].id, dishId: side.id },
        { mealId: ds[j].id, dishId: dessert.id },
      ]);
    }

    await this.mealRepository.save(updateMealDto);
    return await this.dishMealRepository.save(mealDishDto);
  }

  mutation(data: string[]): string[] {
    const percent =
      Math.floor(
        Math.random() *
          (GAConstant.percentMutation.max - GAConstant.percentMutation.min),
      ) + GAConstant.percentMutation.min;

    const addSelect = [];
    for (let i = 1; i <= percent; i++) {
      addSelect.push(i);
    }

    let check = true;

    for (let j = 1; j <= percent; j++) {
      const cur = Math.floor(Math.random() * 100) + 1;
      if (!addSelect.includes(cur)) {
        check = false;
      }
    }

    if (check) {
      const length = Math.floor(Math.random() * 15);

      const arrayMutation = [];

      for (let i = 0; i < length; i++) {
        arrayMutation.push(Math.floor(Math.random() * 15));
      }

      const newData = [];

      data.forEach((item) => {
        let ds = item;
        for (let j = 0; j < arrayMutation.length; j++) {
          if (ds[arrayMutation[j]] === '0')
            ds = this.replaceAt(ds, arrayMutation[j], '1');
          if (data[arrayMutation[j]] === '1')
            ds = this.replaceAt(ds, arrayMutation[j], '0');
        }
        newData.push(ds);
      });

      return newData;
    }
    return data;
  }

  replaceAt(str: string, index: number, replacement: string) {
    return (
      str.substring(0, index) +
      replacement +
      str.substring(index + replacement.length)
    );
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

    newData.forEach(async (item) => {
      if (list1.length < GAConstant.daysOfWeek) {
        const id1 = parseInt(
          item.slice(0, GAConstant.numberBitBinary),
          2,
        ).toString(10);

        const id2 = parseInt(
          item.slice(
            GAConstant.numberBitBinary,
            2 * GAConstant.numberBitBinary,
          ),
          2,
        ).toString(10);

        const id3 = parseInt(
          item.slice(
            2 * GAConstant.numberBitBinary,
            3 * GAConstant.numberBitBinary,
          ),
          2,
        ).toString(10);

        const main = await this.dishRepository.findOne({
          where: {
            position: Number(id1),
            dishStatus: DishStatus.MAIN_DISH,
          },
        });

        const side = await this.dishRepository.findOne({
          where: {
            position: Number(id2),
            dishStatus: DishStatus.SIDE_DISH,
          },
        });

        const dessert = await this.dishRepository.findOne({
          where: {
            position: Number(id3),
            dishStatus: DishStatus.DESSERTS,
          },
        });

        const calories = main.calories + side.calories + dessert.calories;

        const price = main.unitPrice + side.unitPrice + dessert.unitPrice;

        if (
          price > MealStandard.price ||
          price < MealStandard.price - 10000 ||
          Math.abs(calories - MealStandard.calories) > 65
        )
          return;
        /*
         *********Check duplicate dish main**********
         */
        if (list1.includes(Number(id1))) return;

        list2.push(Number(id2));
        list1.push(Number(id1));
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
                    message: 'Số lượng bản ghi trong bảng món ăn > 32',
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
    return Math.round(
      GAConstant.K /
        (Math.abs(price - MealStandard.price) / 100 +
          Math.abs(calories - MealStandard.calories) +
          1),
    );
  }

  async selectionRandom() {
    return await this.mealRepository
      .createQueryBuilder('meals')
      .leftJoinAndSelect('meals.dishMeal', 'dishMeal')
      .leftJoinAndSelect('dishMeal.dish', 'dish')
      .where({ price: MoreThan(0), canUse: false })
      .addSelect('RANDOM()', 'random')
      .take(GAConstant.sizePopulation)
      .getMany();
  }
}
