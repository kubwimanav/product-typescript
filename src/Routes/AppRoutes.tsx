import ProductPage from "../pages/ProductPage";
import Login from "../pages/Login";
import { Routes, Route } from "react-router-dom";
import CategoryPage from "../components/CategoryPage";
import Cart from "../components/Cart";
import SinglePage from "../components/SingleProductPage";
import Navbar from "../components/Navbar";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/products" element={<ProductPage />} />
      <Route path="/navbar" element={<Navbar/>} />
      <Route path="products/product/:id" element={<SinglePage />} />
      <Route path="/category" element={<CategoryPage />} />
      <Route path="/cart" element={<Cart />} />

    </Routes>
  );
}