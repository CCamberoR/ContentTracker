
# 🧭 Documentación Exhaustiva del Proyecto: ContentTracker

**Versión:** 1.0.0  
**Fecha de Documentación:** 07 de Septiembre de 2025

## 1. Introducción y Visión General

**ContentTracker** es una aplicación de escritorio multiplataforma diseñada para ser una "brújula de conocimiento", permitiendo a los usuarios registrar, gestionar y analizar su consumo de contenido educativo y de entretenimiento. La aplicación funciona como un diario personal de aprendizaje, abarcando una amplia gama de formatos como libros, cursos, podcasts, videos, y más.

El objetivo principal es proporcionar una herramienta centralizada y privada donde el usuario pueda:
- **Organizar** todos los recursos de conocimiento en un solo lugar.
- **Visualizar** su progreso y patrones de consumo a través de un dashboard con estadísticas y gráficos.
- **Reflexionar** sobre el contenido mediante un sistema de valoración y notas personales.
- **Mantener la privacidad**, ya que todos los datos se almacenan localmente en el equipo del usuario.

## 2. Arquitectura Tecnológica

La aplicación se basa en una arquitectura híbrida que combina tecnologías web estándar con un entorno de escritorio nativo, aprovechando lo mejor de ambos mundos.

### Stack Tecnológico Principal

| Componente | Tecnología | Razón de la Elección |
| :--- | :--- | :--- |
| **Runtime de Escritorio** | **Electron.js** | Permite crear aplicaciones de escritorio con tecnologías web (HTML, CSS, JavaScript). Facilita el desarrollo multiplataforma (Windows, macOS, Linux) a partir de una única base de código. Ideal para desarrolladores web que buscan crear aplicaciones de escritorio. |
| **Entorno Backend** | **Node.js** | Es el runtime sobre el que corre Electron. Permite ejecutar JavaScript en el lado del servidor (en este caso, el proceso principal de Electron), gestionando la lógica de negocio, el acceso al sistema de archivos y la comunicación con la base de datos. |
| **Base de Datos** | **SQLite3** | Es una base de datos relacional ligera, basada en archivos y sin servidor. La elección perfecta para una aplicación de escritorio local, ya que no requiere instalación ni configuración complejas. El archivo de la base de datos (`.db`) puede ser fácilmente empaquetado con la aplicación. |
| **Frontend (UI)** | **HTML5, CSS3, JavaScript (ES6+)** | Son las tecnologías estándar de la web. Permiten crear una interfaz de usuario rica, moderna e interactiva sin necesidad de aprender lenguajes de UI específicos de escritorio. |
| **Visualización de Datos** | **Chart.js** | Una librería de gráficos simple pero flexible. Ideal para crear los gráficos interactivos del dashboard (barras, líneas, donas) de manera rápida y con un buen rendimiento visual. |

### Flujo de Datos y Comunicación

El núcleo de la arquitectura de Electron se basa en la comunicación entre dos tipos de procesos:

1.  **Proceso Principal (Main Process):**
    -   Es el "backend" de la aplicación.
    -   Se ejecuta en un entorno Node.js.
    -   Tiene acceso completo a las APIs de Node.js y del sistema operativo.
    -   Gestiona las ventanas de la aplicación (`BrowserWindow`), los menús nativos y, crucialmente, la **conexión con la base de datos SQLite**.
    -   En este proyecto, está representado por `main.js`.

2.  **Proceso de Renderizado (Renderer Process):**
    -   Es el "frontend" de la aplicación.
    -   Cada ventana de la aplicación (`BrowserWindow`) tiene su propio proceso de renderizado.
    -   Es, en esencia, una instancia de un navegador web (Chromium) que renderiza HTML, CSS y ejecuta JavaScript.
    -   **No tiene acceso directo a las APIs de Node.js ni al sistema de archivos por razones de seguridad.**
    -   En este proyecto, está representado por los archivos `index.html` (y su `renderer.js`) y `login.html` (y su `login.js`).

3.  **Comunicación IPC (Inter-Process Communication):**
    -   Para que el frontend (que no puede acceder a la base de datos) pueda solicitar o enviar datos, se utiliza un puente seguro llamado **IPC**.
    -   El archivo `preload.js` actúa como este puente. Expone funciones específicas y seguras desde el proceso principal al proceso de renderizado.
    -   **Flujo:** El `renderer.js` llama a una función en `window.api` (definida en `preload.js`), que a su vez envía un mensaje IPC a `main.js`. `main.js` procesa la solicitud (ej. consulta a la BD), y devuelve el resultado por el mismo canal.

