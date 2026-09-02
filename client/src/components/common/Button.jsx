import styles from './button.module.css';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  iconOnly = false,
  className = '',
  ...props 
}) => {
  const classes = [
    styles.btn,
    styles[variant],
    styles[size],
    iconOnly ? styles.iconOnly : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

export default Button;
