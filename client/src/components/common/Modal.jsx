import { useEffect } from 'react';
import { RiCloseLine } from 'react-icons/ri';
import styles from './modal.module.css';

const Modal = ({ isOpen, onClose, children, maxWidth, style }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        style={{ ...(maxWidth ? { maxWidth } : {}), ...(style || {}) }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.closeButton} onClick={onClose} aria-label="Close modal">
          <RiCloseLine />
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
