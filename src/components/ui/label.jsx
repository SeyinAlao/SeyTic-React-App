import React from "react";

export function Label({ className = "", children, ...props }) {
  return (
    <label
      data-slot="label"
      className={`flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </label>
  );
}

export default Label;
