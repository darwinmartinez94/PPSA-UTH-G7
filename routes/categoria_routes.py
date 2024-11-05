from flask import Blueprint, request, jsonify 
from models.categoria import Categoria

categoria_bp = Blueprint('categoria', __name__)

@categoria_bp.route('/categorias', methods=['POST'])
def crear_categoria():
    from app import db  
    data = request.json
    categoria = Categoria(db)
    resultado = categoria.crear_categoria(
        data['nombre'],
        data['descripcion']
    )
    return jsonify(str(resultado.inserted_id)), 201

def serializar_categoria(categoria):
    categoria['_id'] = str(categoria['_id']) 
    return categoria

@categoria_bp.route('/categorias', methods=['GET'])
def obtener_categorias():
    from app import db
    categoria = Categoria(db)
    categorias = categoria.obtener_categorias()
    categorias_serializadas = [serializar_categoria(cat) for cat in categorias]
    return jsonify(categorias_serializadas), 200

#contar el total de categorias
@categoria_bp.route('/categorias/count', methods=['GET'])
def contar_categorias():
    from app import db
    count = db['categorias'].count_documents({})
    return jsonify({"total_categorias": count}),200
