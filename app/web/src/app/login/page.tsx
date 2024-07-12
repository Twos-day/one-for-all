import { useMutation } from "@tanstack/react-query";

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

  return (
    <div>
      로그인 페이지
      <button onClick={() => mutate.mutate()}>로그인 테스트</button>
    </div>
  );
}
