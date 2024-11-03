declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly NODE_ENV: "development" | "production" | "test";
      readonly TZ?: string;

      // vercel env  - https://vercel.com/docs/projects/environment-variables/system-environment-variables
      readonly NEXT_PUBLIC_VERCEL_ENV: "production" | "preview" | "development";
      /** *.vercel.app */
      readonly NEXT_PUBLIC_VERCEL_URL: string;
      /** main | stg | dev | ...etc */
      readonly NEXT_PUBLIC_VERCEL_GIT_REPO_SLUG: string;

      // public
      /** @Example - http://localhost:3000 */
      readonly NEXT_PUBLIC_API_URL: string;

      readonly NEXT_PUBLIC_WAS_PROTOCOL: "http" | "https";
      readonly NEXT_PUBLIC_WAS_HOST: string;

      readonly NEXT_PUBLIC_AWS_CLOUD_FRONT_URL: string;
    }
  }
}

export {};
