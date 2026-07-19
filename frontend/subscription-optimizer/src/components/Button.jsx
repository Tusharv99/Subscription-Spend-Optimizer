
const Button = ({ 
  type = 'button', 
  onClick, 
  children, 
  fullWidth = false,
  disabled = false,
  variant = 'primary'
}) => {
  const baseStyles = 'px-6 py-2.5 font-medium rounded-lg transition-all duration-200'
  const variantStyles = {
    primary: 'bg-primary text-white hover:bg-primary/90',
    secondary: 'bg-secondary text-white hover:bg-secondary/90',
    success: 'bg-success text-white hover:bg-success/90',
    danger: 'bg-danger text-white hover:bg-danger/90',
  }
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${fullWidth ? 'w-full' : ''} 
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98]'}`}
    >
      {children}
    </button>
  )
}

export default Button