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
        this.preselectAffected = function (params) {
            return _this.db.one("select count(p.id)::integer as marker from post p inner join thread t on t.id=p.thread_id\n      where p.parent_id = 0 and $(identifier:raw) $(conditionalLimit:raw) offset $(marker)\n      ", params);
        };
        this.posts = function (params, affected) {
            if (params.sort === 'flat') {
                return _this.db.any(sql.posts, params);
            }
            else if (params.sort === 'tree') {
                return _this.db.any(sql.tree, params);
            }
            else if (params.sort === 'parent_tree') {
                return _this.db.any("select p.id as marker from post p inner join thread t on t.id=p.thread_id\n      where p.parent_id = 0 and $(identifier:raw) $(conditionalLimit:raw) offset $(marker)\n      ", params)
                    .then(function (result) {
                    affected.marker = result.length;
                    return _this.db.any(sql.parentTree, params);
                });
            }
        };
        this.vote = function (params) {
            return _this.db.one(sql.vote, params)
                .then(function (data) { return _this.db.one(sql.details, params); });
        };
        this.checkAuthorOrForumExistance = function (nickname, forum) {
            return _this.db.result('' +
                ' with author as (select id, nickname from "user" where lower(nickname)=lower(${nickname})),' +
                '      fm as (select id, slug from "forum" where lower(slug)=lower(${forum}))' +
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
    return Repository;
}());
exports.Repository = Repository;
//# sourceMappingURL=threads.js.map