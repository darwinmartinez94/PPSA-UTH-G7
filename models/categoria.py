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
