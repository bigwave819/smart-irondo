const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* MODAL BOX */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 animate-scaleIn">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* CONTENT */}
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
