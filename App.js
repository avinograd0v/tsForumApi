"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var forumRouter_1 = require("./routes/forumRouter");
var postRouter_1 = require("./routes/postRouter");
var serviceRouter_1 = require("./routes/serviceRouter");
var threadRouter_1 = require("./routes/threadRouter");
var userRouter_1 = require("./routes/userRouter");
var express = require("express");
var logger = require("morgan");
var bodyParser = require("body-parser");
var App = (function () {
    function App() {
        this.express = express();
        this.middleware();
        this.routes();
    }
    App.prototype.middleware = function () {
        this.express.use(logger('dev'));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
    };
    App.prototype.routes = function () {
        this.express.use('/api/forum', forumRouter_1.default);
        this.express.use('/api/post', postRouter_1.default);
        this.express.use('/api/service', serviceRouter_1.default);
        this.express.use('/api/thread', threadRouter_1.default);
        this.express.use('/api/user', userRouter_1.default);
    };
    return App;
}());
exports.default = new App().express;
//# sourceMappingURL=App.js.map