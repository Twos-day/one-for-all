import LoginForm from "./_component/LoginForm";
import * as css from "./page.css";
import AuthButtonGroup from "./_component/AuthButtonGroup";

export default function Page() {
  return (
    <main className={css.main}>
      <div className={css.inner}>
        <h1 className={css.title}>회원가입/로그인</h1>
        {/* <LoginForm /> */}
        {/* <SocialBox /> */}
        {/* <Link href={"/signup"}>회원가입 페이지로 이동</Link> */}
        <AuthButtonGroup />
      </div>
    </main>
  );
}
