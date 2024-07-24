import * as css from "./page.css";
import AuthButtonGroup from "./_component/AuthButtonGroup";
import { LoaderFunctionArgs, redirect } from "react-router-dom";
import { excuteRootDomain } from "../_lib/excuteDomain";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const redirectUrl = new URL(request.url).searchParams.get("redirect") || window.location.href;
  const hostname = new URL(redirectUrl).hostname;
  const domain = new URL(request.url).hostname;

  if (!hostname.endsWith("twosday.live") && hostname !== "localhost") {
    return redirect("/login");
  }

  document.cookie = `redirect=${redirectUrl}; domain=${excuteRootDomain(domain)}`;
  return true;
};

export default function Page() {
  return (
    <main className={css.main}>
      <div className={css.inner}>
        <h1 className={css.title}>회원가입/로그인</h1>
        <AuthButtonGroup />
      </div>
    </main>
  );
}
