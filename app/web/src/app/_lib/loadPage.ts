type ComponentModule = {
  default: React.ComponentType<any>; // 또는 해당 모듈의 실제 타입
  loader?: (arg: any) => Promise<any>;
};

export const loadPage = async (module: Promise<ComponentModule>) => {
  const load = await module;

  return { Component: load.default, loader: load?.loader };
};
