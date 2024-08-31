import Kakao from "@/asset/svg/kakao.svg?react";
import Google from "@/asset/svg/google.svg?react";
import * as css from "./authBtnGrp.css";
import AuthBtn from "./AuthBtn";
import { useNavigate } from "react-router-dom";

export default function AuthBtnGrp() {
  const navigate = useNavigate();

  const onClick = (provider: "google" | "kakao") => {
    window.location.href = `/api/auth/${provider}`;
  };

  return (
    <div className={css.wrap}>
      <AuthBtn
        icon={<Kakao width={24} height={24} />}
        text="카카오 계정으로 계속하기"
        type="kakao"
        onClick={() => onClick("kakao")}
      />
      <AuthBtn
        icon={<Google width={24} height={24} />}
        text="구글 계정으로 계속하기"
        onClick={() => onClick("google")}
      />
      <AuthBtn text="이메일로 계속하기" onClick={() => navigate("/login/email")} />
    </div>
  );
}
