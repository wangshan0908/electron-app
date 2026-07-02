const { exec } = require('child_process')
const os = require('os')

/**
 * 获取所有磁盘分区信息
 * @returns Promise<Array>
 */
function getDiskInfo() {
  return new Promise((resolve, reject) => {
    const platform = os.platform()
    let cmd = ''
    const diskList = []

    // Windows系统：wmic读取逻辑盘
    if (platform === 'win32') {
      cmd = 'wmic logicaldisk get size,freespace,caption'
      exec(cmd, (err, stdout) => {
        if (err) return reject(err)
        const lines = stdout.trim().split('\r\r\n').filter(line => line.trim())
        // 跳过表头
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim().split(/\s+/)
          const letter = line[0]
          const free = BigInt(line[1] || 0)
          const total = BigInt(line[2] || 0)
          if (!total || total === 0n) continue

          const used = total - free
          const format = (num) => (Number(num) / 1024 / 1024 / 1024).toFixed(2)
          diskList.push({
            name: letter,
            totalGB: format(total),
            freeGB: format(free),
            usedGB: format(used),
            useRate: ((Number(used) / Number(total)) * 100).toFixed(1)
          })
        }
        resolve(diskList)
      })
    }

    // MacOS
    else if (platform === 'darwin') {
      cmd = 'df -g'
      exec(cmd, (err, stdout) => {
        if (err) return reject(err)
        const lines = stdout.trim().split('\n')
        for (let i = 1; i < lines.length; i++) {
          const arr = lines[i].split(/\s+/)
          const total = parseFloat(arr[1])
          const used = parseFloat(arr[2])
          const free = parseFloat(arr[3])
          const mount = arr[8]
          if (total <= 0) continue
          diskList.push({
            name: mount,
            totalGB: total.toFixed(2),
            freeGB: free.toFixed(2),
            usedGB: used.toFixed(2),
            useRate: ((used / total) * 100).toFixed(1)
          })
        }
        resolve(diskList)
      })
    }

    // Linux
    else if (platform === 'linux') {
      cmd = 'df -BG'
      exec(cmd, (err, stdout) => {
        if (err) return reject(err)
        const lines = stdout.trim().split('\n')
        for (let i = 1; i < lines.length; i++) {
          const arr = lines[i].split(/\s+/)
          const total = parseFloat(arr[1])
          const used = parseFloat(arr[2])
          const free = parseFloat(arr[3])
          const mount = arr[5]
          if (total <= 0) continue
          diskList.push({
            name: mount,
            totalGB: total.toFixed(2),
            freeGB: free.toFixed(2),
            usedGB: used.toFixed(2),
            useRate: ((used / total) * 100).toFixed(1)
          })
        }
        resolve(diskList)
      })
    }
  })
}

module.exports = {
  getDiskInfo
}
