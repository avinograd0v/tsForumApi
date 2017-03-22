/**
 * Created by andreivinogradov on 13.03.17.
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sqlProvider = require("../sql");
var sql = sqlProvider.services;
var Repository = (function () {
    function Repository(db, pgp) {
        var _this = this;
        this.clear = function () {
            return _this.db.none(sql.clear);
        };
        this.status = function () {
            return _this.db.one(sql.status);
        };
        this.db = db;
        this.pgp = pgp;
    }
    return Repository;
}());
exports.Repository = Repository;
//# sourceMappingURL=services.js.map