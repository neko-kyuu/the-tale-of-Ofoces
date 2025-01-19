// 从 'electron' 模块中导入所需的类和函数
import { app, BrowserWindow, Tray, Menu, ipcMain } from 'electron';
// 从 'path' 模块中导入 'path'，用于处理文件和目录路径
import path from 'path';
// 从 'url' 模块中导入 'fileURLToPath'，用于将 file URL 转换为路径
import { fileURLToPath } from 'url';
import fs from 'fs';


// 定义 __filename 和 __dirname，用于获取当前文件的路径和目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootPath = path.join(__dirname, '..');

// 创建应用程序的主窗口
function createWindow() {
    const win = new BrowserWindow({
      width: 1200,
      height: 800,
      icon: path.join(__dirname, '../electron/img/icons8-butterfly-100.png'), // 窗口图标
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: true,
        preload: path.join(__dirname, '../electron/preload.cjs')
      }
    })
  
    // 自动打开开发者工具
    win.webContents.openDevTools()
  
    // 开发环境下连接 vite 服务器
    if (process.env.VITE_DEV_SERVER_URL) {
      win.loadURL(process.env.VITE_DEV_SERVER_URL)
    } else {
      // 生产环境下加载打包后的文件
      win.loadFile(path.join(__dirname, '../dist/index.html'))
    }
  }
 
// function createTray() {
//   const menubarPic = process.platform === 'darwin' ? 
//     path.join(__dirname, '../electron/img/favicon.icns') : 
//     path.join(__dirname, '../electron/img/favicon.png')
//   const tray = new Tray(menubarPic)
//   const contextMenu = Menu.buildFromTemplate([
//     { label: '退出', click: () => app.quit() }
//   ])
//   tray.setContextMenu(contextMenu)
// }
// 当 Electron 初始化完成时，调用 createWindow 和 createTray 函数
app.whenReady().then(() => {
  createWindow(); // 创建主窗口
  // createTray(); // 创建托盘图标

  // 当应用被激活时（例如，点击应用图标或从其他窗口切换回来）
  app.on('activate', () => {
    // 如果没有打开的窗口，则创建一个新的窗口
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
  
  app.dock.setIcon(path.join(__dirname, '../electron/img/icons8-butterfly-100.png'))
});

// 当所有窗口都关闭时，退出应用程序（除非是在 macOS 上）
app.on('window-all-closed', () => {
  // 在 macOS 上，通常应用会保持活跃，直到用户明确退出
  if (process.platform !== 'darwin') {
    app.quit(); // 退出应用程序
  }
});

ipcMain.handle('saveFile', async (event, { filePath, content }) => {
  try {
    // 从 /static/md/xxx.md 转换为实际的文件路径
    const relativePath = filePath.replace('/static/', '/public/static/')
    const absolutePath = path.join(rootPath, relativePath)
    
    console.log('保存路径:', absolutePath) // 调试用
    
    // 检查文件是否存在
    if (!fs.existsSync(absolutePath)) {
      return { 
        success: false, 
        error: `未找到文件路径: ${absolutePath}` 
      }
    }
    
    // 保存文件
    await fs.promises.writeFile(absolutePath, content, 'utf8')
    return { success: true }
    
  } catch (error) {
    console.error('保存文件失败:', error)
    throw error
  }
})
 
