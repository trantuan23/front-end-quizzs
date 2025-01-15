import React from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}


const Modal: React.FC<ModalProps> = ({ open, onClose, children }) => {
  if (!open) return null; // Nếu không mở thì không hiển thị gì

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg p-6 w-1/3"
        onClick={(e) => e.stopPropagation()} // Ngừng sự kiện khi click vào nội dung modal
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
