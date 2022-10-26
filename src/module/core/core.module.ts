import { Module } from '@nestjs/common';
import { DishsController } from './dishs/dishs.controller';
import { DishsModule } from './dishs/dishs.module';
import { MealsController } from './meals/meals.controller';
import { MealsModule } from './meals/meals.module';
import { MenusController } from './menus/menus.controller';
import { MenusModule } from './menus/menus.module';

@Module({
  imports: [MenusModule, DishsModule, MealsModule],
  controllers: [MenusController, DishsController, MealsController],
})
export class CoreModule {}
