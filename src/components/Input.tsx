// src/components/Input.tsx

import React from "react";

interface InputProps {
  label: string;
  name: string;
  value: string;
  type?: string;
  placeholder?: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({
  label,
  name,
  value,
  type = "text",
  placeholder,
  error,
  onChange,
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        id={name}
        name={name}
        value={value}
        type={type}
        placeholder={placeholder}
        onChange={onChange}
        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
          error
            ? "border-red-500 ring-red-200"
            : "border-gray-300 ring-blue-200"
        }`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Input;
