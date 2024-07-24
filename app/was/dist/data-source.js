"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const dotenv_1 = require("dotenv");
const path_1 = require("path");
(0, dotenv_1.config)({ path: (0, path_1.resolve)(__dirname, '.env.local') });
const options = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_DATABASE,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    entities: [__dirname + '/**/*.entity.{js,ts}'],
    migrations: ['migration/*.ts'],
    migrationsTableName: 'migration',
};
exports.default = new typeorm_1.DataSource(options);
//# sourceMappingURL=data-source.js.map