"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POSTS_FOLDER_PATH = exports.POSTS_FOLDER_NAME = exports.PUBLIC_FOLDER_PATH = exports.PUBLIC_FOLDER_NAME = exports.PROJECT_ROOT_PATH = void 0;
const path_1 = require("path");
exports.PROJECT_ROOT_PATH = process.cwd();
exports.PUBLIC_FOLDER_NAME = 'public';
exports.PUBLIC_FOLDER_PATH = (0, path_1.join)(exports.PROJECT_ROOT_PATH, exports.PUBLIC_FOLDER_NAME);
exports.POSTS_FOLDER_NAME = 'posts';
exports.POSTS_FOLDER_PATH = (0, path_1.join)(exports.PUBLIC_FOLDER_PATH, exports.POSTS_FOLDER_NAME);
//# sourceMappingURL=path.const.js.map