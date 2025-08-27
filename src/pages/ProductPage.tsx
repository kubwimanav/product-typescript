import { useState, useEffect } from "react";
// import AddProduct from "../components/AddProduct";
import ProductList from "../components/DBProducts/ProductList";
import type { Product } from "../types/productTypes";

export default function ProductPage() {
  const [, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("https://dummyjson.com/products")
      .then((res) => res.json())
      .then((data) => setProducts(data.products))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  

  return (
    <div className="">
      <ProductList refreshKey={0} />
    </div>
  );
}

