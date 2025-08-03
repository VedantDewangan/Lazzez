import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./Pages/Home/Home";
import Login from "./Pages/Auth/Login";
import Register from "./Pages/Auth/Register";
import PublicRoute from "./Context/PublicRoute";
import AdminDashboard from "./Admin/AdminDashboard/AdminDashboard";
import AdminLogin from "./Admin/AdminLogin/AdminLogin";
import AdminViewOrder from "./Admin/AdminViewOrder/AdminViewOrder";
import AdminAddFood from "./Admin/AdminAddFood/AdminAddFood";
import Menu from "./Pages/Menu/Menu";
import Order from "./Pages/Order/Order";
import Cart from "./Pages/Cart/Cart";
import { ToastContainer } from "react-toastify";
import Ai from "./Pages/Ai/Ai";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/orders" element={<Order />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/ai" element={<Ai />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/add-food" element={<AdminAddFood />} />
        <Route path="/admin/manage-order" element={<AdminViewOrder />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}
