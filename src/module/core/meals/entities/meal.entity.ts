import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DishMeal } from '../../dish_meal/entities/dish_meal.entity';

@Entity('meals')
export class Meal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => DishMeal, (dishMeal) => dishMeal.meal, {
    eager: true,
  })
  dishMeal: DishMeal[];

  @Column({ default: 0 })
  timeOfWeek: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
