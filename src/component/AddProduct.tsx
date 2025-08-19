// src/components/AddProduct.tsx
import { useState } from "react";

interface Props {
  onSubmit: () => void;
  onCancel: () => void;
}

interface ProductForm {
  title: string;
  description: string;
  price: string;
  discountPercentage: string;
  rating: string;
  stock: string;
  category: string;
  brand: string;
  weight: string;
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  returnPolicy: string;
  minimumOrderQuantity: string;
  images: string;
}

export default function AddProduct({ onSubmit, onCancel }: Props) {
  const [form, setForm] = useState<ProductForm>({
    title: "",
    description: "",
    price: "",
    discountPercentage: "",
    rating: "",
    stock: "",
    category: "",
    brand: "",
    weight: "",
    warrantyInformation: "",
    shippingInformation: "",
    availabilityStatus: "",
    returnPolicy: "",
    minimumOrderQuantity: "",
    images: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Clear error when user starts typing
    if (error) setError(null);
  };

  const validateForm = (): boolean => {
    if (!form.title.trim()) {
      setError("Title is required");
      return false;
    }

    if (!form.description.trim()) {
      setError("Description is required");
      return false;
    }

    if (!form.price.trim() || parseFloat(form.price) <= 0) {
      setError("Valid price is required");
      return false;
    }

    if (!form.category.trim()) {
      setError("Category is required");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    setLoading(true);

    try {
      // Prepare the data according to the API requirements
      const productData = {
        title: form.title,
        description: form.description,
        price: parseFloat(form.price) || 0,
        discountPercentage: parseFloat(form.discountPercentage) || 0,
        rating: parseFloat(form.rating) || 0,
        stock: parseInt(form.stock) || 0,
        category: form.category,
        brand: form.brand,
        weight: parseFloat(form.weight) || 0,
        warrantyInformation: form.warrantyInformation,
        shippingInformation: form.shippingInformation,
        availabilityStatus: form.availabilityStatus,
        returnPolicy: form.returnPolicy,
        minimumOrderQuantity: parseInt(form.minimumOrderQuantity) || 1,
        images: [form.images].filter(Boolean),
      };

      const response = await fetch("https://dummyjson.com/products/add", {
        method: "POST",
        body: JSON.stringify(productData),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Product created:", data);

      // Reset form
      setForm({
        title: "",
        description: "",
        price: "",
        discountPercentage: "",
        rating: "",
        stock: "",
        category: "",
        brand: "",
        weight: "",
        warrantyInformation: "",
        shippingInformation: "",
        availabilityStatus: "",
        returnPolicy: "",
        minimumOrderQuantity: "",
        images: "",
      });

      alert("Product added successfully!");

      // Call parent's onSubmit to close modal and refresh data
      onSubmit();
    } catch (error) {
      console.error("Error adding product:", error);
      setError(
        error instanceof Error ? error.message : "Failed to add product"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form and call parent's onCancel
    setForm({
      title: "",
      description: "",
      price: "",
      discountPercentage: "",
      rating: "",
      stock: "",
      category: "",
      brand: "",
      weight: "",
      warrantyInformation: "",
      shippingInformation: "",
      availabilityStatus: "",
      returnPolicy: "",
      minimumOrderQuantity: "",
      images: "",
    });
    setError(null);
    onCancel();
  };

  const InputField = ({
    label,
    name,
    type = "text",
    placeholder,
    required = false,
    ...props
  }: {
    label: string;
    name: string;
    type?: string;
    placeholder: string;
    required?: boolean;
    [key: string]: any;
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={form[name as keyof ProductForm]}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        {...props}
      />
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start sm:items-center z-50 overflow-y-auto">
      <div className="rounded-lg w-full max-w-4xl m-4">
        <div className="bg-white rounded-lg p-6 w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Add New Product
            </h2>
            <button
              onClick={handleCancel}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center"
              type="button"
            >
              ×
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Product Title"
                  name="title"
                  placeholder="Enter product title"
                  required
                />
                <InputField
                  label="Category"
                  name="category"
                  placeholder="Enter category"
                  required
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  placeholder="Enter product description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Pricing & Stock */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Pricing & Stock</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField
                  label="Price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Enter price"
                  required
                />
                <InputField
                  label="Discount %"
                  name="discountPercentage"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  placeholder="Discount percentage"
                />
                <InputField
                  label="Stock Quantity"
                  name="stock"
                  type="number"
                  min="0"
                  placeholder="Stock quantity"
                />
              </div>
            </div>

            {/* Product Details */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Product Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Brand"
                  name="brand"
                  placeholder="Enter brand name"
                />
                <InputField
                  label="Weight (kg)"
                  name="weight"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Product weight"
                />
                <InputField
                  label="Rating"
                  name="rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  placeholder="Product rating"
                />
                <InputField
                  label="Min Order Quantity"
                  name="minimumOrderQuantity"
                  type="number"
                  min="1"
                  placeholder="Minimum order"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Availability Status
                </label>
                <select
                  name="availabilityStatus"
                  value={form.availabilityStatus}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select availability</option>
                  <option value="In Stock">In Stock</option>
                  <option value="Low Stock">Low Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">
                Additional Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Warranty Information"
                  name="warrantyInformation"
                  placeholder="Warranty details"
                />
                <InputField
                  label="Return Policy"
                  name="returnPolicy"
                  placeholder="Return policy"
                />
                <InputField
                  label="Shipping Information"
                  name="shippingInformation"
                  placeholder="Shipping details"
                />
                <InputField
                  label="Image URL"
                  name="images"
                  type="url"
                  placeholder="Product image URL"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 px-6 py-3 rounded-lg font-medium bg-gray-500 hover:bg-gray-600 text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 px-6 py-3 rounded-lg font-medium ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                } text-white transition-colors`}
              >
                {loading ? "Adding Product..." : "Add Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
