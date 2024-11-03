import { flexCenter } from "@/styles/var";
import { style } from "@vanilla-extract/css";
import { globalVar } from "@/styles/globalTheme.css";

export const form = style({
  display: "flex",
  flexDirection: "column",
  gap: 20,
});

export const inputWrap = style({
  border: "none",
  display: "flex",
  flexDirection: "column",
  gap: 10,
});

export const label = style({
  width: 60,
  color: "#70737C",
});

export const inputBox = style({
  display: "flex",
  border: "1px solid #70737C36",
  borderRadius: 10,
  backgroundColor: "transparent",
  padding: "0px 16px",
  height: 48,
  ":focus-within": {
    border: `1px solid ${globalVar.purpleDefault}`,
  },
});

export const DisabledInputBox = style([
  inputBox,
  {
    backgroundColor: "#F4F4F5",
  },
]);

export const input = style({
  border: "none",
  width: "100%",
  padding: 7,
  ":focus": {
    outline: "none",
  },
  ":disabled": {
    backgroundColor: "transparent",
    color: "#70737C",
  },
  "::placeholder": {
    color: "#70737C66",
  },
});

export const mailInfo = style({
  fontSize: 12,
  color: globalVar.purpleDefault,
});

export const btnBox = style([
  flexCenter,
  {
    marginTop: 40,
  },
]);

export const loginBtn = style({
  width: "100%",
  height: 40,
  backgroundColor: globalVar.purpleDefault,
  padding: "7px 0",
  fontWeight: 600,
  fontSize: 16,
  color: "#fff",
  borderRadius: 10,
  transition: "background-color 0.2s ease, color 0.2s ease",
  ":hover": {
    backgroundColor: globalVar.purpleHover,
  },
  ":disabled": {
    backgroundColor: globalVar.purpleDisabled,
  },
});

export const pwInfo = style({
  minHeight: 40,
  display: "flex",
  flexDirection: "column",
  gap: 5,
  fontSize: 12,
  color: "#70737C",
});
export const pwCorrect = style({
  color: "#FE415C",
});
export const pwCondition = style({});
