import { fixedMaxSize, flexCenter, zIndex } from "@/style/var";
import { globalStyle, style } from "@vanilla-extract/css";

export const modalLayout = style([zIndex.modal, flexCenter, fixedMaxSize, {}]);

export const modalCenterContent = style({
  position: "relative",
  width: 500,
  padding: 14,
  backgroundColor: "#fff",
  boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
  borderRadius: 3,
  minHeight: 200,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
});

export const modalHeader = style({
  marginBottom: 7,
});

export const modalTitle = style({
  fontSize: 16,
});

export const modalBtnBox = style({
  display: "flex",
  flexDirection: "row-reverse",
  gap: 14,
});

globalStyle(`${modalBtnBox} > button`, {
  width: 100,
});
