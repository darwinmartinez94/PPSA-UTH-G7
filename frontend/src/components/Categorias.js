import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Categoria.css'; 
 
function Categoria() {
  const [categorias, setCategorias] = useState([]);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [mostrarFormularioAgregar, setMostrarFormularioAgregar] = useState(false);
  const [mostrarFormularioEditar, setMostrarFormularioEditar] = useState(false);
  const [categoriaEditar, setCategoriaEditar] = useState(null);

  // Obtener lista de categorías
  useEffect(() => {
    axios.get('http://localhost:5000/api/categorias')
      .then(response => {
        setCategorias(response.data);
      })
      .catch(error => {
        console.error("Hubo un error al obtener las categorías:", error);
        setError(error.response?.data?.error || "Hubo un error al obtener las categorias");
        showError(error.response?.data?.error || "Hubo un error al obtener las categorias");
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
        setError(""); 
        hideMessage(); 
        setMostrarFormularioAgregar(false);

        // Recargar las categorías después de agregar una nueva
        axios.get('http://localhost:5000/api/categorias')
          .then(response => {
            setCategorias(response.data);
          })
          .catch(error => {
            console.error("Hubo un error al obtener las categorías:", error);
            setError(error.response?.data?.error || "Hubo un error al obtener las categorias");
            showError(error.response?.data?.error || "Hubo un error al obtener las categorias");
          });
      })
      .catch(error => {
        console.error("Hubo un error al agregar la categoría:", error);
        setError(error.response?.data?.error || "Hubo un error al agregar la categoria");
        showError(error.response?.data?.error || "Hubo un error al agregar la categoria");
      });
    };

     // Función para manejar la edición de una categoria
  const handleEdit = (categoria) => {
    setCategoriaEditar(categoria);
    setMostrarFormularioEditar(true);
    setMostrarFormularioAgregar(false); 
  };


    // Función para manejar la actualización de categorias
  const handleUpdate = (e) => {
    e.preventDefault();
  
    const categoriaActualizado = {
      ...categoriaEditar,
    };
  
    axios.put(`http://localhost:5000/api/categorias/${categoriaEditar._id}`, categoriaActualizado)
      .then(() => {
          setMensaje('Categoria actualizada con éxito');
          setError(""); 
          hideMessage(); 
          setMostrarFormularioEditar(false); 
  
        return axios.get('http://localhost:5000/api/categorias');
      })
      .then(response => {
          setCategorias(response.data);
      })
      .catch(error => {
          console.error("Hubo un error al actualizar la actegoria:", error);
          setError(error.response?.data?.error || "Hubo un error al actualizar la categoria");
          showError(error.response?.data?.error || "Hubo un error al actualizar la categoria");
      });
  };
    
    // Función para manejar la eliminación de categorias
  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta categoria?')) {
      axios.delete(`http://localhost:5000/api/categorias/${id}`)
        .then(() => {
          setCategorias(categorias.filter(categoria => categoria._id !== id));
          setMensaje('Categoria eliminada con éxito');
          setError(""); 
          hideMessage(); 
        })
        .catch(error => {
          console.error("Hubo un error al eliminar la categoria:", error);
          setError(error.response?.data?.error || "Hubo un error al eliminar la categoria");
          showError(error.response?.data?.error || "Hubo un error al eliminar la categoria");
          
        });
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

  return (
    <div className="container">
       {/* Mensaje de éxito o error */}
       {mensaje && <div className="message">{mensaje}</div>}
       {error && <p className="error">{error}</p>}
    {mostrarFormularioAgregar && (
      <form onSubmit={handleSubmit} className="form-container">
        <h2>Agregar Categoría</h2>
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
    )}

    {/* Formulario para editar un producto */}
    {mostrarFormularioEditar && categoriaEditar && (
        <form onSubmit={handleUpdate} className="form-container">
          <h2>Editar Categoria</h2>
          <input
            type="text"
            value={categoriaEditar.nombre}
            onChange={(e) => setCategoriaEditar({ ...categoriaEditar, nombre: e.target.value })}
            placeholder="Nombre de la Categoria"
            required
          />
          <input
            type="text"
            value={categoriaEditar.descripcion}
            onChange={(e) => setCategoriaEditar({ ...categoriaEditar, descripcion: e.target.value })}
            placeholder="Descripción"
            required
          />
                   
          <button type="submit">Actualizar Categoria</button>
        </form>
    )}

     <button onClick={() => setMostrarFormularioAgregar(!mostrarFormularioAgregar)}>
        {mostrarFormularioAgregar ? 'Cancelar' : 'Agregar una Categoria'}
      </button>

    {/* Tabla de categorías */}
    <h2>Lista de Categorías</h2>
      <table className="categorias-tabla">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th >Acciones</th>
            </tr>
        </thead>
        <tbody>
          {categorias.map(categoria => (
            <tr key={categoria._id}>
              <td>{categoria.nombre}</td>
              <td>{categoria.descripcion}</td>
              <td className='action-buttons'>
                <button className='btn-editar' onClick={() => handleEdit(categoria)} >Editar </button>
                <button className='btn-eliminar'onClick={() => handleDelete(categoria._id)}>Eliminar</button>
              </td>
             
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Categoria;
