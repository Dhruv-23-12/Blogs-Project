import React from "react";

export default function Button({
    children,
    type = "button",
    variant = "primary",
    size = "md",
    className = "",
    ...props
}) {
    const baseClasses = "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variants = {
        primary: "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-soft hover:shadow-medium active:scale-95",
        secondary: "bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500 shadow-soft hover:shadow-medium active:scale-95",
        outline: "bg-white text-primary-600 border-2 border-primary-200 hover:bg-primary-50 hover:border-primary-300 focus:ring-primary-500",
        ghost: "bg-transparent text-neutral-600 hover:bg-neutral-100 hover:text-neutral-800 focus:ring-neutral-500",
        danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-soft hover:shadow-medium active:scale-95",
    };
    
    const sizes = {
        sm: "px-3 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg",
        xl: "px-10 py-5 text-xl",
    };
    
    const buttonClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;
    
    return (
        <button type={type} className={buttonClasses} {...props}>
            {children}
        </button>
    );
}