## 3. Estructura del Proyecto

A continuación, se detalla la estructura de archivos y directorios del proyecto, explicando el propósito de cada elemento.

```
ContentTracker/
│
├── 📂 frontend/
│   ├── 📂 assets/
│   │   ├── 📂 css/
│   │   │   ├── login.css       # Estilos específicos para la pantalla de login/registro.
│   │   │   ├── main.css        # Estilos placeholder, no utilizados activamente en la app principal.
│   │   │   └── style.css       # Hoja de estilos principal para la aplicación (dashboard, biblioteca, etc.).
│   │   └── 📂 js/
│   │       ├── login.js        # Lógica de frontend para la autenticación (login/registro).
│   │       ├── main.js         # Script placeholder, no utilizado activamente.
│   │       └── renderer.js     # Lógica principal del frontend (renderizado de vistas, gráficos, etc.).
│   └── 📂 pages/
│       └── index.html          # Página HTML placeholder, no utilizada en la aplicación final.
│
├── 📄 .gitignore                # Especifica qué archivos y directorios deben ser ignorados por Git.
├── 📄 ContentTracker_database.db # El archivo de la base de datos SQLite. Contiene todos los datos del usuario.
├── 📄 index.html                # El punto de entrada HTML para la ventana principal de la aplicación.
├── 📄 LICENSE                   # Archivo de licencia del software (MIT License).
├── 📄 login.html                # El punto de entrada HTML para la ventana de login.
├── 📄 main.js                   # El corazón de la aplicación. El script del Proceso Principal de Electron.
├── 📄 package.json              # Define los metadatos del proyecto, dependencias (npm) y scripts de ejecución.
├── 📄 package-lock.json         # Registra la versión exacta de cada dependencia instalada.
├── 📄 preload.js                # Script de precarga que actúa como puente seguro entre el frontend y el backend.
├── 📄 README.md                 # Documentación general del proyecto para usuarios y desarrolladores.
└── 📄 requirements.txt          # Lista de dependencias de Python (actualmente no integradas en el flujo principal).
```

## 4. Análisis Detallado de Componentes

### 4.1. Proceso Principal (Backend - Electron)

#### `main.js`
Este es el archivo más importante del backend. Sus responsabilidades son:
- **Inicialización de Electron:** Importa los módulos necesarios (`app`, `BrowserWindow`, `ipcMain`).
- **Gestión de Ventanas:**
    -   `createWindow()`: Función principal que inicia el proceso creando la ventana de login.
    -   `createLoginWindow()`: Crea la ventana de autenticación (`login.html`), definiendo su tamaño y propiedades.
    -   `createMainWindow()`: Crea la ventana principal de la aplicación (`index.html`) una vez que el usuario se ha autenticado.
- **Inicialización de la Base de Datos:**
    -   `initializeDatabase()`: Se conecta al archivo `ContentTracker_database.db` usando el paquete `sqlite3`. Verifica que las tablas `resources` y `users` existan.
- **Manejo de Ciclo de Vida de la App:**
    -   `app.whenReady()`: Ejecuta el código de inicialización una vez que Electron está listo.
    -   `app.on('window-all-closed', ...)`: Cierra la aplicación cuando todas las ventanas se han cerrado (excepto en macOS).
    -   `app.on('activate', ...)`: Re-crea la ventana si la aplicación se activa y no hay ventanas abiertas.
- **Manejadores de IPC (`ipcMain.handle`):**
    -   Esta es la **API del backend**. Cada `ipcMain.handle` define un "endpoint" que el frontend puede invocar.
    -   **Autenticación:** `authenticate-user`, `register-user`, `get-user-info`, etc.
    -   **CRUD de Contenido:** `create-content`, `get-all-content`, `update-content`, `delete-content`.
    -   **Búsqueda y Filtros:** `search-content`, `filter-content`.
    -   **Estadísticas:** `get-dashboard-stats`, `get-content-by-type`, `get-annual-progress`, etc.
    -   Cada manejador ejecuta una consulta SQL en la base de datos y devuelve una promesa con el resultado (`{ success: true, data: ... }` o `{ success: false, error: ... }`).

