// src/types/mealPlan.ts
export interface Meal {
  date?: string;
  day?: string;
  time?: string;
  meal?: string;         // breakfast | lunch | dinner
  meal_name?: string;
  ingredients?: string[];
  calories?: number;
}

export interface Week {
  meal?: Meal[];
}

export interface FoodMenu {
  _id?: string;
  date_created?: string;
  date_range?: string;
  Nutritionist?: {
    _id?: string;
    name?: string;
    email?: string;
  };
  weeks?: number;
  meal_plan?: Week[];
}
