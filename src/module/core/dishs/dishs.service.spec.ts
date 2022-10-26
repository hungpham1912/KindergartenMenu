import { Test, TestingModule } from '@nestjs/testing';
import { DishsService } from './dishs.service';

describe('DishsService', () => {
  let service: DishsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DishsService],
    }).compile();

    service = module.get<DishsService>(DishsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
