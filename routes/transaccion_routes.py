from flask import Blueprint, request, jsonify
from models.transaccion import Transaccion
from models.producto import Producto

transaccion_bp = Blueprint('transaccion', __name__)

@transaccion_bp.route('/transacciones', methods=['POST'])
def crear_transaccion():
    from app import db
    data = request.json
    # Obtener el nombre del usuario logueado desde el contexto
    usuario = data.get('usuario')

    # Verificar que el producto exista
    producto_id = data.get('producto')
    if not producto_id:
        return jsonify({"error": "El campo producto es requerido"}), 422

    producto = Producto(db).obtener_producto_por_id(producto_id)
    if not producto:
        return jsonify({"error": "Producto no encontrado"}), 404

    # pasar id y nombre del producto
    producto_info = {
        "id": str(producto["_id"]),
        "nombre": producto["nombre"]
    }

    # Calcular el nuevo stock
    tipo_transaccion = data.get('tipo_transaccion')
    cantidad = int(data.get('cantidad', 0))
    nuevo_stock = (
        producto['cantidad_stock'] + cantidad
        if tipo_transaccion == "entrada"
        else producto['cantidad_stock'] - cantidad
    )

    #verificar que el stock no sea > que el maximo ni < que el minimo
    if tipo_transaccion == "entrada" and producto['stock_max'] and nuevo_stock > producto['stock_max']:
        return jsonify({"error": f"Stock actual: {producto['cantidad_stock']}. El stock Maximo es: {producto['stock_max']} ¡No lo puede exceder!"}), 400
    if tipo_transaccion == "salida" and nuevo_stock < producto['stock_min']:
        return jsonify({"error": f"Stock actual: {producto['cantidad_stock']}. El stock Minimo es: {producto['stock_min']} ¡No lo puede bajar!"}),400
    if tipo_transaccion == "salida" and producto['cantidad_stock'] < cantidad:
        return jsonify({"error": "Stock insuficiente"}), 400

    # Crear la transacción y actualizar el stock del producto
    transaccion = Transaccion(db)
    transaccion.crear_transaccion(tipo_transaccion, producto_info, cantidad, usuario)
    Producto(db).actualizar_stock(producto_id, nuevo_stock)

    return jsonify({"mensaje": "Transacción registrada y stock actualizado"}), 201

# Serializar la transacción
def serializar_transaccion(transaccion): 
    transaccion['_id'] = str(transaccion['_id']) 
    if 'producto' in transaccion and isinstance(transaccion['producto'], dict): 
        transaccion['producto']['id'] = str(transaccion['producto']['id'])
    return transaccion
 

# Ruta para obtener la lista de transacciones
@transaccion_bp.route('/transacciones', methods=['GET'])
def obtener_transacciones():
    from app import db
    transaccion = Transaccion(db)
    transacciones = transaccion.obtener_transacciones()
    transacciones_serializadas = [serializar_transaccion(tran) for tran in transacciones]
    return jsonify(transacciones_serializadas), 200

# Ruta para obtener la lista de productos
@transaccion_bp.route('/productos', methods=['GET'])
def obtener_productos():
    from app import db
    producto = Producto(db)
    productos = producto.obtener_productos()  
    productos_serializados = [{"_id": str(prod['_id']), "nombre": prod['nombre']} for prod in productos]
    return jsonify(productos_serializados), 200

# Conteo de transacciones
@transaccion_bp.route('/transacciones/count/', methods=['GET'])
def contar_transacciones():
    from app import db
    count = db['transaccion'].count_documents({})
    return jsonify({"total_transacciones": count}), 200
