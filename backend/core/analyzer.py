"""
Core business logic for content analysis
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import matplotlib.pyplot as plt
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans

class ContentAnalyzer:
    def __init__(self):
        self.scaler = StandardScaler()
        
    def analyze(self, data):
        """
        Analizar datos de contenido
        """
        try:
            # Convertir a DataFrame si es necesario
            if isinstance(data, dict):
                df = pd.DataFrame(data)
            else:
                df = data
                
            # Análisis básico
            basic_stats = self._get_basic_stats(df)
            
            # Análisis avanzado si hay suficientes datos
            if len(df) > 10:
                advanced_stats = self._get_advanced_stats(df)
                return {**basic_stats, **advanced_stats}
            
            return basic_stats
            
        except Exception as e:
            return {"error": f"Error en análisis: {str(e)}"}
    
    def _get_basic_stats(self, df):
        """Estadísticas básicas"""
        return {
            "total_records": len(df),
            "columns": list(df.columns),
            "summary": df.describe().to_dict() if not df.empty else {},
            "timestamp": datetime.now().isoformat()
        }
    
    def _get_advanced_stats(self, df):
        """Análisis avanzado con machine learning"""
        try:
            # Seleccionar solo columnas numéricas
            numeric_cols = df.select_dtypes(include=[np.number]).columns
            
            if len(numeric_cols) == 0:
                return {"advanced": "No hay columnas numéricas para análisis"}
            
            # Clustering si hay datos suficientes
            if len(df) >= 3 and len(numeric_cols) >= 2:
                X = df[numeric_cols].fillna(0)
                
                # Normalizar datos
                X_scaled = self.scaler.fit_transform(X)
                
                # K-means clustering
                n_clusters = min(3, len(df))
                kmeans = KMeans(n_clusters=n_clusters, random_state=42)
                clusters = kmeans.fit_predict(X_scaled)
                
                return {
                    "clusters": {
                        "n_clusters": n_clusters,
                        "cluster_centers": kmeans.cluster_centers_.tolist(),
                        "labels": clusters.tolist()
                    },
                    "correlations": df[numeric_cols].corr().to_dict()
                }
            
            return {"advanced": "Datos insuficientes para análisis avanzado"}
            
        except Exception as e:
            return {"advanced_error": str(e)}
    
    def generate_sample_data(self, days=30):
        """Generar datos de ejemplo para pruebas"""
        dates = pd.date_range(start=datetime.now() - timedelta(days=days), 
                             end=datetime.now(), freq='D')
        
        data = {
            'fecha': dates,
            'contenido_creado': np.random.poisson(3, len(dates)),
            'vistas': np.random.normal(500, 150, len(dates)).astype(int),
            'likes': np.random.normal(50, 15, len(dates)).astype(int),
            'comentarios': np.random.poisson(5, len(dates)),
            'shares': np.random.poisson(2, len(dates)),
            'engagement_rate': np.random.beta(2, 8, len(dates))
        }
        
        return pd.DataFrame(data)
