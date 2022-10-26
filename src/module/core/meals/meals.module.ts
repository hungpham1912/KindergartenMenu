import { Module } from '@nestjs/common';
import { MealsService } from './meals.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meal } from './entities/meal.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Meal])],
  providers: [MealsService],
  exports: [MealsService],
})
export class MealsModule {}
