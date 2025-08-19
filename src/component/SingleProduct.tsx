// src/components/ProductDetail.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  MdArrowBack,
  MdEdit,
  MdDelete,
  MdStar,
  MdStarBorder,
} from "react-icons/md";

import api from "../axios/api";
import type { Products } from "../type/type";
import EditProduct from "./Edit";

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Products | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Fetch single product by ID
  const fetchProduct = async (productId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/products/${productId}`);
      console.log("Product response:", res);

      if (res.data) {
        setProduct(res.data);
      } else {
        setError("Product not found");
      }
    } catch (err) {
      console.error("Failed to fetch product:", err);
      setError("Failed to load product details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id]);

  const handleDelete = async () => {
    if (!product || !confirm("Are you sure you want to delete this product?"))
      return;

    try {
      await api.delete(`/products/${product.id}`);
      alert("Product deleted successfully");
      navigate("/products"); // Navigate back to products list
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete product");
    }
  };

  const handleEdit = () => {
    setIsEditOpen(true);
  };

  const handleEditSubmit = () => {
    setIsEditOpen(false);
    // Refresh product data after edit
    if (id) {
      fetchProduct(id);
    }
  };

  const handleEditCancel = () => {
    setIsEditOpen(false);
  };

  const formatCategoryName = (category: string) => {
    return category
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<MdStar key={i} className="text-yellow-400" />);
      } else {
        stars.push(<MdStarBorder key={i} className="text-gray-300" />);
      }
    }

    return stars;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="text-gray-600">Loading product details...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center ">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <button
            onClick={() => navigate("/products")}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-4">Product not found</p>
          <button
            onClick={() => navigate("/products")}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-2">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-2 ">
          <Link to={'/'}
            className="flex items-center gap-2 text-gray-600 hover:bg-blue-500 hover:text-white hover:px-1 hover:rounded-md transition-colors"
          >
            <MdArrowBack className="text-xl" />
            Back to Products
          </Link>
        </div>

        {/* Product Detail */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={product.images[selectedImageIndex]}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://via.placeholder.com/500x500?text=No+Image";
                  }}
                />
              </div>

              {/* Thumbnail Images */}
              {product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-colors ${
                        selectedImageIndex === index
                          ? "border-blue-500"
                          : "border-gray-200"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://via.placeholder.com/80x80?text=No+Image";
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className=" flex  items-center justify-between gap-2">
                  Category:
                  <span className=" bg-blue-50 px-7 py-1 font-bold rounded-md  text-blue-800 text-xs ">
                    {formatCategoryName(product.category)}
                  </span>
                </div>
                <h1 className="text-xl font-bold text-gray-900 mb-2">
                  {product.title}
                </h1>
                <p className="text-gray-600 ">{product.description}</p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex">{renderStars(product.rating)}</div>
                <span className="text-gray-600">{product.rating} out of 5</span>
              </div>

              {/* Price and Discount */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-md font-bold text-[#66bfbf]">
                    ${product.price}
                  </span>
                  with discount of
                  <span className="bg-white text-[#e55578] text-sm px-2 py-1 rounded-full">
                    {product.discountPercentage}%
                  </span>
                </div>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <span className="text-sm text-gray-500">Stock</span>
                  <p className="font-semibold text-xs">{product.stock} units</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Brand</span>
                  <p className="font-semibold text-xs ">
                    {product.brand || "N/A"}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">SKU</span>
                  <p className="font-semibold text-xs">{product.sku}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Weight</span>
                  <p className="font-semibold text-xs">{product.weight}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">returnPolicy</span>
                  <p className="font-semibold text-xs">
                    {product.returnPolicy}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">
                    minimumOrderQuantity
                  </span>
                  <p className="font-semibold text-xs">
                    {product.minimumOrderQuantity}
                  </p>
                </div>
              </div>

              {/* Dimensions */}
              {product.dimensions && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-2 text-sm">Dimensions</h3>
                  <div className="grid grid-cols-3 gap-4 text-sm mb-1">
                    <div>
                      <span className="text-gray-500">Width</span>
                      <p className="font-semibold text-xs">
                        {product.dimensions.width}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Height</span>
                      <p className="font-semibold text-xs">
                        {product.dimensions.height}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Depth</span>
                      <p className="font-semibold text-xs">
                        {product.dimensions.depth}
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold text-sm">Meta</p>
                  <div className="grid grid-cols-3 gap-4 text-sm mb-1">
                    <div>
                      <span className="text-gray-500">createdAt</span>
                      <p className="font-semibold text-xs">
                        {product.meta.createdAt}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500 ">updatedAt</span>
                      <p className="font-semibold text-xs">
                        {product.meta.updatedAt}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">barcode</span>
                      <p className="font-semibold">{product.meta.barcode}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">availabilityStatus</span>
                      <p className="font-semibold text-xs">
                        {product.availabilityStatus}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">shippingInformation</span>
                      <p className="font-semibold text-xs">
                        {product.shippingInformation}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">warrantyInformation</span>
                      <p className="font-semibold text-xs">
                        {product.warrantyInformation}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleEdit}
                  className="flex-1 bg-[#66bfbf] text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                >
                  <MdEdit />
                  Edit Product
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 bg-[#f76b8a] text-white px-6 py-3 rounded-md hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                >
                  <MdDelete />
                  Delete Product
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Product Modal */}
      {isEditOpen && (
        <EditProduct
          productId={product.id}
          onSubmit={handleEditSubmit}
          onCancel={handleEditCancel}
        />
      )}
    </div>
  );
};

export default ProductDetail;
