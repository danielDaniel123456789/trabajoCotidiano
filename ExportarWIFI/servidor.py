from flask import Flask, request, jsonify
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)

@app.route('/recibir', methods=['POST'])
def recibir():
    datos = request.get_json()
    with open('datos.json', 'w', encoding='utf-8') as f:
        json.dump(datos, f)
    return jsonify({"mensaje": "Datos recibidos correctamente"})

@app.route('/datos.json')
def servir_datos():
    with open('datos.json', 'r', encoding='utf-8') as f:
        contenido = f.read()
    return app.response_class(contenido, mimetype='application/json')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
