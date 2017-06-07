"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sqlProvider = require("../sql");
var sql = sqlProvider.users;
var Repository = (function () {
    function Repository(db, pgp) {
        var _this = this;
        this.create = function (info) {
            return _this.db.many(sql.create, info);
        };
        this.profile = function (nickname) {
            return _this.db.oneOrNone(sql.profile, { nickname: nickname });
        };
        this.update = function (info) {
            return _this.db.oneOrNone(sql.update, info, function (userProf) {
                if (userProf === null) {
                    throw new Error('User not found');
                }
                return userProf;
            });
        };
        this.checkExistanceErrors = function (nickname, email) {
            return _this.db.one("select case when (select id from \"user\" where\n     nickname<>$<nickname>::citext and email=$<email>::citext)\n     is not null then true else false end as \"conflict\", case when (select id from \"user\" where\n     nickname=$<nickname>::citext) is not null then false else true end as \"notfound\"", { nickname: nickname, email: email }, function (errors) {
                if (errors.notfound) {
                    throw new Error('notfound');
                }
                else if (errors.conflict) {
                    throw new Error('conflict');
                }
            });
        };
        this.db = db;
        this.pgp = pgp;
    }
    return Repository;
}());
exports.Repository = Repository;
//# sourceMappingURL=users.js.map