import { globalStyle } from "@vanilla-extract/css";

globalStyle("*", {
  margin: 0,
  padding: 0,
  border: "none",
  boxSizing: "border-box",
  color: "inherit",
  fontFamily: "inherit",
  fontSize: "inherit",
  fontWeight: "inherit",
});

globalStyle("::-webkit-scrollbar", {
  width: 7.5,
  height: 7.5,
});

globalStyle("::-webkit-scrollbar-track", {
  backgroundColor: "rgba(0, 0, 0, 0.1)",
});

globalStyle("::-webkit-scrollbar-thumb", {
  backgroundColor: "rgba(0, 0, 0, 0.25)",
  borderRadius: 10,
  cursor: "pointer",
});

globalStyle("::-webkit-scrollbar-button", {
  display: "none",
  visibility: "hidden",
});

globalStyle("html, body", {
  fontSize: 14, //root font size
  minWidth: 1280,
  minHeight: 720,
  letterSpacing: "-0.05em",
  margin: 0,
  padding: 0,
});

globalStyle("a", {
  color: "inherit",
  textDecoration: "none",
});

globalStyle("h1, h2, h3, h4, p", {
  textDecoration: "none",
  lineHeight: 1.6,
});

globalStyle("hr", {
  borderBottom: "1px solid #000000",
});

globalStyle("ul, ol", {
  listStyle: "none",
});

globalStyle("button", {
  cursor: "pointer",
  background: "none",
});

globalStyle("button > svg", {
  display: "block", //svg를 버튼 가온데 위치에 정렬하기위해 사용
});

globalStyle("input::placeholder", {
  fontFamily: "inherit",
});

//자동입력 스타일 제거, 흰그림자로 스타일을 가린다.
globalStyle(
  "input:-webkit-autofill, input:-webkit-autofill:hover, input:-webkit-autofill:focus, input:-webkit-autofill:active",
  {
    WebkitTextFillColor: "black",
    WebkitBoxShadow: "0 0 0 1000px #fff inset",
    boxShadow: "0 0 0 1000px #fff inset",
  }
);

globalStyle("textarea", {
  background: "none",
  border: "none",
  lineHeight: 1.6,
  fontFamily: "inherit",
  margin: 0,
  padding: 0,
  resize: "none", // 사이즈 조절 비활성화
});

globalStyle(".essential::before", {
  content: "*",
  color: "red",
});

globalStyle(".blind", {
  position: "absolute",
  width: 1,
  height: 1,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
});
