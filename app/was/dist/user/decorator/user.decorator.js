"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const common_1 = require("@nestjs/common");
exports.User = (0, common_1.createParamDecorator)((data, context) => {
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    if (!user) {
        throw new common_1.InternalServerErrorException('사용자 정보가 없습니다.');
    }
    return data ? user[data] : user;
});
//# sourceMappingURL=user.decorator.js.map