export function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`p-6 pb-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '' }) {
  return (
    <h4 className={`font-bold text-slate-800 text-lg ${className}`}>
      {children}
    </h4>
  );
}

export function CardContent({ children, className = '' }) {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
}

export function Button({ children, variant = 'primary', className = '', ...props }) {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none shadow-sm";
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-500 focus:ring-indigo-600",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 focus:ring-slate-500",
    outline: "border border-slate-200 text-slate-700 hover:bg-slate-50 focus:ring-slate-500",
    ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-500 shadow-none",
    danger: "bg-red-600 text-white hover:bg-red-500 focus:ring-red-600",
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
    icon: "p-2",
  };
  
  const sizeClass = sizes[props.size || 'md'];
  
  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizeClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: "bg-slate-100 text-slate-800 border border-slate-200",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border border-amber-200",
    danger: "bg-red-50 text-red-700 border border-red-200",
    primary: "bg-indigo-50 text-indigo-700 border border-indigo-200",
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}

export function Input({ className = '', ...props }) {
  return (
    <input
      className={`flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}

export function Label({ children, className = '', ...props }) {
  return (
    <label className={`block text-sm font-medium text-slate-700 mb-1.5 ${className}`} {...props}>
      {children}
    </label>
  );
}
