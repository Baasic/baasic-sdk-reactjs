import { IBaasicOptions, BaasicApp as BaasicSdkApp } from 'baasic-sdk-javascript';
import { HttpClient } from './infrastructure/httpApi/http-client';

export class BaasicApp extends BaasicSdkApp {
    constructor(apiKey: string, options?: Partial<IBaasicOptions>) {
        super(apiKey, getOptions(options));
    }
}

function getOptions(options: Partial<IBaasicOptions>): Partial<IBaasicOptions> {
    var defaults: Partial<IBaasicOptions> = {
        httpClient: () => new HttpClient()
    };

    return Object.assign({}, defaults, options);
};
