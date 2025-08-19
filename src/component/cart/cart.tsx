import React, { useState, useEffect } from "react";
import api from "../../axios/api";
import type { Type } from "../../type/type";

const CartComponent = () => {
  const [carts, setCarts] = useState<Type["carts"]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchCarts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get<Type>("/carts");
        setCarts(res.data.carts);
      } catch (err) {
        console.error(err);
        setError("Failed to load carts");
      } finally {
        setLoading(false);
      }
    };

    fetchCarts();
  }, [refreshKey]);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2">Loading carts...</span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">User Carts</h1>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          AddCarts
        </button>
      </div>

      <div className="space-y-6">
        {carts.map((cart) => (
          <div
            key={cart.id}
            className="bg-white border border-gray-200 rounded-lg shadow-sm"
          >
            {/* Cart Header */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Cart #{cart.id}</h2>
                <div className="text-sm text-gray-600">
                  User ID: {cart.userId}
                </div>
              </div>
              <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Total Products:</span>
                  <span className="ml-1 font-medium">{cart.totalProducts}</span>
                </div>
                <div>
                  <span className="text-gray-500">Total Quantity:</span>
                  <span className="ml-1 font-medium">{cart.totalQuantity}</span>
                </div>
                <div>
                  <span className="text-gray-500">Original Total:</span>
                  <span className="ml-1 font-medium">
                    ${cart.total.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Final Total:</span>
                  <span className="ml-1 font-medium text-green-600">
                    ${cart.discountedTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Products List */}
            <div className="p-4">
              <h3 className="font-medium text-gray-800 mb-3">Products</h3>
              <div className="grid gap-4">
                {cart.products.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50"
                  >
                    {/* Product Image */}
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="w-16 h-16 object-cover rounded-md mr-4"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://via.placeholder.com/64x64?text=No+Image";
                      }}
                    />

                    {/* Product Details */}
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800 mb-1">
                        {product.title}
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm text-gray-600">
                        <div>
                          <span className="text-gray-500">Price:</span>
                          <span className="ml-1">
                            ${product.price.toFixed(2)}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Qty:</span>
                          <span className="ml-1">{product.quantity}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Discount:</span>
                          <span className="ml-1">
                            {product.discountPercentage.toFixed(1)}%
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Subtotal:</span>
                          <span className="ml-1">
                            ${product.total.toFixed(2)}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Final:</span>
                          <span className="ml-1 font-medium text-green-600">
                            ${product.discountedTotal.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className=" flex gap-2 items-center justify-center pb-4">
              <button className="bg-blue-500 text-xs text-white px-7 rounded-md py-1">
                Edit Cart
              </button>
              <button className="bg-red-400 text-xs text-white px-7 rounded-md py-1">
                Delete Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CartComponent;
