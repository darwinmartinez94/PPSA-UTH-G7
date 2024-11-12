import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Proveedores.css';  

function SupervisorProveedor(){
    const [proveedores, setProveedores] = useState([]);
    const [nombre, setNombre] = useState('');
    const [direccion, setDireccion] = useState('');
    const [telefono, setTelefono] = useState('');
    const [email, setEmail] = useState('');
    const [mensaje, setMensaje] = useState('');
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
            actualizarListaProveedores();
          })
          .catch(error => {
            console.error("Hubo un error al agregar el proveedor:", error);
            setMensaje('Hubo un error al agregar el proveedor');
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
        .catch(error => console.error("Hubo un problema al obtener los proveedores", error));
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
  
        {mensaje && <p>{mensaje}</p>}
  
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
}    

export default SupervisorProveedor;