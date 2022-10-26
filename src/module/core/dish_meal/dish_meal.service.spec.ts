import { Test, TestingModule } from '@nestjs/testing';
import { DishMealService } from './dish_meal.service';

describe('DishMealService', () => {
  let service: DishMealService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DishMealService],
    }).compile();

    service = module.get<DishMealService>(DishMealService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
