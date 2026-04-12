import React from 'react';

const base = 'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2';

const variants = {
  primary:   'bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white shadow-sm',
  secondary: 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200',
  danger:    'bg-red-500 hover:bg-red-600 active:bg-red-700 text-white shadow-sm',
  ghost:     'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300',
};

const sizes = {
  sm: 'h-8 px-3 text-xs rounded-lg',
  md: 'h-10 px-4 text-sm rounded-xl',
  lg: 'h-12 px-5 text-base rounded-xl',
};

const Spinner = () => (
  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
  </svg>
);

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  disabled,
  className = '',
  style,
  ...props
}) => (
  <button
    disabled={isLoading || disabled}
    style={style}
    className={`
      ${base}
      ${variants[variant] || variants.primary}
      ${sizes[size]}
      ${fullWidth ? 'w-full' : ''}
      ${className}
    `}
    {...props}
  >
    {isLoading ? <><Spinner /> Loading...</> : children}
  </button>
);
