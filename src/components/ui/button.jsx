// src/components/ui/button.jsx
export const Button = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  const base = 'rounded-lg font-medium transition-colors duration-200 focus:outline-none';

  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border border-blue-600 text-blue-600 hover:bg-blue-50',
    ghost: 'text-slate-700 hover:bg-slate-100',
    secondary: 'bg-white text-blue-600 hover:bg-slate-100',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-2.5 text-lg',
  };

  return (
    <button {...props} className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </button>
  );
};
