// Here is the starting point for your application code.
// All stuff below is just to show you how it works. You can delete all of it.

// Use new ES6 modules syntax for everything.
import {remote} from "electron";
import jetpack from "fs-jetpack";
import env from "./env";
import fs from "fs";
import commonmark from "commonmark"; // native node.js module

console.log('Loaded environment variables:', env);

var app = remote.app;
var appDir = jetpack.cwd(app.getAppPath());

// Holy crap! This is browser window with HTML and stuff, but I can read
// here files like it is node.js! Welcome to Electron world :)
console.log('The author of this app is:', appDir.read('package.json', 'json').author);

document.addEventListener('DOMContentLoaded', function () {
    document.body.addEventListener('dragover', function (e) {
        e.preventDefault();

        // console.log('dragover', e.target);

        if (!document.body.classList.contains('incoming-file')) {
            document.body.classList.add('incoming-file');
        }
    });

    document.body.addEventListener('dragleave', function (e) {
        e.preventDefault();

        // console.log('dragleave', e.target);

        if (e.target.classList.contains('dropzone-mask')) {
            document.body.classList.remove('incoming-file');
        }
    });

    var watchingFilePath = null;

    document.body.addEventListener('drop', function (e) {
        e.preventDefault();

        if (document.body.classList.contains('incoming-file')) {
            document.body.classList.remove('incoming-file');
        }

        var file = e.dataTransfer.files[0];

        console.log('File dragged:', file.path);

        if (watchingFilePath !== null && watchingFilePath !== file.path) {
            fs.unwatchFile(watchingFilePath);
        }

        fs.watchFile(file.path, function (curr, prev) {
            if (curr.mtime !== prev.mtime) {
                renderMarkdownFile(file.path, true);
            }
        });

        renderMarkdownFile(file.path);
    });
});

function renderMarkdownFile(path, isReload = true) {
    var reader = new commonmark.Parser();
    var writer = new commonmark.HtmlRenderer();
    var parsed = reader.parse(fs.readFileSync(path, {encoding: 'UTF-8'})); // parsed is a 'Node' tree
    var result = writer.render(parsed); // result is a String
    var webContainer = document.getElementById('rendered');

    if (isReload) {
        var previousResult = webContainer.innerHTML;
    }

    webContainer.innerHTML = result;
}
