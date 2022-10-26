import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum DishStatus {
  MAIN_DISH = 'MAIN_DISH',
  SIDE_DISH = 'SIDE_DISH',
  DESSERTS = 'DESSERTS',
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

  @Column({ default: DishStatus.DESSERTS, enum: DishStatus, type: 'enum' })
  dishStatus: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
