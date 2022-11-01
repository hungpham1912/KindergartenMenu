import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Dish } from 'src/module/core/dishs/entities/dish.entity';
import { DishMeal } from 'src/module/core/dish_meal/entities/dish_meal.entity';
import { Manager } from 'src/module/core/managers/entities/manager.entity';
import { Meal } from 'src/module/core/meals/entities/meal.entity';
import { Menu } from 'src/module/core/menus/entities/menu.entity';
import { User } from 'src/module/core/users/entities/user.entity';

export class DatabaseConfig {
  config: TypeOrmModuleOptions = {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [Manager, User, Dish, DishMeal, Meal, Menu],
    extra: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
    synchronize: true,
  };

  getConfig() {
    return this.config;
  }
}
