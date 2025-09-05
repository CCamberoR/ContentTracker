# Guía de Instalación - Content Tracker

## Prerrequisitos

### Software necesario:
- **Python 3.8+** - [Descargar aquí](https://www.python.org/downloads/)
- **Node.js 16+** - [Descargar aquí](https://nodejs.org/)
- **Git** - [Descargar aquí](https://git-scm.com/)

### Herramientas recomendadas:
- **UV** - Gestor de paquetes Python (recomendado)
- **Visual Studio Code** - Editor de código

## Instalación paso a paso

### 1. Clonar el repositorio
```bash
git clone https://github.com/CCamberoR/ContentTracker.git
cd ContentTracker
```

### 2. Configurar entorno Python
```bash
# Crear entorno virtual
python -m venv .venv

# Activar entorno virtual
# En Windows:
.venv\Scripts\activate
# En macOS/Linux:
source .venv/bin/activate
```

### 3. Instalar dependencias Python
```bash
# Con UV (recomendado)
uv pip install -r requirements.txt

# O con pip tradicional
pip install -r requirements.txt
```

### 4. Instalar dependencias Node.js
```bash
npm install
```

### 5. Configurar entorno
```bash
# Copiar archivo de configuración
cp .env.example .env

# Editar variables según tu configuración
```

### 6. Probar instalación
```bash
# Probar backend Python
python backend/main.py info

# Probar aplicación Electron
npm start
```

## Solución de problemas

### Error: Python no encontrado
- Verifica que Python esté instalado y en tu PATH
- Usa `python --version` para verificar

### Error: npm command not found
- Instala Node.js desde el sitio oficial
- Reinicia tu terminal después de la instalación

### Error: Dependencias faltantes
```bash
# Reinstalar todo
npm run setup
```

### Error: Permisos en Windows
- Ejecuta como administrador
- O usa PowerShell con permisos elevados

## Scripts disponibles

```bash
npm start          # Iniciar aplicación
npm run dev        # Modo desarrollo
npm run backend    # Solo backend Python
npm run api        # Solo API server
npm run setup      # Instalación completa
```
