from datetime import datetime
from bson import ObjectId
import bcrypt 

class Usuario:
    def __init__(self, db):
        self.db = db
        self.collection = self.db['usuarios'] 

    def crear_usuario(self, nombre, correo, contrasenia, rol):
        # Encriptar la contraseña
        contrasenia_encriptada = bcrypt.hashpw(contrasenia.encode('utf-8'), bcrypt.gensalt())
        nuevo_usuario = {
            "nombre": nombre,
            "correo": correo,
            "contrasenia": contrasenia_encriptada,  
            "rol": rol,
            "fecha_creacion": datetime.now(),
        }
        return self.collection.insert_one(nuevo_usuario)

    def obtener_usuarios(self):
        return list(self.collection.find())

    def obtener_usuario_por_id(self, usuario_id):
        return self.collection.find_one({"_id": ObjectId(usuario_id)})

    def actualizar_usuario(self, usuario_id, actualizaciones):
    # Validar que las actualizaciones incluyan una contraseña válida
        if 'contrasenia' in actualizaciones:
            nueva_contrasenia = actualizaciones['contrasenia']
            if not nueva_contrasenia or len(nueva_contrasenia) < 6:
             raise ValueError("La contraseña debe tener al menos 6 caracteres.")
        
            # Encriptar la contraseña antes de guardarla
            actualizaciones['contrasenia'] = bcrypt.hashpw(
                nueva_contrasenia.encode('utf-8'),
                bcrypt.gensalt()
        )

        # Agregar fecha de actualización
        actualizaciones['fecha_actualizacion'] = datetime.now()

        # Actualizar el documento en la base de datos
        return self.collection.update_one(
            {"_id": ObjectId(usuario_id)},  # Convertir ID si es necesario
            {"$set": actualizaciones}
    )


    def eliminar_usuario(self, usuario_id):
        return self.collection.delete_one({"_id": ObjectId(usuario_id)})

    def verificar_contrasenia(self, correo, contrasenia):
        usuario = self.collection.find_one({"correo": correo})
        if usuario and bcrypt.checkpw(contrasenia.encode('utf-8'), usuario['contrasenia']):
            return True
        return False

    #obtener los datos del usuario
    def obtener_usuario_por_correo(self, correo):
        return self.collection.find_one({"correo": correo})
