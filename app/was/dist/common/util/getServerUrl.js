"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServerUrl = void 0;
const getServerUrl = () => {
    return process.env.PROTOCOL + '://' + process.env.HOST;
};
exports.getServerUrl = getServerUrl;
//# sourceMappingURL=getServerUrl.js.map