import { useState, useEffect } from "react";
// import AddProduct from "../components/AddProduct";
import ProductList from "../components/DBProducts/ProductList";
import type { Product } from "../types/productTypes";

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("https://dummyjson.com/products")
      .then((res) => res.json())
      .then((data) => setProducts(data.products))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  const handleProductAdded = (newProduct: Product) => {
    // ✅ Immediately add it to the list
    setProducts((prev) => [...prev, { ...newProduct, id: prev.length + 1 }]);
  };

  return (
    <div className="">
      {/* <AddProduct onProductAdded={handleProductAdded} /> */}
      <ProductList products={products} />
    </div>
  );
}

