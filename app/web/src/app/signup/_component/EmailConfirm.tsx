"use client";

import { useState } from "react";
import * as css from "./signupForm.css";
import { SIGNUP_EMAIL_PAGE_VALUES, useSetSignupEmail, useSignupEmailStore } from "../_lib/store";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import DotsLoading from "@/app/_component/loading/DotsLoading";

interface EmailConfirmProps {}

export default function EmailConfirm() {
  const [isLoading, setIsLoading] = useState(false);
  const email = useSignupEmailStore((store) => store.email);
  const id = useSignupEmailStore((store) => store.id);
  const setPage = useSetSignupEmail();

  const requestEmailCode = useMutation({
    mutationKey: ["/api/auth/verification/:id"],
    mutationFn: async () => {
      const res = await fetch(`/api/auth/verification/${id}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
      });

      const body: { message: string } = await res.json();
      if (!res.ok) {
        throw new Error(body.message);
      }
      return body;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      setPage({ page: SIGNUP_EMAIL_PAGE_VALUES.VERIFICATION });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (requestEmailCode.isPaused) return;
    requestEmailCode.mutate();
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
      <div className={css.btnBox} tabIndex={0}>
        <button className={css.loginBtn} type="submit" disabled={isLoading}>
          {isLoading ? <DotsLoading /> : "인증번호 요청"}
        </button>
      </div>
    </form>
  );
}
