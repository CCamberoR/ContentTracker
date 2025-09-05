const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

let mainWindow;

function createWindow() {
  // Crear la ventana principal
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    },
    icon: path.join(__dirname, 'frontend/assets/images/icon.png'), // Opcional: añade un icono
    show: false // No mostrar hasta que esté listo
  });

  // Cargar la aplicación
  if (isDev) {
    // En desarrollo, puedes cargar localhost si tienes un servidor web
    mainWindow.loadFile('frontend/pages/index.html');
    mainWindow.webContents.openDevTools(); // Abrir DevTools en desarrollo
  } else {
    // En producción
    mainWindow.loadFile('frontend/pages/index.html');
  }

  // Mostrar cuando esté listo
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Manejar el cierre de la ventana
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Este método se ejecuta cuando Electron ha terminado la inicialización
app.whenReady().then(createWindow);

// Salir cuando todas las ventanas estén cerradas
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
