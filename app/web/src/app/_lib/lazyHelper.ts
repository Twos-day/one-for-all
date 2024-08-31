type PageModule = {
  default: React.ComponentType<any>; // 또는 해당 모듈의 실제 타입
  loader?: (arg: any) => Promise<any>;
};

export const lazyHelper = async (module: Promise<PageModule>) => {
  const load = await module;

  return { Component: load.default, loader: load?.loader };
};
