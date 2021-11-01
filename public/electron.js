const {app, BrowserWindow} = require('electron');
const path = require('path');
const isDev = false;
const isMac = false;

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 700,
        minWidth: 1000,
        minHeight: 700,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: true,
        },
        icon: path.join(__dirname, isMac ? '../icon.icns' : '../icon.ico')
    });

    mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);

    // mainWindow.webContents.openDevTools();

    mainWindow.on('closed', () => {
        mainWindow = null
    });

    mainWindow.setMenu(null);
}

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
    app.quit();
} else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.focus();
        }
    })

    app.whenReady().then(createWindow);
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('before-quit', () => {
    mainWindow.removeAllListeners('close');
    mainWindow.close();
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});
