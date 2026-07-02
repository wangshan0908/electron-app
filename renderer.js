// const information = document.getElementById('info')
// information.innerText = `本应用正在使用 Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), 和 Electron (v${versions.electron()})`
// // script.js

// const btnPing = async () => {
//     console.log('ping')
//     const result = await window.versions2.ping()
//     console.log(result)
// }

// document.getElementById("pingBtn").addEventListener("click", btnPing);
// render.js
window.onload = async () => {
  const memoryWrap = document.getElementById('memoryInfo')
  const diskWrap = document.getElementById('diskList')

  const formatBytes = bytes => (bytes / 1024 / 1024 / 1024).toFixed(2)

  try {
    const memory = await window.electronAPI.getMemoryInfo()
    const memoryDiv = document.createElement('div')
    memoryDiv.className = 'memory-item'
    memoryDiv.innerHTML = `
      <p>总内存：${formatBytes(memory.total)} GB</p>
      <p>已用：${formatBytes(memory.used)} GB | 空闲：${formatBytes(memory.free)} GB</p>
      <div class="bar-box">
        <div class="bar-used"></div>
      </div>
      <p>系统内存占用率：${memory.percent}%</p>
      <p>进程内存：RSS ${formatBytes(memory.processMemory.rss)} GB，堆已用 ${formatBytes(memory.processMemory.heapUsed)} GB</p>
    `
    // 动态给进度条设置宽度，替代 style="width:xx%"
    const bar = memoryDiv.querySelector('.bar-used')
    bar.style.width = `${memory.percent}%`
    memoryWrap.appendChild(memoryDiv)
  } catch (e) {
    memoryWrap.innerHTML = `<p id="error-tip">读取内存失败：${e.message}</p>`
    document.getElementById('error-tip').style.color = 'red'
  }

  try {
    const disks = await window.electronAPI.getDiskInfo()
    disks.forEach(disk => {
      const div = document.createElement('div')
      div.className = 'disk-item'
      // 删掉所有行内 style=""
      div.innerHTML = `
        <h3>分区：${disk.name}</h3>
        <p>总容量：${disk.totalGB} GB | 已使用：${disk.usedGB} GB | 剩余：${disk.freeGB} GB</p>
        <div class="bar-box">
          <div class="bar-used"></div>
        </div>
        <p>占用率：${disk.useRate}%</p>
      `
      // 动态给进度条设置宽度，替代 style="width:xx%"
      const bar = div.querySelector('.bar-used')
      bar.style.width = `${disk.useRate}%`

      diskWrap.appendChild(div)
    })
  } catch (e) {
    diskWrap.innerHTML = `<p id="error-tip">读取磁盘失败：${e.message}</p>`
    document.getElementById('error-tip').style.color = 'red'
  }
}
