// src/components/UserList.tsx
import React, { useEffect, useState } from "react";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";

import api from "../axios/api";
import type { Category, Products } from "../type/type";

interface Props {
  onSelectUser: (id: number | null) => void; // parent chooses which user to view
  refreshKey: number; // parent increments to tell component to re-fetch
}

const Products: React.FC<Props> = ({ onSelectUser, refreshKey }) => {
  const [users, setUsers] = useState<Products[]>([]);
  const [category, setCategory] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch users when component mounts or when refreshKey changes
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        // axios will parse JSON for us and put it into res.data
        const res = await api.get<Products[]>(
          "/products"
        );
        setUsers(res.data);
        console.log('a\zsxdcfvgbhnjk',res);
        
      } catch (err) {
        console.error(err);
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [refreshKey]);

   useEffect(() => {
     const fetchCategory = async () => {
       setLoading(true);
       setError(null);
       try {
         // axios will parse JSON for us and put it into res.data
         const res = await api.get<Category[]>("/products/categories");
         setCategory(res.data);
         console.log("aaaaaaaaaaaaa", res);
       } catch (err) {
         console.error(err);
       } finally {
         setLoading(false);
       }
     };
     fetchCategory();
   }, []);

  // Delete user by id
  const handleDelete = async (id: number) => {
    if (!confirm("Delete this Product?")) return;
    try {
      await api.delete(`/users/${id}`);
      // Optimistic update locally so UI updates immediately
      setUsers((prev) => prev.filter((u) => u.id !== id));
      // No API guarantee of full response — UI should reflect deletion locally
    } catch (err) {
      console.error(err);
      alert("Failed to delete user");
    }
  };
  //make edit for that products from backend

  const handleEdit= async (id: number) => {
    if (!confirm("Delete this Product?")) return;
    try {
      await api.put(`/products/${id}`);
      // Optimistic update locally so UI updates immediately
      setUsers((prev) => prev.filter((u) => u.id !== id));
      // No API guarantee of full response — UI should reflect deletion locally
    } catch (err) {
      console.error(err);
      alert("Failed to delete user");
    }
  };


  if (loading) return <p className="text-center p-4">Loading users...</p>;
  if (error) return <p className="text-center text-red-500 p-4">{error}</p>;

  return (
    <div className="bg-white  p-4 rounded shadow ">
      <h2 className="text-lg font-semibold mb-3">All Products</h2>
      <ul className="grid grid-cols-4 gap-4">
        {users.map((user) => (
          <div className=" border-gray-300 font-serif shadow-2xs border-1 rounded-xl flex gap-1   flex-col justify-between items-center border-b pb-2 w-[18rem]">
            <img src={`${user.image}`} alt="" className=" w-full h-50" />
            <div className=" border-t-2 border-gray-200 p-2 flex flex-col gap-2">
              <div className="font-bold text-sm ">{user.title}</div>
              <span className="text-sm flex gap-1 text-gray-500 ">
                <p className=" font-light text-black">Category:</p>{" "}
                {user.category}
              </span>
              <div className=" flex items-center justify-between">
                <span className="text-sm flex gap-1 text-gray-500 ">
                  <p className=" font-light text-black">Price:</p>{" "}
                  {String(user.price)}
                </span>
                <span className="text-sm flex gap-1 text-gray-500 ">
                  <p className=" font-light text-black">Count:</p>{" "}
                  {String(user.rating.count)}
                </span>
                <span className="text-sm flex gap-1 text-gray-500 ">
                  <p className=" text-black">Rate:</p>{" "}
                  {String(user.rating.rate)} **
                </span>
              </div>
            </div>
            <div className="flex gap-4 w-full p-2">
              <button
                className=" text-white text-sm flex items-center justify-between w-full bg-[#66bfbf] px-7 py- rounded-md"
                onClick={() => handleEdit(Number(user.id))}
              >
                <MdEdit />
                Edit
              </button>

              <button
                className=" bg-[#f76b8a] flex text-sm items-center justify-between  w-full text-white rounded-md  px-5 py-1"
                onClick={() => handleDelete(Number(user.id))}
              >
                <MdDelete />
                Delete
              </button>
            </div>
          </div>
        ))}

        <div>
          {category.map((item) => (
            <div>
              <p>{item.name}</p>
              <p>{item.slug}</p>
              <p>{item.url}</p>
            </div>
          ))}
        </div>
      </ul>
    </div>
  );
};

export default Products;
