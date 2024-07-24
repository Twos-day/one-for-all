export const excuteRootDomain = (host: string) => {
  const parts = host.split('.');

  if (parts.length === 1) {
    return 'localhost';
  }

  if (parts.length === 2) {
    return host;
  }

  parts.shift();
  return parts.join('.');
};
