import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RootLayout } from "./layouts/RootLayout";
<<<<<<< HEAD
import { Home } from "./pages/Home";
import { PetProfile } from "./pages/PetProfile";
import { HealthPortal } from "./pages/HealthPortal";
import { LoginPage } from "./pages/LoginPage"
import { SignupPage } from "./pages/SignupPage"
import { Scheduler } from "./pages/Scheduler"
import { MainDashboard } from "./pages/MainDashboard";

=======
import { AdminLayout } from "./layouts/AdminLayout";
import { Home } from "./pages/Home";
import { PetProfile } from "./pages/PetProfile";
import { MyPetProfile } from "./pages/MyPetProfile";
import { HealthPortal } from "./pages/HealthPortal";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { Scheduler } from "./pages/Scheduler";
import { MainDashboard } from "./pages/MainDashboard";
import Dashboard from "./pages/Dashboard";
import { AppProvider } from "./pages/AppContext"; // Adjust this path if needed
>>>>>>> 5c6fcdb (MyPetManager Dashboard)

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
    element: <RootLayout><MainDashboard /></RootLayout>,
<<<<<<< HEAD
  }
=======
  },
  // Admin routes
  {
    path: "/admin",
    element: <AdminLayout><Dashboard /></AdminLayout>,
  },
  {
    path: "/admin/pets",
    element: <AdminLayout currentPath="/admin/pets"><div className="p-6"><MyPetProfile /></div></AdminLayout>,
  },
  {
    path: "/admin/health-records",
    element: <AdminLayout currentPath="/admin/health-records"><div className="p-6"><HealthPortal /></div></AdminLayout>,
  },
  {
    path: "/admin/appointments",
    element: <AdminLayout currentPath="/admin/appointments"><div className="p-6"><Scheduler /></div></AdminLayout>,
  },
>>>>>>> 5c6fcdb (MyPetManager Dashboard)
]);

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
<<<<<<< HEAD
    <RouterProvider router={router} />
=======
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
>>>>>>> 5c6fcdb (MyPetManager Dashboard)
  </StrictMode>,
);