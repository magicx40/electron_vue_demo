// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { contextBridge, ipcRenderer } = require('electron')
import { DIALOG_OPENFILE, FS_READFILES } from '../ipcApi/ipcApiMap'
import { renameByPath } from '../ipcApi'
window.addEventListener('DOMContentLoaded', () => {

});

contextBridge.exposeInMainWorld('electronAPI', {
    openFile: () => ipcRenderer.invoke(DIALOG_OPENFILE),
    readFilesInDir: (dirPath: String) => ipcRenderer.invoke(FS_READFILES, dirPath),
    rename: (pathArr: Array<Record<string, any>>) => renameByPath(pathArr)
});