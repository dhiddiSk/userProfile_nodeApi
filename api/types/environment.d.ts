export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
        mongoDatabaseURL: string;
        passportSecretCode: string;
        userProfileApplicationPortNumber: number;
        ENV: 'test' | 'dev' | 'prod';
    }
  }
}
