import { keyframes } from "@vanilla-extract/css";

export const fadeIn = keyframes({
  from: {
    opacity: 0,
    visibility: "hidden",
  },
  to: {
    opacity: 1,
    visibility: "visible",
  },
});

export const placeholderShimmer = keyframes({
  "0%": {
    backgroundPosition: "-468px 0",
  },
  "100%": {
    backgroundPosition: "468px 0",
  },
});
