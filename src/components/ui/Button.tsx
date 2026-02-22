import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

export function Button({
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={clsx(
        "px-4 py-2 bg-black text-white rounded-md hover:opacity-80 transition",
        className,
      )}
      {...props}
    />
  );
}
