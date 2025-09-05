# ContentTracker

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)
[![Electron](https://img.shields.io/badge/Electron-Latest-47848f.svg)](https://www.electronjs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Una aplicación de escritorio para el seguimiento y análisis de contenido, construida con Python y Electron.

## 📁 Estructura del Proyecto

```
ContentTracker/
├── 📂 backend/              # Backend en Python
│   ├── __init__.py
│   └── main.py              # Punto de entrada del backend
├── 📂 frontend/             # Frontend en Electron
│   ├── 📂 assets/           # Recursos estáticos
│   │   ├── 📂 css/          # Estilos
│   │   └── 📂 js/           # JavaScript
│   └── 📂 pages/            # Páginas de la aplicación
│       └── index.html       # Página principal
├── main.js                  # Punto de entrada de Electron
├── package.json             # Dependencias de Node.js
├── requirements.txt         # Dependencias de Python
└── README.md               # Este archivo
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

## 📊 Dependencias

### Python (Backend)
- **pandas**: Manipulación y análisis de datos
- **matplotlib**: Visualización de datos
- **scikit-learn**: Machine learning y análisis estadístico

### JavaScript (Frontend)
- **Electron**: Framework para aplicaciones de escritorio
- **Node.js**: Entorno de ejecución

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

# Ejecutar backend
npm run backend
```

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Autor

**Carlos Cambero** - [@CCamberoR](https://github.com/CCamberoR)

---

⭐ ¡No olvides dar una estrella al proyecto si te resulta útil!
