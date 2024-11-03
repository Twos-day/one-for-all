import { keyframes } from "@vanilla-extract/css";
import { flexCenter } from "@/styles/var";
import { style } from "@vanilla-extract/css";

const loadingAni = keyframes({
  "0%": {
    opacity: 0.95,
    transform: "scale(0.95)",
    backgroundColor: "#1075c2",
  },
  "25%": {
    backgroundColor: "#abddf1",
  },
  "50%": {
    opacity: 1,
    transform: "scale(1.02)",
    backgroundColor: "#1075c2",
  },
  "75%": {
    backgroundColor: "#abddf1",
  },
  "100%": {
    opacity: 0.95,
    transform: "scale(0.95)",
    backgroundColor: "#1075c2",
  },
});

export const wrap = style([
  flexCenter,
  {
    width: "100%",
    height: 20,
  },
]);

export const box = style([{ display: "flex", alignItems: "center", gap: 7 }]);

export const circle = style([
  {
    display: "inline-block",
    width: 7,
    height: 7,
    borderRadius: 9999,
    animation: `${loadingAni} 1.6s linear infinite`,
    selectors: {
      "&:nth-of-type(1)": {
        animationDelay: "0s",
      },
      "&:nth-of-type(2)": {
        animationDelay: "0.2s",
      },
      "&:nth-of-type(3)": {
        animationDelay: "0.4s",
      },
    },
  },
]);
