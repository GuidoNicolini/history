const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const url = require('url');

app.commandLine.appendSwitch('no-sandbox');

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    title: 'Happy City',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.setMenu(null);


  // Carga el archivo index.html generado por Angular
  win.loadURL(
    url.format({
      pathname: path.join(__dirname, 'dist/framework/browser/index.html'),
      protocol: 'file:',
      slashes: true
    })
  );

  // Redirigir links con target="_blank" al navegador por defecto del usuario
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Abre las herramientas de desarrollo (opcional)
  // win.webContents.openDevTools();

  win.on('closed', () => {
    win = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});
