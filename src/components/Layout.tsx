import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router";
import SupportContact from "./SupportContact";
import {
  LayoutDashboard,
  Sparkles,
  BookOpen,
  ShoppingCart,
  Box,
  CreditCard,
  Settings,
  Menu,
  X,
  Users,
  TrendingUp,
  Mail,
  FileText,
  Megaphone,
  Link as LinkIcon,
} from "lucide-react";
import { logo } from "../assets";

interface NavItem {
  name: string;
  to: string;
  icon: React.ElementType;
}

const USER_LINKS: NavItem[] = [
  { name: "Dashboard", to: "/app/dashboard", icon: LayoutDashboard },
  { name: "BunziMeal AI", to: "/app/ai", icon: Sparkles },
  { name: "Recipes", to: "/app/recipes", icon: BookOpen },
  { name: "Shopping", to: "/app/shopping", icon: ShoppingCart },
  { name: "Pantry", to: "/app/pantry", icon: Box },
  { name: "Billing", to: "/app/billing", icon: CreditCard },
  { name: "Settings", to: "/app/settings", icon: Settings },
];

const ADMIN_LINKS: NavItem[] = [
  { name: "Admin Home", to: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Users", to: "/admin/users", icon: Users },
  { name: "Recipes", to: "/admin/recipes", icon: BookOpen },
  { name: "AI Usage", to: "/admin/ai-usage", icon: TrendingUp },
  { name: "Payments", to: "/admin/subscriptions", icon: CreditCard },
  { name: "Affiliates", to: "/admin/affiliates", icon: LinkIcon },
  { name: "Requests", to: "/admin/affiliate-requests", icon: Megaphone },
  { name: "Newsletter", to: "/admin/newsletter", icon: Mail },
  { name: "Content", to: "/admin/content", icon: FileText },
  { name: "Settings", to: "/admin/settings", icon: Settings },
];

function Sidebar({
  links,
  open,
  onClose,
  isAdmin = false,
}: {
  links: NavItem[];
  open: boolean;
  onClose: () => void;
  isAdmin?: boolean;
}) {
  return (
    <>
      {/* Light Overlay */}
      <div
        className={`fixed inset-0 bg-primary/20 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-72 bg-white border-r border-slate-200 z-50 transform transition-transform duration-300 md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        } flex flex-col`}
      >
        <div className="p-8 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-primary p-2 rounded-xl">
              <img src={logo} alt="Bunzi" className="h-6 w-6" />
            </div>
            <span className="font-bold text-2xl tracking-tighter text-primary uppercase italic">
              BunziMeal
              {isAdmin && (
                <span className="text-accent-2 not-italic ml-1 text-[10px] font-black align-top border border-accent-2/20 px-1 rounded">
                  ADM
                </span>
              )}
            </span>
          </Link>
          <button
            onClick={onClose}
            className="text-slate-400 md:hidden p-2 hover:bg-slate-100 rounded-full"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto pt-4">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => {
                if (window.innerWidth < 768) onClose();
              }}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all duration-200 group ${
                  isActive
                    ? "bg-primary text-white shadow-xl shadow-primary/20"
                    : "text-slate-500 hover:bg-slate-50 hover:text-primary"
                }`
              }
            >
              <link.icon
                size={20}
                className="group-hover:scale-110 transition-transform"
              />
              <span className="tracking-tight text-sm uppercase tracking-widest">
                {link.name}
              </span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#faf9f6] flex">
      {/* Light Sand Background */}
      <Sidebar
        links={USER_LINKS}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col md:ml-72 min-w-0">
        {/* Mobile Header */}
        <header className="md:hidden sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg">
              <div className="w-3 h-3 bg-accent rounded-[1px]" />
            </div>
            <span className="font-bold text-primary uppercase italic tracking-tighter">
              BunziMeal
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-primary p-2 bg-slate-100 rounded-xl transition-colors"
          >
            <Menu size={24} />
          </button>
        </header>

        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
        {/* Support Section Integrated */}
        <div className="p-6 border-t border-slate-100">
          <SupportContact />
        </div>
      </div>
    </div>
  );
}

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar
        links={ADMIN_LINKS}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isAdmin
      />

      <div className="flex-1 flex flex-col md:ml-72 min-w-0">
        <header className="md:hidden sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 p-4 flex items-center justify-between">
          <span className="font-bold text-primary uppercase italic tracking-tighter">
            BunziMeal Admin
          </span>
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-primary p-2"
          >
            <Menu size={24} />
          </button>
        </header>

        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-6xl mx-auto border border-slate-200 rounded-[2.5rem] min-h-[85vh] p-8 bg-white shadow-sm">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
