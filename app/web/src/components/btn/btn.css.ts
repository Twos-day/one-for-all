import { globalVar } from "@/styles/globalTheme.css";
import { style } from "@vanilla-extract/css";

export const defaultBtn = style([
  {
    backgroundColor: globalVar.blueDefault,
    padding: 3,
    borderRadius: 3,
    boxShadow: "rgba(9, 30, 66, 0.25) 0px 1px 1px, rgba(9, 30, 66, 0.13) 0px 0px 1px 1px",
    transition: "background-color 0.2s ease, color 0.2s ease",
    color: "#fff",
    ":hover": {
      backgroundColor: globalVar.blueHover,
    },
    ":disabled": {
      background: globalVar.blueDisabled,
    },
  },
]);
