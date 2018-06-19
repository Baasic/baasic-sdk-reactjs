"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var baasic_sdk_javascript_1 = require("baasic-sdk-javascript");
var http_client_1 = require("./infrastructure/httpApi/http-client");
var BaasicApp = (function (_super) {
    tslib_1.__extends(BaasicApp, _super);
    function BaasicApp(apiKey, options) {
        return _super.call(this, apiKey, getOptions(options)) || this;
    }
    return BaasicApp;
}(baasic_sdk_javascript_1.BaasicApp));
exports.BaasicApp = BaasicApp;
function getOptions(options) {
    var defaults = {
        httpClient: function () { return new http_client_1.HttpClient(); }
    };
    return Object.assign({}, defaults, options);
}
;
