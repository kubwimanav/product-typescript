// src/App.tsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Product from "./component/Product";
import ProductDetail from "./component/SingleProduct";
import CartComponent from "./component/cart/cart";

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Products List Route */}
          <Route
            path="/"
            element={
              <div className="container mx-auto py-6">
                <Product refreshKey={0} />
              </div>
            }
          />
          <Route path="/cart" element={<CartComponent />} />

          <Route path="/product/:id" element={<ProductDetail />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
