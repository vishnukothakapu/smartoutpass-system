import React from 'react';

const inputBase = `
  w-full px-3.5 py-2.5 text-sm rounded-xl
  border border-slate-200 dark:border-slate-600
  bg-white dark:bg-slate-800/60
  text-slate-900 dark:text-slate-100
  placeholder:text-slate-400 dark:placeholder:text-slate-500
  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
  transition-all duration-150
  disabled:opacity-50 disabled:cursor-not-allowed
`;

export const Input = ({ label, error, className = '', ...props }) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    {label && (
      <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
        {label}
      </label>
    )}
    <input className={`${inputBase} ${error ? 'border-red-400 focus:ring-red-400' : ''}`} {...props} />
    {error && <span className="text-xs text-red-500">{error}</span>}
  </div>
);

export const Select = ({ label, error, options = [], className = '', ...props }) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    {label && (
      <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
        {label}
      </label>
    )}
    <select className={`${inputBase} ${error ? 'border-red-400 focus:ring-red-400' : ''}`} {...props}>
      {options.map((opt, i) => (
        <option key={i} value={opt.value}>{opt.label}</option>
      ))}
    </select>
    {error && <span className="text-xs text-red-500">{error}</span>}
  </div>
);
