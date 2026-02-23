import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
}

export const Card: React.FC<CardProps> = ({ children, className, title }) => {
    return (
        <div className={`card ${className || ''}`}>
            {title && (
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-1.5 h-8 bg-emerald-500 rounded-full" />
                    <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-slate-900">{title}</h3>
                </div>
            )}
            {children}
        </div>
    );
};
