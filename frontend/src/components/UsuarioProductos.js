import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import './Productos.css';
import { AuthContext } from '../context/AuthContext';

function UsuarioProductos(){
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const [mensaje, setMensaje] = useState('');
    const [mostrarFecha, setMostrarFecha] = useState(false);
  
    // Obtener el usuario actual desde el contexto de autenticación
    const { userName } = useContext(AuthContext);
    //console.log(userName)
    
    // Obtener lista de productos, categorías y proveedores
    useEffect(() => {
      const fetchData = async () => {
        try {
          const [productosResponse, categoriasResponse, proveedoresResponse] = await Promise.all([
            axios.get('http://localhost:5000/api/productos'),
            axios.get('http://localhost:5000/api/categorias'),
            axios.get('http://localhost:5000/api/proveedores')
          ]);
  
          setProductos(productosResponse.data);
          setCategorias(categoriasResponse.data);
          setProveedores(proveedoresResponse.data);
        } catch (error) {
          console.error("Hubo un error al obtener los datos:", error);
          setMensaje("Error al cargar los datos. Inténtelo más tarde.");
        }
      };
      fetchData();
    }, []);

  
    // Función para obtener el nombre de la categoría
    const obtenerNombreCategoria = (categoriaId) => {
      const categoria = categorias.find(cat => cat._id === categoriaId);
      return categoria ? categoria.nombre : 'N/A';
    };
  
    // Función para obtener el nombre del proveedor
    const obtenerNombreProveedor = (proveedorId) => {
      const proveedor = proveedores.find(prov => prov._id === proveedorId);
      return proveedor ? proveedor.nombre : 'N/A';
    };
  
    // Función para manejar el agregado de nuevos productos
    const handleAdd = async (e) => {
      e.preventDefault();
      const nuevoProducto = {
        nombre: e.target.nombre.value,
        descripcion: e.target.descripcion.value,
        categoria: e.target.categoria.value,
        cantidad_stock: parseInt(e.target.cantidad_stock.value),
        precio_unitario: parseFloat(e.target.precio_unitario.value),
        proveedor: e.target.proveedor.value,
        actualizado_por: userName,
        disponible: e.target.disponible.checked,
        caducidad: e.target.caducidad.value ? new Date(e.target.caducidad.value).toISOString() : null,
        stock_min: parseInt(e.target.stock_min.value),
        stock_max: parseInt(e.target.stock_max.value)
      };
  
      try {
        await axios.post('http://localhost:5000/api/productos', nuevoProducto);
        setMensaje('Producto agregado con éxito');
  
        // Actualiza la lista de productos
        const productosResponse = await axios.get('http://localhost:5000/api/productos');
        setProductos(productosResponse.data);

        // Resetea los campos del formulario 
        e.target.reset();

      } catch (error) {
        console.error("Hubo un error al agregar el producto:", error);
        setMensaje('Hubo un error al agregar el producto');
      }
  
    };
  
    const handleCheckboxChange = () => {
      setMostrarFecha(!mostrarFecha);
    }
  
    return (
      <div className="container">
        {mensaje && <p>{mensaje}</p>}
  

          <form onSubmit={handleAdd} className="form-container">
            <h2>Agregar Nuevo Producto</h2>
            <input type="text" name="nombre" placeholder="Nombre del Producto" required />
            <input type="text" name="descripcion" placeholder="Descripción" required />
            <select name="categoria" required>
              <option value="">Seleccione una Categoría</option>
              {categorias.map(categoria => (
                <option key={categoria._id} value={categoria._id}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
            <input type="number" name="cantidad_stock" placeholder="Cantidad en Stock" required />
            <input type="number" name="precio_unitario" placeholder="Precio Unitario" required />
            <select name="proveedor" required>
              <option value="">Seleccione un Proveedor</option>
              {proveedores.map(proveedor => (
                <option key={proveedor._id} value={proveedor._id}>
                  {proveedor.nombre}
                </option>
              ))}
            </select>
            <label>
            <input type="checkbox" name="disponible" /> Marcar si el Producto estara disponible inmediatamente 
            </label>
            <label> 
            <input type="checkbox" name="caducidadCheckbox" onChange={handleCheckboxChange} /> 
            Ingresar fecha de caducidad 
            </label> {mostrarFecha && ( 
              <label> Fecha de Caducidad: 
              <input type="date" name="caducidad" placeholder="Fecha de Caducidad (Opcional)" /> 
              </label> )}
            <input type="number" name="stock_min" placeholder="Stock Mínimo (Opcional)" />
            <input type="number" name="stock_max" placeholder="Stock Máximo (Opcional)" />
            <button type="submit">Agregar Producto</button>
          </form>
  
        <table className="productos-tabla">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Categoría</th>
              <th>Stock</th>
              <th>Precio</th>
              <th>Proveedor</th>
              <th>Disponible</th>
              <th>Caducidad</th>
            </tr>
          </thead>
          <tbody>
            {productos.map(producto => (
              <tr key={producto._id}>
                <td>{producto.nombre}</td>
                <td>{producto.descripcion}</td>
                <td>{obtenerNombreCategoria(producto.categoria)}</td>
                <td>{producto.cantidad_stock}</td>
                <td>{producto.precio_unitario.toFixed(2)}</td>
                <td>{obtenerNombreProveedor(producto.proveedor)}</td>
                <td>{producto.disponible ? 'Sí' : 'No'}</td>
                <td>{producto.caducidad ? new Date(producto.caducidad).toLocaleDateString() : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
}

export default UsuarioProductos;