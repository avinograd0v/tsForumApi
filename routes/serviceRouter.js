/**
 * Created by andreivinogradov on 13.03.17.
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var _a = require('../db'), db = _a.db, pgp = _a.pgp;
var ServiceRouter = (function () {
    function ServiceRouter() {
        this.router = express_1.Router();
        this.init();
    }
    ServiceRouter.prototype.clearUserData = function (req, res, next) {
        db.services.clear()
            .then(function () {
            res.status(200)
                .end();
        });
    };
    ServiceRouter.prototype.getDatabaseInfo = function (req, res, next) {
        db.services.status()
            .then(function (data) {
            res.status(200)
                .json(data);
        });
    };
    ServiceRouter.prototype.init = function () {
        this.router.post('/clear', this.clearUserData);
        this.router.get('/status', this.getDatabaseInfo);
    };
    return ServiceRouter;
}());
exports.ServiceRouter = ServiceRouter;
var serviceRoutes = new ServiceRouter();
serviceRoutes.init();
exports.default = serviceRoutes.router;
//# sourceMappingURL=serviceRouter.js.map