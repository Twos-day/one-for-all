import { ThumbnailSize } from '@/common/type/youtube.type';

export const generateVideoUrl = (videoId: string) => {
  return `https://www.youtube.com/watch?v=${videoId}`;
};

export const generateChannelUrl = (channelId: string) => {
  return `https://www.youtube.com/channel/${channelId}`;
};

export const generateThumbnail = (
  videoId: string,
  ThumbnailSize: ThumbnailSize['type'],
) => {
  const base = 'https://i.ytimg.com/vi';
  return base + '/' + videoId + '/' + ThumbnailSize + '.jpg';
};