#### `preload.js`
Este script es un guardián de seguridad. Su única misión es exponer de forma controlada la funcionalidad del `main.js` al `renderer.js`.
- **`contextBridge.exposeInMainWorld('api', ...)`:** Esta es la función clave. Crea un objeto global `window.api` en el proceso de renderizado.
- **Mapeo de Funciones:** Por cada "endpoint" definido en `main.js` con `ipcMain.handle`, hay una función correspondiente en `preload.js`. Por ejemplo, la llamada `window.api.createContent(itemData)` en el frontend, internamente ejecuta `ipcRenderer.invoke('create-content', itemData)`, enviando la solicitud al `main.js`.
- **Seguridad:** Al no exponer `ipcRenderer` directamente, se evita que el frontend pueda enviar mensajes IPC arbitrarios, limitándolo solo a las funciones definidas en el objeto `api`.

### 4.2. Proceso de Renderizado (Frontend)

#### `index.html`
- **Estructura base de la aplicación principal.**
- Contiene un `<header>` con los botones de navegación (`Dashboard`, `Añadir Contenido`, `Mi Biblioteca`).
- Un `<main id="main-content">` que actúa como contenedor donde `renderer.js` inyectará dinámicamente el contenido de cada vista.
- Importa `style.css` para los estilos y `renderer.js` para la lógica.
- Incluye la librería `Chart.js` desde un CDN para los gráficos.
- Define una `Content-Security-Policy` (CSP) para restringir desde dónde se pueden cargar recursos, mejorando la seguridad.

#### `login.html`
- **Estructura de la ventana de autenticación.**
- Contiene dos formularios: uno para iniciar sesión (`#loginForm`) y otro para registrarse (`#registerForm`).
- Importa `login.css` para sus estilos específicos y `login.js` para su lógica.

#### `frontend/assets/js/renderer.js`
- **El cerebro del frontend de la aplicación principal.**
- **Gestión de Vistas:**
    -   `switchView(viewName)`: Función central que maneja la navegación. Limpia el contenido de `<main>` y llama a la función de renderizado apropiada (`renderDashboardView`, `renderAddContentView`, etc.).
- **Renderizado Dinámico de Vistas:**
    -   Las funciones `render...View()` generan el HTML necesario para cada sección (Dashboard, formulario de añadir, tabla de la biblioteca) y lo inyectan en el DOM. Esto crea una experiencia de "Single-Page Application" (SPA).
- **Comunicación con el Backend:**
    -   Utiliza el objeto `window.api` (expuesto por `preload.js`) para todas las operaciones de datos. Por ejemplo, `window.api.getAllContent()` para obtener la lista de libros.
- **Renderizado de Gráficos:**
    -   Funciones como `renderMonthlyChart`, `renderTypeChart`, etc., utilizan los datos obtenidos del backend para crear y actualizar los gráficos de Chart.js.
- **Manejo de Eventos:**
    -   Configura todos los `addEventListener` para botones, formularios, filtros, etc. Por ejemplo, el envío del formulario de "Añadir Contenido" es capturado por `handleAddContentSubmit`.

#### `frontend/assets/js/login.js`
- **Lógica de la ventana de autenticación.**
- **Manejo de Formularios:** Captura los eventos `submit` de los formularios de login y registro.
- **Validación:** Realiza validaciones básicas en el frontend (ej. que las contraseñas coincidan).
- **Comunicación con el Backend:** Llama a `window.api.authenticateUser(...)` o `window.api.registerUser(...)`.
- **Gestión de Sesión (Local):**
    -   Utiliza `localStorage` para guardar un token o identificador de usuario simple (`'currentUser'`).
    -   `checkExistingSession()`: Al cargar, verifica si hay un usuario guardado para ofrecer un inicio de sesión rápido.
    -   `handleSuccessfulLogin()`: Si la autenticación es exitosa, guarda la sesión y llama a `window.api.openMainApp()` para abrir la ventana principal.

### 4.3. Estilos (CSS)

#### `frontend/assets/css/style.css`
- **Estilos de la aplicación principal.**
- Define la apariencia del header, la navegación, las tarjetas de estadísticas, los formularios, las tablas y los contenedores de los gráficos.
- Utiliza un enfoque moderno con Flexbox y Grid para el layout.
- Incluye estilos para los estados de los botones (`active`, `hover`) y animaciones sutiles para mejorar la experiencia de usuario.

