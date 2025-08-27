import React, { useEffect, useState } from "react";
import api from "../api/api";
import { ArrowBigLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  brand: string;
  category: string;
  thumbnail: string;
}

const CategoryPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("smartphones");
  const [loading, setLoading] = useState(true);
 const navigate = useNavigate();

  const categories = [
    "smartphones",
    "laptops",
    "fragrances",
    "skincare",
    "groceries",
    "home-decoration",
    "furniture",
    "tops",
    "womens-dresses",
    "womens-shoes",
    "mens-shirts",
    "mens-shoes",
    "mens-watches",
    "womens-watches",
    "womens-bags",
    "womens-jewellery",
    "sunglasses",
    "automotive",
    "motorcycle",
    "lighting",
  ];

  const goBack = () => {
    navigate("/products");
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/category/${selectedCategory}`);
        setProducts(res.data.products);
      } catch (err) {
        console.error("Error fetching category products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  return (
    <div className="px-4 md:px-8 lg:px-16 mt-10">
      <div className="text-center text-primaryColor-500 mb-4">
        <ArrowBigLeft
          onClick={goBack}
          className="w-10 h-10 cursor-pointer o rounded-full  p-2"
        />
      </div>

      <h1 className="text-3xl font-bold mb-6 text-primaryColor-800 text-center">
        {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
      </h1>

      {/* Category select */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-4 mb-6">
        <label className="font-semibold">Select Category:</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border border-primaryColor-500  p-2 rounded focus:ring-2 f w-full sm:w-auto"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Products grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="rounded-lg p-4 shadow-md animate-pulse bg-gray-200 h-64"
            ></div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="rounded-lg p-4  shadow-md flex flex-col"
            >
              <img
                src={product.thumbnail}
                alt={product.title}
                className="w-full h-40 sm:h-48 md:h-56 object-cover my-2 rounded"
              />
              <h2 className="text-lg  text-primaryColor-500 font-semibold mb-1">{product.title}</h2>
              <p className="text-gray-700 text-sm flex-1">
                {product.description}
              </p>
              <div className="mt-2">
                <p className="text-2xl font-bold">${product.price}</p>
                <div>
                <p className="text-primaryColor-500 text-sm">{product.brand}</p>
                <button className="underline text-sm">View Details</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="col-span-full text-center text-gray-500">
          No products found in this category.
        </p>
      )}
    </div>
  );
};

export default CategoryPage;
