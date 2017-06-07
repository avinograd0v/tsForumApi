/**
 * Created by andreivinogradov on 13.03.17.
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sqlProvider = require("../sql");
var sql = sqlProvider.threads;
var Repository = (function () {
    function Repository(db, pgp) {
        var _this = this;
        this.create = function (info) {
            return _this.db.one(sql.create, info);
        };
        this.details = function (identifier) {
            return _this.db.oneOrNone(sql.details, { identifier: identifier }, function (threadObj) {
                if (threadObj === null) {
                    throw new Error('Ветка не найдена!');
                }
                return threadObj;
            });
        };
        this.update = function (params) {
            return _this.db.oneOrNone(sql.update, params, function (threadObj) {
                if (threadObj === null) {
                    throw new Error('Thread not found');
                }
                return threadObj;
            });
        };
        this.exists = function (ident) {
            return _this.db.one("select id from thread where $(ident:raw)", { ident: ident });
        };
        this.posts = function (params) {
            if (params.sort === 'flat') {
                return _this.db.any(sql.posts, params);
            }
            else if (params.sort === 'tree') {
                return _this.db.any(sql.tree, params);
            }
            else if (params.sort === 'parent_tree') {
                return _this.db.any("select array(select p.id  from post p\n      where p.parent_id = 0 and p.thread_id=$(identifier) order by p.id $(orderCondition:raw) $(conditionalLimit:raw)\n       offset $(marker)) as parent_posts\n      ", params)
                    .then(function (result) {
                    var actualObject = result[0];
                    actualObject.orderCondition = params.orderCondition;
                    return _this.db.any(sql.parentTree, actualObject);
                });
            }
        };
        this.vote = function (params) {
            return _this.db.one(sql.vote, params)
                .then(function (data) {
                data.vote = (data.vote === data.ex_vote) ? 0 : data.vote;
                return _this.db.one(sql.updatevotes, data);
            });
        };
        this.checkAuthorOrForumExistance = function (nickname, forum) {
            return _this.db.result('' +
                ' with author as (select id, nickname from "user" where nickname=${nickname}::citext),' +
                '      fm as (select id, slug from "forum" where slug=${forum}::citext)' +
                ' select id, nickname as title from author union all select id, slug from fm', { nickname: nickname, forum: forum }, function (fu) {
                if (fu.rows.length !== 2) {
                    throw new Error('Author or forum not found!');
                }
                return fu.rows;
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
//# sourceMappingURL=threads.js.map