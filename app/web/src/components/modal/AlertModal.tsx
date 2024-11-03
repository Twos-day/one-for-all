import { ModalProps } from "@/stores/modalStore";
import Modal from "./Modal";
import * as style from "./modal.css";
import { modalDefaultBtn } from "./modalBtn.css";

export const ID = "alertModal";

interface AlertModalProps {
  title?: string;
  content: React.ReactNode;
}

export default function AlertModal({
  title = "Alert",
  onClose,
  content,
}: ModalProps<AlertModalProps>) {
  return (
    <Modal id={ID} onClose={onClose}>
      <div className={style.modalCenterContent}>
        <div>
          <div className={style.modalHeader}>
            <h3 className={style.modalTitle}>{title}</h3>
          </div>
          <p>{content}</p>
        </div>
        <div className={style.modalBtnBox}>
          <button className={modalDefaultBtn} type="button" onClick={onClose}>
            확인
          </button>
        </div>
      </div>
    </Modal>
  );
}
