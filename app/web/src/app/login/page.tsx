import { useMutation } from "@tanstack/react-query";
import { defaultBtn } from "../_component/btn/btn.css";

export default function Page() {
  const mutate = useMutation({
    mutationKey: ["/api/auth/email"],
    mutationFn: async () => {
      const basicToken = btoa("email@naver.com:1234");

      const res = await fetch("/api/auth/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${basicToken}`,
        },
      });

      const body = await res.json();

      if (!res.ok) {
        throw new Error(body.message);
      }

      console.log(body);

      return body;
    },
  });

  const onClick = (provider: "google") => {
    // document.cookie = "redirect=" + encodeURIComponent(process.env.NEXT_PUBLIC_API_URL)

    window.location.href = `/api/auth/${provider}`;
  };

  return (
    <div>
      로그인 페이지
      <button onClick={() => mutate.mutate()}>로그인 테스트</button>
      <button className={defaultBtn} onClick={() => onClick("google")}>
        google
      </button>
    </div>
  );
}
