"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const serve_static_1 = require("@nestjs/serve-static");
const typeorm_1 = require("@nestjs/typeorm");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const user_module_1 = require("./user/user.module");
const auth_module_1 = require("./auth/auth.module");
const common_module_1 = require("./common/common.module");
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const path_const_1 = require("./common/const/path.const");
const aws_module_1 = require("./aws/aws.module");
const image_module_1 = require("./image/image.module");
const log_module_1 = require("./log/log.module");
const log_service_1 = require("./log/log.service");
const twosday_module_1 = require("./twosday/twosday.module");
const mail_module_1 = require("./mail/mail.module");
let AppModule = class AppModule {
    constructor(logService) {
        this.logService = logService;
    }
    async onModuleInit() { }
    async onApplicationBootstrap() {
        if (process.env.NODE_ENV === 'prod') {
            await this.logService.sendDiscode(`WAS 서버가 실행되었습니다.`);
        }
    }
    async onModuleDestroy() { }
    async beforeApplicationShutdown(signal) {
        if (process.env.NODE_ENV === 'prod') {
            await this.logService.sendDiscode(`WAS 서버가 종료됩니다.`);
        }
    }
    async onApplicationShutdown(signal) { }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: path_const_1.PUBLIC_FOLDER_PATH,
                exclude: ['/api*'],
                serveStaticOptions: {
                    fallthrough: true,
                },
            }),
            config_1.ConfigModule.forRoot({
                envFilePath: `.env.${process.env.NODE_ENV}`,
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: process.env.DB_HOST,
                port: Number(process.env.DB_PORT),
                username: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_DATABASE,
                entities: [__dirname + '/**/*.entity.{js,ts}'],
                synchronize: false,
            }),
            user_module_1.UserModule,
            auth_module_1.AuthModule,
            common_module_1.CommonModule,
            aws_module_1.AwsModule,
            image_module_1.ImageModule,
            log_module_1.LogModule,
            mail_module_1.MailModule,
            twosday_module_1.TwosdayModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: common_1.ClassSerializerInterceptor,
            },
        ],
    }),
    __metadata("design:paramtypes", [log_service_1.LogService])
], AppModule);
//# sourceMappingURL=app.module.js.map