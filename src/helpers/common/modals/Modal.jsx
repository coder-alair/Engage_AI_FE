/* eslint-disable react/prop-types */
// import { IoCloseOutline } from "react-icons/io5";

const Modal = (props) => {
  const { isOpen, onClose, children, keepMounted, title, parentClassName } = props;

  if (!isOpen) return null;

  return (
    <div
      onClick={() => !keepMounted && onClose()}
      className="fixed w-full h-full bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-[100] left-0 top-0"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[white] h-max w-max shadow-[2px_solid_black] text-base relative m-auto p-[2%] rounded-[10px] border-2 border-solid border-black"
      >
        <div className="absolute right-0 top-0">
          <div className="h-7 w-7 cursor-pointer" onClick={onClose} >&#x2715;</div>
        </div>
        <div className="flex flex-col items-center justify-center bg-gray-100 overflow-y-auto">
          <div className="bg-white rounded w-full max-w-xl min-h-32 h-min">
            {title && <h2 className="text-2xl font-bold mb-3 text-center">{title}</h2>}
            <div className={`max-h-[90vh] overflow-y-auto ${parentClassName}`}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
