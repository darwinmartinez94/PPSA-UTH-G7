import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Proveedores.css';  // Archivo de estilos

function Proveedores() {
  const [proveedores, setProveedores] = useState([]);
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');

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

    axios.post('http://localhost:5000/api/proveedores', nuevoProveedor)
      .then(() => {
        setNombre('');
        setDireccion('');
        setTelefono('');
        setEmail('');
        setMensaje('Proveedor agregado con éxito');

        // Recargar los proveedores después de agregar uno nuevo
        axios.get('http://localhost:5000/api/proveedores')
          .then(response => {
            setProveedores(response.data);
          })
          .catch(error => {
            console.error("Hubo un error al obtener los proveedores:", error);
          });
      })
      .catch(error => {
        console.error("Hubo un error al agregar el proveedor:", error);
        setMensaje('Hubo un error al agregar el proveedor');
      });
  };

  return (
    <div className="container">
      <h2>Agregar Proveedor</h2>
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
        <button type="submit">Agregar Proveedor</button>
      </form>

      {/* Mensaje de éxito o error */}
      {mensaje && <p>{mensaje}</p>}

      {/* Tabla de proveedores */}
      <h2>Lista de Proveedores</h2>
      <table className="proveedores-tabla">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Dirección</th>
            <th>Teléfono</th>
            <th>Correo Electrónico</th>
          </tr>
        </thead>
        <tbody>
          {proveedores.map(proveedor => (
            <tr key={proveedor._id}>
              <td>{proveedor.nombre}</td>
              <td>{proveedor.direccion}</td>
              <td>{proveedor.telefono}</td>
              <td>{proveedor.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Proveedores;

