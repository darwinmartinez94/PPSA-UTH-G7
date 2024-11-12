from datetime import datetime
from bson import ObjectId


class Categoria:
    def __init__(self, db):
        self.db = db
        self.collection = self.db['categorias'] 

    def crear_categoria(self, nombre, descripcion):
        nueva_categoria = {
            "nombre": nombre,
            "descripcion": descripcion
        }
        return self.collection.insert_one(nueva_categoria)

    def obtener_categorias(self):
        return list(self.collection.find())
    
    def contar_categorias(self):
        return self.collection.count_documents({})
    
    def obtener_categoria_por_id(self, categoria_id):
        return self.collection.find_one({"_id": ObjectId(categoria_id)})

    def actualizar_categoria(self, categoria_id, actualizaciones):
        actualizaciones["fecha_actualizacion"] = datetime.now()
        return self.collection.update_one({"_id": ObjectId(categoria_id)}, {"$set": actualizaciones})

    def eliminar_categoria(self, categoria_id):
        return self.collection.delete_one({"_id": ObjectId(categoria_id)})