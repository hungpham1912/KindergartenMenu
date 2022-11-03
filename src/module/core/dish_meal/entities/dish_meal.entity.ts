import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Dish } from '../../dishs/entities/dish.entity';
import { Meal } from '../../meals/entities/meal.entity';

@Entity('dishMeal')
export class DishMeal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  dishId: string;

  @Column()
  mealId: string;

  @ManyToOne(() => Dish, (dish) => dish.id, {
    eager: true,
  })
  dish: Dish;

  @ManyToOne(() => Meal, (meal) => meal.dishMeal)
  meal: Meal;

  @CreateDateColumn({ default: false, type: 'timestamp' })
  createdAt: Date;
}
