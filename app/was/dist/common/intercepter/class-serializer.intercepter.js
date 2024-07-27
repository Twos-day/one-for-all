"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomClassSerializerInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const PASS_THROUGH = ['/login'];
let CustomClassSerializerInterceptor = class CustomClassSerializerInterceptor extends common_1.ClassSerializerInterceptor {
    intercept(context, next) {
        const contextOptions = this.getContextOptions(context);
        const options = {
            ...this.defaultOptions,
            ...contextOptions,
        };
        const req = context.switchToHttp().getRequest();
        const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
        req.fullUrl = fullUrl;
        return next.handle().pipe((0, operators_1.map)((res) => {
            if (PASS_THROUGH.some((path) => req.originalUrl.startsWith(path))) {
                return res;
            }
            return this.serialize(res, options);
        }));
    }
};
exports.CustomClassSerializerInterceptor = CustomClassSerializerInterceptor;
exports.CustomClassSerializerInterceptor = CustomClassSerializerInterceptor = __decorate([
    (0, common_1.Injectable)()
], CustomClassSerializerInterceptor);
//# sourceMappingURL=class-serializer.intercepter.js.map