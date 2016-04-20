// Here is the starting point for your application code.
// All stuff below is just to show you how it works. You can delete all of it.

// Use new ES6 modules syntax for everything.
import {remote, ipcRenderer} from "electron";
import jetpack from "fs-jetpack";
import env from "./env";
import {watch} from "./previewer/watcher";
import {render} from "./previewer/renderer";

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

    document.body.addEventListener('drop', function (e) {
        e.preventDefault();

        if (document.body.classList.contains('incoming-file')) {
            document.body.classList.remove('incoming-file');
        }

        var file = e.dataTransfer.files[0];

        console.log('File dragged:', file.path);

        watch(file.path, function (path, isReload) {
            document.getElementById('rendered').innerHTML = render(path);
        });
    });
});

ipcRenderer.on('open-file', function (e, file) {
    console.log('File opened:', file.path);

    watch(file.path, function (path, isReload) {
        if (document.body.classList.contains('incoming-file')) {
            document.body.classList.remove('incoming-file');
        }
        document.getElementById('rendered').innerHTML = render(path);
    });
});
