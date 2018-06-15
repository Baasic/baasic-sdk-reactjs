import { IHttpClient, IHttpRequest, IHttpResponse, IHttpHeaders } from 'baasic-sdk-javascript';
import * as http from 'http';
import * as https from 'https';

export class HttpClient implements IHttpClient {
    createPromise<TData>(deferFn: (resolve: (TData) => void, reject: (any) => void) => void): PromiseLike<TData> {
        return new Promise<TData>(deferFn);
    }

    request<ResponseType>(request: IHttpRequest): PromiseLike<IHttpResponse<ResponseType>> {
        return this.createPromise<IHttpResponse<ResponseType>>(function (resolve, reject) {
            let headers: any = Object.assign({}, request.headers);

            let postData;
            if (request.data) {
                let dataType: string = headers['Content-Type'];
                if (dataType.indexOf('application/json') !== -1) {
                    postData = JSON.stringify(request.data);
                } else {
                    postData = request.data;
                }
            }
            if (postData) {
                headers['Content-Length']  = Buffer.byteLength(postData);
            }

            let url = request.url;
            var path = url.pathname;
            if (url.search) {
                path += url.search;
            }

            let client;
            if (url.protocol.startsWith('https')) {
                client = https;
            } else {
                client = http;
            }

            let req = client.request({
                hostname: url.hostname,
                port: url.port ? parseInt(url.port) : undefined,
                path: path,
                method: request.method,
                headers: headers
            }, (res) => {
                res.setEncoding('utf8');
                let body = '';
                res.on('data', (chunk) => {
                    body += chunk;
                });

                res.on('end', () => {
                    var response = {
                        request: request,
                        headers: res.headers,
                        statusCode: res.statusCode,
                        statusText: res.statusMessage,
                        data: body ? JSON.parse(body) : null
                    };
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        resolve(response);
                    } else {
                        reject(response);
                    }
                });
            });

            req.on('error', (e) => {
                reject(e);
            });

            if (postData) {
                req.write(postData);
            }
            req.end();
        }) 
    };
};