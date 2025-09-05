#!/usr/bin/env python3
"""
Content Tracker - Python Backend
Funciones principales para el procesamiento de datos
"""

import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
from datetime import datetime
import json
import sys

def get_system_info():
    """Obtener información del sistema Python"""
    info = {
        "python_version": sys.version,
        "pandas_version": pd.__version__,
        "numpy_version": np.__version__,
        "matplotlib_version": plt.matplotlib.__version__,
        "timestamp": datetime.now().isoformat()
    }
    return info

def process_data_sample():
    """Ejemplo de procesamiento de datos con pandas"""
    # Crear datos de ejemplo
    data = {
        'fecha': pd.date_range('2024-01-01', periods=30, freq='D'),
        'contenido_creado': np.random.randint(1, 10, 30),
        'vistas': np.random.randint(100, 1000, 30),
        'engagement': np.random.uniform(0.1, 0.9, 30)
    }
    
    df = pd.DataFrame(data)
    
    # Análisis básico
    stats = {
        'total_contenido': df['contenido_creado'].sum(),
        'promedio_vistas': df['vistas'].mean(),
        'mejor_engagement': df['engagement'].max(),
        'fecha_mejor_engagement': df.loc[df['engagement'].idxmax(), 'fecha'].strftime('%Y-%m-%d')
    }
    
    return stats

def main():
    """Función principal"""
    if len(sys.argv) > 1:
        command = sys.argv[1]
        
        if command == "info":
            info = get_system_info()
            print(json.dumps(info, indent=2))
        
        elif command == "analyze":
            stats = process_data_sample()
            print(json.dumps(stats, indent=2, default=str))
        
        else:
            print(f"Comando desconocido: {command}")
    else:
        print("Content Tracker Python Backend")
        print("Comandos disponibles:")
        print("  python main.py info     - Información del sistema")
        print("  python main.py analyze  - Análisis de datos de ejemplo")

if __name__ == "__main__":
    main()
