export type MealSlot = 'breakfast' | 'lunch' | 'dinner';
export type GoalCategory = 'health' | 'fitness' | 'medical' | 'lifestyle';

export type MealAdviceRequest = {
  name: string;
  slot: MealSlot;
  goal?: string;
};

export type PlanDay = {
  day: number;
  day_name: string;
  meals: Array<{ slot: MealSlot; name: string; recipe_id?: number }>;
};
