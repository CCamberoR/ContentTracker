/**
 * renderer.js - Mi Brújula de Conocimiento
 * 
 * Frontend Logic Controller para la aplicación de seguimiento de contenido.
 * Este archivo maneja toda la lógica de la interfaz de usuario en el proceso renderer de Electron.
 */

// Variables globales para el estado de la aplicación
let currentView = 'dashboard';
let contentData = [];
let charts = {};
let currentRating = 0;

/**
 * Inicialización de la aplicación cuando el DOM esté completamente cargado
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Mi Brújula de Conocimiento iniciada');
    
    // Verificar que la API esté disponible
    if (!window.api) {
        console.error('❌ API no disponible. Verifica que preload.js esté funcionando.');
        showNotification('Error: La aplicación no puede conectarse con el backend.', 'error');
        return;
    }
    
    // Inicializar la aplicación
    initializeApp();
});

/**
 * Inicializar la aplicación
 */
async function initializeApp() {
    console.log('Inicializando aplicación...');
    
    // Configurar navegación
    setupNavigation();
    
    // Cargar vista inicial (dashboard)
    await renderDashboardView();
    
    console.log('✅ Aplicación inicializada correctamente');
}

/**
 * Configurar la navegación principal
 */
function setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    
    navButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const view = e.currentTarget.getAttribute('data-view');
            if (view) {
                switchView(view);
            }
        });
    });
}

/**
 * Cambiar entre vistas
 */
async function switchView(viewName) {
    if (currentView === viewName) return;
    
    console.log(`Cambiando vista de ${currentView} a ${viewName}`);
    
    // Actualizar navegación activa
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-view') === viewName) {
            btn.classList.add('active');
        }
    });
    
    // Renderizar la nueva vista
    try {
        switch (viewName) {
            case 'dashboard':
                await renderDashboardView();
                break;
            case 'add-content':
                renderAddContentView();
                break;
            case 'library':
                await renderLibraryView();
                break;
            default:
                console.warn(`Vista desconocida: ${viewName}`);
                await renderDashboardView();
        }
        
        currentView = viewName;
    } catch (error) {
        console.error('Error al cambiar vista:', error);
        showNotification('Error al cargar la vista', 'error');
    }
}

// ==============================================
// VISTA: DASHBOARD
// ==============================================

/**
 * Renderizar la vista del dashboard
 */
async function renderDashboardView() {
    console.log('📊 Renderizando Dashboard');
    
    const contentDiv = document.getElementById('main-content');
    contentDiv.innerHTML = `
        <div class="view-container">
            <div class="view-header">
                <h2 class="view-title">📊 Mi Brújula de Conocimiento</h2>
                <p class="view-description">Analiza tu progreso y descubre patrones en tu aprendizaje</p>
            </div>
            
            <!-- Estadísticas Principales -->
            <div class="stats-grid" id="stats-grid">
                <div class="stat-card">
                    <span class="stat-icon">📚</span>
                    <span class="stat-number" id="total-content">0</span>
                    <span class="stat-label">Total Registrado</span>
                </div>
                
                <div class="stat-card">
                    <span class="stat-icon">📖</span>
                    <span class="stat-number" id="total-pages">0</span>
                    <span class="stat-label">Páginas Leídas</span>
                </div>
                
                <div class="stat-card">
                    <span class="stat-icon">🕐</span>
                    <span class="stat-number" id="total-hours">0</span>
                    <span class="stat-label">Horas Escuchadas/Vistas</span>
                </div>
                
                <div class="stat-card">
                    <span class="stat-icon">📅</span>
                    <span class="stat-number" id="this-month">0</span>
                    <span class="stat-label">Este Mes</span>
                </div>
            </div>
            
            <!-- Gráficos de Análisis -->
            <div class="charts-grid">
                <div class="chart-container">
                    <h3 class="chart-title">📊 Contenido por Mes</h3>
                    <canvas id="monthly-chart"></canvas>
                </div>
                
                <div class="chart-container">
                    <h3 class="chart-title">🎯 Distribución por Tipo</h3>
                    <canvas id="type-chart"></canvas>
                </div>
                
                <div class="chart-container">
                    <h3 class="chart-title">🏆 Top 5 Géneros</h3>
                    <canvas id="genres-chart"></canvas>
                </div>
                
                <div class="chart-container">
                    <h3 class="chart-title">⭐ Distribución de Valoraciones</h3>
                    <canvas id="ratings-chart"></canvas>
                </div>
                
                <div class="chart-container" style="grid-column: 1 / -1;">
                    <h3 class="chart-title">📈 Progreso Anual Acumulativo</h3>
                    <canvas id="progress-chart"></canvas>
                </div>
            </div>
        </div>
    `;
    
    // Cargar estadísticas y gráficos
    await loadDashboardData();
}

