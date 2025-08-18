// src/components/AddUser.tsx
import { useState } from "react";
import Input from "./Input";

interface User {
  id: string;
  title: string;
 
}

interface Props {
  onSubmit: () => void;
  onCancel: () => void;
}

export default function AddProduct({ onSubmit, onCancel }: Props) {
  const [form, setForm] = useState<User>({
    id: "",
    title: "",
   
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const validateForm = (): boolean => {
    if (!form.title.trim()) {
      setError("Title is required");
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
        id: "",
        title: "",
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
      id: "",
      title: "",
    });
    setError(null);
    onCancel();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add New Product</h2>
          <button
            onClick={handleCancel}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* <Input
            label="Id "
            name="id"
            placeholder="Enter product id"
            value={form.id}
            onChange={handleChange}
          /> */}

          <Input
            label="Product Title"
            name="title"
            placeholder="Enter product title"
            value={form.title}
            onChange={handleChange}
          />

          <button
            type="submit"
            disabled={loading}
            className={`flex-1 px-4 py-2 rounded font-medium ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            } text-white transition-colors`}
          >
            {loading ? "Adding..." : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
}
