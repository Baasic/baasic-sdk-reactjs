import { IHttpClient, IHttpRequest, IHttpResponse } from 'baasic-sdk-javascript';
export declare class HttpClient implements IHttpClient {
    createPromise<TData>(deferFn: (resolve: (TData: any) => void, reject: (any: any) => void) => void): PromiseLike<TData>;
    request<ResponseType>(request: IHttpRequest): PromiseLike<IHttpResponse<ResponseType>>;
}
