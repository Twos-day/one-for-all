import { IoCloseOutline } from "react-icons/io5";
import { button } from "./modalCloseBtn.css";

export default function ModalCloseBtn({ onClose }: { onClose: () => void }) {
  return (
    <button className={button} type="button" onClick={onClose}>
      <IoCloseOutline size={28} />
    </button>
  );
}
