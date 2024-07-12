import { ModalProps } from "@/app/_lib/modalStore";
import Modal from "./Modal";
import * as style from "./modal.css";
import { modalCancelBtn, modalDefaultBtn } from "./modalBtn.css";

const ID = "confirmModal";

interface ConfirmModalProps {
  title?: string;
  content: React.ReactNode;
}

export default function ConfirmModal({
  title = "Confirm",
  content,
  onClose,
  onSuccess,
}: ModalProps<ConfirmModalProps>) {
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
          <button className={modalCancelBtn} type="button" onClick={onClose}>
            취소
          </button>
          <button className={modalDefaultBtn} type="button" onClick={() => onSuccess(true)}>
            확인
          </button>
        </div>
      </div>
    </Modal>
  );
}
