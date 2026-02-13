import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import KitchenLive from "./pages/Kitchen/KitchenLive";
import Login from "./pages/Login/Login";

import OwnerLayout from "./pages/Owner/OwnerLayout";
import Dashboard from "./pages/Owner/Dashboard";
import MenuManager from "./pages/Owner/MenuManager";
import TablesManager from "./pages/Owner/TablesManager";
import OrdersHistory from "./pages/Owner/OrdersHistory";

import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ✅ Default route → Login */}
        <Route path="/" element={<Login />} />

        {/* ✅ Kitchen */}
        <Route
          path="/kitchen"
          element={
            <ProtectedRoute role="kitchen">
              <KitchenLive />
            </ProtectedRoute>
          }
        />

        {/* ✅ Owner Panel with nested pages */}
        <Route
          path="/owner"
          element={
            <ProtectedRoute role="owner">
              <OwnerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="menu" element={<MenuManager />} />
          <Route path="tables" element={<TablesManager />} />
          <Route path="orders" element={<OrdersHistory />} />
        </Route>

        {/* ✅ Fallback */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
