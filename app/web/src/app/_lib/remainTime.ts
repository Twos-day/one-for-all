import { differenceInSeconds, isValid, parseISO } from "date-fns";

export const remainTime = (exp: string) => {
  const expireTime = parseISO(exp);
  if (!isValid(expireTime)) return 1;
  const now = new Date();
  const diff = differenceInSeconds(expireTime, now);
  return diff;
};
