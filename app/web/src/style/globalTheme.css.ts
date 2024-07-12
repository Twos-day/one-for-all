import { createGlobalTheme, createGlobalThemeContract } from "@vanilla-extract/css";

export const globalVar = createGlobalThemeContract({
  blueActive: "blueActive",
  blueHover: "blueHover",
  blueDefault: "blueDefault",
  blueDisabled: "blueDisabled",

  grayActive: "grayActive",
  grayHover: "grayHover",
  grayDefault: "grayDefault",
  grayDisabled: "grayDisabled",
});

const whiteGlobalTheme = {
  blueActive: "#4F66D8", // 20%
  blueHover: "#354CBE", // 10%
  blueDefault: "#1C33A5", // 0%
  blueDisabled: "#02198B", // -10%

  grayActive: "#E6E6E6", // 10%
  grayHover: "#D9D9D9", // 5%
  grayDefault: "#cccccc", // 0%
  grayDisabled: "#B3B3B3", // -10%
};

// const darkGlobalTheme = {
//   background: {
//     color: 'rgb(0, 0, 0)',
//   },
//   foreground: {
//     color: 'rgb(255, 255, 255)',
//   },
// };

createGlobalTheme(":root", globalVar, whiteGlobalTheme);

// globalStyle(':root', {
//   '@media': {
//     '(prefers-color-scheme: dark)': {
//       vars: assignVars(global, darkGlobalTheme),
//     },
//   },
// });
