class Proveedor:
    def __init__(self, db):
        self.db = db
        self.collection = self.db['proveedores']  

    def crear_proveedor(self, nombre, direccion, telefono, email):
        nuevo_proveedor = {
            "nombre": nombre,
            "direccion": direccion,
            "telefono": telefono,
            "email": email
        }
        return self.collection.insert_one(nuevo_proveedor)

    def obtener_proveedores(self):
        return list(self.collection.find())
    

    def contar_proveedores(self):
        return self.collection.count_documents({})
    
    
