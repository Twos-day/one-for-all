"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.excuteRootDomain = void 0;
const tldts_1 = require("tldts");
const excuteRootDomain = (url) => {
    if (!url)
        return 'localhost';
    const hostname = (0, tldts_1.parse)(url).hostname.split('.');
    let rootDomain;
    if (hostname.length < 3) {
        rootDomain = hostname.join('.');
    }
    else {
        hostname.shift();
        rootDomain = hostname.join('.');
    }
    return rootDomain;
};
exports.excuteRootDomain = excuteRootDomain;
//# sourceMappingURL=excute-root-domain.js.map