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
        var isForum = req.query.related !== undefined && req.query.related.includes('forum');
        var isUser = req.query.related !== undefined && req.query.related.includes('user');
        var isThread = req.query.related !== undefined && req.query.related.includes('thread');
        db.posts.details({
            id: +req.params.id,
            conditionalForum: isForum ? "\n        json_build_object(\n          'posts', f.posts_count,\n          'slug', p.forum_slug,\n          'threads', f.threads_count,\n          'title', f.title,\n          'user', f.user_nickname) as forum,\n      " : '',
            conditionalAuthor: isUser ? "\n        json_build_object(\n          'about', u.about,\n          'email', u.email,\n          'fullname', u.fullname,\n          'nickname', p.author_nickname) as author,\n      " : '',
            // Поправить счетчики голосов постов и веток
            conditionalThread: isThread ? ",\n        json_build_object(\n          'author', t.author_nickname,\n          'forum', p.forum_slug,\n          'id', p.thread_id,\n          'message', t.message,\n          'slug', p.thread_slug,\n          'title', t.title,\n          'votes', t.votes\n           ) as thread, t.created as threadcreated\n      " : '',
            conditionalJoinThread: isThread ? "\n        inner join thread t on p.thread_id=t.id\n      " : '',
            conditionalJoinAuthor: isUser ? "\n        inner join \"user\" u on p.author_id=u.id\n      " : '',
            conditionalJoinForum: isForum ? "\n        inner join forum f on p.forum_id=f.id\n      " : ''
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