from datetime import datetime

class Transaccion:
    def __init__(self, db):
        self.db = db
        self.collection = self.db['transaccion']

    def crear_transaccion(self, tipo_transaccion, producto, cantidad, usuario):
        nueva_transaccion = {
            "tipo_transaccion": tipo_transaccion,
            "producto": producto,
            "cantidad": cantidad,
            "usuario": usuario,
            "fecha": datetime.now(),
        }
        return self.collection.insert_one(nueva_transaccion)
    
    def obtener_transacciones(self):
        return list(self.collection.find())
    
    def contar_transacciones(self):
        return self.collection.count_documents({})

    