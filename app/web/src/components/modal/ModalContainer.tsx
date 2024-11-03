import { useModalStore } from "@/stores/modalStore";
import { useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const MODAL_ID = "modalRoot";

export default function ModalContainer() {
  const { modals: modalInfos, actions } = useModalStore();
  const isEmpty = modalInfos.length === 0;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pathname = useLocation().pathname;

  useEffect(() => {
    //modal-root가 없으면 body에 modal-root를 만들어준다.
    const modalBox = document.createElement("div");
    modalBox.id = MODAL_ID;
    document.body.appendChild(modalBox);
    containerRef.current = modalBox;
    return () => {
      actions.closeAll();
      modalBox.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    actions.closeAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (isEmpty || !containerRef.current) return null;

  return createPortal(
    <>
      {modalInfos.map((modalInfo) => (
        <modalInfo.Component key={modalInfo.key} {...modalInfo.props} />
      ))}
    </>,
    containerRef.current,
  );
}
