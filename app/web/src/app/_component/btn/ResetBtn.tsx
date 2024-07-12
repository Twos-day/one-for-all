import { IoIosCloseCircle } from "react-icons/io";
import { button } from "./resetBtn.css.ts";

interface ResetButtonProps {
  id?: string;
  tabIndex?: number;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isShow: boolean;
}

export default function ResetButton({
  id,
  tabIndex = -1,
  onClick,
  isShow,
}: ResetButtonProps) {
  if (!isShow) return null;
  return (
    <button
      className={button}
      type="button"
      id={id}
      onClick={onClick}
      tabIndex={tabIndex}
    >
      <IoIosCloseCircle size={17} color="#919492" />
    </button>
  );
}
