export const getCookieValue = (name: string) => {
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [key, value] = cookie.split("=").map((c) => c.trim());
    if (key === name) {
      return decodeURIComponent(value);
    }
  }
  return null;
};
