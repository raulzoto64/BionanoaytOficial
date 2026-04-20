import { useState, useCallback } from 'react';
import { ConfirmModalProps } from '../components/ui/ConfirmModal';

interface ConfirmConfig extends Omit<ConfirmModalProps, 'isOpen' | 'onClose'> {}

export function useConfirm() {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<ConfirmConfig | null>(null);

  const confirm = useCallback((newConfig: ConfirmConfig) => {
    setConfig(newConfig);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const modalProps = {
    isOpen,
    onClose: close,
    onConfirm: config?.onConfirm || (() => {}),
    title: config?.title || '',
    message: config?.message || '',
    confirmText: config?.confirmText,
    cancelText: config?.cancelText,
    iconType: config?.iconType
  };

  return { confirmDialog: confirm, confirmModalProps: modalProps };
}
