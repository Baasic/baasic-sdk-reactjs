import {IHttpClient, IHttpRequest, IHttpResponse, IHttpHeaders} from 'baasic-sdk-javascript';

export class HttpClient implements IHttpClient {
    createPromise<TData>(deferFn: (resolve: (TData) => void, reject: (any) => void) => void): PromiseLike<TData> {
        return new Promise<TData>(deferFn);
    }

    request<ResponseType>(request: IHttpRequest): PromiseLike<IHttpResponse<ResponseType>> {
        return this.createPromise<IHttpResponse<ResponseType>>(function (resolve, reject) {
            const options = createOptions(request);
            const fetchRequest = new Request(request.url, options);
            fetch(fetchRequest)
                .then(checkResponseStatus)
                .then(response => {
                    createBaasicResponse<ResponseType>(request, response)
                        .then(function (result) {
                            resolve(result);
                        });
                })
                .catch(ex => {
                    createBaasicResponse<ResponseType>(request, ex.response)
                        .then(function (result) {
                            // should never happen, but not sure.
                            reject(result);
                        }, function(result) {
                            reject(result);
                        });
                });
        })
    };
}

function createOptions(request: IHttpRequest): RequestInit {
    let headers = request.headers || new Headers();

    let data;
    if (request.data) {
        let dataType: string = headers['Content-Type'];
        if (dataType && dataType.indexOf('application/json') !== -1) {
            data = JSON.stringify(request.data);
        } else {
            data = request.data;
        }
    }

    let options: RequestInit = {
        headers: headers,
        method: request.method
    };
    if (request.abortSignal && request.abortSignal.signal) {
        options.signal = request.abortSignal.signal;
    }


    if (data) {
        options.body = data;
    }

    return options;
}

function checkResponseStatus(response: Response): Response {
    if (!response.ok) {
        const ex = {
            response: response,
        };
        throw ex;
    }

    return response;
}

function mapResponseHeaders(headers: Headers): IHttpHeaders {
    if (!headers) {
        return null;
    }

    let responseHeaders: IHttpHeaders = {};

    headers.forEach((value, key) => {
        responseHeaders[key] = value;
    });

    return responseHeaders;
}

function createErrorResponse<TData>(request: IHttpRequest): PromiseLike<IHttpResponse<TData>> {
    const result: IHttpResponse<TData> = {
        request: request,
        headers: null,
        statusCode: 0,
        statusText: '',
        data: null
    };

    return new Promise((resolve, reject) => {
        reject(result)
    });
}

function createAbortedResponse<TData>(request: IHttpRequest): PromiseLike<IHttpResponse<TData>> {
    const result: IHttpResponse<TData> = {
        request: request,
        headers: null,
        statusCode: -1,
        statusText: '',
        data: null
    };

    return new Promise((resolve, reject) => {
        resolve(result)
    });
}

function createBaasicResponse<TData>(request: IHttpRequest, response: Response): PromiseLike<IHttpResponse<TData>> {
    if (isAborted(request)) {
        return createAbortedResponse(request);
    }
    if (!response) {
        return createErrorResponse(request);
    }

    const contentType = response.headers.get('Content-Type') || 'application/json';
    const getBody = () => {
        if (contentType.indexOf('application/json') !== -1) {
            return response.json();
        }
        else if (request.responseType) {
            const rType = request.responseType.toLowerCase();
            if (rType === 'blob') {
                return response.blob();
            }
            // can be arraybuffer or arrayBuffer
            else if (rType === 'arraybuffer') {
                return response.arrayBuffer();
            }
        }
        else if (contentType.includes('image')) {
            return response.blob();
        }
        return response.text();
    };

    const result: IHttpResponse<TData> = {
        request: request,
        headers: mapResponseHeaders(response.headers),
        statusCode: response.status,
        statusText: response.statusText,
        data: null
    };

    return new Promise(function (resolve, reject) {
        getBody().then(function (r) {
            result.data = r;
            resolve(result);
        }, function (error) {
            resolve(result);
        });
    });
}

function isAborted(request: IHttpRequest): boolean {
    return request && request.abortSignal && request.abortSignal.signal && request.abortSignal.signal.aborted;
}