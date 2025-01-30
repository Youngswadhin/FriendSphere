import { X } from "lucide-react";
import React, {
  ReactNode,
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import ReactDOM from "react-dom";
import { cn } from "../../lib/utils";

interface ModalProps {
  trigger: ReactNode;
  open?: boolean;
  heading: string;
  children: ReactNode;
  className?: string;
  onClose?: () => void;
}

export interface ModalRef {
  close: () => void;
}

const Modal = forwardRef<ModalRef, ModalProps>(
  ({ open, heading, children, trigger, className, onClose }, ref) => {
    const [isOpen, setIsOpen] = useState(open);

    useEffect(() => {
      setIsOpen(open);
    }, [open]);

    useImperativeHandle(ref, () => ({
      close: () => {
        setIsOpen(false);
        if (onClose) {
          onClose();
        }
      },
    }));

    const handleClose = () => {
      setIsOpen(false);
      if (onClose) {
        onClose();
      }
    };

    const handleOpen = () => {
      setIsOpen(true);
    };

    return (
      <>
        {React.cloneElement(trigger as React.ReactElement, {
          onClick: handleOpen,
        })}
        {isOpen &&
          ReactDOM.createPortal(
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-[9999]">
              <div
                className={cn(
                  "bg-white rounded-lg overflow-hidden shadow-xl transform transition-all w-[clamp(300px,500px,80vw)] max-h-[90vh] overflow-y-scroll",
                  className
                )}
              >
                <div className="px-3 pt-4 sm:px-5 flex justify-between items-center">
                  <h2 className="text-lg leading-6 font-medium text-gray-900">
                    {heading}
                  </h2>
                  <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <X />
                  </button>
                </div>
                <div className="px-3 py-4 sm:p-5">{children}</div>
              </div>
            </div>,
            document.getElementById("root") as HTMLElement
          )}
      </>
    );
  }
);

export default Modal;
