import styles from './progressBar.module.css';

const ProgressBar = ({ 
  progress, 
  variant = 'primary', 
  size = 'medium',
  label = null,
  valueText = null,
  className = ''
}) => {
  const safeProgress = Math.min(100, Math.max(0, progress));
  
  return (
    <div className={`${styles.container} ${className}`}>
      {(label || valueText) && (
        <div className={styles.labelContainer}>
          {label && <span>{label}</span>}
          {valueText && <span>{valueText}</span>}
        </div>
      )}
      <div className={`${styles.track} ${styles[size]}`}>
        <div 
          className={`${styles.fill} ${styles[variant]}`} 
          style={{ width: `${safeProgress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
