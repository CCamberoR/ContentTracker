const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

let mainWindow;
let loginWindow;
let db;

// Manejo de errores no capturados
process.on('uncaughtException', (error) => {
  console.error('Error no capturado:', error);
  // No cerrar la aplicación, solo loggear el error
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Promise rechazada no manejada:', reason);
  console.error('En promise:', promise);
});

// Inicializar base de datos SQLite
function initializeDatabase() {
  const dbPath = path.join(__dirname, 'ContentTracker_database.db');
  
  db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Error abriendo base de datos:', err.message);
      return;
    }
    console.log('Conectado a la base de datos SQLite');
  });
  
  // Verificar que las tablas existan
  db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='resources'", (err, row) => {
    if (err) {
      console.error('Error verificando tabla resources:', err.message);
    } else if (row) {
      console.log('Tabla resources encontrada');
    } else {
      console.warn('Tabla resources no encontrada en la base de datos');
    }
  });
  
  db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='users'", (err, row) => {
    if (err) {
      console.error('Error verificando tabla users:', err.message);
    } else if (row) {
      console.log('Tabla users encontrada');
    } else {
      console.warn('Tabla users no encontrada en la base de datos');
    }
  });
}

function createWindow() {
  // Crear ventana de login primero
  createLoginWindow();
}

function createLoginWindow() {
  loginWindow = new BrowserWindow({
    width: 500,
    height: 650,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    resizable: true,  // Permitir redimensionar
    center: true,
    autoHideMenuBar: true,
    title: 'Brújula de Conocimiento - Acceso',
    maximizable: true,  // Permitir maximizar
    minimizable: true   // Permitir minimizar
  });

  loginWindow.loadFile('login.html');

  // Solo abrir DevTools manualmente si es necesario
  // if (isDev) {
  //   loginWindow.webContents.openDevTools();
  // }

  loginWindow.on('closed', () => {
    console.log('Ventana de login cerrada');
    loginWindow = null;
    // Si se cierra login sin autenticar, cerrar toda la app
    if (!mainWindow) {
      if (db) {
        db.close((err) => {
          if (err) {
            console.error('Error cerrando base de datos:', err.message);
          } else {
            console.log('Base de datos cerrada correctamente');
          }
          app.quit();
        });
      } else {
        app.quit();
      }
    }
  });
}

function createMainWindow() {
  // Crear la ventana principal
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    show: false, // No mostrar hasta que esté listo
    title: 'Mi Brújula de Conocimiento',
    resizable: true,    // Permitir redimensionar
    maximizable: true,  // Permitir maximizar
    minimizable: true,  // Permitir minimizar
    autoHideMenuBar: true
  });

  // Cargar la aplicación
  if (isDev) {
    // En desarrollo, cargar el index.html principal
    mainWindow.loadFile('index.html');
    // Solo abrir DevTools manualmente si es necesario
    // mainWindow.webContents.openDevTools();
  } else {
    // En producción
    mainWindow.loadFile('index.html');
  }

  // Mostrar cuando esté listo
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    
    // Cerrar ventana de login si existe
    if (loginWindow) {
      loginWindow.close();
      loginWindow = null;
    }
  });

  // Manejar el cierre de la ventana
  mainWindow.on('closed', () => {
    console.log('Ventana principal cerrada');
    mainWindow = null;
    if (db) {
      db.close((err) => {
        if (err) {
          console.error('Error cerrando base de datos:', err.message);
        } else {
          console.log('Base de datos cerrada correctamente');
        }
      });
    }
  });
}

// ==============================================
// IPC HANDLERS - Lógica de Backend
// ==============================================

/**
 * Agregar nuevo ítem de contenido
 */
