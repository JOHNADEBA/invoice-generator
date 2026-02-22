import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type ButtonSize = "sm" | "md" | "lg";
type ButtonVariant = "primary" | "outline" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize;
  variant?: ButtonVariant;
}

export function Button({
  className,
  size = "md",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        "rounded-md transition duration-200 font-medium cursor-pointer",
        // Size
        {
          "px-3 py-1 text-sm": size === "sm",
          "px-4 py-2 text-base": size === "md",
          "px-6 py-3 text-lg": size === "lg",
        },
        // Variant
        {
          "bg-black text-white border border-white hover:bg-white hover:text-black":
            variant === "primary",

          "bg-transparent text-white border border-white hover:bg-white hover:text-black":
            variant === "outline",

          "bg-red-600 text-white border border-red-600 hover:bg-red-700":
            variant === "danger",
        },
        className,
      )}
      {...props}
    />
  );
}
