"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var aws_sdk_1 = require("aws-sdk");
var react_1 = require("react");
var server_1 = require("react-dom/server");
var server_2 = require("react-router-dom/server");
var stream_1 = require("stream");
var HtmlWritable = /** @class */ (function (_super) {
    __extends(HtmlWritable, _super);
    function HtmlWritable() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.chunks = [];
        _this.html = "";
        return _this;
    }
    HtmlWritable.prototype.getHtml = function () {
        return this.html;
    };
    HtmlWritable.prototype._write = function (chunk, encoding, callback) {
        this.chunks.push(chunk);
        callback();
    };
    HtmlWritable.prototype._final = function (callback) {
        this.html = Buffer.concat(this.chunks).toString();
        callback();
    };
    return HtmlWritable;
}(stream_1.Writable));
var writable = new HtmlWritable();
var handler = function (event) {
    return __awaiter(this, void 0, void 0, function () {
        var s3, params;
        return __generator(this, function (_a) {
            try {
                s3 = new aws_sdk_1["default"].S3();
                params = { Bucket: "myBucket", Key: "myKey.csv" };
                s3.getObject(params, function (err, data) {
                    if (err)
                        console.log(err, err.stack); // an error occurred
                    else {
                        console.log(data);
                        var pipe_1 = server_1["default"].renderToPipeableStream(<react_1["default"].StrictMode>
            <server_2.StaticRouter location={event.rawPath}/>
          </react_1["default"].StrictMode>, {
                            onShellReady: function () {
                                pipe_1(writable);
                            },
                            onShellError: function () {
                                return {
                                    statusCode: 500,
                                    headers: { "Content-Type": "text/html" },
                                    body: "<!doctype html><p>Loading...</p>"
                                };
                            }
                        }).pipe;
                        writable.on("finish", function () {
                            var html = writable.getHtml();
                            var indexHTML = data
                                .toString()
                                .replace('<div id="root"></div>', "<div id=\"root\">" + html + "</div>");
                            return {
                                statusCode: 200,
                                headers: { "Content-Type": "text/html" },
                                body: indexHTML
                            };
                        });
                    } // successful response
                });
            }
            catch (error) {
                console.log("Error " + error.message);
                return [2 /*return*/, "Error " + error];
            }
            return [2 /*return*/];
        });
    });
};
exports.handler = handler;
