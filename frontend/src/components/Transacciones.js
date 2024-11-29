import React, { useEffect, useState, useContext } from "react";
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

function Transacciones(){
    const { userName } = useContext(AuthContext); 
    const [transacciones, setTransacciones] = useState([]);
    const [productos, setProductos] = useState([]);
    const [tipo_transaccion, setTipo_Transaccion] = useState('');
    const [producto, setProducto] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");

    // Obtener lista de transacciones
    useEffect(() => {
        axios.get('http://localhost:5000/api/transacciones')
            .then(response => { setTransacciones(response.data); })
            .catch(error => { 
                console.error("Error al obtener las transacciones:", error); 
                setError(error.response?.data?.error || 'Error al obtener las transacciones');
                showError(error.response?.data?.error || "Error al obtener las transacciones");
            });
    }, []);

    // Obtener lista de productos al cargar el componente
    useEffect(() => {
        axios.get('http://localhost:5000/api/productos') 
            .then(response => setProductos(response.data))
            .catch(error => 
                console.error("Error al cargar los productos:", error)
            );
    }, []);

    // Función para agregar nueva transacción
    const handleSubmit = (e) => {
        e.preventDefault();
        const nuevaTransaccion = {
            tipo_transaccion,
            producto,
            cantidad,
            usuario: userName  
        };

        axios.post('http://localhost:5000/api/transacciones', nuevaTransaccion)
        .then(() => {
            setTipo_Transaccion('');
            setProducto('');
            setCantidad('');
            setMensaje('Transacción agregada con éxito');
            setError("");
            hideMessage();
            
            // Recargar las transacciones después de agregar una nueva
            axios.get('http://localhost:5000/api/transacciones')
                .then(response => { setTransacciones(response.data); })
                .catch(error => { 
                    console.error("Error al obtener las transacciones", error); 
                  
                });
        })
        .catch(error => {
            console.error("Error al agregar la transacción", error);
            if(error.response && error.response.data){
                setMensaje(error.response.data.error);
            }
            else{    
            setMensaje('Hubo un error al agregar la transacción');
            }
        });
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
            <h2>Transacciones</h2>
            <form onSubmit={handleSubmit} className="form-container">
                <label>Tipo de Transacción:</label>
                <select value={tipo_transaccion} onChange={(e) => setTipo_Transaccion(e.target.value)} required>
                    <option value="">Seleccione una opción</option>
                    <option value="entrada">Entrada</option>
                    <option value="salida">Salida</option>
                </select>

                <label>Producto:</label>
                <select value={producto} onChange={(e) => setProducto(e.target.value)} required>
                    <option value="">Seleccione un producto</option>
                    {productos.map((prod) => (
                        <option key={prod._id} value={prod._id}>{prod.nombre}</option>
                    ))}
                </select>

                <label>Cantidad:</label>
                <input type="number" value={cantidad} onChange={(e) => setCantidad(e.target.value)} required />

                <button type="submit">Registrar Transacción</button>
            </form>

            {mensaje && <div className="message">{mensaje}</div>}
            {error && <p className="error">{error}</p>}

            <h2>Lista de Transacciones</h2>
            <table className="productos-tabla">
                <thead>
                    <tr>
                        <th>Tipo de Transacción</th>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Fecha</th>
                    </tr>
                </thead>
                <tbody>
                    {transacciones.map((transaccion) => (
                        <tr key={transaccion._id}>
                            <td>{transaccion.tipo_transaccion}</td>
                            <td>{transaccion.producto.nombre}</td>
                            <td>{transaccion.cantidad}</td>
                            <td>{new Date(transaccion.fecha).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Transacciones;

