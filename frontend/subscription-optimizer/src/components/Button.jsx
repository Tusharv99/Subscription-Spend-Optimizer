

const Button = ({ 
  type = 'button', 
  onClick, 
  children, 
  fullWidth = false,
  disabled = false,
  variant = 'primary'
}) => {
  const baseStyle = 'px-6 py-2.5 font-medium rounded-lg transition duration-200'
  const variantStyle = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700',
  }
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variantStyle[variant]} ${fullWidth ? 'w-full' : ''} 
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  )
}

export default Button