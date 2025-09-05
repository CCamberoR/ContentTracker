"""
Data models for Content Tracker
"""

import pandas as pd
import numpy as np
from datetime import datetime
import os
import json

class ContentModel:
    def __init__(self, data_path="../../data"):
        self.data_path = data_path
        self.ensure_data_directory()
    
    def ensure_data_directory(self):
        """Asegurar que el directorio de datos existe"""
        if not os.path.exists(self.data_path):
            os.makedirs(self.data_path)
    
    def save_data(self, data, filename):
        """Guardar datos en formato JSON o CSV"""
        filepath = os.path.join(self.data_path, filename)
        
        if isinstance(data, pd.DataFrame):
            if filename.endswith('.csv'):
                data.to_csv(filepath, index=False)
            else:
                data.to_json(filepath, orient='records', date_format='iso')
        else:
            with open(filepath, 'w') as f:
                json.dump(data, f, indent=2, default=str)
    
    def load_data(self, filename):
        """Cargar datos desde archivo"""
        filepath = os.path.join(self.data_path, filename)
        
        if not os.path.exists(filepath):
            return None
        
        if filename.endswith('.csv'):
            return pd.read_csv(filepath)
        elif filename.endswith('.json'):
            with open(filepath, 'r') as f:
                data = json.load(f)
                return pd.DataFrame(data) if isinstance(data, list) else data
        
        return None
    
    def get_stats(self):
        """Obtener estadísticas generales"""
        stats = {
            "timestamp": datetime.now().isoformat(),
            "data_directory": self.data_path,
            "available_files": []
        }
        
        # Listar archivos disponibles
        if os.path.exists(self.data_path):
            files = os.listdir(self.data_path)
            stats["available_files"] = [f for f in files if f.endswith(('.csv', '.json'))]
        
        return stats
    
    def create_sample_content(self):
        """Crear contenido de ejemplo"""
        sample_data = {
            "posts": [
                {
                    "id": 1,
                    "title": "Introducción al análisis de datos",
                    "content": "En este post exploramos los conceptos básicos...",
                    "date": "2024-01-15",
                    "views": 1250,
                    "likes": 89,
                    "comments": 12,
                    "shares": 5
                },
                {
                    "id": 2,
                    "title": "Python para científicos de datos",
                    "content": "Python se ha convertido en el lenguaje...",
                    "date": "2024-01-20",
                    "views": 2100,
                    "likes": 156,
                    "comments": 23,
                    "shares": 12
                },
                {
                    "id": 3,
                    "title": "Visualización con Matplotlib",
                    "content": "Las visualizaciones son fundamentales...",
                    "date": "2024-01-25",
                    "views": 1850,
                    "likes": 134,
                    "comments": 18,
                    "shares": 8
                }
            ],
            "metrics": {
                "total_views": 5200,
                "total_engagement": 457,
                "average_engagement_rate": 0.088,
                "growth_rate": 0.15
            }
        }
        
        return sample_data
