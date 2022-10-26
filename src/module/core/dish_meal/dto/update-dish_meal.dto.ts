import { PartialType } from '@nestjs/swagger';
import { CreateDishMealDto } from './create-dish_meal.dto';

export class UpdateDishMealDto extends PartialType(CreateDishMealDto) {}
