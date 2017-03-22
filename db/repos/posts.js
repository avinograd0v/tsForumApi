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
        this.create = function (posts, info) {
            return _this.db.tx(function (t) {
                var queries = Object.values(posts).map(function (post) {
                    return t.oneOrNone(sql.create, Object.assign(info, {
                        author: post.author,
                        created: post.created,
                        isEdited: post.isEdited === true ? true : false,
                        message: post.message,
                        parent: (post.parent === 0 || post.parent === undefined) ? 0 : "\n            case when exists(select id from post where id = " + post.parent + " and thread_id = " + info.threadid + ")\n            then " + post.parent + " else null end\n          "
                    }), function (data) {
                        if (data === null) {
                            throw new Error('notfound');
                        }
                        return data;
                    });
                });
                return t.batch(queries);
            });
        };
        this.getForumAndThread = function (identifier) {
            return _this.db.oneOrNone("\n     select t.id as threadID, t.slug as threadSlug, f.id as forumID,\n     f.slug as forumSlug from thread t inner\n     join forum f on t.forum_id=f.id where $(identifier:raw)", { identifier: identifier }, function (result) {
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
    return Repository;
}());
exports.Repository = Repository;
//# sourceMappingURL=posts.js.map