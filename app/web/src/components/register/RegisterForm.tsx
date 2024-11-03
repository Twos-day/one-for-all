import ResetButton from "@/components/btn/ResetBtn";
import DotsLoading from "@/components/loading/DotsLoading";
import ErrorModal from "@/components/modal/ErrorModal";
import { useApp } from "@/stores/app";
import { useSetModalStore } from "@/stores/modalStore";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useStore } from "zustand";
import * as css from "@/components/signup/signupForm.css";
import { checkPassword } from "@/utils/regexp";
import { VerificationData } from "@/apis/signup";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface RegisterFormProps {
  data: VerificationData;
  onCompleted: () => void;
}

export default function RegisterForm({ data, onCompleted }: RegisterFormProps) {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [validationPw, setValidationPw] = useState(true);

  const [isLoading, setIsLoading] = useState(false);

  const modalStore = useSetModalStore();
  const store = useApp();
  const action = useStore(store, (store) => store.actions);

  const emailSignupFn = useMutation({
    mutationKey: ["/api/auth/signup/email"],
    mutationFn: async ({ nickname, password }: { nickname: string; password: string }) => {
      const trimmedNickname = nickname.trim();
      const trimmedPassword = password.trim();

      if (!trimmedNickname) {
        throw new Error("닉네임을 입력해주세요.");
      }

      if (!checkPassword(trimmedPassword)) {
        throw new Error("비밀번호를 확인하세요.");
      }

      // document.cookie = "redirect=" + encodeURIComponent(process.env.NEXT_PUBLIC_API_URL);

      const res = await fetch(`/api/auth/signup/email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.accessToken}`,
        },
        body: JSON.stringify({
          nickname: trimmedNickname,
          password: trimmedPassword,
          avatar: null,
        }),
        credentials: "include",
      });

      const body: { token: string; message: string } = await res.json();
      if (!res.ok) {
        throw new Error(body.message);
      }

      return body;
    },
    onSuccess: (data) => {
      toast.success(data.message[0]);
      onCompleted();
    },
  });

  const socialSignupFn = useMutation({
    mutationKey: ["/api/auth/signup/social"],
    mutationFn: async ({ nickname }: { nickname: string }) => {
      const trimmedNickname = nickname.trim();

      if (!trimmedNickname) {
        throw new Error("닉네임을 입력해주세요.");
      }

      document.cookie = "redirect=" + encodeURIComponent(process.env.NEXT_PUBLIC_API_URL);

      const res = await fetch(`/api/auth/signup/social`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.accessToken}`,
        },
        body: JSON.stringify({
          nickname: trimmedNickname,
          avatar: data.avatar,
        }),
        credentials: "include",
      });

      const body: { token: string; message: string } = await res.json();

      if (!res.ok) {
        throw new Error(body.message);
      }

      return body;
    },
    onSuccess: (data) => {
      toast.success(data.message[0]);
      navigate("/");
    },
  });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = e.target.id;
    const value = e.target.value;

    switch (id) {
      case "nicknameInput":
        setNickname(() => value);
        break;
      case "passwordInput":
        setPassword(() => value);
        setValidationPw(() => value === passwordConfirm);
        break;
      case "passwordConfirmInput":
        setPasswordConfirm(() => value);
        setValidationPw(() => value === password);
        break;
    }
  };

  const handleEmailSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (emailSignupFn.isPending) return;
    emailSignupFn.mutate({ nickname, password });
  };

  const handleSocialSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (socialSignupFn.isPending) return;
    socialSignupFn.mutate({ nickname });
  };

  return (
    <form
      className={css.form}
      onSubmit={data.accountType === "email" ? handleEmailSubmit : handleSocialSubmit}
    >
      <div className={css.inputWrap}>
        <label className={css.label} htmlFor="emailInput">
          이메일
        </label>
        <div className={css.DisabledInputBox}>
          <input className={css.input} id="emailInput" type="text" value={data.email} disabled />
        </div>
        <p className={css.mailInfo}>가입이 가능한 이메일입니다.</p>
      </div>
      <div className={css.inputWrap}>
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
      {data.accountType === "email" && (
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
        </div>
      )}
      <div className={css.btnBox} tabIndex={0}>
        <button className={css.loginBtn} type="submit" disabled={isLoading}>
          {isLoading ? <DotsLoading /> : "회원가입"}
        </button>
      </div>
    </form>
  );
}
