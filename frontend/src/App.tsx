import React from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { useGetCurrentUser } from "./apis/auth/auth.api";
import Layout from "./components/layouts/layout";
import { Loading } from "./components/ui/loading";
import AccountPage from "./pages/Account";
import Dashboard from "./pages/Dashboard";
import { Login } from "./pages/Login";
import NotificationsPage from "./pages/Notifications";
import { Orders } from "./pages/Orders";
import SyncOrdersPage from "./pages/Orders/sync";
import { Platforms } from "./pages/Platforms";
import PlatformCreatePage from "./pages/Platforms/create";
import { Products } from "./pages/Products";
import ProductCreatePage from "./pages/Products/create";
import SyncProductsPage from "./pages/Products/sync";
import { Settings } from "./pages/Settings";
import { Sync } from "./pages/Sync";
import SyncConflicts from "./pages/Sync/tabs/Conflicts";
import SyncStats from "./pages/Sync/tabs/Stats";
import SyncTasks from "./pages/Sync/tabs/Tasks";
import TermsPage from "./pages/Terms";
import PrivacyPage from "./pages/Privacy";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const {
    data: currentUser,
    isLoading,
    isError,
  } = useGetCurrentUser({ enabled: true });

  if (isLoading) {
    return <Loading />;
  }

  if (isError || !currentUser) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

function App() {
  const { data: currentUser, isLoading } = useGetCurrentUser({ enabled: true });

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={!isLoading && currentUser ? <Navigate to="/" /> : <Login />}
        />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/products/sync" element={<SyncProductsPage />} />
                  <Route
                    path="/products/create"
                    element={<ProductCreatePage />}
                  />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/orders/sync" element={<SyncOrdersPage />} />
                  <Route path="/platforms" element={<Platforms />} />
                  <Route
                    path="/platforms/create"
                    element={<PlatformCreatePage />}
                  />
                  <Route path="/sync/*" element={<Sync />}>
                    <Route index element={<Navigate to="task" replace />} />
                    <Route path="task" element={<SyncTasks />} />
                    <Route path="conflict" element={<SyncConflicts />} />
                    <Route path="stats" element={<SyncStats />} />
                  </Route>
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/account" element={<AccountPage />} />
                  <Route
                    path="/notifications"
                    element={<NotificationsPage />}
                  />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
