from flask import Blueprint, request, jsonify
from models.producto import Producto

# Crear un blueprint para las rutas de productos
producto_bp = Blueprint('producto', __name__)

# Función auxiliar para serializar el producto con ObjectId
def serializar_producto(producto):
    producto['_id'] = str(producto['_id'])  
    return producto

# Crear un nuevo producto
@producto_bp.route('/productos', methods=['POST'])
def crear_producto():
    from app import db
    data = request.json
    producto = Producto(db)
    
    caducidad = data.get('caducidad', None)
    stock_min = data.get('stock_min', 0)
    stock_max = data.get('stock_max', None)
    
    resultado = producto.crear_producto(
        data['nombre'],
        data['descripcion'],
        data['categoria'],
        data['cantidad_stock'],
        data['precio_unitario'],
        data['proveedor'],
        data['actualizado_por'],
        data['disponible'],
        caducidad, 
        stock_min,
        stock_max
    )
    
    return jsonify(str(resultado.inserted_id)), 201

# Obtener todos los productos
@producto_bp.route('/productos', methods=['GET'])
def obtener_productos():
    from app import db
    producto = Producto(db)
    productos = producto.obtener_productos()
    productos_serializados = [serializar_producto(prod) for prod in productos]
    return jsonify(productos_serializados), 200

# Obtener un producto por ID
@producto_bp.route('/productos/<producto_id>', methods=['GET'])
def obtener_producto_por_id(producto_id):
    from app import db
    producto = Producto(db)
    producto_encontrado = producto.obtener_producto_por_id(producto_id)
    
    if producto_encontrado:
        return jsonify(serializar_producto(producto_encontrado)), 200
    return jsonify({"error": "Producto no encontrado"}), 404

# Actualizar un producto 
@producto_bp.route('/productos/<producto_id>', methods=['PUT'])
def actualizar_producto(producto_id):
    from app import db
    data = request.json
    producto = Producto(db)
    
    actualizaciones = {
        "nombre": data.get('nombre'),
        "descripcion": data.get('descripcion'),
        "categoria": data.get('categoria'),
        "cantidad_stock": data.get('cantidad_stock'),
        "precio_unitario": data.get('precio_unitario'),
        "proveedor": data.get('proveedor'),
        "disponible": data.get('disponible'),
        "actualizado_por": data.get('actualizado_por'),
        "caducidad": data.get('caducidad'),
        "stock_min": data.get('stock_min'),
        "stock_max": data.get('stock_max')
    }

    resultado = producto.actualizar_producto(producto_id, actualizaciones, data['actualizado_por'])
    
    return jsonify({"mensaje": "Producto actualizado", "resultado": resultado.modified_count}), 200

# Eliminar un producto
@producto_bp.route('/productos/<producto_id>', methods=['DELETE'])
def eliminar_producto(producto_id):
    from app import db
    producto = Producto(db)
    resultado = producto.eliminar_producto(producto_id)
    
    if resultado.deleted_count > 0:
        return jsonify({"mensaje": "Producto eliminado"}), 200
    return jsonify({"error": "Producto no encontrado"}), 404


# Verificar el stock de un producto
@producto_bp.route('/productos/<producto_id>/verificar_stock', methods=['GET'])
def verificar_stock(producto_id):
    from app import db
    producto = Producto(db)

    mensaje = producto.verificar_stock(producto_id)
    return jsonify({"mensaje": mensaje}), 200

# Obtener el conteo de productos
@producto_bp.route('/productos/count', methods=['GET'])
def obtener_conteo_productos():
    from app import db
    producto = Producto(db)
    total_productos = producto.collection.count_documents({})
    return jsonify({"total_productos": total_productos}), 200
