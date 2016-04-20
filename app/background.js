// This is main process of Electron, started as first thing when your
// app starts. This script is running through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

import {app, Menu} from "electron";
import {devMenuTemplate} from "./helpers/dev_menu_template";
import {editMenuTemplate} from "./helpers/edit_menu_template";
import createWindow from "./helpers/window";
import env from "./env";

// Special module holding environment variables which you declared
// in config/env_xxx.json file.

var mainWindow;

var setApplicationMenu = function () {
    var menus = [editMenuTemplate];
    if (env.name !== 'production') {
        menus.push(devMenuTemplate);
    }
    Menu.setApplicationMenu(Menu.buildFromTemplate(menus));
};

app.on('will-finish-launching', function () {

});

app.on('open-file', function (e, path) {
    if (!mainWindow) {
        // first time open, pass over to ready
        global.initialOpenFilePath = path;
    } else {
        mainWindow.webContents.send('open-file', {path: path});
    }

    e.preventDefault();
});

app.on('ready', function () {
    setApplicationMenu();

    mainWindow = createWindow('main', {
        width: 1000,
        height: 600
    });

    mainWindow.loadURL('file://' + __dirname + '/app.html');

    if (env.name !== 'production') {
        mainWindow.openDevTools();
    }

    if (typeof global.initialOpenFilePath !== 'undefined') {
        mainWindow.webContents.send('open-file', {path: global.initialOpenFilePath});
    }
});

app.on('window-all-closed', function () {
    app.quit();
});
