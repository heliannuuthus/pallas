import { useState } from 'react';
import { Button } from '@heliannuuthus/ui/button';
import { Input } from '@heliannuuthus/ui/input';
import { Eye, EyeOff, LockKeyhole } from 'lucide-react';
import styles from './index.module.scss';

interface PasswordInputProps {
  email: string;
  loading?: boolean;
  disabled?: boolean;
  onSubmit: (password: string) => void;
}

const PasswordInput = ({
  email,
  loading = false,
  disabled = false,
  onSubmit,
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password) onSubmit(password);
  };

  return (
    <div className={styles.container}>
      <div className={styles.userInfo}>
        <span className={styles.email}>{email}</span>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.passwordField}>
          <LockKeyhole size={17} aria-hidden="true" />
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="输入密码"
            disabled={disabled}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            aria-label="密码"
            required
          />
          <button
            type="button"
            className={styles.visibilityButton}
            onClick={() => setShowPassword((visible) => !visible)}
            aria-label={showPassword ? '隐藏密码' : '显示密码'}
          >
            {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </div>

        <Button
          type="submit"
          size="lg"
          loading={loading}
          disabled={disabled}
          className={styles.submitButton}
        >
          登录
        </Button>
      </form>
    </div>
  );
};

export default PasswordInput;
