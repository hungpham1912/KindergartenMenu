import { Test, TestingModule } from '@nestjs/testing';
import { DishsController } from './dishs.controller';
import { DishsService } from './dishs.service';

describe('DishsController', () => {
  let controller: DishsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DishsController],
      providers: [DishsService],
    }).compile();

    controller = module.get<DishsController>(DishsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
