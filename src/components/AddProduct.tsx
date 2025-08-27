import { useState } from "react";
import type { Product } from "../types/productTypes";
interface Props {
  onProductAdded: (product: Product) => void;
}

interface ProductForm {
  title: string;
  category: string;
  price: number | string;
  discountPercentage: number;
  weight: number
  brand: string;
  images: string[];
}

export default function AddProduct({ onProductAdded }: Props) {
  const [form, setForm] = useState<ProductForm>({
    title: "",
    category: "",
    price: "",
    discountPercentage: 0,
    weight: 0,
    brand: "",
    images: [""]
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "discountPercentage"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    fetch("https://dummyjson.com/products/add", {
      method: "POST",
      body: JSON.stringify(form),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data: Product) => {
        console.log("Product created:", data);
        alert("Product added successfully!");

        setForm({
          title: "",
          category: "",
          price: 0,
          discountPercentage: 0,
          weight: 0,
          brand: "",
          images: [""]
        });

        onProductAdded(data); 
      })
      .catch((err) => {
        console.error("Error adding product:", err);
        alert("Failed to add product");
      });
  };

  return (
    <div className="flex justify-center items-center">
      <div className="p-4 w-full  rounded-2xl bg-white shadow-2xl border-1 border-gray-200 mt-4">
        <h2 className="text-xl flex justify-center  font-bold mb-4">
          Add Product
        </h2>
        <form
          onSubmit={handleSubmit}
          className="space-y-2 flex justify-center flex-col"
        >
          <input
            className="border border-gray-300 p-1 rounded-md w-full"
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            required
          />
          <input
            className="border border-gray-300 p-1 rounded-md  w-full"
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            required
          />
          <label htmlFor="price" className="block text-xs font-medium text-gray-700">
            Price
          </label>
          <input
            className="border border-gray-300 p-1 rounded-md  w-full"
            name="price"
            placeholder="Price"
            type="number"
            value={form.price}
            onChange={handleChange}
            required
          />
          <label htmlFor="price" className="block font-medium text-xs text-gray-700">
            Discount Percentage
          </label>
          <input
            className="border border-gray-300 p-1 rounded-md w-full"
            name="discountPercentage"
            placeholder="Discount Percentage"
            type="number"
            value={form.discountPercentage}
            onChange={handleChange}
            required
          />
          <label htmlFor="price" className="block font-medium text-xs text-gray-700">
            Weight
          </label>
          <input
            className="border border-gray-300 p-1 rounded-md  w-full"
            name="weight"
            placeholder="weight"
            type="number"
            value={form.weight}
            onChange={handleChange}
            required
          />
          <input
            className="border border-gray-300 p-1 rounded-md w-full"
            name="brand"
            placeholder="Brand"
            value={form.brand}
            onChange={handleChange}
            required
          />
          <input
            className="border border-gray-300 p-1 rounded-md  w-full"
            name="images"
            placeholder="Image url"
            value={form.images}
            onChange={handleChange}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white flex justify-center items-center px-4  rounded-md py-2"
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
}
