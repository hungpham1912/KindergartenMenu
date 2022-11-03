import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DishMeal } from '../../dish_meal/entities/dish_meal.entity';
import { Menu } from '../../menus/entities/menu.entity';

@Entity('meals')
export class Meal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  menuId: string;

  @ManyToOne(() => Menu, (menu) => menu.id)
  menu: Menu;

  @OneToMany(() => DishMeal, (dishMeal) => dishMeal.meal, {
    eager: true,
  })
  dishMeal: DishMeal[];

  @Column({ default: 0, type: 'float' })
  calories: number;

  @Column({ default: false })
  canUse: boolean;

  @Column({ default: 0 })
  price: number;

  @Column({ default: 0 })
  timeOfWeek: number;

  @Column({ default: 0 })
  priorityLevel: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}

export const MealStandard = {
  price: 50000,
  calories: 600,
};

export const GAConstant = {
  sizePopulation: 10,
  numberBitBinary: 5,
  daysOfWeek: 6,
  K: 10000000,
};

export class Individual {
  data: Meal;
  chromosome?: string;
  suitability: number;
  adaptability: number;
  spacePercent?: {
    min: number;
    max: number;
  };
}
export class TargetMenu {
  total: number;
  listMainIds: number[];
  listSideIds: number[];
  listDessertsIds: number[];
}
