import { ReactNode } from "react";

interface ButtonProps {
  label?: string;
  onClick?: () => void;
  disabled?: boolean;
  children?: ReactNode;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "danger";
}

export default function Button({
  children,
  label,
  onClick,
  variant = "primary",
  disabled,
  type = "button",
}: ButtonProps) {
  const isDanger = variant === "danger";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`flex w-full justify-center rounded-md ${
        isDanger
          ? "bg-error-700 focus-visible:outline-error-700 hover:bg-error-700"
          : "bg-primary-600 focus-visible:outline-primary-600 hover:bg-primary-500"
      }  px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer`}
    >
      {label ? label : children}
    </button>
  );
}
