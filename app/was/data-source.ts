import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, '.env.prod') });

const options: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_DATABASE,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  entities: [__dirname + '/**/*.entity.{js,ts}'],
  migrations: ['migration/*.ts'], //마이그레이션 실행파일 위치
  migrationsTableName: 'migration', //마이그레이션 상태를 기록
};

export default new DataSource(options);
