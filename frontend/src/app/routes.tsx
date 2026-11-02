import HomePage from "../shared/pages/HomePage.tsx";
import { Route, Routes } from "react-router";

import NewPersonPage from "../features/persons/pages/NewPersonPage.tsx";
import PersonDetailPage from "../features/persons/pages/PersonDetailPage.tsx";
import PersonListPage from "../features/persons/pages/PersonListPage.tsx";

import NewDevicePage from "../features/devices/pages/NewDevicePage.tsx";
import DeviceDetailPage from "../features/devices/pages/DeviceDetailPage.tsx";
import DeviceListPage from "../features/devices/pages/DeviceListPage.tsx";

import NotFoundPage from "../shared/pages/NotFoundPage.tsx";
import LoginPage from "../features/auth/LoginPage.tsx";
import RequireAuth from "../features/auth/RequireAuth.tsx";
export default function AppRoutes() {
  return (
    <Routes>
      {/* Authentication */}
      <Route path="/login" element={<LoginPage />} />
      {/* Default route */}
      <Route path="/" element={<RequireAuth><HomePage /></RequireAuth>} />
      {/* Persons */}
      <Route
        path="/persons"
        element={
          <RequireAuth adminOnly>
            {" "}
            <PersonListPage />{" "}
          </RequireAuth>
        }
      />
      <Route
        path="/persons/new"
        element={
          <RequireAuth adminOnly>
            <NewPersonPage />{" "}
          </RequireAuth>
        }
      />
      <Route
        path="/persons/:id"
        element={
          <RequireAuth adminOnly>
            <PersonDetailPage />{" "}
          </RequireAuth>
        }
      />

      {/* Devices */}
      <Route
        path="/devices"
        element={
          <RequireAuth adminOnly>
            <DeviceListPage key="all"/>{" "}
          </RequireAuth>
        }
      />
      <Route
        path="/devices/new"
        element={
          <RequireAuth adminOnly>
            <NewDevicePage />{" "}
          </RequireAuth>
        }
      />
      <Route
        path="/devices/:id"
        element={
          <RequireAuth adminOnly>
            <DeviceDetailPage />{" "}
          </RequireAuth>
        }
      />
      <Route
        path="/my-devices"
        element={
          <RequireAuth>
            <DeviceListPage key="mine" currentUser />
          </RequireAuth>
        }
      />
      <Route
        path="/profile"
        element={
          <RequireAuth>
            <PersonDetailPage currentUser />
          </RequireAuth>
        }
      />

      {/* Not found */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
