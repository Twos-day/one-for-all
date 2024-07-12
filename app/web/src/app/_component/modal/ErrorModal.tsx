import { ModalProps } from "@/app/_lib/modalStore";
import Modal from "./Modal";
import ModalCloseBtn from "./ModalCloseBtn";
import * as style from "./modal.css";
import { modalDefaultBtn } from "./modalBtn.css";

const ID = "errorModal";

interface ErrorModalProps {
  title?: string;
  error: Error;
}

export default function ErrorModal({
  title = "Message",
  onClose,
  error,
}: ModalProps<ErrorModalProps>) {
  return (
    <Modal id={ID} onClose={onClose}>
      <div className={style.modalCenterContent}>
        <ModalCloseBtn onClose={onClose} />
        <div>
          <div className={style.modalHeader}>
            <h3 className={style.modalTitle}>{title}</h3>
          </div>
          <p>{error.message}</p>
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
