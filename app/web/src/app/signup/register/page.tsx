import * as css from "./page.css";
import { Navigate, useSearchParams } from "react-router-dom";
import { useQueryGetVerification } from "../_lib/signup";
import RegisterForm from "./_component/RegisterForm";

interface PageProps {}

export default function Page() {
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const { data, error } = useQueryGetVerification(token);

  if (data?.data === null) return <Navigate to="/signup" />;
  if (error) throw error;
  if (data?.data === undefined) return <div>로딩중...</div>;

  return (
    <main className={css.main}>
      <div className={css.inner}>
        <h1 className={css.title}>회원가입</h1>
        <RegisterForm data={data.data} />
      </div>
    </main>
  );
}
