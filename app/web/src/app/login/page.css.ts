import { flexCenter } from "@/style/var";
import { style } from "@vanilla-extract/css";

export const main = style([
  flexCenter,
  {
    width: "100dvw",
    height: "100dvh",
  },
]);

export const inner = style({
  display: "flex",
  flexDirection: "column",
  width: 300,
  gap: 48,
  paddingBottom: 24,
});

export const title = style({
  textAlign: "center",
  fontSize: 24,
  fontWeight: 700,
});

export const btnWrap = style({
  maxWidth: 360,
  display: "flex",
  flexDirection: "column",
  gap: 16,
  justifyContent: "center",
});
