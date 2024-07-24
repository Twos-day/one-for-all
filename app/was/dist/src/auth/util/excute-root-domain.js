"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.excuteRootDomain = void 0;
const excuteRootDomain = (host) => {
    const parts = host.split('.');
    if (parts.length === 1) {
        return 'localhost';
    }
    if (parts.length === 2) {
        return host;
    }
    parts.shift();
    return parts.join('.');
};
exports.excuteRootDomain = excuteRootDomain;
//# sourceMappingURL=excute-root-domain.js.map