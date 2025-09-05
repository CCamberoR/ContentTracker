"""
API endpoints para Content Tracker
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import sys
import os

# Agregar el directorio padre al path para importar módulos
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.analyzer import ContentAnalyzer
from models.content import ContentModel

app = Flask(__name__)
CORS(app)  # Permitir CORS para requests desde Electron

@app.route('/api/health', methods=['GET'])
def health_check():
    """Verificar que la API está funcionando"""
    return jsonify({
        "status": "ok",
        "message": "Content Tracker API is running",
        "version": "1.0.0"
    })

@app.route('/api/analyze', methods=['POST'])
def analyze_content():
    """Analizar contenido"""
    try:
        data = request.get_json()
        analyzer = ContentAnalyzer()
        result = analyzer.analyze(data)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Obtener estadísticas"""
    try:
        model = ContentModel()
        stats = model.get_stats()
        return jsonify(stats)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
