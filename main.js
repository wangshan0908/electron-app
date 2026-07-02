const { app, BrowserWindow, ipcMain } = require('electron');
const registerIpc = require('./ipcRegister')

// 启动时一次性注册全部IPC
registerIpc()
const createWindow = ()=>{
    const win = new BrowserWindow({width:1200,height:600,webPreferences:{preload:`${__dirname}/preload.js`}})
    win.loadFile('index.html')
    win.webContents.openDevTools()
}

app.whenReady().then(()=>{
    createWindow()
})

app.on('window-all-closed',()=>{
    if(process.platform !== 'darwin'){
        app.quit()
    }
})
