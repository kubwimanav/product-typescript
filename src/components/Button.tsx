import React from "react";

type ButtonVariant = "primary" | "danger";

interface ButtonProps {
  label: string;
  type?: "button" | "submit" | "reset";
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  variant?: ButtonVariant;
}



const Button: React.FC<ButtonProps> = ({
  label,
  type = "button",
  onClick,
  disabled = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-md font-semibold disabled:opacity-50 w-full text-white hover:bg-blue-200 hover:text-black bg-blue-600`}
    >
      {label}
    </button>
  );
};

export default Button;