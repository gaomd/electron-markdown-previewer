import fs from "fs";

var watchingFilePath = null;

export var watch = function (path, callback) {
    if (watchingFilePath !== null && watchingFilePath !== path) {
        fs.unwatchFile(watchingFilePath);
    }

    fs.watchFile(path, function (curr, prev) {
        if (curr.mtime !== prev.mtime) {
            callback(path, true);
        }
    });

    callback(path);
};
