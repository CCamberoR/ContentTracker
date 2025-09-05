// ContentTracker - Scripts principales
const { spawn } = require('child_process');
const path = require('path');

/**
 * Prueba la conexión con Python y muestra información del sistema
 */
function testPython() {
    const output = document.getElementById('output');
    output.textContent = 'Ejecutando script de Python...\n';
    
    // Ejecutar un script de Python simple
    const python = spawn('python', ['-c', `
import sys
import pandas as pd
import matplotlib
import sklearn

print("¡Python funcionando correctamente!")
print(f"Python version: {sys.version}")
print(f"Pandas version: {pd.__version__}")
print(f"Matplotlib version: {matplotlib.__version__}")
print(f"Scikit-learn version: {sklearn.__version__}")
print("\\n✓ Todas las librerías están instaladas correctamente")
    `]);
    
    python.stdout.on('data', (data) => {
        output.textContent += data.toString();
    });
    
    python.stderr.on('data', (data) => {
        output.textContent += '❌ Error: ' + data.toString();
    });
    
    python.on('close', (code) => {
        if (code === 0) {
            output.textContent += '\n✅ Proceso completado exitosamente';
        } else {
            output.textContent += `\n❌ Proceso terminado con código de error: ${code}`;
        }
    });
}

/**
 * Ejecuta el backend de Python
 */
function runBackend() {
    const output = document.getElementById('output');
    output.textContent = 'Iniciando backend de Python...\n';
    
    const backendPath = path.join(__dirname, '..', '..', 'backend', 'main.py');
    const python = spawn('python', [backendPath]);
    
    python.stdout.on('data', (data) => {
        output.textContent += data.toString();
    });
    
    python.stderr.on('data', (data) => {
        output.textContent += 'Error: ' + data.toString();
    });
    
    python.on('close', (code) => {
        output.textContent += `\nBackend terminado con código: ${code}`;
    });
}

/**
 * Muestra información del sistema
 */
function showSystemInfo() {
    const output = document.getElementById('output');
    output.textContent = 'Información del sistema:\n\n';
    
    // Información de Node.js
    output.textContent += `Node.js version: ${process.version}\n`;
    output.textContent += `Electron version: ${process.versions.electron}\n`;
    output.textContent += `Chrome version: ${process.versions.chrome}\n`;
    output.textContent += `Platform: ${process.platform}\n`;
    output.textContent += `Architecture: ${process.arch}\n`;
    output.textContent += `Working directory: ${process.cwd()}\n`;
}

// Evento cuando la página está lista
document.addEventListener('DOMContentLoaded', () => {
    console.log('Content Tracker iniciado correctamente');
    
    // Agregar event listeners
    const testButton = document.getElementById('test-python-btn');
    const backendButton = document.getElementById('run-backend-btn');
    const infoButton = document.getElementById('system-info-btn');
    
    if (testButton) {
        testButton.addEventListener('click', testPython);
    }
    
    if (backendButton) {
        backendButton.addEventListener('click', runBackend);
    }
    
    if (infoButton) {
        infoButton.addEventListener('click', showSystemInfo);
    }
});

// Exportar funciones para uso global
window.testPython = testPython;
window.runBackend = runBackend;
window.showSystemInfo = showSystemInfo;
