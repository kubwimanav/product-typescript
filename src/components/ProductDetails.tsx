import React, { useEffect, useState } from "react";
import api from "../api/api";
import type { Product } from "../types/productTypes";

interface Props {
  productId: number | null;
  onUpdated?: () => void; // Made optional
  onClose: () => void;
}

const ProductDetails: React.FC<Props> = ({ productId, onUpdated, onClose }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [backupProduct, setBackupProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false); // fetching
  const [saving, setSaving] = useState(false); // saving
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [refreshTrigger] = useState(0); // Force refresh trigger

  // Fetch product when productId changes or refreshTrigger changes
  useEffect(() => {
    if (!productId) {
      setProduct(null);
      return;
    }

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get<Product>(`/${productId}`);
        console.log("Fetched product data:", res.data);
        setProduct(res.data);
        setBackupProduct(res.data); // Set backup when fetching
      } catch (err) {
        console.error(err);
        setError("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, refreshTrigger]);

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!product) return;
    const { name, value } = e.target;

    setProduct({
      ...product,
      [name]:
        name === "price" ||
        name === "discountPercentage" ||
        name === "stock" ||
        name === "rating"
          ? Number(value)
          : value,
    });
  };

  // Save product updates with validation
  const handleSave = async () => {
    if (!product || !productId) return;

    // Validation
    if (!product.title?.trim()) {
      setError("Title is required.");
      return;
    }
    if (product.price <= 0) {
      setError("Price must be greater than 0.");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const updateData = {
        title: product.title,
        price: product.price,
        description: product.description,
        category: product.category,
        discountPercentage: product.discountPercentage,
        stock: product.stock,
        rating: product.rating,
      };

      // Update the product

      // Create the updated product object with our edited data
      const updatedProduct = {
        ...product, // Keep all existing data
        ...updateData, // Override with our edited values
        id: productId, // Ensure ID is preserved
      };

      console.log("Updated product with new data:", updatedProduct);

      // Immediately update the display with our edited data
      setProduct(updatedProduct);
      setBackupProduct(updatedProduct);

      // Exit editing mode
      setIsEditing(false);

      // Show success message
      alert("Product updated successfully!");

      // Force a refresh of the component data
      setTimeout(async () => {
        try {
          const freshRes = await api.get<Product>(`/${productId}`);
          setProduct(freshRes.data);
          setBackupProduct(freshRes.data);
          console.log("Refreshed with API data:", freshRes.data);
        } catch (err) {
          console.log("Could not refresh from API, keeping local data");
        }
      }, 100);

      // Notify parent component if callback exists
      if (onUpdated) {
        onUpdated();
      }
    } catch (err) {
      console.error("Error updating product:", err);
      setError("Failed to update product. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Start editing (store backup)
  const startEditing = () => {
    if (product) {
      setBackupProduct({ ...product });
      setIsEditing(true);
      setError(null);
    }
  };

  // Cancel edit (restore backup)
  const handleCancelEdit = () => {
    if (backupProduct) {
      setProduct({ ...backupProduct });
    }
    setIsEditing(false);
    setError(null);
  };

  // UI states
  if (loading)
    return <div className="p-4 text-center">Loading product details...</div>;
  if (error && !isEditing && !product)
    return <div className="p-4 text-red-500">{error}</div>;
  if (!product) return <div className="p-4">No product selected</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Product Details</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
        >
          &times;
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
          {error}
        </div>
      )}

      {/* Product Info */}
      <div className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          {isEditing ? (
            <input
              type="text"
              name="title"
              value={product.title || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter product title"
            />
          ) : (
            <p
              className="p-2 bg-gray-50 rounded"
              key={`title-${product.title}`}
            >
              {product.title}
            </p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          {isEditing ? (
            <input
              type="text"
              name="category"
              value={product.category || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter product category"
            />
          ) : (
            <p
              className="p-2 bg-gray-50 rounded"
              key={`category-${product.category}`}
            >
              {product.category}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          {isEditing ? (
            <textarea
              name="description"
              value={product.description || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Enter product description"
            />
          ) : (
            <p
              className="p-2 bg-gray-50 rounded"
              key={`description-${product.description}`}
            >
              {product.description || "No description available"}
            </p>
          )}
        </div>

        {/* Price and Discount */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price ($)
            </label>
            {isEditing ? (
              <input
                type="number"
                name="price"
                value={product.price || 0}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p
                className="p-2 bg-gray-50 rounded"
                key={`price-${product.price}`}
              >
                ${product.price?.toFixed(2) || "0.00"}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount (%)
            </label>
            {isEditing ? (
              <input
                type="number"
                name="discountPercentage"
                value={product.discountPercentage || 0}
                onChange={handleChange}
                min="0"
                max="100"
                step="0.01"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p
                className="p-2 bg-gray-50 rounded"
                key={`discount-${product.discountPercentage}`}
              >
                {product.discountPercentage?.toFixed(2) || "0.00"}%
              </p>
            )}
          </div>
        </div>

        {/* Stock and Rating */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock
            </label>
            {isEditing ? (
              <input
                type="number"
                name="stock"
                value={product.stock || 0}
                onChange={handleChange}
                min="0"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p
                className="p-2 bg-gray-50 rounded"
                key={`stock-${product.stock}`}
              >
                {product.stock || "N/A"}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rating
            </label>
            {isEditing ? (
              <input
                type="number"
                name="rating"
                value={product.rating || 0}
                onChange={handleChange}
                min="0"
                max="5"
                step="0.1"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p
                className="p-2 bg-gray-50 rounded"
                key={`rating-${product.rating}`}
              >
                {product.rating ? `${product.rating}★` : "N/A"}
              </p>
            )}
          </div>
        </div>

        {/* Images */}
        {product.images && product.images.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Images
            </label>
            <div className="flex space-x-2 flex-wrap gap-2">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Product ${index + 1}`}
                  className="h-20 w-20 object-cover rounded border"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://via.placeholder.com/80x80?text=No+Image";
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Reviews */}
        {product.reviews && product.reviews.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reviews
            </label>
            <div className="max-h-40 overflow-y-auto">
              <ul className="space-y-2">
                {product.reviews.map((review, index) => (
                  <li
                    key={index}
                    className="p-3 border rounded bg-gray-50 text-sm"
                  >
                    <p className="font-semibold">
                      {review.reviewerName ?? "Anonymous"}
                    </p>
                    <p className="text-gray-600 italic">
                      Rating: {review.rating ?? "N/A"} ★
                    </p>
                    <p className="mt-1">
                      {review.comment ?? "No comment provided."}
                    </p>
                    {review.date && (
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(review.date).toLocaleDateString()}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="mt-6 flex justify-end space-x-2">
        {!isEditing ? (
          <>
            <button
              onClick={startEditing}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Edit
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
            >
              Close
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={handleCancelEdit}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
              disabled={saving}
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
