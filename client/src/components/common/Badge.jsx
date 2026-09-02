import styles from './badge.module.css';

const Badge = ({ children, variant = 'easy', className = '' }) => {
  return (
    <span className={`${styles.badge} ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
