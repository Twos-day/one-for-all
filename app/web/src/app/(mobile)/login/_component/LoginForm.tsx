import ResetButton from "@/app/_component/btn/ResetBtn";
import DotsLoading from "@/app/_component/loading/DotsLoading";
import ErrorModal from "@/app/_component/modal/ErrorModal";
import { useSetModalStore } from "@/app/_lib/modalStore";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import emailLoginFn from "../_lib/login";
import * as css from "./loginForm.css";

export default function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const modalStore = useSetModalStore();

  const mutateEmailLogin = useMutation({
    mutationFn: emailLoginFn,
    onMutate: () => setIsLoading(() => true),
    onSuccess: ({ data }) => {
      const hostname = new URL(window.location.href).hostname;
      const domain = hostname.endsWith("twosday.live") ? "twosday.live" : "localhost";
      const maxAge = 60 * 60 * 24 * 3; // 3일 (초단위)
      let refreshCookie = `refreshToken=${data.token}; domain=${domain}; path=/; max-age=${maxAge};`;
      if (domain !== "localhost") refreshCookie += " secure;";
      document.cookie = refreshCookie;
      window.location.href = "/login";
    },
    onError: async (error) => {
      await modalStore.push(ErrorModal, { props: { error } });
      setIsLoading(() => false);
    },
  });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = e.target.id;
    const value = e.target.value;

    switch (id) {
      case "loginEmailInput":
        setEmail(() => value);
        break;
      case "loginPasswordInput":
        setPassword(() => value);
        break;
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (mutateEmailLogin.isPending) return;
    mutateEmailLogin.mutate({ email, password });
  };

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <div className={css.top}>
        <div className={css.inputWrap}>
          <label className={css.label} htmlFor="loginEmailInput">
            이메일
          </label>
          <div className={css.inputBox}>
            <input
              className={css.input}
              id="loginEmailInput"
              type="text"
              value={email}
              onChange={handleInput}
            />
            <ResetButton isShow={email !== ""} onClick={() => setEmail("")} />
          </div>
        </div>
        <div className={css.inputWrap}>
          <label className={css.label} htmlFor="loginPasswordInput">
            비밀번호
          </label>
          <div className={css.inputBox}>
            <input
              className={css.input}
              id="loginPasswordInput"
              type="password"
              value={password}
              onChange={handleInput}
            />
            <ResetButton isShow={password !== ""} onClick={() => setPassword("")} />
          </div>
        </div>
        <div className={css.btnBox}>
          <button className={css.loginBtn} type="submit" disabled={isLoading}>
            {isLoading ? <DotsLoading /> : "로그인"}
          </button>
        </div>
      </div>
      <div className={css.bottom}>
        <div className={css.signUp}>
          <p className={css.division}>또는</p>
          <div className={css.btnBox}>
            <button className={css.singUpBtn} type="button" onClick={() => navigate("/signup")}>
              이메일로 회원가입
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
