from flask import Flask
from pymongo import MongoClient
from dotenv import load_dotenv
from flask_cors import CORS
import os


from routes.producto_routes import producto_bp
from routes.categoria_routes import categoria_bp
from routes.proveedor_routes import proveedor_bp
from routes.usuarios_routes import usuario_bp
from routes.transaccion_routes import transaccion_bp


# Cargar las variables de entorno
load_dotenv()

app = Flask(__name__)
CORS(app)  # Habilitar CORS

# Conexión a MongoDB
client = MongoClient(os.getenv("MONGO_URI"))
db = client['inventario_db']  # Nombre de la base de datos

# Registrar los blueprints
app.register_blueprint(producto_bp, url_prefix='/api')
app.register_blueprint(categoria_bp, url_prefix='/api')
app.register_blueprint(proveedor_bp, url_prefix='/api')
app.register_blueprint(usuario_bp, url_prefix='/api')
app.register_blueprint(transaccion_bp, url_prefix='/api')

@app.route('/')
def home():
    return "Sistema de Inventario UTH-PPSA-G7"

if __name__ == "__main__":
    app.run(debug=True)
