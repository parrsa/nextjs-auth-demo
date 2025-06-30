import styles from './Input.module.scss';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, ...props }: InputProps) {
  return (
    <div className={styles.inputWrapper}>
      {label && <label className={styles.label} htmlFor={props.id}>{label}</label>}
      <input className={`${styles.input} ${error ? styles.errorInput : ''}`} {...props} />
      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
}
