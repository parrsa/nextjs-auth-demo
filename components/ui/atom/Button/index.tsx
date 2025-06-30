import styles from './Button.module.scss';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

export default function Button({ children, ...props }: ButtonProps) {
    return <button className={styles.button} {...props}>{children}</button>;
}
