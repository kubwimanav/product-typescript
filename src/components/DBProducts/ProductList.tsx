import React, { useEffect, useState } from "react";
import api from "../../api/api";
import type { Product } from "../../types/productTypes";
import ProductDetails from "../ProductDetails";
import { useCart } from "../../context/CartContext";
import Cart from "../Cart";
import AddProduct from "../AddProduct";
import { Link, useNavigate } from "react-router-dom";
import {
  MdClear,
  MdDelete,
  MdEdit,
  MdLogin,
  MdLogout,
  MdPerson,
  MdSearch,
  MdShoppingCart,
} from "react-icons/md";
import { useAuth } from "../../context/AuthContext";

interface Props {
  product?: Product;
  onSelectProduct?: (id: number | null) => void;
  refreshKey: number;
  onProductUpdated?: () => void;
}

const ProductList: React.FC<Props> = ({
  onSelectProduct,
  refreshKey,
  onProductUpdated,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  const [cartError, setCartError] = useState<string | null>(null);
  const [addingToCart,  setAddingToCart] = useState<number | null>(null);
  const [showCart, setShowCart] = useState(false);
  const { cart, addToCart } = useCart();
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [, setNewProduct] = useState<Product | null>(null);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("https://dummyjson.com/products/category-list");
        const categoryList = await res.json();
        setCategories(categoryList);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        let res;

        // If a specific category is selected, fetch products by category
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

  const handleEditClick = (productId: number) => {
    setSelectedProductId(productId);
    if (onSelectProduct) {
      onSelectProduct(productId);
    }
  };

  const handleCloseDetails = () => {
    setSelectedProductId(null);
    if (onSelectProduct) {
      onSelectProduct(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this product?")) return;
    try {
      await api.delete(`/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      // Call onProductUpdated if it exists
      if (onProductUpdated) {
        onProductUpdated();
      }
      alert("Product deleted successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to delete product");
    }
  };

  const handleAddToCart = async (productId: number) => {
    try {
      setCartError(null);
      setAddingToCart(productId);

      await addToCart(productId);
      console.log("Product added to cart:", productId);
    } catch (err) {
      console.error("Failed to add to cart:", err);
      setCartError("Failed to add product to cart. Please try again.");
      setTimeout(() => setCartError(null), 3000);
    } finally {
      setAddingToCart(null);
    }
  };

  const handleLogin = () => {
    navigate("/");
  };

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      logout();
      navigate("/");
    }
  };

  const handleProductUpdated = async () => {
    if (onProductUpdated) {
      onProductUpdated();
    }

    try {
      setLoading(true);
      let res;

      if (selectedCategory !== "all") {
        const response = await fetch(
          `https://dummyjson.com/products/category/${selectedCategory}`
        );
        const data = await response.json();
        res = { data };
      } else {

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
      console.error("Error refreshing products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedCategory(event.target.value);
  };

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      <div className="relative mb-4">
        <div className="relative">
          <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
          <input
            type="text"
            placeholder="Search products by name, category, brand, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <MdClear className="text-lg" />
            </button>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Category:
          </label>
          <p className="text-xs text-green-500">
            {selectedCategory === "all"
              ? "All"
              : selectedCategory.charAt(0).toUpperCase() +
                selectedCategory.slice(1).replace("-", " ")}{" "}
            - {filteredProducts.length} items
          </p>
        </div>
        <select
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() +
                category.slice(1).replace("-", " ")}
            </option>
          ))}
        </select>
      </div>

      {filteredProducts.length === 0 ? (
        <p className="text-center p-4">No products found</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <div key={product.id}>
              <Link
                to={`product/${product.id}`}
                className="border-gray-300 font-serif shadow-lg border rounded-xl flex gap-1 flex-col justify-between items-center pb-2 hover:shadow-xl transition-all cursor-pointer transform hover:scale-105"
              >
                <img
                  src={product.images[0]}
                  className="w-full h-48 object-cover rounded-t-xl"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://via.placeholder.com/300x200?text=No+Image";
                  }}
                />

                <div className="border-t-2 border-gray-200 p-3 flex flex-col gap-2 w-full">
                  <div className="font-bold text-sm line-clamp-2">
                    {product.title}
                  </div>
                  <span className="text-sm flex gap-1 text-gray-500">
                    <p className="font-light text-black">Category:</p>
                    <span className="capitalize">
                      {product.category.replace("-", " ")}
                    </span>
                  </span>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="flex gap-1 text-gray-500">
                      <p className="font-light text-black">Price:</p>
                      <span className="font-semibold text-green-600">
                        $ {product.price}
                      </span>
                    </span>
                    {product.stock && (
                      <span className="flex gap-1 text-gray-500">
                        <p className="font-light text-black">Stock:</p>
                        {String(product.stock)}
                      </span>
                    )}
                    {product.rating && (
                      <span className="flex gap-1 text-gray-500">
                        <p className="text-black">Rating:</p>
                        <span className="text-yellow-500">
                          {String(product.rating)}★
                        </span>
                      </span>
                    )}
                  </div>
                  <span className="text-sm flex gap-1 text-gray-500">
                    <p className="font-light text-black">Discount:</p>
                    <span className="text-red-500 font-semibold">
                      {String(product.discountPercentage)}%
                    </span>
                  </span>
                </div>

                <div className="flex gap-2 w-full p-3 pt-0">
                  <button
                    className="text-white text-sm flex items-center justify-center gap-2 flex-1 bg-green-500 px-3 py-2 rounded-md hover:bg-green-600 transition-colors disabled:opacity-50"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleAddToCart(product.id);
                    }}
                    disabled={addingToCart === product.id}
                  >
                    {addingToCart === product.id ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Adding...</span>
                      </>
                    ) : (
                      <>
                        <MdShoppingCart />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>

                  {isAuthenticated && (
                    <>
                      <button
                        className="text-white text-sm flex items-center justify-center gap-2 bg-[#66bfbf] px-3 py-2 rounded-md hover:bg-[#5aa5a5] transition-colors"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleEditClick(product.id);
                        }}
                      >
                        <MdEdit />
                      </button>

                      <button
                        className="bg-[#f76b8a] flex text-sm items-center justify-center gap-2 text-white rounded-md px-3 py-2 hover:bg-[#e55578] transition-colors"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleDelete(product.id);
                        }}
                      >
                        <MdDelete />
                      </button>
                    </>
                  )}
                </div>
              </Link>
            </div>
          ))}
        </ul>
      )}

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

      {selectedProductId && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-30 flex items-center justify-center p-4 z-50">
          <div className="bg-primaryColor-50 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <ProductDetails
              productId={selectedProductId}
              onUpdated={() => {
                handleProductUpdated();
                // Close the modal after a short delay to allow the user to see the success message
                setTimeout(() => {
                  handleCloseDetails();
                }, 1000);
              }}
              onClose={handleCloseDetails}
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

export default ProductList;
