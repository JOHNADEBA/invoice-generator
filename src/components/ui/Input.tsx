import { InputHTMLAttributes } from "react";
import clsx from "clsx";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  // No label prop here - labels should be separate
}

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={clsx(
        "w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500",
        className,
      )}
      {...props}
    />
  );
}
