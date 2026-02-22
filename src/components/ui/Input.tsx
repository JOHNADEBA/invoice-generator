import { InputHTMLAttributes } from "react";
import clsx from "clsx";

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={clsx(
        "w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black",
        className,
      )}
      {...props}
    />
  );
}
