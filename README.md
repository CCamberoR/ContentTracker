# ContentTracker

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)
[![Electron](https://img.shields.io/badge/Electron-Latest-47848f.svg)](https://www.electronjs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Una aplicación de escritorio para el seguimiento y análisis de contenido, construida con Python y Electron.

## 🚀 Características

- **Interfaz de Usuario Moderna**: Aplicación de escritorio construida con Electron
- **Backend Potente**: Procesamiento de datos con Python y librerías científicas
- **Análisis de Datos**: Integración con pandas, matplotlib y scikit-learn
- **Cross-Platform**: Funciona en Windows, macOS y Linux
- **Arquitectura Modular**: Separación clara entre frontend y backend

## 📁 Estructura del Proyecto

```
ContentTracker/
├── 📂 backend/              # Backend en Python
│   ├── 📂 api/              # Endpoints de la API
│   ├── 📂 core/             # Lógica de negocio
│   ├── 📂 models/           # Modelos de datos
│   ├── 📂 utils/            # Utilidades
│   └── main.py              # Punto de entrada del backend
├── 📂 frontend/             # Frontend en Electron
│   ├── 📂 assets/           # Recursos estáticos
│   │   ├── 📂 css/          # Estilos
│   │   ├── 📂 js/           # JavaScript
│   │   └── 📂 images/       # Imágenes
│   ├── 📂 components/       # Componentes reutilizables
│   └── 📂 pages/            # Páginas de la aplicación
├── 📂 config/               # Archivos de configuración
├── 📂 data/                 # Datos del proyecto
├── 📂 docs/                 # Documentación
├── 📂 tests/                # Pruebas
├── main.js                  # Punto de entrada de Electron
├── package.json             # Dependencias de Node.js
└── requirements.txt         # Dependencias de Python
```

## 🛠️ Instalación

### Prerrequisitos

- **Python 3.8+** instalado
- **Node.js 16+** instalado
- **UV** (recomendado para gestión de paquetes Python)

### Clonar el Repositorio

```bash
git clone https://github.com/CCamberoR/ContentTracker.git
cd ContentTracker
```

### Configurar el Backend (Python)

```bash
# Crear entorno virtual
python -m venv .venv

# Activar entorno virtual
# En Windows:
.venv\Scripts\activate
# En macOS/Linux:
source .venv/bin/activate

# Instalar dependencias con UV (recomendado)
uv pip install -r requirements.txt

# O con pip tradicional
pip install -r requirements.txt
```

### Configurar el Frontend (Electron)

```bash
# Instalar dependencias de Node.js
npm install
```

## 🚀 Uso

### Ejecutar la Aplicación

```bash
# Iniciar la aplicación Electron
npm start
```

### Ejecutar Solo el Backend

```bash
# Activar entorno virtual (si no está activo)
.venv\Scripts\activate  # Windows
source .venv/bin/activate  # macOS/Linux

# Ejecutar backend
python backend/main.py
```

### Desarrollo

```bash
# Modo desarrollo con recarga automática
npm run dev
```

## 🧪 Testing

```bash
# Ejecutar pruebas de Python
python -m pytest tests/

# Ejecutar pruebas de JavaScript
npm test
```

## 📊 Dependencias

### Python (Backend)
- **pandas**: Manipulación y análisis de datos
- **matplotlib**: Visualización de datos
- **scikit-learn**: Machine learning y análisis estadístico

### JavaScript (Frontend)
- **Electron**: Framework para aplicaciones de escritorio
- **Node.js**: Entorno de ejecución

## 🔧 Configuración

Los archivos de configuración se encuentran en la carpeta `config/`. 

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Configuración del servidor
PORT=3000
DEBUG=true

# Configuración de la base de datos
DATABASE_URL=sqlite:///data/contenttracker.db
```

## 📚 Documentación

La documentación completa se encuentra en la carpeta `docs/`.

- [Guía de Instalación](docs/installation.md)
- [Guía de Desarrollo](docs/development.md)
- [API Reference](docs/api.md)

## 📝 Scripts Disponibles

```bash
# Instalar dependencias
npm install

# Iniciar aplicación
npm start

# Modo desarrollo
npm run dev

# Construir para producción
npm run build

# Ejecutar pruebas
npm test

# Linting
npm run lint
```

## 🐛 Solución de Problemas

### Problemas Comunes

1. **Error de permisos con git**: Asegúrate de tener configuradas las credenciales correctas
2. **Dependencias faltantes**: Ejecuta `npm install` y `uv pip install -r requirements.txt`
3. **Python no encontrado**: Verifica que Python esté en tu PATH

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Autor

**Carlos Cambero** - [@CCamberoR](https://github.com/CCamberoR)