"""
Utility functions for Content Tracker
"""

import os
import json
import logging
from datetime import datetime
import pandas as pd

def setup_logging(log_level=logging.INFO):
    """Configurar logging para la aplicación"""
    logging.basicConfig(
        level=log_level,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler('logs/app.log'),
            logging.StreamHandler()
        ]
    )

def ensure_directory(path):
    """Asegurar que un directorio existe"""
    if not os.path.exists(path):
        os.makedirs(path)
        return True
    return False

def load_config(config_file='config/app.json'):
    """Cargar configuración desde archivo JSON"""
    if os.path.exists(config_file):
        with open(config_file, 'r') as f:
            return json.load(f)
    return {}

def save_config(config, config_file='config/app.json'):
    """Guardar configuración en archivo JSON"""
    ensure_directory(os.path.dirname(config_file))
    with open(config_file, 'w') as f:
        json.dump(config, f, indent=2)

def format_date(date_obj):
    """Formatear fecha para mostrar"""
    if isinstance(date_obj, str):
        date_obj = pd.to_datetime(date_obj)
    return date_obj.strftime('%Y-%m-%d %H:%M:%S')

def calculate_engagement_rate(likes, comments, shares, views):
    """Calcular tasa de engagement"""
    if views == 0:
        return 0
    return (likes + comments + shares) / views

def export_to_csv(data, filename):
    """Exportar datos a CSV"""
    if isinstance(data, dict):
        df = pd.DataFrame(data)
    else:
        df = data
    
    ensure_directory('exports')
    filepath = os.path.join('exports', filename)
    df.to_csv(filepath, index=False)
    return filepath

def get_file_size(filepath):
    """Obtener tamaño de archivo en formato legible"""
    if not os.path.exists(filepath):
        return "File not found"
    
    size = os.path.getsize(filepath)
    for unit in ['B', 'KB', 'MB', 'GB']:
        if size < 1024.0:
            return f"{size:.1f} {unit}"
        size /= 1024.0
    return f"{size:.1f} TB"