ipcMain.handle('create-content', async (event, itemData) => {
  return new Promise((resolve) => {
    const stmt = db.prepare(`
      INSERT INTO resources (
        title, author, type, start_date, end_date, 
        pages, duration_mins, genre, rating, notes
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      itemData.title,
      itemData.author || null,
      itemData.type,
      itemData.start_date,
      itemData.end_date || null,
      itemData.pages || null,
      itemData.duration_mins || null,
      itemData.genre || null,
      itemData.rating || null,
      itemData.notes || null,
      function(err) {
        if (err) {
          console.error('Error agregando contenido:', err.message);
          resolve({ success: false, error: err.message });
        } else {
          console.log(`Nuevo contenido agregado con ID: ${this.lastID}`);
          resolve({ success: true, id: this.lastID });
        }
      }
    );
  });
});

/**
 * Obtener todos los ítems de contenido
 */
ipcMain.handle('get-all-content', async () => {
  return new Promise((resolve) => {
    db.all(`
      SELECT * FROM resources 
      ORDER BY id DESC
    `, (err, rows) => {
      if (err) {
        console.error('Error obteniendo contenido:', err.message);
        resolve({ success: false, error: err.message });
      } else {
        console.log(`Recuperados ${rows.length} ítems de contenido`);
        resolve({ success: true, data: rows });
      }
    });
  });
});

/**
 * Obtener ítem de contenido por ID
 */
ipcMain.handle('get-content-by-id', async (event, id) => {
  return new Promise((resolve) => {
    db.get(`
      SELECT * FROM resources WHERE id = ?
    `, [id], (err, row) => {
      if (err) {
        console.error('Error obteniendo ítem por ID:', err.message);
        resolve({ success: false, error: err.message });
      } else if (row) {
        console.log(`Ítem encontrado: ${row.title}`);
        resolve({ success: true, data: row });
      } else {
        resolve({ success: false, error: 'Ítem no encontrado' });
      }
    });
  });
});

/**
 * Actualizar ítem de contenido
 */
ipcMain.handle('update-content', async (event, id, updatedItemData) => {
  return new Promise((resolve) => {
    const stmt = db.prepare(`
      UPDATE resources 
      SET title = ?, author = ?, type = ?, start_date = ?, end_date = ?,
          pages = ?, duration_mins = ?, genre = ?, rating = ?, notes = ?
      WHERE id = ?
    `);
    
    stmt.run(
      updatedItemData.title,
      updatedItemData.author || null,
      updatedItemData.type,
      updatedItemData.start_date,
      updatedItemData.end_date || null,
      updatedItemData.pages || null,
      updatedItemData.duration_mins || null,
      updatedItemData.genre || null,
      updatedItemData.rating || null,
      updatedItemData.notes || null,
      id,  // Usar el parámetro id en lugar de updatedItemData.id
      function(err) {
        if (err) {
          console.error('Error actualizando ítem:', err.message);
          resolve({ success: false, error: err.message });
        } else if (this.changes > 0) {
          console.log(`Ítem actualizado: ${updatedItemData.title}`);
          resolve({ success: true });
        } else {
          resolve({ success: false, error: 'Ítem no encontrado para actualizar' });
        }
      }
    );
  });
});

/**
 * Eliminar ítem de contenido
 */
ipcMain.handle('delete-content', async (event, id) => {
  return new Promise((resolve) => {
    db.run(`
      DELETE FROM resources WHERE id = ?
    `, [id], function(err) {
      if (err) {
        console.error('Error eliminando ítem:', err.message);
        resolve({ success: false, error: err.message });
      } else if (this.changes > 0) {
        console.log(`Ítem eliminado con ID: ${id}`);
        resolve({ success: true });
      } else {
        resolve({ success: false, error: 'Ítem no encontrado para eliminar' });
      }
    });
  });
});

// =============================================================================
// BÚSQUEDA Y FILTRADO
// =============================================================================

/**
 * Buscar contenido por texto
 */
ipcMain.handle('search-content', async (event, query) => {
  return new Promise((resolve) => {
    const searchTerm = `%${query.toLowerCase()}%`;
    db.all(`
      SELECT * FROM resources 
      WHERE LOWER(title) LIKE ? 
         OR LOWER(author) LIKE ? 
         OR LOWER(genre) LIKE ?
         OR LOWER(notes) LIKE ?
      ORDER BY start_date DESC
    `, [searchTerm, searchTerm, searchTerm, searchTerm], (err, rows) => {
      if (err) {
        console.error('Error en búsqueda:', err.message);
        resolve({ success: false, error: err.message });
      } else {
        console.log(`Búsqueda "${query}" encontró ${rows.length} resultados`);
        resolve({ success: true, data: rows });
      }
    });
  });
});

/**
 * Filtrar contenido por criterios
 */
ipcMain.handle('filter-content', async (event, filters) => {
  return new Promise((resolve) => {
    let whereClause = 'WHERE 1=1';
    const params = [];
    
    if (filters.type && filters.type !== '') {
      whereClause += ' AND type = ?';
      params.push(filters.type);
    }
    
    if (filters.genre && filters.genre !== '') {
      whereClause += ' AND LOWER(genre) LIKE ?';
      params.push(`%${filters.genre.toLowerCase()}%`);
    }
    
    if (filters.rating && filters.rating > 0) {
      whereClause += ' AND rating >= ?';
      params.push(filters.rating);
    }
    
    if (filters.completed !== undefined) {
      if (filters.completed) {
        whereClause += ' AND end_date IS NOT NULL';
      } else {
        whereClause += ' AND end_date IS NULL';
      }
    }
    
    const query = `SELECT * FROM resources ${whereClause} ORDER BY start_date DESC`;
    
    db.all(query, params, (err, rows) => {
      if (err) {
        console.error('Error en filtrado:', err.message);
        resolve({ success: false, error: err.message });
      } else {
        console.log(`Filtros aplicados, ${rows.length} resultados encontrados`);
        resolve({ success: true, data: rows });
      }
    });
  });
});

// =============================================================================
// ESTADÍSTICAS Y ANALYTICS
// =============================================================================

/**
 * Obtener estadísticas para el dashboard
 */
ipcMain.handle('get-dashboard-stats', async () => {
  return new Promise((resolve) => {
    // Obtener estadísticas en paralelo
    let completed = 0;
    const stats = {};
    
    // Total de ítems
    db.get('SELECT COUNT(*) as total FROM resources', (err, row) => {
      if (err) {
        console.error('Error obteniendo total:', err.message);
        resolve({ success: false, error: err.message });
        return;
      }
      stats.total = row.total;
      if (++completed === 5) finishStats();
    });
    
    // Ítems de este mes
    db.get(`
      SELECT COUNT(*) as count FROM resources 
      WHERE strftime('%Y-%m', start_date) = strftime('%Y-%m', 'now')
    `, (err, row) => {
      if (err) {
        console.error('Error obteniendo mes actual:', err.message);
        resolve({ success: false, error: err.message });
        return;
      }
      stats.thisMonth = row.count;
      if (++completed === 5) finishStats();
    });
    
    // Ítems de esta semana
    db.get(`
      SELECT COUNT(*) as count FROM resources 
      WHERE start_date >= date('now', '-7 days')
    `, (err, row) => {
      if (err) {
        console.error('Error obteniendo semana actual:', err.message);
        resolve({ success: false, error: err.message });
        return;
      }
      stats.thisWeek = row.count;
      if (++completed === 5) finishStats();
    });
    
    // Total de páginas leídas
    db.get(`
      SELECT SUM(pages) as totalPages FROM resources 
      WHERE pages IS NOT NULL
    `, (err, row) => {
      if (err) {
        console.error('Error obteniendo páginas:', err.message);
        resolve({ success: false, error: err.message });
        return;
      }
      stats.totalPages = row.totalPages || 0;
      if (++completed === 5) finishStats();
    });
    
    // Total de horas escuchadas/vistas
    db.get(`
      SELECT SUM(duration_mins) as totalMinutes FROM resources 
      WHERE duration_mins IS NOT NULL
    `, (err, row) => {
      if (err) {
        console.error('Error obteniendo duración:', err.message);
        resolve({ success: false, error: err.message });
        return;
      }
      stats.totalHours = Math.round((row.totalMinutes || 0) / 60 * 10) / 10; // Redondear a 1 decimal
      if (++completed === 5) finishStats();
    });
    
    function finishStats() {
      console.log('Estadísticas del dashboard:', stats);
      resolve({ success: true, data: stats });
    }
  });
});

/**
 * Obtener contenido agrupado por tipo (para gráficos)
 */
ipcMain.handle('get-content-by-type', async () => {
  return new Promise((resolve) => {
    db.all(`
      SELECT type, COUNT(*) as count 
      FROM resources 
      GROUP BY type 
      ORDER BY count DESC
    `, (err, rows) => {
      if (err) {
        console.error('Error obteniendo datos por tipo:', err.message);
        resolve({ success: false, error: err.message });
      } else {
        console.log('Datos por tipo:', rows);
        resolve({ success: true, data: rows });
      }
    });
  });
});

/**
 * Obtener contenido agrupado por mes (para gráfico temporal)
 */
ipcMain.handle('get-content-by-month', async () => {
  return new Promise((resolve) => {
    db.all(`
      SELECT 
        strftime('%Y-%m', start_date) as month,
        COUNT(*) as count 
      FROM resources 
      WHERE start_date >= date('now', '-12 months')
      GROUP BY strftime('%Y-%m', start_date)
      ORDER BY month
    `, (err, rows) => {
      if (err) {
        console.error('Error obteniendo datos por mes:', err.message);
        resolve({ success: false, error: err.message });
      } else {
        console.log('Datos por mes:', rows);
        resolve({ success: true, data: rows });
      }
    });
  });
});

/**
 * Obtener top 5 géneros/temas más populares
 */
ipcMain.handle('get-top-genres', async () => {
  return new Promise((resolve) => {
    db.all(`
      SELECT 
        genre,
        COUNT(*) as count,
        SUM(CASE WHEN pages IS NOT NULL THEN pages ELSE 0 END) as total_pages,
        SUM(CASE WHEN duration_mins IS NOT NULL THEN duration_mins ELSE 0 END) as total_minutes
      FROM resources 
      WHERE genre IS NOT NULL AND genre != ''
      GROUP BY genre 
      ORDER BY count DESC
      LIMIT 5
    `, (err, rows) => {
      if (err) {
        console.error('Error obteniendo top géneros:', err.message);
        resolve({ success: false, error: err.message });
      } else {
        console.log('Top géneros:', rows);
        resolve({ success: true, data: rows });
      }
    });
  });
});

/**
 * Obtener distribución de valoraciones
 */
ipcMain.handle('get-rating-distribution', async () => {
  return new Promise((resolve) => {
    db.all(`
      SELECT 
        rating,
        COUNT(*) as count 
      FROM resources 
      WHERE rating IS NOT NULL
      GROUP BY rating 
      ORDER BY rating
    `, (err, rows) => {
      if (err) {
        console.error('Error obteniendo distribución de valoraciones:', err.message);
        resolve({ success: false, error: err.message });
      } else {
        console.log('Distribución de valoraciones:', rows);
        resolve({ success: true, data: rows });
      }
    });
  });
});

/**
 * Obtener progreso anual (acumulación de páginas y minutos)
 */
ipcMain.handle('get-annual-progress', async () => {
  return new Promise((resolve) => {
    db.all(`
      SELECT 
        strftime('%Y-%m', start_date) as month,
        SUM(CASE WHEN pages IS NOT NULL THEN pages ELSE 0 END) as pages,
        SUM(CASE WHEN duration_mins IS NOT NULL THEN duration_mins ELSE 0 END) as minutes
      FROM resources 
      WHERE strftime('%Y', start_date) = strftime('%Y', 'now')
      GROUP BY strftime('%Y-%m', start_date)
      ORDER BY month
    `, (err, rows) => {
      if (err) {
        console.error('Error obteniendo progreso anual:', err.message);
        resolve({ success: false, error: err.message });
      } else {
        // Calcular acumulación
        let cumulativePages = 0;
        let cumulativeMinutes = 0;
        
        const progressData = rows.map(row => {
          cumulativePages += row.pages;
          cumulativeMinutes += row.minutes;
          return {
            month: row.month,
            cumulativePages: cumulativePages,
            cumulativeHours: Math.round(cumulativeMinutes / 60 * 10) / 10
          };
        });
        
        console.log('Progreso anual:', progressData);
        resolve({ success: true, data: progressData });
      }
    });
  });
});

// =============================================================================
// AUTENTICACIÓN DE USUARIOS
// =============================================================================

/**
 * Validar credenciales de usuario
 */
ipcMain.handle('authenticate-user', async (event, username, password) => {
  return new Promise((resolve) => {
    db.get(`
      SELECT id, username, email, created_at 
      FROM users 
      WHERE username = ? AND password_hash = ?
    `, [username, password], (err, row) => {
      if (err) {
        console.error('Error en autenticación:', err.message);
        resolve({ success: false, error: 'Error en la base de datos' });
      } else if (row) {
        console.log('Usuario autenticado:', row.username);
        resolve({ 
          success: true, 
          user: {
            id: row.id,
            username: row.username,
            email: row.email,
            created_at: row.created_at
          }
        });
      } else {
        console.log('Credenciales incorrectas para:', username);
        resolve({ success: false, error: 'Usuario o contraseña incorrectos' });
      }
    });
  });
});

/**
 * Registrar nuevo usuario
 */
ipcMain.handle('register-user', async (event, userData) => {
  return new Promise((resolve) => {
    const { username, email, password } = userData;
    
    // Verificar si el usuario ya existe
    db.get(`
      SELECT id FROM users 
      WHERE username = ? OR email = ?
    `, [username, email], (err, row) => {
      if (err) {
        console.error('Error verificando usuario existente:', err.message);
        resolve({ success: false, error: 'Error en la base de datos' });
        return;
      }
      
      if (row) {
        resolve({ success: false, error: 'Usuario o email ya existe' });
        return;
      }
      
      // Crear nuevo usuario
      db.run(`
        INSERT INTO users (username, email, password_hash, created_at)
        VALUES (?, ?, ?, datetime('now'))
      `, [username, email, password], function(err) {
        if (err) {
          console.error('Error creando usuario:', err.message);
          resolve({ success: false, error: 'Error creando usuario' });
        } else {
          console.log('Usuario creado:', username);
          resolve({ 
            success: true, 
            message: 'Usuario registrado exitosamente',
            userId: this.lastID
          });
        }
      });
    });
  });
});

/**
 * Obtener información del usuario
 */
ipcMain.handle('get-user-info', async (event, userId) => {
  return new Promise((resolve) => {
    db.get(`
      SELECT id, username, email, created_at 
      FROM users 
      WHERE id = ?
    `, [userId], (err, row) => {
      if (err) {
        console.error('Error obteniendo info del usuario:', err.message);
        resolve({ success: false, error: err.message });
      } else if (row) {
        resolve({ success: true, user: row });
      } else {
        resolve({ success: false, error: 'Usuario no encontrado' });
      }
    });
  });
});

/**
 * Actualizar perfil de usuario
 */
ipcMain.handle('update-user-profile', async (event, userId, updateData) => {
  return new Promise((resolve) => {
    const { username, email } = updateData;
    
    db.run(`
      UPDATE users 
      SET username = ?, email = ?, updated_at = datetime('now')
      WHERE id = ?
    `, [username, email, userId], function(err) {
      if (err) {
        console.error('Error actualizando perfil:', err.message);
        resolve({ success: false, error: err.message });
      } else {
        console.log('Perfil actualizado para usuario ID:', userId);
        resolve({ success: true, message: 'Perfil actualizado correctamente' });
      }
    });
  });
});

/**
 * Cambiar contraseña
 */
ipcMain.handle('change-password', async (event, userId, currentPassword, newPassword) => {
  return new Promise((resolve) => {
    // Verificar contraseña actual
    db.get(`
      SELECT id FROM users 
      WHERE id = ? AND password_hash = ?
    `, [userId, currentPassword], (err, row) => {
      if (err) {
        console.error('Error verificando contraseña:', err.message);
        resolve({ success: false, error: 'Error en la base de datos' });
        return;
      }
      
      if (!row) {
        resolve({ success: false, error: 'Contraseña actual incorrecta' });
        return;
      }
      
      // Actualizar contraseña
      db.run(`
        UPDATE users 
        SET password_hash = ?, updated_at = datetime('now')
        WHERE id = ?
      `, [newPassword, userId], function(err) {
        if (err) {
          console.error('Error cambiando contraseña:', err.message);
          resolve({ success: false, error: err.message });
        } else {
          console.log('Contraseña cambiada para usuario ID:', userId);
          resolve({ success: true, message: 'Contraseña actualizada correctamente' });
        }
      });
    });
  });
});

/**
 * Abrir aplicación principal después de autenticación exitosa
 */
ipcMain.handle('open-main-app', async () => {
  try {
    createMainWindow();
    return { success: true };
  } catch (error) {
    console.error('Error abriendo aplicación principal:', error);
    return { success: false, error: 'Error abriendo aplicación' };
  }
});

// Este método se ejecuta cuando Electron ha terminado la inicialización
app.whenReady().then(() => {
  initializeDatabase();
  createWindow();
});

// Manejar el cierre de la aplicación
app.on('before-quit', (event) => {
  console.log('Aplicación cerrándose...');
  if (db) {
    // Cerrar la base de datos de forma asíncrona
    db.close((err) => {
      if (err) {
        console.error('Error cerrando base de datos:', err.message);
      } else {
        console.log('Base de datos cerrada correctamente');
      }
    });
  }
});

// Salir cuando todas las ventanas estén cerradas
app.on('window-all-closed', () => {
  console.log('Todas las ventanas cerradas');
  if (process.platform !== 'darwin') {
    if (db) {
      db.close((err) => {
        if (err) {
          console.error('Error cerrando base de datos:', err.message);
        } else {
          console.log('Base de datos cerrada correctamente');
        }
        app.quit();
      });
    } else {
      app.quit();
    }
  }
});

app.on('activate', () => {
  console.log('Aplicación activada');
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
