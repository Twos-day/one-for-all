const emailLoginFn = async ({ email, password }: { email: string; password: string }) => {
  const trimmedEmail = email.trim();
  const trimmedPassword = password.trim();

  if (!trimmedEmail) {
    throw new Error("이메일을 입력해주세요.");
  }

  if (!trimmedPassword) {
    throw new Error("비밀번호를 입력해주세요.");
  }

  const basicToken = btoa(`${trimmedEmail}:${trimmedPassword}`);

  const res = await fetch("/api/auth/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${basicToken}`,
    },
    credentials: "include",
  });

  const body: { data: { token: string }; message: string[] } = await res.json();

  if (!res.ok) {
    throw new Error(body.message[0]);
  }

  return body;
};

export default emailLoginFn;
