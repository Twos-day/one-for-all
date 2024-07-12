import { backdrop } from "./backdrop.css.ts";

interface BackdropProps {
  onClick?: () => void;
}

export default function Backdrop({ onClick }: BackdropProps) {
  return <div className={backdrop} onClick={onClick} />;
}
