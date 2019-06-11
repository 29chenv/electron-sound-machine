'use strict';

const {app,ipcMain,BrowserWindow,globalShortcut} = require('electron');


var mainWindow = null;

//
var configuration = require('./configuration');

app.on('ready', function() {
    if (!configuration.readSettings('shortcutKeys')) {
        configuration.saveSettings('shortcutKeys', ['ctrl', 'shift']);
    }

    mainWindow = new BrowserWindow({
        frame: false,
        height: 700,
        resizable: false,
        width: 368,
        //不引入前台require会报错
        webPreferences: {
            nodeIntegration: true
        }
    });
    // mainWindow.webContents.openDevTools();
    mainWindow.loadFile('app/index.html');
    setGlobalShortcuts();
});

function setGlobalShortcuts() {
    globalShortcut.unregisterAll();

    var shortcutKeysSetting = configuration.readSettings('shortcutKeys');
    var shortcutPrefix = shortcutKeysSetting.length === 0 ? '' : shortcutKeysSetting.join('+') + '+';

    globalShortcut.register(shortcutPrefix + '1', function () {
        mainWindow.webContents.send('global-shortcut', 0);
    });
    globalShortcut.register(shortcutPrefix + '2', function () {
        mainWindow.webContents.send('global-shortcut', 1);
    });
}


ipcMain.on('close-main-window', function () {
    app.quit();
});

var settingsWindow = null;
//
ipcMain.on('open-settings-window', function () {
    if (settingsWindow) {
        return;
    }

    settingsWindow = new BrowserWindow({
        frame: false,
        height: 200,
        resizable: false,
        width: 200,
        // width: 800,
        webPreferences: {
            nodeIntegration: true
        }
    });
    // settingsWindow.webContents.openDevTools();

    settingsWindow.loadFile('app/settings.html');

    settingsWindow.on('closed', function () {
        settingsWindow = null;
    });
});
//关闭设置窗口
ipcMain.on('close-settings-window', function () {
    if (settingsWindow) {
        settingsWindow.close();
    }
});
//设置快捷键
ipcMain.on('set-global-shortcuts', function () {
    setGlobalShortcuts();
});