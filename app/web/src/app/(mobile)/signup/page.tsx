import Content from "./_component/Content";
import * as layout from "../_component/mobileLayout.css";

export default function Page() {
  return (
    <>
      <h1 className={layout.title}>이메일 회원가입</h1>
      <Content />
    </>
  );
}
