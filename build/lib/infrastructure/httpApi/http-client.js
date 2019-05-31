"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HttpClient = /** @class */ (function () {
    function HttpClient() {
    }
    HttpClient.prototype.createPromise = function (deferFn) {
        return new Promise(deferFn);
    };
    HttpClient.prototype.request = function (request) {
        return this.createPromise(function (resolve, reject) {
            var options = createOptions(request);
            var fetchRequest = new Request(request.url, options);
            fetch(fetchRequest)
                .then(checkResponseStatus)
                .then(function (response) {
                createBaasicResponse(request, response)
                    .then(function (result) {
                    resolve(result);
                });
            })
                .catch(function (ex) {
                createBaasicResponse(request, ex.response)
                    .then(function (result) {
                    // should never happen, but not sure.
                    reject(result);
                }, function (result) {
                    reject(result);
                });
            });
        });
    };
    ;
    return HttpClient;
}());
exports.HttpClient = HttpClient;
function createOptions(request) {
    var headers = request.headers || new Headers();
    var data;
    if (request.data) {
        var dataType = headers['Content-Type'];
        if (dataType && dataType.indexOf('application/json') !== -1) {
            data = JSON.stringify(request.data);
        }
        else {
            data = request.data;
        }
    }
    var options = {
        headers: headers,
        method: request.method
    };
    if (data) {
        options.body = data;
    }
    return options;
}
function checkResponseStatus(response) {
    if (!response.ok) {
        var ex = {
            response: response,
        };
        throw ex;
    }
    return response;
}
function mapResponseHeaders(headers) {
    if (!headers) {
        return null;
    }
    var responseHeaders = {};
    headers.forEach(function (value, key) {
        responseHeaders[key] = value;
    });
    return responseHeaders;
}
function createErrorResponse(request) {
    var result = {
        request: request,
        headers: null,
        statusCode: 0,
        statusText: '',
        data: null
    };
    return new Promise(function (resolve, reject) {
        reject(result);
    });
}
function createBaasicResponse(request, response) {
    if (!response) {
        return createErrorResponse(request);
    }
    var contentType = response.headers.get('Content-Type') || 'application/json';
    var getBody = function () {
        if (contentType.indexOf('application/json') !== -1) {
            return response.json();
        }
        else if (contentType.includes('image')) {
            return response.blob();
        }
        return response.text();
    };
    var result = {
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
