import React, { createContext, useContext, useState } from "react";
import axios from "axios";

interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  thumbnail: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (productId: number) => Promise<void>;
  increaseQuantity: (productId: number) => void;
  decreaseQuantity: (productId: number) => void;
  removeFromCart: (productId: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = async (productId: number) => {
    try {
      const res = await axios.get(`https://dummyjson.com/products/${productId}`);
      const product = res.data;

      setCart((prevCart) => {
        const existing = prevCart.find((item) => item.id === productId);

        if (existing) {
          return prevCart.map((item) =>
            item.id === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          return [
            ...prevCart,
            {
              id: product.id,
              title: product.title,
              price: product.price,
              thumbnail: product.thumbnail,
              quantity: 1,
            },
          ];
        }
      });
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  const increaseQuantity = (productId: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (productId: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, increaseQuantity, decreaseQuantity, removeFromCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
