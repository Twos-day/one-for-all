export type ThumbnailSize =
  | ThumbnailDefault
  | ThumbnailMedium
  | ThumbnailHigh
  | ThumbnailStandard
  | ThumbnailMaxres;

export type ThumbnailDefault = {
  type: 'default';
  width: 120;
  height: 90;
};

export type ThumbnailMedium = {
  type: 'mqdefault';
  width: 320;
  height: 180;
};

export type ThumbnailHigh = {
  type: 'hqdefault';
  width: 480;
  height: 360;
};

export type ThumbnailStandard = {
  type: 'sddefault';
  width: 640;
  height: 480;
};

export type ThumbnailMaxres = {
  type: 'maxresdefault';
  width: 1280;
  height: 720;
};
