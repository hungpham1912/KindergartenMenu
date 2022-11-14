import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum DishStatus {
  MAIN_DISH = 'MAIN_DISH',
  SIDE_DISH = 'SIDE_DISH',
  DESSERTS = 'DESSERTS',
  SIDE_MEAL = 'SIDE_MEAL',
}

@Entity('dish')
export class Dish {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: '' })
  nameDish: string;

  @Column({ default: null, type: 'json' })
  ingredients: JSON;

  @Column({ default: 0, type: 'float' })
  calories: number;

  @Column({ default: 0 })
  unitPrice: number;

  @Column({ default: 0 })
  position: number;

  @Column({ default: DishStatus.DESSERTS, enum: DishStatus, type: 'enum' })
  dishStatus: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date;
}
