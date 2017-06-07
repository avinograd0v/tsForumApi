/**
 * Created by andreivinogradov on 13.03.17.
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sqlProvider = require("../sql");
var sql = sqlProvider.posts;
var Repository = (function () {
    function Repository(db, pgp) {
        var _this = this;
        this.create = function (posts, info, task) {
            return task.tx(function (t) {
                var chObj = posts.reduce(function (prev, curr) {
                    prev.parents.push(curr.parent || 0);
                    prev.messages.push(curr.message);
                    prev.authors.push(curr.author);
                    return prev;
                }, { parents: [], messages: [], authors: [] });
                var query = t.any(sql.create, Object.assign(info, chObj))
                    .then(function (data) {
                    if (data.length !== posts.length) {
                        throw new Error('notfound');
                    }
                    if (data.some(function (p) { return p.parent === null; })) {
                        throw new Error('wrong parent id');
                    }
                    t.posts.addToUserForumRelations({ forumID: info.forumid, authors: chObj.authors });
                    return data;
                });
                return query;
            });
        };
        this.getForumAndThread = function (identifier, task) {
            return task.oneOrNone("\n     select id as threadID, slug as threadSlug, forum_id as forumID,\n     forum_slug as forumSlug from thread where $(identifier:raw)", { identifier: identifier }, function (result) {
                if (result === null) {
                    throw new Error('notfound');
                }
                return result;
            });
        };
        this.details = function (params) {
            return _this.db.oneOrNone(sql.details, params, function (postObj) {
                if (postObj === null) {
                    throw new Error('Post not found');
                }
                return postObj;
            });
        };
        this.update = function (message, id) {
            return _this.db.oneOrNone(sql.update, { message: message, id: id }, function (postObj) {
                if (postObj === null) {
                    throw new Error('Post not found');
                }
                return postObj;
            });
        };
        this.db = db;
        this.pgp = pgp;
    }
    Repository.prototype.addToUserForumRelations = function (info) {
        this.db.none(sql.addToUserForumRelation, info);
    };
    return Repository;
}());
exports.Repository = Repository;
//# sourceMappingURL=posts.js.map