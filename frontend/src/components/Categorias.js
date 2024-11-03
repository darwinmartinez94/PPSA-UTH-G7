import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Categoria.css';  // Archivo de estilos

function Categoria() {
  const [categorias, setCategorias] = useState([]);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [mensaje, setMensaje] = useState('');

  // Obtener lista de categorías
  useEffect(() => {
    axios.get('http://localhost:5000/api/categorias')
      .then(response => {
        setCategorias(response.data);
      })
      .catch(error => {
        console.error("Hubo un error al obtener las categorías:", error);
      });
  }, []);

  // Función para agregar una nueva categoría
  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevaCategoria = {
      nombre,
      descripcion
    };

    axios.post('http://localhost:5000/api/categorias', nuevaCategoria)
      .then(() => {
        setNombre('');
        setDescripcion('');
        setMensaje('Categoría agregada con éxito');

        // Recargar las categorías después de agregar una nueva
        axios.get('http://localhost:5000/api/categorias')
          .then(response => {
            setCategorias(response.data);
          })
          .catch(error => {
            console.error("Hubo un error al obtener las categorías:", error);
          });
      })
      .catch(error => {
        console.error("Hubo un error al agregar la categoría:", error);
        setMensaje('Hubo un error al agregar la categoría');
      });
  };

  return (
    <div className="container">
      <h2>Agregar Categoría</h2>
      <form onSubmit={handleSubmit} className="form-container">
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre de la Categoría"
          required
        />
        <input
          type="text"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Descripción"
          required
        />
        <button type="submit">Agregar Categoría</button>
      </form>

      {/* Mensaje de éxito o error */}
      {mensaje && <p>{mensaje}</p>}

      {/* Tabla de categorías */}
      <h2>Lista de Categorías</h2>
      <table className="categorias-tabla">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map(categoria => (
            <tr key={categoria._id}>
              <td>{categoria.nombre}</td>
              <td>{categoria.descripcion}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Categoria;
