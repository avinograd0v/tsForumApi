/**
 * Created by andreivinogradov on 13.03.17.
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var _a = require('../db'), db = _a.db, pgp = _a.pgp;
// let resus: number[] = []
// const source = (arr: number[], identifier: any) => (index: any, data: any, delay: any) => {
//   console.log(index, data, delay)
//   if (data !== undefined) {
//     resus.push(data[0])
//   }
//   if (index < arr.length) {
//     return db.query(`with tuple as (
//      select u.id as uid, u.nickname, f.id as fid, f.slug from "user" u, forum f
//      where lower(f.slug)=lower($(forum))
//      and lower(u.nickname) = lower($(nickname))
//      )
//
//      insert into post as ci (author_id, created, forum_id, isedited, message,
//      parent_id, thread_id) select uid, $(created), fid, false,
//      $(message), $(parentID), $(threadID) from tuple
//      returning (select nickname from tuple) as author, ci.created,
//      (select slug from tuple) as forum, ci.id, ci.isedited as isEdited,
//      ci.message, ci.parent_id as parent, ci.thread_id as thread`,
//       (Object as any).assign({identifier}, arr[index]))
//   }
// }
var ThreadRouter = (function () {
    function ThreadRouter() {
        this.router = express_1.Router();
        this.init();
    }
    ThreadRouter.prototype.getThreadDetails = function (req, res, next) {
        var identifier = isNaN(req.params.identifier) ? "lower(t.slug) = lower('" + req.params.identifier + "')"
            : "t.id = " + +req.params.identifier;
        db.threads.details(identifier)
            .then(function (data) {
            res.status(200)
                .json(data);
        })
            .catch(function (e) {
            console.log(e);
            res.status(404)
                .end();
        });
    };
    ThreadRouter.prototype.changeThreadDetails = function (req, res, next) {
        var identifier = isNaN(req.params.identifier) ? "lower(slug) = lower('" + req.params.identifier + "')"
            : "id = " + +req.params.identifier;
        db.threads.update({
            message: req.body.message,
            title: req.body.title,
            identifier: identifier
        })
            .then(function (data) {
            res.status(200)
                .json(data);
        })
            .catch(function (e) {
            console.log(e);
            res.status(404)
                .end();
        });
    };
    ThreadRouter.prototype.changeVotes = function (req, res, next) {
        var identifier = isNaN(req.params.identifier) ? "lower(t.slug) = lower('" + req.params.identifier + "')"
            : "t.id = " + +req.params.identifier;
        db.threads.vote({
            nickname: req.body.nickname,
            voice: req.body.voice,
            identifier: identifier
        })
            .then(function (data) {
            res.status(200)
                .json(data);
        })
            .catch(function (e) {
            console.log(e);
            res.status(404)
                .end();
        });
    };
    ThreadRouter.prototype.addPosts = function (req, res, next) {
        var identifier = isNaN(req.params.identifier) ? "lower(t.slug) = lower('" + req.params.identifier + "')"
            : "t.id = " + +req.params.identifier;
        db.posts.getForumAndThread(identifier)
            .then(function (info) {
            return db.posts.create(req.body, info);
        })
            .then(function (data) {
            res.status(201)
                .json(data);
        })
            .catch(function (e) {
            console.log(e);
            res.status(e.message === 'notfound' ? 404 : 409)
                .end();
        });
    };
    ThreadRouter.prototype.getThreadPosts = function (req, res, next) {
        var identifier = isNaN(req.params.identifier) ? "lower(t.slug) = lower('" + req.params.identifier + "')"
            : "t.id = " + +req.params.identifier;
        var marker = req.query.marker === undefined ? 0 : +req.query.marker;
        var affected = {};
        db.posts.getForumAndThread(identifier)
            .then(function (info) {
            return db.threads.posts({
                identifier: identifier,
                marker: marker,
                conditionalLimit: req.query.limit === undefined ? '' : "limit " + req.query.limit,
                sort: req.query.sort === undefined ? 'flat' : req.query.sort,
                orderCondition: req.query.desc === 'true' ? 'desc' : 'asc'
            }, affected);
        })
            .then(function (data) {
            marker += affected.marker === undefined ? data.length : affected.marker;
            data.forEach(function (post) { if (post.parent === 0) {
                delete post.parent;
            } });
            var result = { marker: '' + marker, posts: data };
            res.status(200)
                .json(result);
        })
            .catch(function (e) {
            console.log(e);
            res.status(404)
                .end();
        });
    };
    ThreadRouter.prototype.init = function () {
        this.router.post('/:identifier/create', this.addPosts);
        this.router.get('/:identifier/details', this.getThreadDetails);
        this.router.post('/:identifier/details', this.changeThreadDetails);
        this.router.get('/:identifier/posts', this.getThreadPosts);
        this.router.post('/:identifier/vote', this.changeVotes);
    };
    return ThreadRouter;
}());
exports.ThreadRouter = ThreadRouter;
var threadRoutes = new ThreadRouter();
threadRoutes.init();
exports.default = threadRoutes.router;
//# sourceMappingURL=threadRouter.js.map