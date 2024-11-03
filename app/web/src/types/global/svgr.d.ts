declare module "*.svg?react" {
  const svg: React.FC<React.SVGProps<SVGSVGElement>>;
  export default svg;
}

declare module "*.svg?url" {
  const svgUrl: string;
  export default svgUrl;
}
