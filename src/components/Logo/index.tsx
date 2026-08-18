import clsx from 'clsx';
import styles from './index.module.scss';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'light' | 'dark';
  animated?: boolean;
  showText?: boolean;
  className?: string;
}

/** Aegis 品牌标志。 */
const Logo = ({
  size = 'md',
  variant = 'default',
  animated = true,
  showText = false,
  className,
}: LogoProps) => {
  return (
    <div className={clsx(styles.container, styles[size], className)}>
      <div
        className={clsx(
          styles.logo,
          styles[variant],
          animated && styles.animated
        )}
      >
        <img src="/aegis.svg" alt="Aegis" className={styles.shield} />
        <div className={styles.glow} />
      </div>
      {showText && (
        <span className={clsx(styles.text, styles[`text-${variant}`])}>
          Aegis
        </span>
      )}
    </div>
  );
};

export default Logo;
