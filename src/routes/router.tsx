import { createBrowserRouter, Navigate } from "react-router";
import { Layout, AdminLayout } from "../components/Layout";
import AuthLayout from "../components/AuthLayout";

// Marketing / Public Views
import Landing from "../features/marketing/views/Landing";
import ContentPage from "../features/marketing/views/ContentPage";

// Auth Views
import Login from "../features/auth/views/Login";
import Signup from "../features/auth/views/Signup";
import Verify from "../features/auth/views/Verify";
import Forgot from "../features/auth/views/Forgot";
import Reset from "../features/auth/views/Reset";

// Core App Views
import Dashboard from "../features/dashboard/views/Dashboard";
import AI from "../features/ai-chat/views/AI";
import Recipes from "../features/nutrition/views/Recipes";
import RecipeDetails from "../features/nutrition/views/RecipeDetails";
import Nutrition from "../features/nutrition/views/Nutrition";
import Pantry from "../features/pantry/views/Pantry";
import Shopping from "../features/shopping-list/views/Shopping";
import Settings from "../features/profile/views/Settings";
import SettingsEditProfile from "../features/profile/views/SettingsEditProfile";
import Billing from "../features/billing/views/Billing";
import Processing from "../features/billing/views/Processing";
import AffiliateApply from "../features/referrals/views/AffiliateApply";

// Admin Views
import AdminDashboard from "../features/admin/dashboard/views/Dashboard";
import AIUsage from "../features/admin/dashboard/views/AIUsage";
import AdminSubscriptions from "../features/admin/dashboard/views/Subscriptions";
import AdminUsers from "../features/admin/users/views/Users";
import AdminRecipes from "../features/admin/nutrition/views/Recipes";
import AdminRecipeDetails from "../features/admin/nutrition/views/RecipeDetails";
import Newsletter from "../features/admin/notifications/views/Newsletter";
import Affiliates from "../features/admin/referrals/views/Affiliates";
import AffiliateRequests from "../features/admin/referrals/views/AffiliateRequests";
import AdminSettings from "../features/admin/dashboard/views/Settings";
import ContentAdmin from "../features/admin/content/views/ContentAdmin";

import { useAuthStore } from "../features/auth/authStore";
import type { JSX } from "react";

function RequireAuth({ children }: { children: JSX.Element }) {
  const { token, hydrated } = useAuthStore();
  if (!hydrated) return null;
  if (!token) return <Navigate replace to="/login" />;
  return children;
}

function RequireAdmin({ children }: { children: JSX.Element }) {
  const { user, hydrated, token } = useAuthStore();
  if (!hydrated) return null;
  if (!token) return <Navigate replace to="/login" />;
  if (user?.role !== "admin") return <Navigate replace to="/app/dashboard" />;
  return children;
}

export const router = createBrowserRouter([
  { path: "/", element: <Landing /> },
  { path: "/privacy-policy", element: <ContentPage contentType="privacy" /> },
  { path: "/terms-and-conditions", element: <ContentPage contentType="terms" /> },
  { path: "/refund-policy", element: <ContentPage contentType="refund" /> },
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> },
      { path: "/verify-otp", element: <Verify /> },
      { path: "/forgot-password", element: <Forgot /> },
      { path: "/reset-password", element: <Reset /> },
    ],
  },
  {
    path: "/app",
    element: (
      <RequireAuth>
        <Layout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Navigate replace to="dashboard" /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "ai", element: <AI /> },
      { path: "recipes", element: <Recipes /> },
      { path: "recipes/:id", element: <RecipeDetails /> },
      { path: "nutrition", element: <Nutrition /> },
      { path: "pantry", element: <Pantry /> },
      { path: "shopping", element: <Shopping /> },
      { path: "settings", element: <Settings /> },
      { path: "settings/edit-profile", element: <SettingsEditProfile /> },
      { path: "billing", element: <Billing /> },
      { path: "billing/processing", element: <Processing /> },
      { path: "affiliate", element: <AffiliateApply /> },
    ],
  },
  {
    path: "/admin",
    element: (
      <RequireAdmin>
        <AdminLayout />
      </RequireAdmin>
    ),
    children: [
      { index: true, element: <Navigate replace to="dashboard" /> },
      { path: "dashboard", element: <AdminDashboard /> },
      { path: "users", element: <AdminUsers /> },
      { path: "recipes", element: <AdminRecipes /> },
      { path: "recipes/:id", element: <AdminRecipeDetails /> },
      { path: "newsletter", element: <Newsletter /> },
      { path: "subscriptions", element: <AdminSubscriptions /> },
      { path: "affiliates", element: <Affiliates /> },
      { path: "affiliate-requests", element: <AffiliateRequests /> },
      { path: "ai-usage", element: <AIUsage /> },
      { path: "settings", element: <AdminSettings /> },
      { path: "content", element: <ContentAdmin /> },
    ],
  },
]);
