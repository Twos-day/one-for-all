export const getServerUrl = () => {
  return process.env.PROTOCOL + '://' + process.env.HOST;
};
