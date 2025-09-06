# 🧭 Mi Brújula de Conocimiento - ContentTracker

Una aplicación de escritorio moderna para gestionar y rastrear tu viaje de aprendizaje personal. Desde libros y audiolibros hasta podcasts y cursos, mantén organizados todos tus recursos de conocimiento en un solo lugar.

![Electron](https://img.shields.io/badge/Electron-191970?style=for-the-badge&logo=Electron&logoColor=white)
![SQLite](https://img.shields.io/badge/sqlite-%2307405e.svg?style=for-the-badge&logo=sqlite&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)

## ✨ Características Principales

### 🔐 Sistema de Autenticación
- **Registro de usuarios** con validación de datos
- **Inicio de sesión seguro** con gestión de sesiones
- **Base de datos SQLite** para almacenamiento local
- **Validación de credenciales** y manejo de errores

### 📊 Dashboard Inteligente
- **Estadísticas en tiempo real**: Total de contenido, progreso mensual y semanal
- **Gráficos interactivos**: Distribución por tipos, evolución temporal, top géneros
- **Métricas de progreso**: Páginas leídas, horas de audio/video consumidas
- **Visualización de ratings**: Distribución de valoraciones y contenido favorito

### 📚 Gestión de Contenido
- **Múltiples tipos de medios**: Libros, Audiolibros, Podcasts, **Videos**, Cursos, Artículos, Documentales, **Películas**, **Series**
- **Campos dinámicos**: Páginas para libros, duración para audio/video/películas
- **Sistema de valoración**: Estrellas de 1 a 5 para cada ítem
- **Estados de progreso**: Completado vs. En progreso
- **Notas personales**: Espacio para comentarios y reflexiones

### 🔍 Búsqueda y Filtros Avanzados
- **Búsqueda por texto**: En título, autor, género y notas
- **Filtros múltiples**: Por tipo, género, rating y estado de finalización
- **Ordenamiento**: Por fecha de inicio, rating, tipo, etc.
- **Vista de biblioteca**: Tabla organizada con toda la información

### 🎨 Interfaz Moderna
- **Diseño responsive**: Se adapta a cualquier tamaño de ventana
- **Ventanas maximizables**: Soporte completo para redimensionar y maximizar
- **Navegación intuitiva**: Dashboard, Agregar Contenido, Mi Biblioteca
- **Indicadores visuales**: Estados, ratings con estrellas, badges de tipo

## 🛠️ Tecnologías Utilizadas

### Backend
- **Electron**: Framework para aplicaciones de escritorio
- **Node.js**: Runtime de JavaScript
- **SQLite3**: Base de datos local ligera
- **IPC (Inter-Process Communication)**: Comunicación segura entre procesos

### Frontend
- **HTML5/CSS3**: Estructura y estilos modernos
- **JavaScript ES6+**: Lógica de aplicación
- **Chart.js**: Gráficos y visualizaciones
- **CSS Grid/Flexbox**: Layout responsive

### Base de Datos
```sql
-- Tabla de recursos/contenido
CREATE TABLE "resources" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "author" TEXT,
    "type" TEXT NOT NULL,
    "start_date" TEXT,
    "end_date" TEXT,
    "pages" INTEGER,
    "episodes" INTEGER,
    "duration_mins" INTEGER,
    "genre" TEXT,
    "rating" INTEGER,
    "notes" TEXT
);

-- Tabla de usuarios
CREATE TABLE "users" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL UNIQUE,
    "email" TEXT NOT NULL UNIQUE,
    "password_hash" TEXT NOT NULL,
    "created_at" TEXT DEFAULT (DATE('now')),
    "updated_at" TEXT
);
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- **Node.js** (versión 14 o superior)
- **npm** (incluido con Node.js)

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/CCamberoR/ContentTracker.git
cd ContentTracker
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Verificar la base de datos**
Asegúrate de que existe el archivo `ContentTracker_database.db` con las tablas necesarias.

4. **Ejecutar la aplicación**
```bash
npm start
```

## 📖 Guía de Uso

### Primer Uso
1. **Iniciar la aplicación**: La pantalla de login aparece automáticamente
2. **Crear cuenta**: Clic en "Regístrate aquí" y completa el formulario
3. **Iniciar sesión**: Usa tus credenciales para acceder a la aplicación principal

### Agregar Contenido
1. **Navegar a "Agregar Contenido"**
2. **Completar el formulario**:
   - Título y autor/fuente
   - Tipo de contenido (libro, podcast, etc.)
   - Fechas de inicio y finalización
   - Métricas específicas (páginas o duración)
   - Género y valoración
   - Notas personales

### Explorar tu Biblioteca
1. **Ir a "Mi Biblioteca"**
2. **Usar filtros y búsqueda**:
   - Buscar por texto libre
   - Filtrar por tipo, género, rating
   - Ver solo completados o en progreso

### Dashboard y Estadísticas
1. **Vista general**: Métricas principales en la página de inicio
2. **Gráficos interactivos**: Distribución de contenido y progreso temporal
3. **Top géneros**: Los temas más populares en tu biblioteca

## 📁 Estructura del Proyecto

```
ContentTracker/
├── main.js                     # Proceso principal de Electron
├── preload.js                  # Script de preload (puente IPC)
├── package.json                # Configuración y dependencias
├── index.html                  # Aplicación principal
├── login.html                  # Pantalla de autenticación
├── frontend/
│   └── assets/
│       ├── css/
│       │   ├── style.css       # Estilos de la aplicación
│       │   └── login.css       # Estilos del login
│       └── js/
│           ├── renderer.js     # Lógica del frontend principal
│           └── login.js        # Lógica de autenticación
├── ContentTracker_database.db  # Base de datos SQLite
└── README.md                   # Este archivo
```

## 🎯 Tipos de Contenido Soportados

| Tipo | Icono | Métricas | Campos Específicos |
|------|-------|----------|-------------------|
| Libro | 📚 | Páginas | Páginas totales/leídas |
| Audiolibro | 🎧 | Duración | Minutos de audio |
| Podcast | 🎙️ | Duración | Episodios y duración |
| **Video** | 📹 | Duración | Minutos de video |
| **Película** | 🎬 | Duración | Minutos de película |
| **Serie** | 📺 | Duración | Episodios y duración |
| Curso | 🎓 | Duración | Horas del curso |
| Artículo | 📄 | Páginas | Páginas estimadas |
| Documental | 🎬 | Duración | Minutos del documental |

## 📊 Métricas y Estadísticas

### Dashboard Principal
- **Total de ítems** en tu biblioteca
- **Contenido de este mes** y esta semana
- **Páginas totales** leídas
- **Horas de audio/video** consumidas

### Visualizaciones Avanzadas
- **Gráfico de barras**: Distribución por tipo de contenido
- **Gráfico temporal**: Evolución mensual de tu aprendizaje
- **Top 5 géneros**: Tus áreas de interés principales
- **Distribución de ratings**: Calidad percibida de tu contenido
- **Progreso anual**: Acumulación de páginas y horas por mes

## 🔒 Seguridad y Privacidad

- **Almacenamiento local**: Todos los datos se mantienen en tu equipo
- **Base de datos SQLite**: Ligera y eficiente para uso personal
- **Passwords hasheados**: Las contraseñas se almacenan de forma segura
- **IPC seguro**: Comunicación aislada entre procesos

## 🛠️ Comandos de Desarrollo

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm start

# Limpiar cache (si hay problemas)
npm run clean

# Verificar dependencias
npm list
```

## 🐛 Solución de Problemas

### Error: "No handler registered"
- **Causa**: Desalineación entre frontend y backend
- **Solución**: Reiniciar la aplicación, los handlers están sincronizados

### Error: "SQLITE_ERROR: no such column"
- **Causa**: Esquema de base de datos desactualizado
- **Solución**: Verificar que las tablas tengan los campos correctos

### DevTools abriéndose automáticamente
- **Causa**: Modo desarrollo activo
- **Solución**: Las DevTools están deshabilitadas por defecto

### Error al cerrar la aplicación
- **Síntoma**: Error de JavaScript al cerrar (no afecta funcionalidad)
- **Estado**: Conocido, no impacta el uso normal de la aplicación

## 🔮 Funcionalidades Futuras

- [ ] **Exportación de datos** a PDF/Excel
- [ ] **Sincronización en la nube** (opcional)
- [ ] **Modo oscuro/claro** personalizable
- [ ] **Notificaciones y recordatorios** de lectura
- [ ] **Metas y objetivos** de aprendizaje
- [ ] **Integración con APIs** de libros y podcasts
- [ ] **Sistema de etiquetas** avanzado
- [ ] **Recomendaciones** basadas en historial

##  Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🙏 Agradecimientos

- **Carlos Cambero Rojas** - Desarrollo y conceptualización del proyecto
- **GitHub Copilot con Claude Sonnet 4** - Asistencia en el desarrollo y documentación

---

**Content Tracker** - Navega tu viaje de aprendizaje con confianza 🧭✨