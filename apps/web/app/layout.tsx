import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BunziMeal',
  description: 'Interactive global meal planner',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="px-6 py-4 border-b">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="font-black tracking-tight text-xl" style={{color:'var(--color-primary)'}}>BunziMeal</div>
          </div>
        </header>
        <main className="max-w-6xl mx-auto p-6">{children}</main>
      </body>
    </html>
  );
}
