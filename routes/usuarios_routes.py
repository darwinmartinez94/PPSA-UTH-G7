from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
import jwt
from models.usuarios import Usuario

usuario_bp = Blueprint('usuario', __name__)
SECRET_KEY = ''

def serializar_usuario(usuario):
    usuario['_id'] = str(usuario['_id'])
    return usuario

# Crear un nuevo usuario
@usuario_bp.route('/usuarios', methods=['POST'])
def crear_usuario():
    from app import db
    data = request.json
    usuario = Usuario(db)
    resultado = usuario.crear_usuario(
        data['nombre'],
        data['correo'],
        data['contrasenia'], 
        data['rol']
    )
    
    return jsonify(str(resultado.inserted_id)), 201

# Ruta para el inicio de sesión
@usuario_bp.route('/usuarios/login', methods=['POST'])
def login_usuario():
    from app import db
    data = request.json
    usuario = Usuario(db)
    
    if usuario.verificar_contrasenia(data['correo'], data['contrasenia']):
        usuario_data = usuario.obtener_usuario_por_correo(data['correo'])
        rol = usuario_data.get("rol")
        nombre = usuario_data.get("nombre")

        payload = {
            "correo": data['correo'],
            "nombre": nombre,
            "rol": rol,
            "exp": datetime.utcnow() + timedelta(hours=1)
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
        
        return jsonify({"token": token, "rol": rol, "nombre": nombre, "mensaje": "Inicio de sesión exitoso"}), 200
        
    else:
        return jsonify({"error": "Credenciales incorrectas"}), 401


#ruta para actualizar contraseña desde el perfil
@usuario_bp.route('/usuarios/actualizar_contrasenia', methods=['PUT'])
def actualizar_contrasenia():
    token = request.headers.get('Authorization')  # Obtener el token del encabezado
    
    if not token or "Bearer " not in token:
        return jsonify({"error": "Token no proporcionado o mal formateado"}), 401

    try:
        # Decodificar el token
        token = token.split(" ")[1]
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        
        # Obtener el correo del payload
        correo = payload.get('correo')
        if not correo:
            return jsonify({"error": "Correo no encontrado en el token"}), 400
        
        # Obtener los datos del usuario desde la DB
        from app import db
        usuario = Usuario(db)
        usuario_data = usuario.obtener_usuario_por_correo(correo)
        
        if not usuario_data:
            return jsonify({"error": "Usuario no encontrado"}), 404
        
        # Extraer la nueva contraseña del cuerpo de la solicitud
        nueva_contrasenia = request.json.get('contrasenia')
        
        if not nueva_contrasenia:
            return jsonify({"error": "La nueva contraseña es requerida"}), 400
        
        # Actualizar la contraseña
        resultado = usuario.actualizar_usuario(usuario_data['_id'], {"contrasenia": nueva_contrasenia})
        
        if resultado.modified_count == 0:
            return jsonify({"error": "No se pudo actualizar la contraseña"}), 500

        return jsonify({"mensaje": "Contraseña actualizada exitosamente"}), 200
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "El token ha expirado"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "Token inválido"}), 401
    except Exception as e:
        return jsonify({"error": f"Error interno: {str(e)}"}), 500


# Obtener todos los usuarios
@usuario_bp.route('/usuarios', methods=['GET'])
def obtener_usuarios():
    from app import db
    usuario = Usuario(db)
    usuarios = usuario.obtener_usuarios()
    usuarios_serializados = [{"_id": str(usr["_id"]), "nombre": usr["nombre"], "correo": usr["correo"], "rol": usr["rol"]} for usr in usuarios]
    return jsonify(usuarios_serializados), 200

#obtener usuario por id

# Actualizar un usuario
@usuario_bp.route('/usuarios/<usuario_id>', methods=['PUT'])
def actualizar_usuario(usuario_id):
    from app import db
    data = request.json
    usuario = Usuario(db)

    actualizaciones = {
        "nombre": data.get('nombre'),
        "correo": data.get('correo'),
        "rol": data.get('rol'),
    }

    # Si se proporciona una contraseña, incluirla en las actualizaciones
    if 'contrasenia' in data and data['contrasenia']:
        actualizaciones['contrasenia'] = data['contrasenia']

    resultado = usuario.actualizar_usuario(usuario_id, actualizaciones)

    return jsonify({"mensaje": "Usuario actualizado", "resultado": resultado.modified_count}), 200

# Eliminar un usuario 
@usuario_bp.route('/usuarios/<usuario_id>', methods=['DELETE'])
def eliminar_usuario(usuario_id):
    from app import db
    usuario = Usuario(db)
    resultado = usuario.eliminar_usuario(usuario_id)
    
    if resultado.deleted_count > 0:
        return jsonify({"mensaje": "Usuario eliminado"}), 200
    return jsonify({"error": "Usuario no encontrado"}), 404

##contar el total de usuarios
@usuario_bp.route('/usuarios/count', methods=['GET'])
def contar_usuarios():
    from app import db
    count = db['usuarios'].count_documents({})
    return jsonify({"total_usuarios": count}), 200

