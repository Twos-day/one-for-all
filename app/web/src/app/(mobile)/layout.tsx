import { Outlet } from "react-router-dom";
import * as css from "./layout.css";

export default function MobileLayout() {
  return (
    <div className={css.wrap}>
      <div className={css.inner}>
        <Outlet />
      </div>
    </div>
  );
}
