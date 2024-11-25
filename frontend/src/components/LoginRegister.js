import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './LoginRegister.css';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function LoginRegister() {
  const [isLoginActive, setIsLoginActive] = useState(true);
  const [user, setUser] = useState({ nombre: '', correo: '', contrasenia: '', rol: '', admin_password: '' });
  const [error, setError] = useState('');
  const { login, userRole } = useContext(AuthContext)
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleRegister = async () => {
    try {
      if (user.rol === 'Administrador' && user.admin_password !== 'UTH2024') {
        setError('Ingrese la contraseña para ser administrador del sistema');
        return;
      }
      await axios.post('http://localhost:5000/api/usuarios', user);
      alert("Usuario registrado con éxito");

      setIsLoginActive(true); 
    } catch (error) {
      setError(error.response?.data?.error || 'Error al registrar');
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/usuarios/login', {
        correo: user.correo,
        contrasenia: user.contrasenia,
      });
      // Guarda el token en el localStorage o maneja la sesión
      const token = response.data.token;
      const role = response.data.role;
      login(token, role);
      console.log(token)
      console.log(user.name)
      console.log(user.correo)
      alert("Inicio de sesión exitoso");
    } catch (error) {
      setError('Credenciales incorrectas');
    }
  };

  useEffect(() => {
    if (userRole) {
      // Redirige al dashboard correspondiente según el rol del usuario
      if (userRole === 'Administrador') {
        navigate('/admin');
      } else if (userRole === 'Supervisor') {
        navigate('/supervisor');
      } else if (userRole === 'Usuario') {
        navigate('/usuario');
      }
    }
  }, [userRole, navigate]);

  useEffect(() => {
    const adjustFormDisplay = () => {
    const cajaTraseraLogin = document.querySelector(".cajaTraseraLogin");
    const cajaTraseraRegister = document.querySelector(".cajaTraseraRegister");
    const formularioLogin = document.querySelector(".formularioLogin");
    const formularioRegister = document.querySelector(".formularioRegister");
    const contenedorLoginRegister = document.querySelector(".contenedorLoginRegister");

      if (window.innerWidth > 850) {
        cajaTraseraLogin.style.display = "block";
        cajaTraseraRegister.style.display = "block";
      } else {
        cajaTraseraRegister.style.display = "block";
        cajaTraseraRegister.style.opacity = "1";
        cajaTraseraLogin.style.display = "none";
        formularioLogin.style.display = "block";
        formularioRegister.style.display = "none";
        contenedorLoginRegister.style.left = "0px";
      }
    };
    adjustFormDisplay();
    window.addEventListener("resize", adjustFormDisplay);
    return () => window.removeEventListener("resize", adjustFormDisplay);
  }, []);

  const iniciarSesion = () => {
    const cajaTraseraLogin = document.querySelector(".cajaTraseraLogin");
    const cajaTraseraRegister = document.querySelector(".cajaTraseraRegister");
    const formularioLogin = document.querySelector(".formularioLogin");
    const formularioRegister = document.querySelector(".formularioRegister");
    const contenedorLoginRegister = document.querySelector(".contenedorLoginRegister");

    if (window.innerWidth > 850) {
      formularioLogin.style.display = "block";
      contenedorLoginRegister.style.left = "10px";
      formularioRegister.style.display = "none";
      cajaTraseraRegister.style.opacity = "1";
      cajaTraseraLogin.style.opacity = "0";
    } else {
      formularioLogin.style.display = "block";
      contenedorLoginRegister.style.left = "0px";
      formularioRegister.style.display = "none";
      cajaTraseraRegister.style.display = "block";
      cajaTraseraLogin.style.display = "none";
    }
  };

  const register = () => {
    const cajaTraseraLogin = document.querySelector(".cajaTraseraLogin");
    const cajaTraseraRegister = document.querySelector(".cajaTraseraRegister");
    const formularioLogin = document.querySelector(".formularioLogin");
    const formularioRegister = document.querySelector(".formularioRegister");
    const contenedorLoginRegister = document.querySelector(".contenedorLoginRegister");

    if (window.innerWidth > 850) {
      formularioRegister.style.display = "block";
      contenedorLoginRegister.style.left = "410px";
      formularioLogin.style.display = "none";
      cajaTraseraRegister.style.opacity = "0";
      cajaTraseraLogin.style.opacity = "1";
    } else {
      formularioRegister.style.display = "block";
      contenedorLoginRegister.style.left = "0px";
      formularioLogin.style.display = "none";
      cajaTraseraRegister.style.display = "none";
      cajaTraseraLogin.style.display = "block";
      cajaTraseraLogin.style.opacity = "1";
    }
  };

  return (
    <div className="contenedor_todo">
      <div className="cajaTrasera">
        <div className="cajaTraseraLogin">
          <h3>¿Ya tienes una cuenta?</h3>
          <p>Inicia sesión para entrar a la página</p>
          <button onClick={iniciarSesion}>Iniciar Sesión</button>
        </div>
        <div className="cajaTraseraRegister">
          <h3>¿Aún no tienes una cuenta?</h3>
          <p>Regístrate para que puedas iniciar sesión</p>
          <button onClick={register}>Registrarse</button>
        </div>
      </div>

      <div className="contenedorLoginRegister">
      <form className="formularioLogin" onSubmit={(e) => {
        e.preventDefault();
        if (!user.correo || !user.contrasenia) {
            setError('Debe llenar todos los campos.');
            setTimeout(() => setError(''), 3000);
            return;
        }
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(user.correo)) {
            setError('Ingrese un correo válido.');
            setTimeout(() => setError(''), 3000);
            return;
        }
        handleLogin();
        }} style={{ display: isLoginActive ? 'block' : 'none' }}>
        <h2>Iniciar Sesión</h2>
        {error && <p className="error">{error}</p>}
        <input
            type="email"
            placeholder="Correo Electrónico"
            name="correo"
            value={user.correo}
            onChange={handleInputChange}
            required
        />
        <input
            type="password"
            placeholder="Contraseña"
            name="contrasenia"
            value={user.contrasenia}
            onChange={handleInputChange}
            required
        />
        <button type="submit">Entrar</button>
        </form>


        <form className="formularioRegister" onSubmit={(e) => {
        e.preventDefault();
        if (!user.nombre || !user.correo || !user.contrasenia || !user.rol) {
            setError('Debe llenar todos los campos.');
            setTimeout(() => setError(''), 3000);
            return;
        }
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(user.correo)) {
            setError('Ingrese un correo válido.');
            setTimeout(() => setError(''), 3000);
            return;
        }
        if (user.rol === 'Administrador' && !user.admin_password) {
            setError('Por favor, ingrese la contraseña de administrador.');
            setTimeout(() => setError(''), 3000);
            return;
        }
        handleRegister();
        }} style={{ display: isLoginActive ? 'none' : 'block' }}>
        <h2>Registrarse</h2>
        {error && <p className="error">{error}</p>}
        <input
            type="text"
            placeholder="Nombre Completo"
            name="nombre"
            value={user.nombre}
            onChange={handleInputChange}
            required
        />
        <input
            type="email"
            placeholder="Correo Electrónico"
            name="correo"
            value={user.correo}
            onChange={handleInputChange}
            required
        />
        <input
            type="password"
            placeholder="Contraseña"
            name="contrasenia"
            value={user.contrasenia}
            onChange={handleInputChange}
            required
        />
        <select
            name="rol"
            value={user.rol}
            onChange={handleInputChange}
            required
        >
            <option value="">Seleccione un rol</option>
            <option value="Usuario">Usuario</option>
            <option value="Supervisor">Supervisor</option>
            <option value="Administrador">Administrador</option>
        </select>
        {user.rol === 'Administrador' && (
            <input
            type="password"
            placeholder="Contraseña de Administrador"
            name="admin_password"
            value={user.admin_password}
            onChange={handleInputChange}
            required
            />
        )}
        <button type="submit">Registrarse</button>
        </form>

      </div>
    </div>
  );
}

export default LoginRegister;
