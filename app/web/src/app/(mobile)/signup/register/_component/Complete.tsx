import { Link } from "react-router-dom";

export default function Complete() {
  return (
    <>
      <h2>회원 가입이 완료되었습니다. 서비스 이용을 위해 로그인해 주시기 바랍니다.</h2>
      <Link to="/login">로그인 페이지로 이동</Link>
    </>
  );
}
