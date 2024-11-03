import { useNavigate } from "react-router-dom";
import * as layout from "../layout.css";
import AuthBtnGrp from "@/components/login/AuthBtnGrp";

export default function Page() {
  const navigate = useNavigate();
  return (
    <>
      <h1 className={layout.title}>Twosday 통합로그인</h1>
      <AuthBtnGrp />
      <button className={layout.backBtn} onClick={() => navigate(-1)}>
        뒤로 돌아가기
      </button>
    </>
  );
}
