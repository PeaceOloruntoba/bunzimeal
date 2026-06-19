import { useEffect } from "react";
import { RouterProvider } from "react-router";
import { router } from "./routes/router";
import { useAuthStore } from "./features/auth/authStore";
import { Toaster } from "sonner";

export default function App() {
  const bootstrap = useAuthStore((state) => state.bootstrap);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  return (
    <>
      <Toaster />
      <RouterProvider router={router} />
    </>
  );
}
