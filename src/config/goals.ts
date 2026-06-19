export type GoalDef = {
  key: string;
  label: string;
  description?: string;
  category?: string;
  inputs?: { name: string; label: string; placeholder?: string; type?: 'number'|'text'|'range' }[];
};

export const GOAL_DEFINITIONS: GoalDef[] = [
  { key: 'weight_loss', label: 'Weight Loss', description: 'Lose weight safely with a sustainable calorie deficit.', category: 'Health', inputs: [{ name: 'current_weight', label: 'Current weight (kg)', type: 'number' }, { name: 'target_weight', label: 'Target weight (kg)', type: 'number' }, { name: 'timeframe_weeks', label: 'In how many weeks?', type: 'number' }] },
  { key: 'weight_gain', label: 'Weight Gain', description: 'Increase lean mass with calorie surplus and protein focus.', category: 'Health' },
  { key: 'maintain_weight', label: 'Maintain Weight', description: 'Keep current body composition and energy balance.', category: 'Health' },
  { key: 'muscle_gain', label: 'Muscle Gain', description: 'Build muscle with high-protein meals and resistance training.', category: 'Fitness' },
  { key: 'athletic_performance', label: 'Athletic Performance', description: 'Fuel workouts and recovery for improved performance.', category: 'Fitness' },
  { key: 'endurance', label: 'Endurance', description: 'Support longer duration activities with carb and electrolyte planning.', category: 'Fitness' },
  { key: 'high_protein', label: 'High Protein', description: 'Prioritize protein-rich meals to support muscle and satiety.', category: 'Nutrition' },
  { key: 'low_carb', label: 'Low Carb', description: 'Reduce carbohydrate intake for metabolic goals.', category: 'Nutrition' },
  { key: 'low_fat', label: 'Low Fat', description: 'Limit fats for specific clinical or preference reasons.', category: 'Nutrition' },
  { key: 'low_calorie', label: 'Low Calorie', description: 'Keep meals lower in total energy to support weight loss.', category: 'Nutrition' },
  { key: 'high_fiber', label: 'High Fiber', description: 'Increase fiber for digestion and satiety.', category: 'Nutrition' },
  { key: 'iron_rich', label: 'Iron Rich', description: 'Focus on iron-containing foods for anemia prevention.', category: 'Health' },
  { key: 'heart_health', label: 'Heart Health', description: 'Lower saturated fat and sodium to support heart health.', category: 'Health' },
  { key: 'low_sodium', label: 'Low Sodium', description: 'Reduce salt and high-sodium condiments.', category: 'Health' },
  { key: 'diabetes', label: 'Diabetes Management', description: 'Manage blood glucose with balanced meals and low glycemic choices.', category: 'Health' },
  { key: 'gluten_free', label: 'Gluten Free', description: 'Avoid gluten-containing ingredients.', category: 'Allergies & Intolerances' },
  { key: 'dairy_free', label: 'Dairy Free', description: 'Avoid milk and dairy products.', category: 'Allergies & Intolerances' },
  { key: 'egg_free', label: 'Egg Free', description: 'Exclude eggs from meals and baked goods.', category: 'Allergies & Intolerances' },
  { key: 'nut_allergy', label: 'Nut Allergy', description: 'Avoid tree nuts and peanuts.', category: 'Allergies & Intolerances' },
  { key: 'shellfish_allergy', label: 'Shellfish Allergy', description: 'Avoid shellfish and crustaceans.', category: 'Allergies & Intolerances' },
  { key: 'pescatarian', label: 'Pescatarian', description: 'Include fish and seafood but avoid other meats.', category: 'Diet Type' },
  { key: 'vegetarian', label: 'Vegetarian', description: 'Exclude meat; include dairy/eggs depending on preference.', category: 'Diet Type' },
  { key: 'vegan', label: 'Vegan', description: 'Exclude all animal products.', category: 'Diet Type' },
  { key: 'keto', label: 'Keto', description: 'Very low-carb, higher fat meals.', category: 'Diet Type' },
  { key: 'paleo', label: 'Paleo', description: 'Whole foods, avoid processed grains and dairy.', category: 'Diet Type' },
  { key: 'mediterranean', label: 'Mediterranean', description: 'Balanced diet rich in olive oil, fish, and vegetables.', category: 'Diet Type' },
  { key: 'budget', label: 'Budget', description: 'Keep meals inexpensive and pantry-first.', category: 'Practical' , inputs:[{name:'budget_min', label:'Min budget per meal'},{name:'budget_max', label:'Max budget per meal'}]},
  { key: 'quick_meals', label: 'Quick Meals', description: 'Favor recipes with short prep and cook times.', category: 'Practical' },
  { key: 'meal_prep', label: 'Meal Prep', description: 'Provide batch-cookable recipes for the week.', category: 'Practical' },
  { key: 'intermittent_fasting', label: 'Intermittent Fasting', description: 'Support fasting windows and meal timing.', category: 'Practical' },
  { key: 'low_fodmap', label: 'Low FODMAP', description: 'Reduce fermentable carbs for IBS management.', category: 'Health' },
  { key: 'kosher', label: 'Kosher', description: 'Follow kosher dietary laws.', category: 'Diet Type' }
];

export const GOAL_CATEGORIES = Array.from(new Set(GOAL_DEFINITIONS.map(g => g.category || 'Other')));

export default GOAL_DEFINITIONS;
