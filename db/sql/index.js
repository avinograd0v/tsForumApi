"use strict";
/**
 * Created by andreivinogradov on 13.03.17.
 */
var pg_promise_1 = require("pg-promise");
var path = require("path");
function sql(file) {
    var fullPath = path.join(__dirname, file);
    var options = {
        minify: true,
        params: {
            schema: 'public'
        }
    };
    var qf = new pg_promise_1.QueryFile(fullPath, options);
    if (qf.error) {
        console.error(qf.error);
    }
    return qf;
}
module.exports = {
    users: {
        create: sql('users/create.sql'),
        profile: sql('users/profile.sql'),
        update: sql('users/update.sql')
    },
    forums: {
        create: sql('forums/create.sql'),
        details: sql('forums/details.sql'),
        threads: sql('forums/threads.sql'),
        users: sql('forums/users.sql')
    },
    threads: {
        create: sql('threads/create.sql'),
        details: sql('threads/details.sql'),
        update: sql('threads/update.sql'),
        vote: sql('threads/vote.sql'),
        posts: sql('threads/posts.sql'),
        tree: sql('threads/tree.sql'),
        parentTree: sql('threads/parenttree.sql')
    },
    posts: {
        details: sql('posts/details.sql'),
        update: sql('posts/update.sql'),
        create: sql('posts/create.sql')
    },
    services: {
        clear: sql('services/clear.sql'),
        status: sql('services/status.sql')
    }
};
//# sourceMappingURL=index.js.map