const isDev = require('electron-is-dev')
const path = require('path')
const prepareNext = require('electron-next')

const {
  app,
  BrowserWindow,
} = require('electron')

let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    },
  })

  const devPath = 'http://localhost:8000/game'
  const prodPath = path.resolve('renderer/out/game/index.html')
  const entry = isDev ? devPath : 'file://' + prodPath

  mainWindow.loadURL(entry)
  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', async () => {
  await prepareNext('./renderer')
  createWindow()
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})
