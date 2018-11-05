import { IBaasicOptions, BaasicApp as BaasicSdkApp, BaasicPlatform as BaasicSdkPlatform } from 'baasic-sdk-javascript';
declare class BaasicApp extends BaasicSdkApp {
    constructor(apiKey: string, options?: Partial<IBaasicOptions>);
}
declare class BaasicPlatform extends BaasicSdkPlatform {
    constructor(options?: Partial<IBaasicOptions>);
}
export { BaasicApp, BaasicPlatform };
