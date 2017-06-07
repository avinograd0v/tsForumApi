/**
 * Created by andreivinogradov on 13.03.17.
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sqlProvider = require("../sql");
var sql = sqlProvider.forums;
var Repository = (function () {
    function Repository(db, pgp) {
        var _this = this;
        this.create = function (info) {
            return _this.db.one(sql.create, info);
        };
        this.details = function (slug) {
            return _this.db.oneOrNone(sql.details, { slug: slug }, function (forumObj) {
                if (forumObj === null) {
                    throw new Error('Forum not found');
                }
                return forumObj;
            });
        };
        this.threads = function (params) {
            return _this.db.any(sql.threads, params);
        };
        this.users = function (params) {
            return _this.db.any(sql.users, params);
        };
        this.addToCounter = function (id) {
            return _this.db.none("update forum set threads_count = threads_count + 1 where id = $(id)", { id: id });
        };
        this.addToPostsCounter = function (length, id, task) {
            return task.none("update forum set posts_count = posts_count + $(length) where id = $(id)", { length: length, id: id });
        };
        this.checkAuthorExistance = function (nickname) {
            return _this.db.oneOrNone("select id, nickname from \"user\" where nickname=$(nickname)::citext", { nickname: nickname }, function (userObj) {
                if (userObj === null) {
                    throw new Error('Author not found!');
                }
                return userObj;
            });
        };
        this.checkForumExistance = function (slug) {
            return _this.db.oneOrNone('select id, slug from forum where slug=${slug}::citext', { slug: slug }, function (forumObj) {
                if (forumObj === null) {
                    throw new Error('Forum not found!');
                }
                return forumObj;
            });
        };
        this.db = db;
        this.pgp = pgp;
    }
    return Repository;
}());
exports.Repository = Repository;
//# sourceMappingURL=forums.js.map