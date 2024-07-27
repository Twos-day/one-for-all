import { parse } from 'tldts';

export const excuteRootDomain = (url: string) => {
  if (!url) return 'localhost';
  const hostname = parse(url).hostname.split('.');

  let rootDomain: string;
  if (hostname.length < 3) {
    rootDomain = hostname.join('.');
  } else {
    hostname.shift(); // SID 제거
    rootDomain = hostname.join('.');
  }

  return rootDomain;
};
