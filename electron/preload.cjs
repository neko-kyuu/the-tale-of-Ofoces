const { contextBridge, ipcRenderer } = require('electron')

// 通过 contextBridge 暴露 API
contextBridge.exposeInMainWorld('electronAPI', {
  saveFile: (data) => ipcRenderer.invoke('saveFile', data),
  readJsonFile: (filePath) => ipcRenderer.invoke('readJsonFile', filePath),
  updateCharacter: (data) => ipcRenderer.invoke('updateCharacter', data),
  test: () => console.log('electron bridge is working')
})

window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector)
        if (element) element.innerText = text
    }

    for (const dependency of ['chrome', 'node', 'electron']) {
        replaceText(`${dependency}-version`, process.versions[dependency])
    }
})

console.log('Preload script is running')