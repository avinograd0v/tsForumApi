"use strict";
/**
 * Created by andreivinogradov on 13.03.17.
 */
var os = require("os");
var fs = require("fs");
var pgMonitor = require("pg-monitor");
pgMonitor.setTheme('matrix');
var $DEV = process.env.NODE_ENV === 'development';
var logFile = './db/errors.log';
pgMonitor.setLog(function (msg, info) {
    if (info.event === 'error') {
        var logText = os.EOL + msg;
        if (info.time) {
            logText = os.EOL + logText;
        }
        fs.appendFileSync(logFile, logText);
    }
    if (!$DEV) {
        info.display = false;
    }
});
var attached = false;
module.exports = {
    init: function (options) {
        if (attached) {
            return;
        }
        attached = true;
        if ($DEV) {
            pgMonitor.attach(options);
        }
        else {
            pgMonitor.attach(options, ['error']);
        }
    },
    done: function () {
        if (attached) {
            attached = false;
            pgMonitor.detach();
        }
    }
};
//# sourceMappingURL=diagnostics.js.map