import { Dialog, DialogContent, DialogTitle } from './dialog';
import { AlertTriangle, Trash2, LogOut } from 'lucide-react';

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  iconType?: 'delete' | 'warning' | 'logout';
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Sí, eliminar",
  cancelText = "Cancelar",
  iconType = "delete"
}: ConfirmModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-white border-2 border-red-500 rounded-2xl shadow-2xl p-6 z-[99999]" style={{ zIndex: 99999 }}>
        <DialogTitle className="text-xl font-black text-[#1C5D15] flex items-center gap-2 mb-2">
          {iconType === 'delete' && <Trash2 className="text-red-500 w-6 h-6" />}
          {iconType === 'warning' && <AlertTriangle className="text-red-500 w-6 h-6" />}
          {iconType === 'logout' && <LogOut className="text-red-500 w-6 h-6" />}
          {title}
        </DialogTitle>
        <div className="text-red-600/80 mb-6 font-medium leading-relaxed" dangerouslySetInnerHTML={{ __html: message }} />
        <div className="flex justify-end gap-3 font-medium">
          <button
            onClick={onClose}
            className="px-4 py-2 text-[#629960] hover:bg-gray-100 rounded-xl transition-colors font-bold"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-lg shadow-red-500/20 transition-all active:scale-95 flex items-center gap-2 font-bold"
          >
            {iconType === 'delete' && <Trash2 size={16} />}
            {iconType === 'logout' && <LogOut size={16} />}
            {confirmText}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
