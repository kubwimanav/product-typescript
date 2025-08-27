import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MdLogin,
  MdLogout,
  MdPerson,
  MdShoppingCart,
} from "react-icons/md";
import { useAuth } from "../context/AuthContext";
import type { Product } from "../types/productTypes";
import { useCart } from "../context/CartContext";
import AddProduct from "./AddProduct";
import Cart from "./Cart";

interface Props {
  product?: Product;
  onSelectProduct?: (id: number | null) => void;
  refreshKey?: number;
  onProductUpdated?: () => void;
}

const Navbar: React.FC<Props> = ({
  refreshKey,
  onProductUpdated,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [ setCategories] = useState<string[]>([]);
  const [selectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
 
  const [cartError] = useState<string | null>(null);
  const [showCart, setShowCart] = useState(false);
  const { cart } = useCart();
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState<Product | null>(null);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

 
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        let res;

        if (selectedCategory !== "all") {
          const response = await fetch(
            `https://dummyjson.com/products/category/${selectedCategory}`
          );
          const data = await response.json();
          res = { data };
        } else {
          // Fetch all products with a higher limit to show more products
          const response = await fetch(
            "https://dummyjson.com/products?limit=100"
          );
          const data = await response.json();
          res = { data };
        }

        const fetchedProducts = res.data.products.map((p: any) => ({
          id: p.id,
          title: p.title,
          category: p.category,
          price: p.price,
          discountPercentage: p.discountPercentage,
          images: p.images,
          stock: p.stock,
          rating: p.rating,
          description: p.description,
        }));
        setProducts(fetchedProducts);
      } catch (err) {
        console.error(err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [refreshKey, selectedCategory]);

 
  const handleLogin = () => {
    navigate("/");
  };

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      logout();
      navigate("/");
    }
  };







  if (loading) return <p className="text-center p-4">Loading products...</p>;
  if (error) return <p className="text-center text-red-500 p-4">{error}</p>;

  return (
    <div className="bg-white flex flex-col gap-3 justify-center p-4 rounded shadow">
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold mb-3">All Products</h2>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-md">
                  <MdPerson className="text-gray-600" />
                  <span className="text-sm text-gray-700">
                    {user?.username}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-600 hover:text-red-800 px-3 py-2 rounded-md hover:bg-red-50 transition-colors"
                  title="Logout"
                >
                  <MdLogout />
                  <span className="text-sm">Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                <MdLogin />
                <span className="text-sm">Login</span>
              </button>
            )}

            {/* Cart Link */}
            <Link
              to={"/cart"}
              className="text-green-400 flex items-center gap-2 hover:text-green-600 transition-colors relative"
            >
              <MdShoppingCart className="text-xl" />
              {cart && cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                  {cart.length}
                </span>
              )}
            </Link>

            {isAuthenticated && (
              <button
                className="bg-blue-500 text-white px-3 py-2 rounded-md text-xs font-bold hover:bg-blue-600 transition-colors"
                onClick={() => setShowAddProduct(true)}
              >
                Add New Product
              </button>
            )}
          </div>
        </div>
      </div>

      



      {showAddProduct && isAuthenticated && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className=" rounded-lg max-w-lg w-full p-6 shadow-lg relative">
            <button
              onClick={() => setShowAddProduct(false)}
              className="absolute top-6 text-xl right-4 bg-blue-500 px-2 py-1 rounded-md  text-white hover:text-gray-700"
            >
              ✕
            </button>

            <AddProduct
              onProductAdded={(product) => {
                setNewProduct(product);
                setProducts((prev) => [product, ...prev]);
                setShowAddProduct(false);
                // Call onProductUpdated if it exists
                if (onProductUpdated) {
                  onProductUpdated();
                }
              }}
            />
          </div>
        </div>
      )}

      

      {showCart && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/50 bg-opacity-30"
            onClick={() => setShowCart(false)}
          ></div>
          <div className="absolute right-0 top-0 h-full w-96 max-w-full bg-white shadow-xl">
            <Cart />
            <button
              onClick={() => setShowCart(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {cartError && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg z-50">
          {cartError}
        </div>
      )}
    </div>
  );
};

export default Navbar;
