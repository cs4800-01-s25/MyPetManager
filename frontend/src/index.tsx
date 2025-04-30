import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RootLayout } from "./layouts/RootLayout";
import { AppProvider } from "./pages/AppContext";

import { Home } from "./pages/Home";
import { PetProfile } from "./pages/PetProfile";
import { HealthPortal } from "./pages/HealthPortal";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { Scheduler } from "./pages/Scheduler";
import Dashboard from "./pages/Dashboard";
import { AdminLayout } from "./layouts/AdminLayout"; 
import { MyPetProfile } from "./pages/MyPetProfile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout><Home /></RootLayout>,
  },
  {
    path: "/pet-profile",
    element: <RootLayout><PetProfile /></RootLayout>,
  },
  {
    path: "/health-portal",
    element: <RootLayout><HealthPortal /></RootLayout>,
  },
  {
    path: "/login",
    element: <RootLayout><LoginPage /></RootLayout>,
  },
  {
    path: "/signup",
    element: <RootLayout><SignupPage /></RootLayout>,
  },
  {
    path: "/schedule",
    element: <RootLayout><Scheduler /></RootLayout>,
  },
  {
    path: "/dashboard",
    element: (
      <AdminLayout currentPath="/dashboard">
        <Dashboard />
      </AdminLayout>
    )
  },
  {
    path: "/admin",
    element: <AdminLayout currentPath="/admin"><Dashboard /></AdminLayout>,
  },
  {
    path: "/admin/pets",
    element: <AdminLayout currentPath="/admin/pets"><MyPetProfile /></AdminLayout>,
  },
  {
    path: "/admin/health-records",
    element: <AdminLayout currentPath="/admin/health-records"><HealthPortal /></AdminLayout>,
  },
  {
    path: "/admin/appointments",
    element: <AdminLayout currentPath="/admin/appointments"><Scheduler /></AdminLayout>,
  },    
]);

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  </StrictMode>
);
