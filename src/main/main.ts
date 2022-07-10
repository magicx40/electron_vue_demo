// Modules to control application life and create native browser window
const { app, BrowserWindow, protocol, ipcMain, dialog } = require('electron')
const path = require('path')
import { readdir } from 'fs/promises';
import { DIALOG_OPENFILE, FS_READFILES } from '../ipcApi/ipcApiMap';

function createWindow() {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    // and load the index.html of the app.
    if (process.env.npm_lifecycle_event === 'electron:dev') {
        mainWindow.loadURL('http://localhost:3000')
        // Open the DevTools.
        mainWindow.webContents.openDevTools()
    } else {
        mainWindow.loadFile('./dist/index.html')
    }

}

async function handleFileOpen() {
    const { canceled, filePaths } = await dialog.showOpenDialog({ properties: ['openDirectory'] });
    if (canceled) {
        return
    } else {
        return filePaths[0];
    }
}

async function handleReadFiles(event, filePath) {
    console.log('filePath:', filePath);
    let filesArr = [];
    try {
        const files = await readdir(filePath, { withFileTypes: true });
        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            let fileFullPath = path.join(filePath, file.name);
            if (file.isFile()) {
                filesArr.push(fileFullPath);
            }
        }
    } catch (error) {
        console.log('error:',error);
        return;
    }
    console.log('filesArr:', filesArr);
    return filesArr;
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow()
    // 注册自定义协议，拦截现有协议的请求
    protocol.registerFileProtocol('atom', (request, callback) => {
        const url = request.url.substr(7)
        callback(decodeURI(path.normalize(url)))
    })

    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })

    ipcMain.handle(DIALOG_OPENFILE, handleFileOpen)
    ipcMain.handle(FS_READFILES, handleReadFiles)
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.