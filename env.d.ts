declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly NODE_ENV: 'local' | 'prod' | 'test';
      readonly TZ?: string;

      readonly HOST: string;
      readonly PORT: 'http' | 'https';

      readonly JWT_SECRET: string;
      readonly HASH_ROUNDS: string;

      readonly DB_HOST: string;
      readonly DB_PORT: string;
      readonly DB_USERNAME: string;
      readonly DB_PASSWORD: string;
      readonly DB_DATABASE: string;

      readonly AWS_RESION: string;
      readonly AWS_S3_ACCESS_KEY: string;
      readonly AWS_S3_SECRET_KEY: string;
      readonly AWS_S3_BUCKET_NAME: string;
    }
  }
}

export {};
