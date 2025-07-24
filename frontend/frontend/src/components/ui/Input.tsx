import React from "react";
import type { InputHTMLAttributes } from "react";
import clsx from "clsx";// Optional: For merging classNames

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={clsx(
          "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;
