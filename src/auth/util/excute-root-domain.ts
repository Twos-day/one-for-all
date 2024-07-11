export const excuteRootDomain = (urlStr: string) => {
  const url = new URL(urlStr);
  const hostname = url.hostname;
  const parts = hostname.split('.');

  if (parts.length <= 2) {
    return hostname;
  }

  parts.shift();
  return parts.join('.');
};
