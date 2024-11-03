from flask import Blueprint, request, jsonify  
from models.proveedor import Proveedor

proveedor_bp = Blueprint('proveedor', __name__)

@proveedor_bp.route('/proveedores', methods=['POST'])
def crear_proveedor():
    from app import db  
    data = request.json
    proveedor = Proveedor(db)
    resultado = proveedor.crear_proveedor(
        data['nombre'],
        data['direccion'],
        data['telefono'],
        data['email']
    )
    return jsonify(str(resultado.inserted_id)), 201

def serializar_proveedor(proveedor):
    proveedor['_id'] = str(proveedor['_id'])  
    return proveedor

@proveedor_bp.route('/proveedores', methods=['GET'])
def obtener_proveedores():
    from app import db
    proveedor = Proveedor(db)
    proveedores = proveedor.obtener_proveedores()
    proveedores_serializados = [serializar_proveedor(prov) for prov in proveedores]
    return jsonify(proveedores_serializados), 200

#contar el total de proveedores
@proveedor_bp.route('/proveedores/count', methods=['GET'])
def contar_proveedores():
    from app import db
    count = db['proveedores'].count_documents({})
    return jsonify({"total_proveedores": count}), 200
