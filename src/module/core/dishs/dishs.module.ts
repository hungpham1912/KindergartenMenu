import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DishsService } from './dishs.service';
import { Dish } from './entities/dish.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Dish])],
  providers: [DishsService],
  exports: [DishsService],
})
export class DishsModule {}
