import { useState, useCallback, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@heliannuuthus/ui/dialog';
import { Spinner } from '@heliannuuthus/ui/spinner';
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';
import styles from './index.module.scss';

export interface CaptchaModalProps {
  open: boolean;
  siteKey: string;
  challengeId: string;
  onSuccess: (challengeId: string, token: string) => Promise<void>;
  onCancel: () => void;
}

const CaptchaModal = ({
  open,
  siteKey,
  challengeId,
  onSuccess,
  onCancel,
}: CaptchaModalProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const turnstileRef = useRef<TurnstileInstance>(null);

  const handleSuccess = useCallback(
    async (token: string) => {
      setIsSubmitting(true);
      try {
        await onSuccess(challengeId, token);
      } catch {
        turnstileRef.current?.reset();
        setIsSubmitting(false);
      }
    },
    [challengeId, onSuccess]
  );

  const handleWidgetLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleError = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleExpire = useCallback(() => {
    turnstileRef.current?.reset();
  }, []);

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onCancel()}>
      <DialogContent
        className={styles.captchaModal}
        showCloseButton={!isSubmitting}
        onPointerDownOutside={(event) => event.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>安全验证</DialogTitle>
          <DialogDescription>请完成人机验证以继续</DialogDescription>
        </DialogHeader>
        <div className={styles.content}>
          <div className={styles.turnstileWrapper}>
            {isLoading && (
              <div className={styles.loading}>
                <Spinner />
              </div>
            )}

            {open && siteKey && (
              <Turnstile
                ref={turnstileRef}
                siteKey={siteKey}
                onSuccess={handleSuccess}
                onError={handleError}
                onExpire={handleExpire}
                onWidgetLoad={handleWidgetLoad}
                options={{
                  theme: 'light',
                  size: 'flexible',
                }}
              />
            )}
          </div>

          {isSubmitting && (
            <div className={styles.submitting}>
              <Spinner className={styles.smallSpinner} />
              <span>验证中...</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CaptchaModal;
