import {
  app,
  BrowserWindow,
} from 'electron'
import isDevelopment from 'electron-is-dev'
import path from 'path'
import url from 'url'

let mainWindow = null

const createMainWindow = () => {
  const window = new BrowserWindow()

  if (isDevelopment) {
    window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`)
  } else {
    window.loadURL(url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file',
      slashes: true
    }))
  }

  window.on('closed', () => mainWindow = null)

  return window
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    mainWindow = createMainWindow()
  }
})

app.on('ready', () => mainWindow = createMainWindow())
