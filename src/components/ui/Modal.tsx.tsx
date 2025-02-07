import React from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  onConfirm?: () => void; // Thêm prop onConfirm
}

const Modal: React.FC<ModalProps> = ({ open, onClose,onConfirm, children }) => {
  if (!open) return null; // If not open, don't display anything

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg p-6 w-1/3 relative"
        onClick={(e) => e.stopPropagation()} // Prevent the event from propagating when clicking inside the modal
      >
        <button
          onClick={onClose} // Close the modal when clicked
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
        >
          X
        </button>
        <button onClick={onConfirm}>Confirm</button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
