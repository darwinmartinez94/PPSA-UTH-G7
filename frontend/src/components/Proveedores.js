import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Proveedores.css';  

function Proveedores() {
  const [proveedores, setProveedores] = useState([]);
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [modoEdicion, setModoEdicion] = useState(false);
  const [proveedorEditando, setProveedorEditando] = useState(null);

  // Obtener lista de proveedores
  useEffect(() => {
    axios.get('http://localhost:5000/api/proveedores')
      .then(response => {
        setProveedores(response.data);
      })
      .catch(error => {
        console.error("Hubo un error al obtener los proveedores:", error);
        setError(error.response?.data?.error || 'Hubo un error al obtener los proveedores');
        showError(error.response?.data?.error || "Hubo un error al obtener los proveedores");
      });
  }, []);

  // Función para agregar proveedores
  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevoProveedor = {
      nombre,
      direccion,
      telefono,
      email
    };

    if (modoEdicion) {
      axios.put(`http://localhost:5000/api/proveedores/${proveedorEditando._id}`, nuevoProveedor)
        .then(() => {
          setModoEdicion(false);
          setProveedorEditando(null);
          actualizarListaProveedores();
          setMensaje('Proveedor actualizado con éxito');
          setError("");
          hideMessage();
        })
        .catch(error => setMensaje('Hubo un problema al actualizar el proveedor.'));
    } else {
      axios.post('http://localhost:5000/api/proveedores', nuevoProveedor)
        .then(() => {
          setNombre('');
          setDireccion('');
          setTelefono('');
          setEmail('');
          setMensaje('Proveedor agregado con éxito');
          setError("");
          hideMessage();
          actualizarListaProveedores();
        })
        .catch(error => {
          console.error("Hubo un error al agregar el proveedor:", error); 
          setError(error.response?.data?.error || 'Hubo un error al agregar el proveedor');
          showError(error.response?.data?.error || "Hubo un error al obtener el proveedor");
        
        });
    }
  };

  const actualizarListaProveedores = () => {
    axios.get('http://localhost:5000/api/proveedores')
      .then(response => 
        {
          setNombre('');
          setDireccion('');
          setTelefono('');
          setEmail('');
          setProveedores(response.data)
        })
      .catch(error => {
       console.error("Hubo un problema al obtener los proveedores", error);
       setError(error.response?.data?.error || 'Hubo un error al obtener los proveedores');
       showError(error.response?.data?.error || "Hubo un error al obtener los proveedores"); 
      }
      );
  };

  // Eliminar un proveedor
  const eliminarProveedor = (id) => {
    axios.delete(`http://localhost:5000/api/proveedores/${id}`)
      .then(() => {
        setMensaje('Proveedor eliminado con éxito');
        setError("");
        hideMessage();
        actualizarListaProveedores()
      })
      .catch(error => {
        setError(error.response?.data?.error || 'Hubo un problema al eliminar el proveedor');
        showError(error.response?.data?.error || "Hubo un error al eliminar el proveedor");
      })
  };

  // Iniciar la edición de un proveedor
  const editarProveedor = (proveedor) => {
    setModoEdicion(true);
    setProveedorEditando(proveedor);
    setNombre(proveedor.nombre);
    setDireccion(proveedor.direccion);
    setTelefono(proveedor.telefono);
    setEmail(proveedor.email);
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
  
  return (
    <div className="container">
      <h2>{modoEdicion ? "Actualizar Proveedor" : "Agregar Proveedor"}</h2>
      <form onSubmit={handleSubmit} className="form-container">
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre del Proveedor"
          required
        />
        <input
          type="text"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
          placeholder="Dirección"
          required
        />
        <input
          type="text"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          placeholder="Teléfono"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Correo Electrónico"
          required
        />
        <button type="submit">{modoEdicion ? "Actualizar" : "Agregar"} Proveedor</button>
      </form>

      {mensaje && <div className="message">{mensaje}</div>}
      {error && <p className="error">{error}</p>}
      
      <h2>Lista de Proveedores</h2>
      <table className="proveedores-tabla">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Dirección</th>
            <th>Teléfono</th>
            <th>Correo Electrónico</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {proveedores.map(proveedor => (
            <tr key={proveedor._id}>
              <td>{proveedor.nombre}</td>
              <td>{proveedor.direccion}</td>
              <td>{proveedor.telefono}</td>
              <td>{proveedor.email}</td>
              <td>
                <button className="btn-editar" onClick={() => editarProveedor(proveedor)}>Actualizar</button>
                <button className="btn-eliminar" onClick={() => eliminarProveedor(proveedor._id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Proveedores;

