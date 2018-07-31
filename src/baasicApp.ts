import { IBaasicOptions, BaasicApp as BaasicSdkApp, BaasicPlatform as BaasicSdkPlatform } from 'baasic-sdk-javascript';
import { HttpClient } from './infrastructure/httpApi/http-client';

class BaasicApp extends BaasicSdkApp {
    constructor(apiKey: string, options?: Partial<IBaasicOptions>) {
        super(apiKey, getOptions(options));
    }
}

class BaasicPlatform extends BaasicSdkPlatform {
    constructor(options?: Partial<IBaasicOptions>) {
        super(getOptions(options));
    }
}

function getOptions(options: Partial<IBaasicOptions>): Partial<IBaasicOptions> {
    var defaults: Partial<IBaasicOptions> = {
        httpClient: () => new HttpClient()
    };

    return Object.assign({}, defaults, options);
};

export {
    BaasicApp,
    BaasicPlatform
}