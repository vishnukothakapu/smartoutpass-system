import React from 'react';

export const Card = ({ children, className = '', hoverable = false, onClick, style, ...props }) => (
  <div
    onClick={onClick}
    style={style}
    className={`
      bg-white dark:bg-slate-800
      rounded-2xl border border-slate-200 dark:border-slate-700
      shadow-sm p-5
      ${hoverable ? 'cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.99]' : ''}
      ${className}
    `}
    {...props}
  >
    {children}
  </div>
);