/**
 * Cargar datos del dashboard
 */
async function loadDashboardData() {
    try {
        // Cargar estadísticas principales
        const statsResponse = await window.api.getDashboardStats();
        if (statsResponse.success) {
            updateDashboardStats(statsResponse.data);
        }
        
        // Cargar y renderizar gráficos
        await Promise.all([
            loadMonthlyChart(),
            loadTypeChart(),
            loadGenresChart(),
            loadRatingsChart(),
            loadProgressChart()
        ]);
        
    } catch (error) {
        console.error('Error cargando datos del dashboard:', error);
        showNotification('Error cargando estadísticas', 'error');
    }
}

/**
 * Actualizar estadísticas del dashboard
 */
function updateDashboardStats(stats) {
    document.getElementById('total-content').textContent = stats.total || 0;
    document.getElementById('total-pages').textContent = (stats.totalPages || 0).toLocaleString();
    document.getElementById('total-hours').textContent = stats.totalHours || 0;
    document.getElementById('this-month').textContent = stats.thisMonth || 0;
}

// ==============================================
// VISTA: AÑADIR CONTENIDO
// ==============================================

/**
 * Renderizar la vista de añadir contenido
 */
function renderAddContentView() {
    console.log('➕ Renderizando Add Content');
    
    const contentDiv = document.getElementById('main-content');
    contentDiv.innerHTML = `
        <div class="view-container">
            <div class="view-header">
                <h2 class="view-title">➕ Añadir Nuevo Contenido</h2>
                <p class="view-description">Registra un nuevo elemento en tu brújula de conocimiento</p>
            </div>
            
            <div class="form-container">
                <form id="add-content-form">
                    <!-- Información Básica -->
                    <div class="form-section">
                        <h3 class="section-title">📖 Información Básica</h3>
                        
                        <div class="form-group">
                            <label class="form-label" for="title">Título *</label>
                            <input type="text" id="title" name="title" class="form-input" required 
                                   placeholder="Ej: El Arte de la Guerra, Historia de la Ciencia...">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label" for="author">Autor / Fuente</label>
                            <input type="text" id="author" name="author" class="form-input" 
                                   placeholder="Ej: Sun Tzu, National Geographic, Tim Ferriss...">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label" for="type">Tipo de Contenido *</label>
                            <select id="type" name="type" class="form-select" required>
                                <option value="">Selecciona el tipo</option>
                                <option value="libro">📚 Libro</option>
                                <option value="audiobook">🎧 Audiolibro</option>
                                <option value="podcast">�️ Podcast</option>
                                <option value="video">� Video</option>
                                <option value="pelicula">� Película</option>
                                <option value="serie">📺 Serie</option>
                                <option value="curso">🎓 Curso</option>
                                <option value="articulo">📄 Artículo</option>
                                <option value="documental">�️ Documental</option>
                                <option value="paper">📄 Paper Académico</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label" for="genre">Género / Tema</label>
                            <input type="text" id="genre" name="genre" class="form-input" 
                                   placeholder="Ej: Desarrollo Personal, Historia, Ciencia Ficción, Tecnología...">
                        </div>
                    </div>
                    
                    <!-- Fechas -->
                    <div class="form-section">
                        <h3 class="section-title">📅 Fechas</h3>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label" for="start_date">Fecha de Inicio *</label>
                                <input type="date" id="start_date" name="start_date" class="form-input" required>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label" for="end_date">Fecha de Finalización</label>
                                <input type="date" id="end_date" name="end_date" class="form-input">
                                <small class="form-helper">Déjalo vacío si aún no has terminado</small>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Métricas -->
                    <div class="form-section">
                        <h3 class="section-title">📊 Métricas de Progreso</h3>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label" for="pages">Páginas Leídas</label>
                                <input type="number" id="pages" name="pages" class="form-input" 
                                       min="0" placeholder="Ej: 250">
                                <small class="form-helper">Para libros y artículos</small>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label" for="duration_mins">Duración (minutos)</label>
                                <input type="number" id="duration_mins" name="duration_mins" class="form-input" 
                                       min="0" placeholder="Ej: 90">
                                <small class="form-helper">Para podcasts, videos y cursos</small>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Valoración y Notas -->
                    <div class="form-section">
                        <h3 class="section-title">⭐ Valoración y Reflexiones</h3>
                        
                        <div class="form-group">
                            <label class="form-label">Valoración</label>
                            <div class="rating-container">
                                <div class="star-rating" id="star-rating">
                                    <span class="star" data-rating="1">⭐</span>
                                    <span class="star" data-rating="2">⭐</span>
                                    <span class="star" data-rating="3">⭐</span>
                                    <span class="star" data-rating="4">⭐</span>
                                    <span class="star" data-rating="5">⭐</span>
                                </div>
                                <span class="rating-text" id="rating-text">Sin valoración</span>
                                <input type="hidden" id="rating" name="rating" value="">
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label" for="notes">Notas / Reflexiones</label>
                            <textarea id="notes" name="notes" class="form-textarea" rows="4" 
                                      placeholder="Comparte tus reflexiones, aprendizajes clave, citas favoritas..."></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label" for="url">URL / Enlace</label>
                            <input type="url" id="url" name="url" class="form-input" 
                                   placeholder="https://ejemplo.com/enlace-al-contenido">
                            <small class="form-helper">Enlace al contenido original (opcional)</small>
                        </div>
                    </div>
                    
                    <!-- Botones de Acción -->
                    <div class="form-actions">
                        <button type="submit" class="form-button primary">
                            <span class="button-icon">💾</span>
                            Guardar Contenido
                        </button>
                        <button type="button" class="form-button secondary" onclick="switchView('dashboard')">
                            <span class="button-icon">↩️</span>
                            Volver al Inicio
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    // Configurar fecha de inicio por defecto (hoy)
    document.getElementById('start_date').value = new Date().toISOString().split('T')[0];
    
    // Configurar sistema de estrellas
    setupStarRating();
    
    // Configurar campos dinámicos según tipo de contenido
    document.getElementById('type').addEventListener('change', handleContentTypeChange);
    handleContentTypeChange(); // Inicializar estado de campos
    
    // Configurar el envío del formulario
    document.getElementById('add-content-form').addEventListener('submit', handleAddContentSubmit);
}

// ==============================================
// VISTA: BIBLIOTECA
// ==============================================

/**
 * Renderizar la vista de la biblioteca
 */
async function renderLibraryView() {
    console.log('📚 Renderizando Library');
    
    const contentDiv = document.getElementById('main-content');
    contentDiv.innerHTML = `
        <div class="view-container">
            <div class="view-header">
                <h2 class="view-title">📚 Mi Biblioteca</h2>
                <p class="view-description">Explora y gestiona todo tu contenido registrado</p>
            </div>
            
            <!-- Controles de Biblioteca -->
            <div class="library-controls">
                <div class="search-container">
                    <input type="text" id="search-input" class="search-input" 
                           placeholder="🔍 Buscar por título, autor o género...">
                </div>
                
                <div class="filter-container">
                    <select id="type-filter" class="filter-select">
                        <option value="">Todos los tipos</option>
                        <option value="libro">📚 Libros</option>
                        <option value="podcast">🎧 Podcasts</option>
                        <option value="articulo">📰 Artículos</option>
                        <option value="curso">🎓 Cursos</option>
                        <option value="video">🎬 Videos</option>
                        <option value="audiobook">🔊 Audiolibros</option>
                        <option value="paper">📄 Papers</option>
                        <option value="documental">🎭 Documentales</option>
                    </select>
                    
                    <select id="rating-filter" class="filter-select">
                        <option value="">Todas las valoraciones</option>
                        <option value="5">⭐⭐⭐⭐⭐ (5 estrellas)</option>
                        <option value="4">⭐⭐⭐⭐ (4 estrellas)</option>
                        <option value="3">⭐⭐⭐ (3 estrellas)</option>
                        <option value="2">⭐⭐ (2 estrellas)</option>
                        <option value="1">⭐ (1 estrella)</option>
                    </select>
                </div>
            </div>
            
            <!-- Lista de Contenido -->
            <div class="content-table">
                <table class="table" id="content-table">
                    <thead>
                        <tr>
                            <th>Título</th>
                            <th>Autor/Fuente</th>
                            <th>Tipo</th>
                            <th>Género</th>
                            <th>Fecha Inicio</th>
                            <th>Valoración</th>
                            <th>Progreso</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="content-table-body">
                        <!-- Los elementos se cargarán dinámicamente -->
                    </tbody>
                </table>
                
                <div id="empty-state" class="empty-state" style="display: none;">
                    <div class="empty-state-icon">📚</div>
                    <h3 class="empty-state-title">No hay contenido registrado</h3>
                    <p class="empty-state-description">
                        Comienza tu brújula de conocimiento agregando tu primer elemento
                    </p>
                </div>
            </div>
        </div>
    `;
    
    // Cargar contenido
    await loadLibraryContent();
    
    // Configurar búsqueda y filtros
    setupLibraryFilters();
}

// ==============================================
// FUNCIONES DE MANEJO DE FORMULARIOS
// ==============================================

/**
 * Configurar sistema de valoración por estrellas
 */
function setupStarRating() {
    const stars = document.querySelectorAll('.star');
    const ratingText = document.getElementById('rating-text');
    const ratingInput = document.getElementById('rating');
    
    const ratingLabels = {
        0: 'Sin valoración',
        1: 'Muy malo',
        2: 'Malo',
        3: 'Regular',
        4: 'Bueno',
        5: 'Excelente'
    };
    
    stars.forEach(star => {
        star.addEventListener('click', (e) => {
            const rating = parseInt(e.target.getAttribute('data-rating'));
            currentRating = rating;
            ratingInput.value = rating;
            ratingText.textContent = ratingLabels[rating];
            
            // Actualizar visual de estrellas
            stars.forEach((s, index) => {
                if (index < rating) {
                    s.style.opacity = '1';
                    s.style.transform = 'scale(1.2)';
                } else {
                    s.style.opacity = '0.3';
                    s.style.transform = 'scale(1)';
                }
            });
        });
        
        star.addEventListener('mouseover', (e) => {
            const rating = parseInt(e.target.getAttribute('data-rating'));
            
            stars.forEach((s, index) => {
                if (index < rating) {
                    s.style.opacity = '1';
                } else {
                    s.style.opacity = '0.3';
                }
            });
        });
    });
    
    // Reset en mouseleave
    document.getElementById('star-rating').addEventListener('mouseleave', () => {
        stars.forEach((s, index) => {
            if (index < currentRating) {
                s.style.opacity = '1';
                s.style.transform = 'scale(1.2)';
            } else {
                s.style.opacity = '0.3';
                s.style.transform = 'scale(1)';
            }
        });
    });
}

/**
 * Manejar cambio en el tipo de contenido
 */
function handleContentTypeChange() {
    const contentType = document.getElementById('type').value;
    const pagesField = document.querySelector('.form-group:has(#pages)');
    const durationField = document.querySelector('.form-group:has(#duration_mins)');
    
    // Ocultar todos los campos específicos por defecto
    if (pagesField) pagesField.style.display = 'none';
    if (durationField) durationField.style.display = 'none';
    
    // Mostrar campos según el tipo
    switch(contentType) {
        case 'libro':
        case 'paper':
            if (pagesField) pagesField.style.display = 'block';
            break;
        case 'video':
        case 'curso':
        case 'podcast':
        case 'audiobook':
        case 'documental':
        case 'pelicula':
        case 'serie':
            if (durationField) durationField.style.display = 'block';
            break;
        case 'articulo':
        case 'blog':
            // Estos tipos no requieren páginas ni duración específica
            break;
    }
}

/**
 * Manejar envío del formulario de agregar contenido
 */
async function handleAddContentSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Construir objeto de datos
    const itemData = {
        title: formData.get('title'),
        author: formData.get('author'),
        type: formData.get('type'),
        start_date: formData.get('start_date'),
        end_date: formData.get('end_date'),
        pages: formData.get('pages') ? parseInt(formData.get('pages')) : null,
        duration_mins: formData.get('duration_mins') ? parseInt(formData.get('duration_mins')) : null,
        genre: formData.get('genre'),
        rating: formData.get('rating') ? parseInt(formData.get('rating')) : null,
        notes: formData.get('notes'),
        url: formData.get('url')
    };
    
    try {
        // Deshabilitar botón de envío
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="button-icon">⏳</span> Guardando...';
        
        // Enviar datos a la API
        const response = await window.api.createContent(itemData);
        
        if (response.success) {
            showNotification('¡Contenido guardado exitosamente!', 'success');
            
            // Limpiar formulario
            form.reset();
            currentRating = 0;
            
            // Resetear estrellas
            document.querySelectorAll('.star').forEach(star => {
                star.style.opacity = '0.3';
                star.style.transform = 'scale(1)';
            });
            document.getElementById('rating-text').textContent = 'Sin valoración';
            
            // Volver al dashboard después de 1.5 segundos
            setTimeout(() => {
                switchView('dashboard');
            }, 1500);
        } else {
            throw new Error(response.error || 'Error desconocido');
        }
        
    } catch (error) {
        console.error('Error guardando contenido:', error);
        showNotification('Error al guardar contenido: ' + error.message, 'error');
    } finally {
        // Rehabilitar botón
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.disabled = false;
        submitButton.innerHTML = '<span class="button-icon">💾</span> Guardar Contenido';
    }
}

// ==============================================
// FUNCIONES DE BIBLIOTECA
// ==============================================

/**
 * Cargar contenido de la biblioteca
 */
async function loadLibraryContent() {
    try {
        const response = await window.api.getAllContent();
        
        if (response.success) {
            contentData = response.data;
            renderLibraryTable(contentData);
        } else {
            throw new Error(response.error || 'Error cargando biblioteca');
        }
        
    } catch (error) {
        console.error('Error cargando biblioteca:', error);
        showNotification('Error cargando biblioteca', 'error');
    }
}

/**
 * Renderizar tabla de biblioteca
 */
function renderLibraryTable(data) {
    const tbody = document.getElementById('content-table-body');
    const emptyState = document.getElementById('empty-state');
    
    if (!data || data.length === 0) {
        tbody.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    
    tbody.innerHTML = data.map(item => `
        <tr data-id="${item.id}">
            <td>
                <strong>${escapeHtml(item.title)}</strong>
                ${item.end_date ? '<span class="status-badge completed">✅ Completado</span>' : '<span class="status-badge in-progress">⏳ En progreso</span>'}
            </td>
            <td>${escapeHtml(item.author || 'Sin autor')}</td>
            <td>
                <span class="content-type-badge type-${item.type}">
                    ${getTypeIcon(item.type)} ${capitalizeFirst(item.type)}
                </span>
            </td>
            <td>${escapeHtml(item.genre || 'Sin género')}</td>
            <td>${formatDate(item.start_date)}</td>
            <td>${renderStarRating(item.rating)}</td>
            <td>${renderProgress(item)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-edit" onclick="editContentItem(${item.id})" title="Editar">
                        ✏️
                    </button>
                    <button class="btn-delete" onclick="deleteContentItem(${item.id})" title="Eliminar">
                        🗑️
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

/**
 * Configurar filtros de biblioteca
 */
function setupLibraryFilters() {
    const searchInput = document.getElementById('search-input');
    const typeFilter = document.getElementById('type-filter');
    const ratingFilter = document.getElementById('rating-filter');
    
    const applyFilters = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const typeFilter_ = typeFilter.value;
        const ratingFilter_ = ratingFilter.value;
        
        const filteredData = contentData.filter(item => {
            const matchesSearch = !searchTerm || 
                item.title.toLowerCase().includes(searchTerm) ||
                (item.author_source && item.author_source.toLowerCase().includes(searchTerm)) ||
                (item.genre && item.genre.toLowerCase().includes(searchTerm));
            
            const matchesType = !typeFilter_ || item.type === typeFilter_;
            const matchesRating = !ratingFilter_ || item.rating == ratingFilter_;
            
            return matchesSearch && matchesType && matchesRating;
        });
        
        renderLibraryTable(filteredData);
    };
    
    searchInput.addEventListener('input', applyFilters);
    typeFilter.addEventListener('change', applyFilters);
    ratingFilter.addEventListener('change', applyFilters);
}

// ==============================================
// FUNCIONES DE GRÁFICOS
// ==============================================

/**
 * Cargar gráfico mensual
 */
async function loadMonthlyChart() {
    try {
        const response = await window.api.getContentByMonth();
        if (response.success) {
            renderMonthlyChart(response.data);
        }
    } catch (error) {
        console.error('Error cargando gráfico mensual:', error);
    }
}

/**
 * Cargar gráfico por tipo
 */
async function loadTypeChart() {
    try {
        const response = await window.api.getContentByType();
        if (response.success) {
            renderTypeChart(response.data);
        }
    } catch (error) {
        console.error('Error cargando gráfico por tipo:', error);
    }
}

/**
 * Cargar gráfico de géneros
 */
async function loadGenresChart() {
    try {
        const response = await window.api.getTopGenres();
        if (response.success) {
            renderGenresChart(response.data);
        }
    } catch (error) {
        console.error('Error cargando gráfico de géneros:', error);
    }
}

/**
 * Cargar gráfico de valoraciones
 */
async function loadRatingsChart() {
    try {
        const response = await window.api.getRatingDistribution();
        if (response.success) {
            renderRatingsChart(response.data);
        }
    } catch (error) {
        console.error('Error cargando gráfico de valoraciones:', error);
    }
}

/**
 * Cargar gráfico de progreso
 */
async function loadProgressChart() {
    try {
        const response = await window.api.getAnnualProgress();
        if (response.success) {
            renderProgressChart(response.data);
        }
    } catch (error) {
        console.error('Error cargando gráfico de progreso:', error);
    }
}

// ==============================================
// FUNCIONES DE RENDERIZADO DE GRÁFICOS
// ==============================================

function renderMonthlyChart(data) {
    const ctx = document.getElementById('monthly-chart').getContext('2d');
    
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(d => formatMonth(d.month)),
            datasets: [{
                label: 'Contenido Consumido',
                data: data.map(d => d.count),
                backgroundColor: 'rgba(102, 126, 234, 0.8)',
                borderColor: 'rgba(102, 126, 234, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
    
    charts.monthly = chart;
}

function renderTypeChart(data) {
    const ctx = document.getElementById('type-chart').getContext('2d');
    
    const colors = [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
        '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
    ];
    
    const chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: data.map(d => capitalizeFirst(d.type)),
            datasets: [{
                data: data.map(d => d.count),
                backgroundColor: colors.slice(0, data.length),
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
    
    charts.type = chart;
}

function renderGenresChart(data) {
    const ctx = document.getElementById('genres-chart').getContext('2d');
    
    const chart = new Chart(ctx, {
        type: 'horizontalBar',
        data: {
            labels: data.map(d => d.genre_topic),
            datasets: [{
                label: 'Cantidad',
                data: data.map(d => d.count),
                backgroundColor: 'rgba(118, 75, 162, 0.8)',
                borderColor: 'rgba(118, 75, 162, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
    
    charts.genres = chart;
}

function renderRatingsChart(data) {
    const ctx = document.getElementById('ratings-chart').getContext('2d');
    
    // Completar datos para todas las estrellas (1-5)
    const completeData = [];
    for (let i = 1; i <= 5; i++) {
        const found = data.find(d => d.rating === i);
        completeData.push({
            rating: i,
            count: found ? found.count : 0
        });
    }
    
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: completeData.map(d => '⭐'.repeat(d.rating)),
            datasets: [{
                label: 'Cantidad',
                data: completeData.map(d => d.count),
                backgroundColor: ['#ff4444', '#ff8800', '#ffbb33', '#00C851', '#007E33'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
    
    charts.ratings = chart;
}

function renderProgressChart(data) {
    const ctx = document.getElementById('progress-chart').getContext('2d');
    
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(d => formatMonth(d.month)),
            datasets: [{
                label: 'Páginas Acumuladas',
                data: data.map(d => d.cumulativePages),
                borderColor: 'rgba(102, 126, 234, 1)',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                fill: true,
                tension: 0.4
            }, {
                label: 'Horas Acumuladas',
                data: data.map(d => d.cumulativeHours),
                borderColor: 'rgba(118, 75, 162, 1)',
                backgroundColor: 'rgba(118, 75, 162, 0.1)',
                fill: true,
                tension: 0.4,
                yAxisID: 'y1'
            }]
        },
        options: {
            responsive: true,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Páginas'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Horas'
                    },
                    grid: {
                        drawOnChartArea: false,
                    },
                }
            }
        }
    });
    
    charts.progress = chart;
}

// ==============================================
// FUNCIONES DE UTILIDAD
// ==============================================

/**
 * Mostrar notificación
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

/**
 * Escapar HTML
 */
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Capitalizar primera letra
 */
function capitalizeFirst(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Formatear fecha
 */
function formatDate(dateString) {
    if (!dateString) return 'Sin fecha';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
}

/**
 * Formatear mes
 */
function formatMonth(monthString) {
    if (!monthString) return '';
    const [year, month] = monthString.split('-');
    const monthNames = [
        'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
        'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
    ];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
}

/**
 * Obtener icono de tipo
 */
function getTypeIcon(type) {
    const icons = {
        'libro': '📚',
        'podcast': '🎧',
        'articulo': '📰',
        'curso': '🎓',
        'video': '🎬',
        'audiobook': '🔊',
        'paper': '📄',
        'documental': '🎭',
        'pelicula': '🎬',
        'serie': '📺'
    };
    return icons[type] || '📄';
}

/**
 * Renderizar valoración por estrellas
 */
function renderStarRating(rating) {
    if (!rating) return '<span class="no-rating">Sin valorar</span>';
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
}

/**
 * Renderizar progreso
 */
function renderProgress(item) {
    const parts = [];
    
    if (item.pages) {
        parts.push(`${item.pages} páginas`);
    }
    
    if (item.duration_mins) {
        const hours = Math.round(item.duration_mins / 60 * 10) / 10;
        parts.push(`${hours}h`);
    }
    
    if (parts.length === 0) {
        return '<span class="no-progress">Sin métricas</span>';
    }
    
    return parts.join(' • ');
}

/**
 * Eliminar contenido
 */
async function deleteContentItem(id) {
    if (!confirm('¿Estás seguro de que quieres eliminar este contenido?')) {
        return;
    }
    
    try {
        const response = await window.api.deleteContentItem(id);
        
        if (response.success) {
            showNotification('Contenido eliminado exitosamente', 'success');
            await loadLibraryContent(); // Recargar tabla
        } else {
            throw new Error(response.error || 'Error eliminando contenido');
        }
        
    } catch (error) {
        console.error('Error eliminando contenido:', error);
        showNotification('Error al eliminar contenido', 'error');
    }
}

/**
 * Editar contenido (función placeholder)
 */
function editContentItem(id) {
    showNotification('Función de edición próximamente disponible', 'info');
    // TODO: Implementar modal de edición
}
