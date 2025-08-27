import React from "react";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className=" fixed flex  w-50 shadow-2xs bg-white  flex-col p-10 h-screen max-sm:absolute max-sm:top-[70px] max-sm:w-full max-sm:left-0 max-sm:h-[60vh] text-black-600 border border-gray-200 space-y-3">
     
    

      {/* Navigation Links */}
      <Link
        to="/products"
        className="px-3 py-2 rounded  hover:bg-primaryColor-50 transition-colors flex hover:text-primaryColor-600 "
      >
       
        Products
      </Link>

 

      <Link
      to="/category"
        className="px-3 py-2  rounded flex  hover:bg-primaryColor-50  hover:text-primaryColor-600 transition-colors "
      >
        
        Categories
      </Link>

      {/* Logout at the bottom */}
     
    </aside>
  );
}
