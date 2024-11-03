import { MOBILE_MIN_WIDTH } from "@/styles/var";
import { style } from "@vanilla-extract/css";

export const wrap = style([
  {
    maxWidth: MOBILE_MIN_WIDTH,
    height: "100%",
    minHeight: "100dvh",
    margin: "0 auto",
    boxShadow: "0 0 30px 0 rgba(0, 0, 0, 0.05)",
    paddingTop: 62,
  },
]);

export const inner = style({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  gap: 48,
  paddingBottom: 24,
  padding: 14,
});

export const title = style({
  textAlign: "center",
  fontSize: 24,
  fontWeight: 600,
  marginBottom: 24,
});

export const backBtn = style({
  marginTop: 100,
  color: "#747474",
});
