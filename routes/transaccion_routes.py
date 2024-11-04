from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import Blueprint, request, jsonify
from models.transaccion import Transaccion
from models.producto import Producto
import logging

transaccion_bp = Blueprint('transaccion', __name__)

# Configuración de logging
logging.basicConfig(level=logging.INFO)

@transaccion_bp.route('/transacciones', methods=['POST'])
@jwt_required()
def crear_transaccion():
    try:
        from app import db
        data = request.json

        # Obtener el nombre del usuario logueado desde el token
        usuario_logueado = get_jwt_identity()
        nombre_usuario = usuario_logueado.get("nombre")
        logging.info(f"Nombre del usuario logueado: {nombre_usuario}")

        # Verificar que el producto exista
        producto_id = data.get('producto_id')
        if not producto_id:
            logging.error("El campo producto_id es requerido")
            return jsonify({"error": "El campo producto_id es requerido"}), 422

        producto = Producto(db).obtener_producto_por_id(producto_id)
        if not producto:
            logging.error(f"Producto con ID {producto_id} no encontrado")
            return jsonify({"error": "Producto no encontrado"}), 404

        # Preparar el campo producto con el ID y nombre del producto
        producto_info = {
            "id": str(producto["_id"]),
            "nombre": producto["nombre"]
        }
        logging.info(f"Producto encontrado: {producto_info}")

        # Calcular el nuevo stock
        tipo_transaccion = data.get('tipo_transaccion')
        cantidad = int(data.get('cantidad', 0))
        logging.info(f"Tipo de transacción: {tipo_transaccion}, Cantidad: {cantidad}")

        if tipo_transaccion not in ["entrada", "salida"]:
            logging.error("Tipo de transacción inválido")
            return jsonify({"error": "Tipo de transacción inválido"}), 422
        if tipo_transaccion == "salida" and producto['cantidad_stock'] < cantidad:
            logging.error("Stock insuficiente")
            return jsonify({"error": "Stock insuficiente"}), 400

        nuevo_stock = (
            producto['cantidad_stock'] + cantidad if tipo_transaccion == "entrada"
            else producto['cantidad_stock'] - cantidad
        )
        logging.info(f"Nuevo stock calculado: {nuevo_stock}")

        # Crear la transacción y actualizar el stock del producto
        transaccion = Transaccion(db)
        transaccion.crear_transaccion(tipo_transaccion, producto_info, cantidad, nombre_usuario)
        logging.info("Transacción creada exitosamente")

        Producto(db).actualizar_stock(producto_id, nuevo_stock)
        logging.info("Stock del producto actualizado correctamente")

        return jsonify({"mensaje": "Transacción registrada y stock actualizado"}), 201

    except Exception as e:
        logging.error(f"Error en crear_transaccion: {str(e)}")
        return jsonify({"error": "Hubo un error al procesar la solicitud"}), 500




#serializar la transaccion para el frontend
def serializar_transaccion(transaccion):
    transaccion['_id'] = str(transaccion['_id'])
    return transaccion

#lista de transacciones 
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

#conteo de transacciones
@transaccion_bp.route('transacciones/count/', methods=['GET'])
def contar_transacciones():
    from app import db
    count = db['transaccion'].count_documents({})
    return jsonify({"total_transacciones": count}), 200