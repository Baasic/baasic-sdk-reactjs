"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HttpClient = (function () {
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
                .then(function (response) { return resolve(response); })
                .catch(function (ex) {
                reject({
                    request: fetchRequest,
                    response: ex.response
                });
            });
        });
    };
    ;
    return HttpClient;
}());
exports.HttpClient = HttpClient;
;
function createOptions(request) {
    var headers = request.headers || new Headers();
    var data;
    if (request.data) {
        var dataType = headers['Content-Type'];
        if (dataType.indexOf('application/json') !== -1) {
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
