import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DishsService } from '../dishs/dishs.service';
import { Dish } from '../dishs/entities/dish.entity';
import { DishMealService } from '../dish_meal/dish_meal.service';
import { DishMeal } from '../dish_meal/entities/dish_meal.entity';
import { Meal } from '../meals/entities/meal.entity';
import { MealsService } from '../meals/meals.service';
import { Menu } from './entities/menu.entity';
import { MenusService } from './menus.service';

@Module({
  imports: [TypeOrmModule.forFeature([Meal, Dish, Menu, DishMeal])],
  providers: [MenusService, MealsService, DishMealService, DishsService],
  exports: [MenusService, MealsService, DishMealService, DishsService],
})
export class MenusModule {}
