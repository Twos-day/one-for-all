"use client";
import DotsLoading from "@/app/_component/loading/DotsLoading";
import { SIGNUP_EMAIL_PAGE_VALUES, useSetSignupEmail, useSignupEmailStore } from "../_lib/store";
import * as css from "./signupForm.css";
import { useState } from "react";
import ResetButton from "@/app/_component/btn/ResetBtn";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function Verification() {
  const [isLoading, setIsLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const email = useSignupEmailStore((store) => store.email);
  const id = useSignupEmailStore((store) => store.id);
  const setPage = useSetSignupEmail();
  const navigate = useNavigate();

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVerificationCode(e.target.value);
  };

  const verificationEmailCode = useMutation({
    mutationKey: ["/api/auth/verification"],
    mutationFn: async () => {
      const res = await fetch(`/api/auth/verification`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id, email, code: verificationCode }),
      });

      const body: { message: string; data: { token: string } } = await res.json();
      if (!res.ok) {
        throw new Error(body.message);
      }
      return body;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      navigate(`/signup/register?token=${data.data.token}`);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (verificationEmailCode.isPending) return;

    verificationEmailCode.mutate();
  };

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <div className={css.inputWrap}>
        <label className={css.label} htmlFor="emailInput">
          이메일
        </label>
        <div className={css.inputBox}>
          <input className={css.input} id="emailInput" type="text" value={email} disabled />
        </div>
      </div>
      <div className={css.inputWrap}>
        <label className={css.label} htmlFor="verificationCodeInput">
          인증번호
        </label>
        <div className={css.inputBox}>
          <input
            className={css.input}
            id="verificationCodeInput"
            type="text"
            value={verificationCode}
            onChange={handleInput}
          />
          <ResetButton isShow={verificationCode !== ""} onClick={() => setVerificationCode("")} />
        </div>
        <div>
          <div>남은시간 : </div>
          <button>인증번호 재요청</button>
        </div>
      </div>
      <div className={css.btnBox} tabIndex={0}>
        <button className={css.loginBtn} type="submit" disabled={isLoading}>
          {isLoading ? <DotsLoading /> : "인증번호 확인"}
        </button>
      </div>
    </form>
  );
}
