/**
 * Created by andreivinogradov on 13.03.17.
 */
"use strict";
var users = require("./repos/users");
var forums = require("./repos/forums");
var threads = require("./repos/threads");
var posts = require("./repos/posts");
var services = require("./repos/services");
var pgPromise = require("pg-promise");
var diag = require("./diagnostics");
var options = {
    extend: function (obj) {
        obj.users = new users.Repository(obj, pgp);
        obj.forums = new forums.Repository(obj, pgp);
        obj.threads = new threads.Repository(obj, pgp);
        obj.posts = new posts.Repository(obj, pgp);
        obj.services = new services.Repository(obj, pgp);
    }
};
var config = {
    host: 'localhost',
    port: 5432,
    database: 'docker',
    user: 'docker',
    password: 'docker'
};
var pgp = pgPromise(options);
pgp.pg.defaults.poolSize = 20;
var db = pgp(config);
diag.init(options);
module.exports = { db: db, pgp: pgp };
//# sourceMappingURL=index.js.map