"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleUser = void 0;
const common_1 = require("@nestjs/common");
exports.GoogleUser = (0, common_1.createParamDecorator)((data, context) => {
    const req = context.switchToHttp().getRequest();
    const profile = req.user;
    if (!profile) {
        throw new common_1.InternalServerErrorException('Request에 google profile이 존재하지 않습니다.');
    }
    console.log('profile', profile);
    const googleUser = {
        email: profile.emails[0].value,
        nickname: profile.displayName,
        avatar: profile.photos[0].value,
        accessToken: profile.accessToken,
    };
    return data ? googleUser[data] : googleUser;
});
//# sourceMappingURL=google-user.decorator.js.map