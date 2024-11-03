import { globalStyle, style } from "@vanilla-extract/css";

export const toast = style({
  padding: 14,
  borderRadius: 5,
});

globalStyle(`${toast}  button[aria-label="Close toast"]`, {
  left: "unset",
  right: 0,
  top: 0,
  backgroundColor: "transparent",
  border: "none",
  borderRadius: 0,
  transform: "none",
});

globalStyle(`${toast}  button[aria-label="Close toast"] > svg`, {
  width: 12,
  height: 12,
  display: "block",
});
