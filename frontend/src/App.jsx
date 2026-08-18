import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Analytics from "./pages/Analytics.jsx";
import Alerts from "./pages/Alerts.jsx";
import Review from "./pages/Review.jsx";
import Admin from "./pages/Admin.jsx";
import { useAuth } from "./context/AuthContext.jsx";

function Protected({ children, roles }) {
  const { session } = useAuth();
  if (!session) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(session.user.role)) return <Navigate to="/" replace />;
  return <Layout>{children}</Layout>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Protected><Dashboard /></Protected>} />
      <Route path="/analytics" element={<Protected><Analytics /></Protected>} />
      <Route path="/alerts" element={<Protected><Alerts /></Protected>} />
      <Route
        path="/review"
        element={
          <Protected roles={["analyst", "admin"]}>
            <Review />
          </Protected>
        }
      />
      <Route
        path="/admin"
        element={
          <Protected roles={["admin"]}>
            <Admin />
          </Protected>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
