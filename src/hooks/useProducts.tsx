// src/hooks/useproducts.ts
import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import type { Products } from "../type/type";

const API_URL = "https://dummyjson.com/products";
export function useproducts() {
  const [products, setProducts] = useState<Products[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Helper for Axios requests
  const request = async <T,>(promise: Promise<{ data: T }>): Promise<T> => {
    setLoading(true);
    setError(null);
    try {
      const response = await promise;
      return response.data;
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(axiosError.message || "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // GET all products
 const fetchUsers = async () => {
   const data = await request<Products[]>(axios.get(API_URL));
   setProducts(data);
 };

  // GET single product
  const getUser = async (id: number) => {
    return await request<Products>(axios.get(`${API_URL}/${id}`));
  };

  // CREATE new product
  const createUser = async (user: Omit<Products, "id">) => {
    const newUser = await request<Products>(axios.post(API_URL, user));
    setProducts((prev) => [...prev, newUser]);
  };

  // UPDATE existing product
  const updateUser = async (id: number, updates: Partial<Products>) => {
    const updated = await request<Products>(
      axios.put(`${API_URL}/${id}`, updates)
    );
    setProducts((prev) => prev.map((u) => (u.id === id ? updated : u)));
  };

  // DELETE product
  const deleteUser = async (id: number) => {
    await request(axios.delete(`${API_URL}/${id}`));
    setProducts((prev) => prev.filter((u) => u.id !== id));
  };

  // Load products on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    products,
    loading,
    error,
    fetchUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
  };
}
