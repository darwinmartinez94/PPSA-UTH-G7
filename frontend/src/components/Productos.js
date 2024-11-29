import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import './Productos.css';
import { AuthContext } from '../context/AuthContext';

function Productos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [mostrarFormularioAgregar, setMostrarFormularioAgregar] = useState(false);
  const [mostrarFormularioEditar, setMostrarFormularioEditar] = useState(false);
  const [productoEditar, setProductoEditar] = useState(null);
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
        setError(error.response?.data?.error || 'Error al cargar los datos');
        showError(error.response?.data?.error || "Error al cargar los datos");
      }
    };
    fetchData();
  }, []);

  // Función para manejar la edición de un producto
  const handleEdit = (producto) => {
    setProductoEditar(producto);
    setMostrarFormularioEditar(true);
    setMostrarFormularioAgregar(false);
  };

  // Función para manejar la actualización de productos
  const handleUpdate = async (e) => {
    e.preventDefault();

    const productoActualizado = {
      ...productoEditar,
      cantidad_stock: parseInt(productoEditar.cantidad_stock),
      precio_unitario: parseFloat(productoEditar.precio_unitario),
      caducidad: productoEditar.caducidad ? new Date(productoEditar.caducidad).toISOString() : null,
      actualizado_por: userName
    };

    try {
      await axios.put(`http://localhost:5000/api/productos/${productoEditar._id}`, productoActualizado);
      setMensaje('Producto actualizado con éxito');
      setError(""); 
      hideMessage(); 
      setMostrarFormularioEditar(false);
      
      // Actualiza la lista de productos
      const productosResponse = await axios.get('http://localhost:5000/api/productos');
      setProductos(productosResponse.data);
    } catch (error) {
      console.error("Hubo un error al actualizar el producto:", error);
      setError(error.response?.data?.error || 'Hubo un error al actualizar el producto');
      showError(error.response?.data?.error || "Hubo un error al actualizar el producto");
    }
  };

  // Función para manejar la eliminación de productos
 const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      axios.delete(`http://localhost:5000/api/productos/${id}`)
        .then(() => {
          setProductos(productos.filter(producto => producto._id !== id));
          setMensaje('Producto eliminado con éxito');
          setError(""); 
          hideMessage(); 
        })
        .catch(error => {
          console.error("Hubo un error al eliminar el producto:", error);
          setError(error.response?.data?.error || 'Hubo un error al eliminar el producto');
          showError(error.response?.data?.error || "Hubo un error al eliminar el producto");
        });
    }
  };

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
      caducidad: e.target.caducidad && e.target.caducidad.value ? new Date(e.target.caducidad.value).toISOString() : null,
      stock_min: parseInt(e.target.stock_min.value),
      stock_max: parseInt(e.target.stock_max.value)
    };

    try {
      await axios.post('http://localhost:5000/api/productos', nuevoProducto);
      setMensaje('Producto agregado con éxito');
      setError(""); 
      hideMessage(); 
      setMostrarFormularioAgregar(false);

      // Actualiza la lista de productos
      const productosResponse = await axios.get('http://localhost:5000/api/productos');
      setProductos(productosResponse.data);
    } catch (error) {
      console.error("Hubo un error al agregar el producto:", error);
      setError(error.response?.data?.error || 'Hubo un error al agregar el producto');
      showError(error.response?.data?.error || "Hubo un error al agregar el producto");
    
    }

  };
  
  
  const showError = (errorMsg) => {
    setError(errorMsg);
    setTimeout(() => {
      setError("");
    }, 2000);
  };

  const hideMessage = () => {
    setTimeout(() => {
      setMensaje("");
    }, 2000);
  };

  const handleCheckboxChange = () => {
    setMostrarFecha(!mostrarFecha);
  }

  return (
    <div className="container">
       {mensaje && <div className="message">{mensaje}</div>}
       {error && <p className="error">{error}</p>}

      {mostrarFormularioAgregar && (
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
      )}

      {mostrarFormularioEditar && productoEditar && (
        <form onSubmit={handleUpdate} className="form-container">
        <h2>Editar Producto</h2>
        <div className="form-field">
          <label>Nombre:</label>
          <input
            type="text"
            value={productoEditar.nombre}
            onChange={(e) => setProductoEditar({ ...productoEditar, nombre: e.target.value })}
            placeholder="Nombre del Producto"
            required
          /> 
        </div>
        <div className="form-field">
          <label>Descripción:</label>
          <input
            type="text"
            value={productoEditar.descripcion}
            onChange={(e) => setProductoEditar({ ...productoEditar, descripcion: e.target.value })}
            placeholder="Descripción"
            required
          /> 
        </div>
        <div className="form-field">
          <label>Categoría:</label>
          <select
            value={productoEditar.categoria}
            onChange={(e) => setProductoEditar({ ...productoEditar, categoria: e.target.value })}
            required
          >
            <option value="">Seleccione una Categoría</option>
            {categorias.map(categoria => (
              <option key={categoria._id} value={categoria._id}>
                {categoria.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="form-field">
          <label>Cantidad existente:</label>
          <input
            type="number"
            value={productoEditar.cantidad_stock}
            onChange={(e) => setProductoEditar({ ...productoEditar, cantidad_stock: e.target.value })}
            placeholder="Cantidad en Stock"
            required
          /> 
        </div>
        <div className="form-field">
          <label>Precio:</label>
          <input
            type="number"
            value={productoEditar.precio_unitario}
            onChange={(e) => setProductoEditar({ ...productoEditar, precio_unitario: e.target.value })}
            placeholder="Precio Unitario"
            required
          /> 
        </div>
        <div className="form-field">
          <label>Proveedor:</label>
          <select
            value={productoEditar.proveedor}
            onChange={(e) => setProductoEditar({ ...productoEditar, proveedor: e.target.value })}
            required
          >
            <option value="">Seleccione un Proveedor</option>
            {proveedores.map(proveedor => (
              <option key={proveedor._id} value={proveedor._id}>
                {proveedor.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="form-field">
          <label>
            <input
              type="checkbox"
              checked={productoEditar.disponible}
              onChange={(e) => setProductoEditar({ ...productoEditar, disponible: e.target.checked })}
            /> Producto Disponible
          </label>
        </div>
        <div className="form-field">
          <label>Fecha de Caducidad:</label>
          <input
            type="date"
            value={productoEditar.caducidad ? new Date(productoEditar.caducidad).toISOString().substring(0, 10) : ''}
            onChange={(e) => setProductoEditar({ ...productoEditar, caducidad: e.target.value })}
            placeholder="Fecha de Caducidad"
          />
        </div>
        <div className="form-field">
          <label>Stock Mínimo (Opcional):</label>
          <input
            type="number"
            value={productoEditar.stock_min}
            onChange={(e) => setProductoEditar({ ...productoEditar, stock_min: e.target.value })}
            placeholder="Stock Mínimo"
          />
        </div>
        <div className="form-field">
          <label>Stock Máximo (Opcional):</label>
          <input
            type="number"
            value={productoEditar.stock_max}
            onChange={(e) => setProductoEditar({ ...productoEditar, stock_max: e.target.value })}
            placeholder="Stock Máximo"
          />
        </div>
        <div className="form-buttons">
          <button type="submit">Actualizar Producto</button>
          <button type="button" onClick={() => setMostrarFormularioEditar(false)}>Cancelar</button>
        </div>
      </form>      
     
      )}
      
      <button onClick={() => setMostrarFormularioAgregar(!mostrarFormularioAgregar)}>
        {mostrarFormularioAgregar ? 'Cancelar' : 'Agregar Producto Nuevo'}
      </button>

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
            <th>Acciones</th>
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
              <td>
                <button className='btn-editar' onClick={() => handleEdit(producto)}>Editar</button>
                <button className='btn-eliminar' onClick={() => handleDelete(producto._id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Productos;
