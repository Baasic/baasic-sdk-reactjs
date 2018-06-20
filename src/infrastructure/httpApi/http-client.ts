import { IHttpClient, IHttpRequest, IHttpResponse, IHttpHeaders } from 'baasic-sdk-javascript';

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
                    createBaasicResponse<ResponseType>(fetchRequest, response)
                        .then(function (result) {
                            resolve(result);
                        });
                })
                .catch(ex => {
                    createBaasicResponse<ResponseType>(fetchRequest, ex.response)
                        .then(function (result) {
                            reject(result);
                        });
                });
        })
    };
};

function createOptions(request: IHttpRequest): RequestInit {
    let headers = request.headers || new Headers();

    let data;
    if (request.data) {
        let dataType: string = headers['Content-Type'];
        if (dataType.indexOf('application/json') !== -1) {
            data = JSON.stringify(request.data);
        } else {
            data = request.data;
        }
    }

    let options: RequestInit = {
        headers: headers,
        method: request.method
    };

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

function createBaasicResponse<TData>(request: Request, response: Response): PromiseLike<IHttpResponse<TData>> {
    const contentType = response.headers.get('Content-Type') || 'application/json';
    const getBody = () => {
        if (contentType.indexOf('application/json') !== -1) {
            return response.json();
        }

        return response.text();
    }

    const result: IHttpResponse<TData> = {
        request: request,
        headers: response.headers,
        statusCode: response.status,
        statusText: response.statusText,
        data: null
    };

    return new Promise(function (resolve, reject) {
        getBody().then(function (response) {
            result.data = response;
            resolve(result);
        }, function (error) {
            resolve(result);
        });
    });
}