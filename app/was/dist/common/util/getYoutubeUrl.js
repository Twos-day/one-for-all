"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateThumbnail = exports.generateChannelUrl = exports.generateVideoUrl = void 0;
const generateVideoUrl = (videoId) => {
    return `https://www.youtube.com/watch?v=${videoId}`;
};
exports.generateVideoUrl = generateVideoUrl;
const generateChannelUrl = (channelId) => {
    return `https://www.youtube.com/channel/${channelId}`;
};
exports.generateChannelUrl = generateChannelUrl;
const generateThumbnail = (videoId, ThumbnailSize) => {
    const base = 'https://i.ytimg.com/vi';
    return base + '/' + videoId + '/' + ThumbnailSize + '.jpg';
};
exports.generateThumbnail = generateThumbnail;
//# sourceMappingURL=getYoutubeUrl.js.map