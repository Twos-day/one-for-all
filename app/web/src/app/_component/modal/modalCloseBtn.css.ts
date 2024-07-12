import { flexCenter } from "@/style/var";
import { style } from "@vanilla-extract/css";

export const button = style([
  flexCenter,
  {
    position: "absolute",
    top: 10,
    right: 10,
    borderRadius: 3,
    transition: "color 0.2s ease, background-color 0.2s ease",
    ":hover": {
      backgroundColor: "rgba(0, 0, 0, 0.45)",
      color: "white",
    },
  },
]);
