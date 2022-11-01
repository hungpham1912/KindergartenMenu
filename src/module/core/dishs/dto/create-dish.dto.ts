export class CreateDishDto {
  nameDish: string;
  ingredients: any;
  calories: number;
  unitPrice: number;
  position: number;
  dishStatus: string;
}

export class DishDto {
  dishStatus: string;
  data: CreateDishDto[];
}
