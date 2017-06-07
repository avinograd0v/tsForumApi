/**
 * Created by andreivinogradov on 13.03.17.
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var _a = require('../db'), db = _a.db, pgp = _a.pgp;
var ForumRouter = (function () {
    function ForumRouter() {
        this.router = express_1.Router();
        this.init();
    }
    ForumRouter.prototype.createForum = function (req, res, next) {
        db.forums.checkAuthorExistance(req.body.user)
            .then(function (user) {
            return db.forums.create({
                slug: req.body.slug,
                title: req.body.title,
                userID: user.id,
                name: user.nickname
            });
        })
            .then(function (data) {
            res.status(data.action === 'updated' ? 409 : 201)
                .json({
                slug: data.slug,
                title: data.title,
                user: data.user
            });
        })
            .catch(function (e) {
            console.log(e);
            res.status(404)
                .end();
        });
    };
    ForumRouter.prototype.createThread = function (req, res, next) {
        db.threads.checkAuthorOrForumExistance(req.body.author, req.params.slug)
            .then(function (fu) {
            return db.threads.create({
                authorId: fu[0].id,
                authorNickname: fu[0].title,
                forumId: fu[1].id,
                forumSlug: fu[1].title,
                created: req.body.created,
                message: req.body.message,
                slug: req.body.slug,
                title: req.body.title
            });
        })
            .then(function (data) {
            var code;
            if (data.action === 'updated') {
                code = 409;
            }
            else {
                db.forums.addToCounter(data.forum_id);
                db.threads.addToUserForumRelations({ forum_id: data.forum_id, user_id: data.author_id });
                code = 201;
            }
            res.status(code)
                .json({
                slug: data.slug,
                title: data.title,
                author: data.author_nickname,
                id: data.id,
                message: data.message,
                forum: data.forum_slug,
                created: data.created
            });
        })
            .catch(function (e) {
            console.log(e);
            res.status(404)
                .end();
        });
    };
    ForumRouter.prototype.getForumDetails = function (req, res, next) {
        db.forums.details(req.params.slug)
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
    ForumRouter.prototype.getForumThreads = function (req, res, next) {
        db.forums.checkForumExistance(req.params.slug)
            .then(function (fm) {
            return db.forums.threads({
                slug: fm.slug,
                fID: fm.id,
                conditionalLimit: req.query.limit === undefined ? '' : "limit " + req.query.limit,
                conditionalSince: req.query.since === undefined ? '' : "and t.created \n          " + (req.query.desc === 'true' ? '<=' : '>=') + " '" + req.query.since + "'",
                orderCondition: req.query.desc === 'true' ? 'desc' : 'asc'
            });
        })
            .then(function (data) {
            res.status(200)
                .json(data)
                .end();
        })
            .catch(function (e) {
            console.log(e);
            res.status(404)
                .end();
        });
    };
    ForumRouter.prototype.getForumUsers = function (req, res, next) {
        db.forums.checkForumExistance(req.params.slug)
            .then(function (fm) {
            return db.forums.users({
                fID: fm.id,
                conditionalLimit: req.query.limit === undefined ? '' : "limit " + req.query.limit,
                conditionalSince: req.query.since === undefined ? '' : "\n             and u.nickname " + (req.query.desc === 'true' ? '<' : '>') + "\n             '" + req.query.since + "'::citext\n          ",
                orderCondition: req.query.desc === 'true' ? 'desc' : 'asc'
            });
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
    ForumRouter.prototype.init = function () {
        this.router.post('/create', this.createForum);
        this.router.post('/:slug/create', this.createThread);
        this.router.get('/:slug/details', this.getForumDetails);
        this.router.get('/:slug/threads', this.getForumThreads);
        this.router.get('/:slug/users', this.getForumUsers);
    };
    return ForumRouter;
}());
exports.ForumRouter = ForumRouter;
var forumRoutes = new ForumRouter();
forumRoutes.init();
exports.default = forumRoutes.router;
//# sourceMappingURL=forumRouter.js.map