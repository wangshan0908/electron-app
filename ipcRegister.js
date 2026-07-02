const ipcMain = require('electron').ipcMain
const { getDiskInfo } = require('./services/diskService')
const { getMemoryInfo } = require('./services/memService')
// 统一注册所有IPC
function registerIpc() {

  ipcMain.handle('get-disk-info', getDiskInfo)
  ipcMain.handle('get-memory-info', getMemoryInfo)
}

module.exports = registerIpc
