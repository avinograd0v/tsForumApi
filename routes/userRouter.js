/**
 * Created by andreivinogradov on 13.03.17.
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var _a = require('../db'), db = _a.db, pgp = _a.pgp;
var UserRouter = (function () {
    function UserRouter() {
        this.router = express_1.Router();
        this.init();
    }
    UserRouter.prototype.createUser = function (req, res, next) {
        db.users.create({
            nickname: req.params.nickname,
            email: req.body.email,
            fullname: req.body.fullname,
            about: req.body.about
        })
            .then(function (data) {
            if (data[0].action === 'updated') {
                delete data[0].action;
                res.status(409)
                    .json(data);
            }
            else {
                delete data[0].action;
                res.status(201)
                    .json(data[0]);
            }
            // res.status(data.action === 'updated' ? 409 : 201)
            //   .json(data)
        });
    };
    UserRouter.prototype.getProfile = function (req, res, next) {
        db.users.profile(req.params.nickname)
            .then(function (data) {
            res.status(200)
                .json(data);
        })
            .catch(function (e) {
            res.status(404)
                .end();
        });
    };
    UserRouter.prototype.changeProfile = function (req, res, next) {
        db.users.checkExistanceErrors(req.params.nickname, req.body.email)
            .then(function () {
            return db.users.update({
                nickname: req.params.nickname,
                about: req.body.about,
                email: req.body.email,
                fullname: req.body.fullname
            });
        })
            .then(function (data) {
            res.status(200)
                .json(data);
        })
            .catch(function (e) {
            console.log(e);
            res.status(e.message === 'notfound' ? 404 : 409)
                .end();
        });
    };
    UserRouter.prototype.init = function () {
        this.router.post('/:nickname/create', this.createUser);
        this.router.get('/:nickname/profile', this.getProfile);
        this.router.post('/:nickname/profile', this.changeProfile);
    };
    return UserRouter;
}());
exports.UserRouter = UserRouter;
var userRoutes = new UserRouter();
userRoutes.init();
exports.default = userRoutes.router;
//# sourceMappingURL=userRouter.js.map