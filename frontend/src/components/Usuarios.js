import React, {useEffect, useState}  from "react";
import axios from 'axios';
import  './Proveedores.css';

function Usuarios(){
    const [usuarios, setUsuarios ] = useState([]);
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [contrasenia, setContrasenia] = useState('');
    const [rol, setRol] = useState('');
    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");
    const [modoEdicion, setModoEdicion] = useState(false);
    const [usuarioEditando, setUsuarioEditando] = useState(null);

//traer lista de usuarios
useEffect(() => {
    axios.get('http://localhost:5000/api/usuarios')
    .then(Response => {
        setUsuarios(Response.data)
    })
    .catch(error => {
        console.error("Hubo un problema al obtener los usuarios",error);
        setError(error.response?.data?.error || 'Hubo un problema al obtener los usuarios');
        showError(error.response?.data?.error || "Hubo un problema al obtener los usuarios");
        
    });
}, []);

//funcion para agregar un nuevo usuario
const handleSubmit = (e) => {
    e.preventDefault();
    const nuevoUsuario = {
        nombre,
        correo,
        contrasenia,
        rol
    };
    if (modoEdicion) {
      axios.put(`http://localhost:5000/api/usuarios/${usuarioEditando._id}`, nuevoUsuario)
          .then(() => {
              setModoEdicion(false);
              setUsuarioEditando(null);
              setMensaje('Usuario actualizado con éxito');
              setError("");
              hideMessage();
              actualizarListaUsuarios();
          })
          .catch(error => {
            setError(error.response?.data?.error || 'Hubo un problema al actualizar el usuario');
            showError(error.response?.data?.error || "Hubo un problema al actualizar el usuario");
          }
            
            
          );
  } else {
      axios.post('http://localhost:5000/api/usuarios', nuevoUsuario)
          .then(() => {
              setNombre('');
              setCorreo('');
              setContrasenia('');
              setRol('');
              setMensaje('Usuario agregado exitosamente.');
              setError("");
              hideMessage();
              actualizarListaUsuarios();
          })
          .catch(error => {
            setError(error.response?.data?.error || 'Hubo un problema al agregar el usuario');
            showError(error.response?.data?.error || "Hubo un problema al agregar el usuario");
          })
  }
};

const actualizarListaUsuarios = () => {
  axios.get('http://localhost:5000/api/usuarios')
      .then(response => setUsuarios(response.data))
      .catch(error => {
        console.error("Hubo un problema al obtener los usuarios", error);
        setError(error.response?.data?.error || 'Hubo un problema al obtener los usuario');
        showError(error.response?.data?.error || "Hubo un problema al obtener los usuario");
      
      });
};

// Eliminar un usuario
const eliminarUsuario = (id) => {
  axios.delete(`http://localhost:5000/api/usuarios/${id}`)
      .then(() => {
        setMensaje('Usuario eliminado con éxito');
        setError("");
        hideMessage();
        actualizarListaUsuarios() 
      }
        
    )
      .catch(error => {
        setError(error.response?.data?.error || 'Hubo un problema al eliminar el usuario');
        showError(error.response?.data?.error || "Hubo un problema al eliminar el usuario");
      })
};

// Iniciar la edición de un usuario
const editarUsuario = (usuario) => {
  setModoEdicion(true);
  setUsuarioEditando(usuario);
  setNombre(usuario.nombre);
  setCorreo(usuario.correo);
  setRol(usuario.rol);
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
      <h2>Agregar Usuarios</h2>
      <form onSubmit={handleSubmit} className="form-container">
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre del usuario"
          required
        />
        <input
          type="email"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          placeholder="Correo"
          required
        />
        <input
          type="password"
          value={contrasenia}
          onChange={(e) => setContrasenia(e.target.value)}
          placeholder="Contraseña"
          required
        />
       <select value={rol} onChange={(e) => setRol(e.target.value)} required>
          <option value="">Selecciona un rol</option>
          <option value="Usuario">Usuario</option>
          <option value="Supervisor">Supervisor</option>
          <option value="Administrativo">Administrativo</option>
        </select>
        <button type="submit">Agregar Usuario</button>
      </form>

      {/* Mensaje de éxito o error */}
      {mensaje && <div className="message">{mensaje}</div>}
      {error && <p className="error">{error}</p>}

      {/* Tabla de usuarios */}
      <h2>Lista de Usaarios</h2>
      <table className="proveedores-tabla">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(usuario => (
            <tr key={usuario._id}>
              <td>{usuario.nombre}</td>
              <td>{usuario.correo}</td>
              <td>{usuario.rol}</td>
              <td>
                <button className="btn-editar" onClick={() => editarUsuario(usuario)}>Editar</button>
                <button className="btn-eliminar" onClick={() => eliminarUsuario(usuario._id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default Usuarios;