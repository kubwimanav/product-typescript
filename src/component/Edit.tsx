// src/components/EditProduct.tsx
import React, { useState, useEffect } from "react";
import api from "../axios/api";

interface Props {
  productId: number | null;
  onSubmit: () => void;
  onCancel: () => void;
}

const EditProduct: React.FC<Props> = ({ productId, onSubmit, onCancel }) => {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch product data when component mounts
  useEffect(() => {
    if (productId) {
      const fetchProduct = async () => {
        setFetchLoading(true);
        setError(null);
        try {
          const res = await api.get(`/products/${productId}`);
          if (res.data) {
            setTitle(res.data.title || "");
          }
        } catch (err) {
          console.error("Failed to fetch product:", err);
          setError("Failed to load product data");
        } finally {
          setFetchLoading(false);
        }
      };
      fetchProduct();
    }
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productId) {
      setError("No product ID provided");
      return;
    }

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.put(`/products/${productId}`, {
        title: title.trim(),
      });

      console.log("Product updated successfully:", response.data);
      onSubmit(); // Notify parent component
    } catch (err) {
      console.error("Failed to update product:", err);
      setError("Failed to update product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!productId) {
    return null; // Don't render if no product ID
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Edit Product</h2>

        {fetchLoading ? (
          <div className="text-center py-4">
            <p>Loading product data...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="productId"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Product ID
              </label>
              <input
                type="text"
                id="productId"
                value={productId}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Title *
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter product title"
                required
                disabled={loading}
              />
            </div>

            {error && (
              <div className="mb-4 text-red-600 text-sm bg-red-50 p-2 rounded">
                {error}
              </div>
            )}

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !title.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Updating..." : "Update Product"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditProduct;
