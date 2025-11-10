import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import CategoryPage from "./pages/CategoryPage";
import Subcategories from "./pages/Subcategories";
import Products from "./pages/Products";
import CategoriesManager from "./admin/CategoriesManager";
import AdminLogin from "./admin/AdminLogin.jsx";

import AdminDashboard from "./admin/AdminDashboard";
import ProductsManager from "./admin/ProductsManager";
import OrdersManager from "./admin/OrdersManager";
import ServicesManager from "./admin/ServicesManager";
import ContactsManager from "./admin/ContactsManager";

import ProtectedRoute from "./routes/ProtectedRoute";
const ProductDetails = React.lazy(() => import("./pages/ProductDetails"));

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route
        path="/product/:id"
        element={
          <React.Suspense fallback={<div className="container" style={{ padding: '2rem' }}>جاري التحميل...</div>}>
            <ProductDetails />
          </React.Suspense>
        }
      />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/services" element={<Services />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/category/:cat" element={<CategoryPage />} />
      <Route path="/subcategories/:category" element={<Subcategories />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:cat/:sub" element={<Products />} />
      
      {/* Admin */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/products"
        element={
          <ProtectedRoute>
            <ProductsManager />
          </ProtectedRoute>
        }
        
      />
      
<Route
  path="/admin/categories"
  element={
    <ProtectedRoute>
      <CategoriesManager />
    </ProtectedRoute>
  }
/>
      <Route
        path="/admin/orders"
        element={
          <ProtectedRoute>
            <OrdersManager />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/services"
        element={
          <ProtectedRoute>
            <ServicesManager />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/contacts"
        element={
          <ProtectedRoute>
            <ContactsManager />
          </ProtectedRoute>
        }
      />

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
