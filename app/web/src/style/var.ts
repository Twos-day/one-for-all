import { CSSPropertiesWithVars } from "@/type/vanillaExtract";
import { calc } from "@vanilla-extract/css-utils";

export const BEZIER_CURVE = "cubic-bezier(0.23, 1, 0.32, 1)";
export const BOX_SHADOW = "0px 1px 2px 0 rgba(56, 52, 52, 0.4)";

export const flexCenter: CSSPropertiesWithVars = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

export const absoluteCenter: CSSPropertiesWithVars = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

export const fixedMaxSize: CSSPropertiesWithVars = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100dvw",
  height: "100dvh",
};

export const zIndex = {
  header: {
    zIndex: 1000,
  },
  float: {
    zIndex: 200,
  },
  modal: {
    zIndex: 9000,
  },
  toast: {
    zIndex: 10000,
  },
  sidebar: {
    zIndex: 500,
  },
};

export const MOBILE_MIN_WIDTH = 480;

export const BREAK_POINT = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
  full: 1900,
};

export const VAR_COLOR = {
  KAKAO: "#FEE500",
};

type ResponsiveArgs = Partial<Record<keyof typeof BREAK_POINT, CSSPropertiesWithVars>>;
export const responsive = (styles: ResponsiveArgs) => {
  const mediaStyle: Record<string, CSSPropertiesWithVars> = {};

  for (const _key in BREAK_POINT) {
    const key = _key as keyof typeof BREAK_POINT;
    const style = styles[key];

    if (style) {
      mediaStyle[`screen and (min-width: ${BREAK_POINT[key]}px)`] = style;
    }
  }

  return {
    "@media": {
      ...mediaStyle,
    },
  };
};

export const textLine = (lineHeight: string | number, clamp: number): CSSPropertiesWithVars => ({
  wordBreak: "break-all",
  display: "-webkit-box",
  overflow: "hidden",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: clamp,
  lineHeight,
  height: calc.multiply(clamp, lineHeight),
});

export const preventUserSelect: CSSPropertiesWithVars = {
  WebkitUserSelect: "none",
  userSelect: "none",
};
