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
                .then(response => resolve(response))
                .catch(ex => {
                    reject({
                        request: fetchRequest,
                        response: ex.response
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