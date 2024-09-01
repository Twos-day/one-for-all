import { Navigate, useSearchParams } from "react-router-dom";
import { useQueryGetVerification } from "../_lib/signup";
import RegisterForm from "./_component/RegisterForm";
import * as layout from "../../layout.css";
import { useState } from "react";
import Complete from "./_component/Complete";

interface PageProps {}

export default function Page() {
  const [searchParams] = useSearchParams();
  const [isComplete, setIsComplete] = useState(true);

  const token = searchParams.get("token");

  const { data, error } = useQueryGetVerification(token);

  if (data?.data === null) return <Navigate to="/signup" />;
  if (error) throw error;
  if (data?.data === undefined) return <div>로딩중...</div>;

  if (isComplete) {
    return (
      <>
        <h1 className={layout.title}>회원가입 완료</h1>
        <Complete />
      </>
    );
  }

  return (
    <>
      <h1 className={layout.title}>회원가입</h1>
      <RegisterForm data={data.data} onCompleted={() => setIsComplete(true)} />
    </>
  );
}
