import { AuthBtnWrap } from "./loginForm.css";
import classNames from "classnames";

interface AuthBtnProps {
  icon?: string | React.ReactElement;
  text: string;
  type?: string;
  onClick: () => void;
}

export default function AuthBtn({ icon, text, type, onClick }: AuthBtnProps) {
  return (
    <button
      type="button"
      className={classNames(AuthBtnWrap, type === "kakao" ? "kakao" : "")}
      onClick={onClick}
    >
      <span>{icon}</span>
      <p>{text}</p>
    </button>
  );
}
