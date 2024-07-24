import { ThumbnailSize } from '@/common/type/youtube.type';
export declare const generateVideoUrl: (videoId: string) => string;
export declare const generateChannelUrl: (channelId: string) => string;
export declare const generateThumbnail: (videoId: string, ThumbnailSize: ThumbnailSize["type"]) => string;
