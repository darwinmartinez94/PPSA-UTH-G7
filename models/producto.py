from datetime import datetime
from bson import ObjectId

class Producto:
    def __init__(self, db):
        self.db = db
        self.collection = self.db['productos']  # Colección de productos en MongoDB

    def crear_producto(self, nombre, descripcion, categoria, cantidad, precio, proveedor, creado_por, disponible, caducidad=None, stock_min=0, stock_max=None):
        nuevo_producto = {
            "nombre": nombre,
            "descripcion": descripcion,
            "categoria": categoria,
            "cantidad_stock": cantidad,
            "precio_unitario": precio,
            "proveedor": proveedor,
            "fecha_ingreso": datetime.now(),
            "fecha_actualizacion": datetime.now(),
            "actualizado_por": creado_por,
            "disponible": disponible,
            "caducidad": caducidad,  
            "stock_min": stock_min,  
            "stock_max": stock_max,  
        }
        return self.collection.insert_one(nuevo_producto)

    def obtener_productos(self):
        return list(self.collection.find())

    def obtener_producto_por_id(self, producto_id):
        return self.collection.find_one({"_id": ObjectId(producto_id)})

    def actualizar_producto(self, producto_id, actualizaciones, actualizado_por):
        actualizaciones["fecha_actualizacion"] = datetime.now()
        actualizaciones["actualizado_por"] = actualizado_por

        return self.collection.update_one({"_id": ObjectId(producto_id)}, {"$set": actualizaciones})

    def eliminar_producto(self, producto_id):
        return self.collection.delete_one({"_id": ObjectId(producto_id)})

 

    def verificar_stock(self, producto_id):
        producto = self.collection.find_one({"_id": ObjectId(producto_id)})
        if producto:
            if producto['cantidad_stock'] < producto['stock_min']:
                return f"El producto '{producto['nombre']}' está por debajo del stock mínimo."
            elif producto['stock_max'] and producto['cantidad_stock'] > producto['stock_max']:
                return f"El producto '{producto['nombre']}' excede el stock máximo."
            else:
                return f"El stock del producto '{producto['nombre']}' está dentro del rango permitido."
        return "Producto no encontrado."

    #actualizarl el stock al hacer una transaccion
    def actualizar_stock(self, producto_id, nuevo_stock):
        self.collection.update_one(
            {"_id": ObjectId(producto_id)},
            {"$set": {"cantidad_stock": nuevo_stock}}
        )