import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  MdArrowBack,
  MdShoppingCart,
  MdEdit,
  MdDelete,
  MdStar,
  MdStarBorder,

} from "react-icons/md";
import type { Product } from "../types/productTypes";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api from "../api/api";
import ProductDetails from "./ProductDetails";


const SingleProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [cartMessage, setCartMessage] = useState<string | null>(null);

  const { addToCart } = useCart();
  const {isAuthenticated } = useAuth();

  useEffect(() => {
    if (!id) {
      setError("Product ID is required");
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.get(`/${id}`);
        setProduct(response.data);
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setError("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      setAddingToCart(true);

      for (let i = 0; i < quantity; i++) {
        await addToCart(product.id);
      }

      setCartMessage(`Added ${quantity} item(s) to cart successfully!`);
      setTimeout(() => setCartMessage(null), 3000);
    } catch (error) {
      console.error("Failed to add to cart:", error);
      setCartMessage("Failed to add item to cart. Please try again.");
      setTimeout(() => setCartMessage(null), 3000);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleDelete = async () => {
    if (!product) return;

    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await api.delete(`/${product.id}`);
      alert("Product deleted successfully!");
      navigate("/products");
    } catch (error) {
      console.error("Failed to delete product:", error);
      alert("Failed to delete product. Please try again.");
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);

    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className="text-yellow-400">
          {i < fullStars ? <MdStar /> : <MdStarBorder />}
        </span>
      );
    }

    return stars;
  };

;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="text-red-500 text-lg">
          {error || "Product not found"}
        </div>
        <Link
          to="/products"
          className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Back to Products
        </Link>
      </div>
    );
  }

  return (
 <div className="min-h-screen bg-gray-50 py-2">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-2 ">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:bg-blue-500 hover:text-white hover:px-1 hover:rounded-md transition-colors"
            >
              <MdArrowBack className="text-xl" />
              Back to Products
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
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

              <div className="space-y-6">
                <div>
                  <div className=" flex  items-center justify-between gap-2">
                    Category:
                    <span className=" bg-blue-50 px-7 py-1 font-bold rounded-md  text-blue-800 text-xs ">
                      {product.category}
                    </span>
                  </div>
                  <h1 className="text-xl font-bold text-gray-900 mb-2">
                    {product.title}
                  </h1>
                  <p className="text-gray-600 ">{product.description}</p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex">{renderStars(product.rating)}</div>
                  <span className="text-gray-600">
                    {product.rating} out of 5
                  </span>
                </div>

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

                <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <span className="text-sm text-gray-500">Stock</span>
                    <p className="font-semibold text-xs">
                      {product.stock} units
                    </p>
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
                        <span className="text-gray-500">
                          availabilityStatus
                        </span>
                        <p className="font-semibold text-xs">
                          {product.availabilityStatus}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">
                          shippingInformation
                        </span>
                        <p className="font-semibold text-xs">
                          {product.shippingInformation}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">
                          warrantyInformation
                        </span>
                        <p className="font-semibold text-xs">
                          {product.warrantyInformation}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={addingToCart || (product.stock || 0) === 0}
                    className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    {addingToCart ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Adding to Cart...
                      </>
                    ) : (
                      <>
                        <MdShoppingCart />
                        Add to Cart
                      </>
                    )}
                  </button>
                
                {isAuthenticated && (

                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowEditModal(true)}
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
                )}
              </div>
            </div>
          </div>
        </div>

        {showEditModal && isAuthenticated && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <ProductDetails
              
                productId={product.id}
                onUpdated={() => {
                  setShowEditModal(false);
                  // Refresh product data
                  window.location.reload();
                }}
                onClose={() => setShowEditModal(false)}
              />
            </div>
          </div>
        )}

        {/* Success/Error Messages */}
        {cartMessage && (
          <div
            className={`fixed bottom-4 right-4 px-6 py-3 rounded-md shadow-lg z-50 ${
              cartMessage.includes("success")
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {cartMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleProductPage;