#### `frontend/assets/css/login.css`
- **Estilos exclusivos para `login.html`.**
- Crea un layout centrado y atractivo para los formularios de autenticación.
- Define el diseño de la tarjeta de login, los campos de entrada y los mensajes de error/éxito.
- Incluye animaciones para la transición entre el formulario de login y el de registro.

#### `frontend/assets/css/main.css`
- Un archivo de estilos residual, probablemente de una etapa anterior del desarrollo. No parece ser utilizado por las ventanas principales (`index.html`, `login.html`).

### 4.4. Base de Datos

#### `ContentTracker_database.db`
- Es un único archivo que contiene toda la información de la aplicación.
- **Portabilidad:** Al ser un solo archivo, es fácil de respaldar o mover.
- **Esquema de Tablas:**
    -   **`users`**: Almacena la información de los usuarios.
        -   `id`: Clave primaria.
        -   `username`, `email`: Credenciales únicas.
        -   `password_hash`: Almacena la contraseña (actualmente en texto plano, pero nombrado para un futuro hash).
        -   `created_at`, `updated_at`: Timestamps de auditoría.
    -   **`resources`**: Almacena cada pieza de contenido registrada.
        -   `id`: Clave primaria.
        -   `title`, `author`, `type`, `genre`, `rating`, `notes`: Campos descriptivos.
        -   `start_date`, `end_date`: Para seguimiento del progreso.
        -   `pages`, `episodes`, `duration_mins`: Métricas específicas del tipo de contenido.
        -   `userid`: Clave foránea que vincula el recurso a un usuario (aunque la lógica actual no la usa extensivamente, está preparada para multi-usuario).

### 4.5. Configuración y Dependencias

#### `package.json`
- **Manifiesto del proyecto Node.js.**
- **`name`, `version`, `description`, `author`, `license`**: Metadatos básicos.
- **`main`**: "main.js", indica a Electron cuál es el script del proceso principal.
- **`scripts`**:
    -   `"start": "electron ."`: El comando principal para ejecutar la aplicación en modo de desarrollo.
    -   `"build"`, `"dist"`, `"pack"`: Comandos para empaquetar la aplicación para producción usando `electron-builder`.
    -   Otros scripts para tareas de desarrollo como `lint`, `clean`, etc.
- **`dependencies`**:
    -   `electron-is-dev`: Utilidad para detectar si la aplicación se ejecuta en modo desarrollo o producción.
    -   `sqlite3`: El driver de Node.js para interactuar con la base de datos SQLite.
- **`devDependencies`**:
    -   `electron`: El propio framework de Electron.
    -   `electron-builder`: Herramienta para construir y empaquetar la aplicación en instaladores nativos (.exe, .dmg, etc.).
- **`build`**: Configuración específica para `electron-builder`, como el `appId` y los directorios de salida.

#### `requirements.txt`
- Define las dependencias de Python para un posible backend alternativo o para scripts de análisis de datos.
- **Actualmente, estas dependencias y el backend de Python no están integrados en el flujo de la aplicación Electron.** La aplicación funciona de manera autónoma con el backend de Node.js/Electron. Este archivo representa una exploración o una futura dirección del proyecto.

### 4.6. Otros Archivos

#### `.gitignore`
- Un archivo de configuración crucial para el control de versiones con Git.
- Lista todos los archivos y carpetas que no deben ser subidos al repositorio.
- **Ejemplos importantes:**
    -   `node_modules/`: Carpeta con todas las dependencias de npm, que puede ser muy pesada y se reinstala con `npm install`.
    -   `dist/`, `build/`: Carpetas con los artefactos de construcción de la aplicación.
    -   `*.db`: Para evitar subir el archivo de la base de datos con datos personales.
    -   Archivos de sistema operativo (`.DS_Store`) y de IDEs (`.vscode/`, `.idea/`).

#### `LICENSE`
- Contiene el texto de la Licencia MIT.
- Es un documento legal que define los términos bajo los cuales el software puede ser usado, modificado y distribuido. La licencia MIT es muy permisiva, lo que permite un uso amplio del código.

#### `README.md`
- La puerta de entrada al proyecto.
- Proporciona una visión general de alto nivel, instrucciones de instalación y uso, y una descripción de las características.
- Está orientado tanto a usuarios finales como a otros desarrolladores que quieran contribuir o entender el proyecto.
