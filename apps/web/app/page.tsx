import { Utensils, ShoppingBasket } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black tracking-tight">Welcome to <span className="text-[color:var(--color-primary)]">BunziMeal</span></h1>
      <p className="text-slate-600">Your interactive, global meal planner. Start by exploring recipes, building your plan, and syncing your shopping list.</p>
      <div className="grid sm:grid-cols-2 gap-4">
        <a className="p-4 border rounded-xl hover:bg-slate-50 flex items-center gap-3" href="#">
          <Utensils className="text-[color:var(--color-accent2)]" />
          <span className="font-semibold">Generate a 7-day plan</span>
        </a>
        <a className="p-4 border rounded-xl hover:bg-slate-50 flex items-center gap-3" href="#">
          <ShoppingBasket className="text-[color:var(--color-accent)]" />
          <span className="font-semibold">Open Shopping List</span>
        </a>
      </div>
    </div>
  );
}
