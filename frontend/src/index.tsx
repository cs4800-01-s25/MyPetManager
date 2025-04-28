import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RootLayout } from "./layouts/RootLayout";
import { Home } from "./pages/Home";
import { PetProfile } from "./pages/PetProfile";
import { HealthPortal } from "./pages/HealthPortal";
import { LoginPage } from "./pages/LoginPage"
import { SignupPage } from "./pages/SignupPage"
import { Scheduler } from "./pages/Scheduler"
import { MainDashboard } from "./pages/MainDashboard";


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
  }
]);

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);