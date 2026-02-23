import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'outline' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    isLoading,
    icon,
    className,
    ...props
}) => {
    const baseClass = "btn";

    let variantClass = "";
    if (variant === 'primary') variantClass = "btn-primary";
    else if (variant === 'outline') variantClass = "btn-outline";
    else if (variant === 'danger') variantClass = "btn-danger";
    else if (variant === 'ghost') variantClass = "btn-ghost";

    const sizeClass = size === 'sm' ? "!px-4 !py-2 !text-[10px]" :
        size === 'lg' ? "!px-10 !py-6 !text-lg" : "";

    return (
        <button
            className={`${baseClass} ${variantClass} ${sizeClass} ${className || ''}`}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading && <Loader2 className="animate-spin" size={size === 'sm' ? 14 : 20} />}
            {!isLoading && icon && (
                <span className={children ? "-ml-1" : ""}>
                    {icon}
                </span>
            )}
            {children}
        </button>
    );
};
