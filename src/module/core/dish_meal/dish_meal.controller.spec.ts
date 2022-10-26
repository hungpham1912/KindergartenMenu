import { Test, TestingModule } from '@nestjs/testing';
import { DishMealController } from './dish_meal.controller';
import { DishMealService } from './dish_meal.service';

describe('DishMealController', () => {
  let controller: DishMealController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DishMealController],
      providers: [DishMealService],
    }).compile();

    controller = module.get<DishMealController>(DishMealController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
