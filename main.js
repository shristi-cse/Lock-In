const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
app.commandLine.appendSwitch('force-device-scale-factor', '1');

function createWindow()
{
    const win = new BrowserWindow({
        width:296,
        height:410,
        resizable: false,
        maximizable: false,
        fullscreen: false,
        frame:false,

        icon: path.join(__dirname, 'assets', 'icons', 'app-icon.png'),

        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });
    win.webContents.setZoomFactor(1);
    win.webContents.setVisualZoomLevelLimits(1, 1);
    win.loadFile('index.html');

    win.webContents.on('before-input-event',(event, input)=>{
      if(
        (input.control || input.meta) &&
        input.key.toLowerCase() === 'r'
      ) {
        event.preventDefault();
      }
    });
}

ipcMain.on('close-window', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);

  if (win) {
    win.close();
  }
});

app.whenReady().then(createWindow)