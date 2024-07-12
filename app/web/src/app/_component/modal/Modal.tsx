import { useEffect } from "react";
import { useHotkeys, useHotkeysContext } from "react-hotkeys-hook";
import { RemoveScroll } from "react-remove-scroll";
import Backdrop from "../Backdrop";
import { modalLayout } from "./modal.css";

interface ModalProps {
  className?: string;
  id: string;
  children: React.ReactNode;
  showBackdrop?: boolean;
  removeScrollBar?: boolean;
  onClose?: () => void;
}

/** backdrop과 outsideClick, 키보드 이벤트 */
export default function Modal({
  id,
  children,
  onClose = () => {},
  showBackdrop = true,
  removeScrollBar = false,
}: ModalProps) {
  const { enableScope, disableScope, enabledScopes } = useHotkeysContext();

  useHotkeys("esc", onClose, {
    enabled: enabledScopes.at(-1) === id,
    preventDefault: true,
    scopes: [id],
  });

  useEffect(() => {
    enableScope(id);
    return () => disableScope(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <RemoveScroll removeScrollBar={removeScrollBar}>
      <div className={modalLayout} id={id}>
        {showBackdrop && <Backdrop onClick={onClose} />}
        {children}
      </div>
    </RemoveScroll>
  );
}
