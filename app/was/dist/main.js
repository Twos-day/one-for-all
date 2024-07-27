"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_filter_1 = require("./app.filter");
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./http-exception.filter");
const express_1 = require("express");
const swagger_1 = require("@nestjs/swagger");
const cookieParser = require("cookie-parser");
const logger_middleware_1 = require("./log/logger.middleware");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const { httpAdapter } = app.get(core_1.HttpAdapterHost);
    const options = new swagger_1.DocumentBuilder()
        .setTitle('One For All API Docs')
        .setDescription('One For All API Docs')
        .setVersion('0.1.0')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, options);
    swagger_1.SwaggerModule.setup('docs', app, document);
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
        whitelist: true,
        forbidNonWhitelisted: true,
    }));
    app.useGlobalFilters(new app_filter_1.AppFilter(httpAdapter), new http_exception_filter_1.HttpExceptionFilter());
    app.use((0, express_1.json)({ limit: '500mb' }));
    app.use((0, express_1.urlencoded)({ extended: true, limit: '500mb' }));
    app.use(cookieParser());
    function checkOrigin(origin) {
        if (!origin)
            return true;
        const whitelist = [
            'http://localhost:3000',
            'http://localhost:3001',
            'http://localhost:8080',
            'http://localhost:8081',
            'https://twosday.live',
        ];
        return whitelist.some((allowedOrigin) => origin.startsWith(allowedOrigin) || origin.endsWith('.twosday.live'));
    }
    app.enableCors({
        origin: (origin, callback) => {
            if (checkOrigin(origin)) {
                callback(null, true);
            }
            else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        credentials: true,
    });
    app.use(new logger_middleware_1.LoggerMiddleware().use);
    const port = 8080;
    await app.listen(port, async () => {
        common_1.Logger.log(`🚀 one_for_all 서버가 실행되었습니다. 🚀 포트 : ${port}, ENV : ${process.env.NODE_ENV}`);
    });
}
bootstrap();
//# sourceMappingURL=main.js.map