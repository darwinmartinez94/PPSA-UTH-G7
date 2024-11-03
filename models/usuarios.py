from datetime import datetime
from bson import ObjectId
import bcrypt 

class Usuario:
    def __init__(self, db):
        self.db = db
        self.collection = self.db['usuarios']  # Colección de usuarios en MongoDB

    def crear_usuario(self, nombre, correo, contrasenia, rol):
        # Encriptar la contraseña
        contrasenia_encriptada = bcrypt.hashpw(contrasenia.encode('utf-8'), bcrypt.gensalt())
        nuevo_usuario = {
            "nombre": nombre,
            "correo": correo,
            "contrasenia": contrasenia_encriptada,  # Guardar la contraseña encriptada
            "rol": rol,
            "fecha_creacion": datetime.now(),
        }
        return self.collection.insert_one(nuevo_usuario)

    def obtener_usuarios(self):
        return list(self.collection.find())

    def obtener_usuario_por_id(self, usuario_id):
        return self.collection.find_one({"_id": ObjectId(usuario_id)})

    def actualizar_usuario(self, usuario_id, actualizaciones):
        # Si la contraseña es parte de las actualizaciones, encriptarla
        if 'contrasenia' in actualizaciones:
            actualizaciones['contrasenia'] = bcrypt.hashpw(actualizaciones['contrasenia'].encode('utf-8'), bcrypt.gensalt())

        actualizaciones['fecha_actualizacion'] = datetime.now()

        return self.collection.update_one({"_id": ObjectId(usuario_id)}, {"$set": actualizaciones})

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
