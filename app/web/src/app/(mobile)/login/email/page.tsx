import { useNavigate } from "react-router-dom";
import * as layout from "../../layout.css";
import LoginForm from "../_component/LoginForm";

export default function Page() {
  const navigate = useNavigate();
  return (
    <>
      <h1 className={layout.title}>이메일 로그인</h1>
      <LoginForm />
      <button className={layout.backBtn} onClick={() => navigate(-1)}>
        뒤로 돌아가기
      </button>
    </>
  );
}
