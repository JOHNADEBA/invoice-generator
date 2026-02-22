import { TextareaHTMLAttributes } from "react";
import clsx from "clsx";

export function TextArea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={clsx(
        "w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black resize-none",
        className,
      )}
      {...props}
    />
  );
}
