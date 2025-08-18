// src/components/productsList.tsx
import React, { useEffect, useState } from "react";
import { MdEdit, MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";

import api from "../axios/api";
import type { Products } from "../type/type";
import AddUser from "./AddProduct";
import EditProduct from "./Edit";

interface Props {
  onSelectproducts?: (id: number | null) => void;
  refreshKey: number;
  onSubmit?: () => void;
  onCancel?: () => void;
}

const CATEGORIES = [
  "beauty",
  "fragrances",
  "furniture",
  "groceries",
  "home-decoration",
  "kitchen-accessories",
  "laptops",
  "mens-shirts",
  "mens-shoes",
  "mens-watches",
  "mobile-accessories",
  "motorcycle",
  "skin-care",
  "smartphones",
  "sports-accessories",
  "sunglasses",
  "tablets",
  "tops",
  "vehicle",
  "womens-bags",
  "womens-dresses",
  "womens-jewellery",
  "womens-shoes",
  "womens-watches",
];

const Product: React.FC<Props> = ({
  onSelectproducts,
  onCancel,
  onSubmit,
  refreshKey,
}) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Products[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenedit, setIsOpenedit] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Fetch products by category
  const fetchProductsByCategory = async (category: string) => {
    setLoading(true);
    setError(null);
    try {
      const endpoint =
        category === "all" ? "/products" : `/products/category/${category}`;
      const res = await api.get(endpoint);

      console.log(`Products response for ${category}:`, res);

      if (res.data && Array.isArray(res.data.products)) {
        setProducts(res.data.products);
      } else if (Array.isArray(res.data)) {
        setProducts(res.data);
      } else {
        console.warn("API response format unexpected:", res.data);
        setProducts([]);
        setError("Invalid data format received from server");
      }
    } catch (err) {
      console.error(`Failed to fetch products for category ${category}:`, err);
      setError("Failed to load products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all products from all categories
  const fetchAllProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const promises = CATEGORIES.map((category) =>
        api.get(`/products/category/${category}`)
      );

      const responses = await Promise.all(promises);
      const allProducts: Products[] = [];

      responses.forEach((res) => {
        if (res.data && Array.isArray(res.data.products)) {
          allProducts.push(...res.data.products);
        } else if (Array.isArray(res.data)) {
          allProducts.push(...res.data);
        }
      });

      setProducts(allProducts);
    } catch (err) {
      console.error("Failed to fetch all products:", err);
      setError("Failed to load products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch products when component mounts or when category/refreshKey changes
  useEffect(() => {
    if (selectedCategory === "all") {
      fetchAllProducts();
    } else {
      fetchProductsByCategory(selectedCategory);
    }
  }, [refreshKey, refreshTrigger, selectedCategory]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const formatCategoryName = (category: string) => {
    return category
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking delete
    if (!confirm("Delete this Product?")) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((product) => product.id !== id));
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      console.error(err);
      alert("Failed to delete product");
    }
  };

  const handleEdit = (id: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking edit
    setSelectedProductId(id);
    if (onSelectproducts && typeof onSelectproducts === "function") {
      onSelectproducts(id);
    }
    setIsOpenedit(true);
  };

  const handleProductClick = (id: number) => {
    navigate(`/product/${id}`);
  };

  const handleAddNewProduct = () => {
    setIsOpen(true);
  };

  const handleAddSubmit = () => {
    setIsOpen(false);
    if (onSubmit && typeof onSubmit === "function") {
      onSubmit();
    }
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleAddCancel = () => {
    setIsOpen(false);
    if (onCancel && typeof onCancel === "function") {
      onCancel();
    }
  };

  const handleEditSubmit = () => {
    setIsOpenedit(false);
    setSelectedProductId(null);
    if (onSubmit && typeof onSubmit === "function") {
      onSubmit();
    }
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleEditCancel = () => {
    setIsOpenedit(false);
    setSelectedProductId(null);
    if (onCancel && typeof onCancel === "function") {
      onCancel();
    }
  };

  return (
    <div className="bg-white flex flex-col gap-3 justify-center p-4 rounded shadow">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold mb-3">
          All Products{" "}
          {selectedCategory !== "all" &&
            `- ${formatCategoryName(selectedCategory)}`}
        </h2>
        <button
          className="bg-blue-500 text-white px-3 py-2 rounded-md text-xs font-bold hover:bg-blue-600 transition-colors"
          onClick={handleAddNewProduct}
        >
          Add New Product
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Category:
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Categories</option>
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {formatCategoryName(category)}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">Loading products...</span>
        </div>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-500 p-4">No products found</p>
      ) : (
        <>
          <div className="mb-2 text-sm text-gray-600">
            Showing {products.length} product{products.length !== 1 ? "s" : ""}
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <div
                className="border-gray-300 font-serif shadow-lg border rounded-xl flex gap-1 flex-col justify-between items-center pb-2 hover:shadow-xl transition-all cursor-pointer transform hover:scale-105"
                onClick={() => handleProductClick(Number(product.id))}
              >
                {/* Fixed image display */}
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
                    <span className="flex gap-1 text-gray-500">
                      <p className="font-light text-black">Stock:</p>
                      {String(product.stock)}
                    </span>
                    <span className="flex gap-1 text-gray-500">
                      <p className="text-black">Rating:</p>
                      <span className="text-yellow-500">
                        {String(product.rating)}★
                      </span>
                    </span>
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
                    className="text-white text-sm flex items-center justify-center gap-2 flex-1 bg-[#66bfbf] px-3 py-2 rounded-md hover:bg-[#5aa5a5] transition-colors"
                    onClick={(e) => handleEdit(Number(product.id), e)}
                  >
                    <MdEdit />
                    Edit
                  </button>

                  <button
                    className="bg-[#f76b8a] flex text-sm items-center justify-center gap-2 flex-1 text-white rounded-md px-3 py-2 hover:bg-[#e55578] transition-colors"
                    onClick={(e) => handleDelete(Number(product.id), e)}
                  >
                    <MdDelete />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </ul>
        </>
      )}

      {/* Add Product Modal */}
      {isOpen && (
        <AddUser onSubmit={handleAddSubmit} onCancel={handleAddCancel} />
      )}

      {/* Edit Product Modal */}
      {isOpenedit && (
        <EditProduct
          productId={selectedProductId}
          onSubmit={handleEditSubmit}
          onCancel={handleEditCancel}
        />
      )}
    </div>
  );
};

export default Product;
