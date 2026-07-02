const os = require('os')

function getMemoryInfo() {
  const total = os.totalmem()
  const free = os.freemem()
  const used = total - free
  return {
    total,
    free,
    used,
    percent: Math.round((used / total) * 100),
    processMemory: process.memoryUsage()
  }
}

module.exports = {
  getMemoryInfo
}
