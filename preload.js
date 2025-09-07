/**
 * preload.js - Enlace seguro entre Main Process y Renderer Process
 * 
 * Este archivo se ejecuta en un contexto aislado y expone APIs específicas
 * al renderer process de forma segura. Es el puente de comunicación entre
 * el frontend (renderer.js) y el backend (main.js).
 */

const { contextBridge, ipcRenderer } = require('electron');

// Exponer API segura al renderer process
contextBridge.exposeInMainWorld('api', {
  // ==============================================
  // CRUD Operations para Content Items (Resources)
  // ==============================================
  
  /**
   * Agregar nuevo ítem de contenido
   * @param {Object} itemData - Datos del ítem a agregar
   * @returns {Promise<Object>} Resultado de la operación
   */
  createContent: (itemData) => {
    console.log('Preload: Enviando datos para agregar contenido:', itemData);
    return ipcRenderer.invoke('create-content', itemData);
  },

  /**
   * Obtener todos los ítems de contenido
   * @returns {Promise<Object>} Lista de todos los ítems
   */
  getAllContent: () => {
    console.log('Preload: Solicitando todos los ítems de contenido');
    return ipcRenderer.invoke('get-all-content');
  },

  /**
   * Obtener ítem específico por ID
   * @param {number} id - ID del ítem a obtener
   * @returns {Promise<Object>} Datos del ítem específico
   */
  getContentById: (id) => {
    console.log('Preload: Solicitando ítem con ID:', id);
    return ipcRenderer.invoke('get-content-by-id', id);
  },

  /**
   * Actualizar ítem de contenido
   * @param {number} id - ID del ítem a actualizar
   * @param {Object} updatedItemData - Datos actualizados del ítem
   * @returns {Promise<Object>} Resultado de la actualización
   */
  updateContent: (id, updatedItemData) => {
    console.log('Preload: Actualizando ítem ID:', id, 'con datos:', updatedItemData);
    return ipcRenderer.invoke('update-content', id, updatedItemData);
  },

  /**
   * Eliminar ítem de contenido
   * @param {number} id - ID del ítem a eliminar
   * @returns {Promise<Object>} Resultado de la eliminación
   */
  deleteContent: (id) => {
    console.log('Preload: Eliminando ítem con ID:', id);
    return ipcRenderer.invoke('delete-content', id);
  },

  // ==============================================
  // Búsqueda y Filtrado
  // ==============================================

  /**
   * Buscar contenido por texto
   * @param {string} query - Texto de búsqueda
   * @returns {Promise<Object>} Resultados de la búsqueda
   */
  searchContent: (query) => {
    console.log('Preload: Buscando contenido:', query);
    return ipcRenderer.invoke('search-content', query);
  },

  /**
   * Filtrar contenido por criterios
   * @param {Object} filters - Filtros a aplicar
   * @returns {Promise<Object>} Contenido filtrado
   */
  filterContent: (filters) => {
    console.log('Preload: Aplicando filtros:', filters);
    return ipcRenderer.invoke('filter-content', filters);
  },

  // ==============================================
  // Dashboard y Analytics
  // ==============================================

  /**
   * Obtener estadísticas para el dashboard
   * @returns {Promise<Object>} Estadísticas generales
   */
  getDashboardStats: () => {
    console.log('Preload: Solicitando estadísticas del dashboard');
    return ipcRenderer.invoke('get-dashboard-stats');
  },

  /**
   * Obtener contenido agrupado por tipo
   * @returns {Promise<Object>} Datos agrupados por tipo de contenido
   */
  getContentByType: () => {
    console.log('Preload: Solicitando datos por tipo de contenido');
    return ipcRenderer.invoke('get-content-by-type');
  },

  /**
   * Obtener contenido agrupado por mes
   * @returns {Promise<Object>} Datos agrupados por mes
   */
  getContentByMonth: () => {
    console.log('Preload: Solicitando datos por mes');
    return ipcRenderer.invoke('get-content-by-month');
  },

  /**
   * Obtener top 5 géneros/temas más populares
   * @returns {Promise<Object>} Top géneros con estadísticas
   */
  getTopGenres: () => {
    console.log('Preload: Solicitando top géneros');
    return ipcRenderer.invoke('get-top-genres');
  },

  /**
   * Obtener distribución de valoraciones
   * @returns {Promise<Object>} Distribución de ratings 1-5 estrellas
   */
  getRatingDistribution: () => {
    console.log('Preload: Solicitando distribución de valoraciones');
    return ipcRenderer.invoke('get-rating-distribution');
  },

  /**
   * Obtener progreso anual acumulativo
   * @param {number} year - Año para filtrar (opcional)
   * @returns {Promise<Object>} Progreso acumulativo de páginas y horas por mes
   */
  getAnnualProgress: (year = null) => {
    console.log('Preload: Solicitando progreso anual para año:', year);
    return ipcRenderer.invoke('get-annual-progress', year);
  },

  /**
   * Obtener años disponibles para filtros
   * @returns {Promise<Object>} Lista de años disponibles
   */
  getAvailableYears: () => {
    console.log('Preload: Solicitando años disponibles');
    return ipcRenderer.invoke('get-available-years');
  },

  // ==============================================
  // Autenticación de Usuarios
  // ==============================================

  /**
   * Autenticar usuario con credenciales
   * @param {string} username - Nombre de usuario
   * @param {string} password - Contraseña
   * @returns {Promise<Object>} Resultado de la autenticación
   */
  authenticateUser: (username, password) => {
    console.log('Preload: Autenticando usuario:', username);
    return ipcRenderer.invoke('authenticate-user', username, password);
  },

  /**
   * Registrar nuevo usuario
   * @param {Object} userData - Datos del nuevo usuario
   * @returns {Promise<Object>} Resultado del registro
   */
  registerUser: (userData) => {
    console.log('Preload: Registrando nuevo usuario:', userData.username);
    return ipcRenderer.invoke('register-user', userData);
  },

  /**
   * Obtener información del usuario
   * @param {number} userId - ID del usuario
   * @returns {Promise<Object>} Información del usuario
   */
  getUserInfo: (userId) => {
    console.log('Preload: Obteniendo info del usuario ID:', userId);
    return ipcRenderer.invoke('get-user-info', userId);
  },

  /**
   * Actualizar perfil del usuario
   * @param {number} userId - ID del usuario
   * @param {Object} updateData - Datos a actualizar
   * @returns {Promise<Object>} Resultado de la actualización
   */
  updateUserProfile: (userId, updateData) => {
    console.log('Preload: Actualizando perfil del usuario ID:', userId);
    return ipcRenderer.invoke('update-user-profile', userId, updateData);
  },

  /**
   * Cambiar contraseña del usuario
   * @param {number} userId - ID del usuario
   * @param {string} currentPassword - Contraseña actual
   * @param {string} newPassword - Nueva contraseña
   * @returns {Promise<Object>} Resultado del cambio
   */
  changePassword: (userId, currentPassword, newPassword) => {
    console.log('Preload: Cambiando contraseña para usuario ID:', userId);
    return ipcRenderer.invoke('change-password', userId, currentPassword, newPassword);
  },

  /**
   * Abrir aplicación principal después de autenticación
   * @returns {Promise<Object>} Resultado de la operación
   */
  openMainApp: () => {
    console.log('Preload: Abriendo aplicación principal');
    return ipcRenderer.invoke('open-main-app');
  },



  // ==============================================
  // Utilidades y Helpers
  // ==============================================

  /**
   * Verificar si la API está disponible
   * @returns {boolean} Estado de disponibilidad de la API
   */
  isApiAvailable: () => {
    return true;
  },

  /**
   * Obtener información del sistema
   * @returns {Object} Información básica del sistema
   */
  getSystemInfo: () => {
    return {
      platform: process.platform,
      version: process.versions.electron,
      nodeVersion: process.versions.node,
      chromeVersion: process.versions.chrome
    };
  }
});

console.log('Preload script cargado - API expuesta como window.api');
