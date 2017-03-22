/**
 * Created by andreivinogradov on 13.03.17.
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var _a = require('../db'), db = _a.db, pgp = _a.pgp;
var PostRouter = (function () {
    function PostRouter() {
        this.router = express_1.Router();
        this.init();
    }
    PostRouter.prototype.changePostDetails = function (req, res, next) {
        db.posts.update(req.body.message, req.params.id)
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
    PostRouter.prototype.getPostDetails = function (req, res, next) {
        db.posts.details({
            id: +req.params.id,
            conditionalForum: req.query.related !== undefined && req.query.related.includes('forum') ? "\n        json_build_object(\n          'posts', (select count(id) from post where forum_id=f.id),\n          'slug', f.slug,\n          'threads', (select count(id) from thread where forum_id=f.id),\n          'title', f.title,\n          'user', (select nickname from \"user\" where id=f.user_id)) as forum,\n      " : '',
            conditionalAuthor: req.query.related !== undefined && req.query.related.includes('user') ? "\n        json_build_object(\n          'about', u.about,\n          'email', u.email,\n          'fullname', u.fullname,\n          'nickname', u.nickname) as author,\n      " : '',
            conditionalThread: req.query.related !== undefined && req.query.related.includes('thread') ? ",\n        json_build_object(\n          'author', (select nickname from \"user\" where id=t.author_id),\n          'forum', f.slug,\n          'id', t.id,\n          'message', t.message,\n          'slug', t.slug,\n          'title', t.title,\n          'votes', COALESCE((select sum(vote) from vote where thread_id=t.id), 0)::integer\n           ) as thread, t.created as threadcreated\n      " : '',
            conditionalJoinThread: req.query.related !== undefined && req.query.related.includes('thread') ? "\n        inner join thread t on p.thread_id=t.id\n      " : ''
        })
            .then(function (data) {
            data.post.created = data.postcreated;
            delete data.postcreated;
            if (data.thread !== undefined) {
                data.thread.created = data.threadcreated;
                delete data.threadcreated;
            }
            res.status(200)
                .json(data);
        })
            .catch(function (e) {
            console.log(e);
            res.status(404)
                .end();
        });
    };
    PostRouter.prototype.init = function () {
        this.router.post('/:id/details', this.changePostDetails);
        this.router.get('/:id/details', this.getPostDetails);
    };
    return PostRouter;
}());
exports.PostRouter = PostRouter;
var postRoutes = new PostRouter();
postRoutes.init();
exports.default = postRoutes.router;
//# sourceMappingURL=postRouter.js.map