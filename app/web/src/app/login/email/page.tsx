import LoginForm from "../_component/LoginForm";
import * as css from "../page.css";

export default function Page() {
  return (
    <main className={css.main}>
      <div className={css.inner}>
        <h1 className={css.title}>이메일 로그인</h1>
        <LoginForm />
      </div>
    </main>
  );
}
