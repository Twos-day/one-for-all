import ResetButton from "@/components/btn/ResetBtn";
import DotsLoading from "@/components/loading/DotsLoading";
import ErrorModal from "@/components/modal/ErrorModal";
import { useApp } from "@/stores/app";
import { useSetModalStore } from "@/stores/modalStore";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useStore } from "zustand";
import * as css from "./signupForm.css";
import { toast } from "sonner";
import { SIGNUP_EMAIL_PAGE_VALUES, useSetSignupEmail, useSignupEmailStore } from "@/stores/signup";

export default function SignupForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const modalStore = useSetModalStore();
  const store = useApp();
  const action = useStore(store, (store) => store.actions);
  const setState = useSetSignupEmail();
  const page = useSignupEmailStore((store) => store.page);

  const emailSignUpFn = useMutation({
    mutationKey: ["/api/auth/signup"],
    mutationFn: async ({ email }: { email: string }) => {
      const res = await fetch(`/api/auth/signup`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const body: { message: string[]; data: { id: number } } = await res.json();
      if (!res.ok) {
        throw new Error(body.message[0]);
      }
      return body;
    },
    onSuccess: (data) => {
      toast.success(data.message[0]);
      setState({ page: SIGNUP_EMAIL_PAGE_VALUES.EMAIL_CONFIRM, id: data.data.id, email });
    },
  });

  useEffect(() => {
    console.log(page);
  }, [page]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = e.target.id;
    const value = e.target.value;

    switch (id) {
      case "emailInput":
        setEmail(() => value);
        break;
      case "verificationCode":
        setVerificationCode(() => value);
        break;
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (emailSignUpFn.isPending) return;
    emailSignUpFn.mutate({ email });
  };

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <div className={css.inputWrap}>
        <label className={css.label} htmlFor="emailInput">
          이메일
        </label>
        <div className={css.inputBox}>
          <input
            className={css.input}
            id="emailInput"
            type="text"
            value={email}
            onChange={handleInput}
          />
          <ResetButton isShow={email !== ""} onClick={() => setEmail("")} />
        </div>
      </div>
      {/* <div className={css.inputWrap}>
        <label className={css.label} htmlFor="nicknameInput">
          닉네임
        </label>
        <div className={css.inputBox}>
          <input
            className={css.input}
            id="nicknameInput"
            type="text"
            value={nickname}
            onChange={handleInput}
          />
          <ResetButton isShow={nickname !== ""} onClick={() => setNickname("")} />
        </div>
      </div>
      <div className={css.inputWrap}>
        <label className={css.label} htmlFor="passwordInput">
          비밀번호
        </label>
        <div className={css.inputBox}>
          <input
            className={css.input}
            id="passwordInput"
            type="password"
            value={password}
            onChange={handleInput}
            placeholder="비밀번호를 입력해주세요."
          />
          <ResetButton isShow={password !== ""} onClick={() => setPassword("")} />
        </div>
        <div className={css.inputBox}>
          <input
            className={css.input}
            id="passwordConfirmInput"
            type="password"
            value={passwordConfirm}
            onChange={handleInput}
            placeholder="비밀번호를 한번 더 입력해주세요."
          />
          <ResetButton isShow={passwordConfirm !== ""} onClick={() => setPasswordConfirm("")} />
        </div>
        <div className={css.pwInfo}>
          <div className={css.pwCondition}>
            영문, 숫자, 특수문자를 조합해 8자 이상으로 입력해주세요.
          </div>
          <div className={css.pwCorrect}>
            {!validationPw && "비밀번호가 서로 일치하지 않습니다."}
          </div>
        </div>
      </div> */}

      <div className={css.btnBox} tabIndex={0}>
        <button className={css.loginBtn} type="submit" disabled={isLoading}>
          {isLoading ? <DotsLoading /> : "회원가입"}
        </button>
      </div>
    </form>
  );
}
