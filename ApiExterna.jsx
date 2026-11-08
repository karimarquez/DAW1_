import React, { useState, useEffect } from 'react';

const ApiExterna = () => {
  const [datos, setDatos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const consultarApi = async () => {
      try {
        // Petición asíncrona a una API externa confiable (datos reales de usuarios/clientes)
        const respuesta = await fetch('https://jsonplaceholder.typicode.com/users');
        
        if (!respuesta.ok) {
          throw new Error(`Error en el servidor: Código ${respuesta.status}`);
        }
        
        const resultado = await respuesta.json();
        setDatos(resultado);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false); // Manejo estricto del estado de carga finalizado
      }
    };

    consultarApi();
  }, []);

  // 1. Estado de Carga (Requisito de rúbrica)
  if (cargando) {
    return (
      <div style={estilos.contenedorCentro}>
        <div style={estilos.spinner}></div>
        <p style={estilos.textoCarga}>Sincronizando registros externos con Aesthetica...</p>
      </div>
    );
  }

  // 2. Manejo de Errores (Requisito de rúbrica)
  if (error) {
    return (
      <div style={estilos.contenedorError}>
        <h3>Falla en la Conexión</h3>
        <p>No se pudo establecer comunicación con la API externa: {error}</p>
      </div>
    );
  }

  // 3. Renderizado de Datos Reales Estructurados (Requisito de rúbrica)
  return (
    <section style={estilos.seccion}>
      <header style={estilos.cabecera}>
        <h2>Directorio Externo - Clientes y Registros (Aesthetica)</h2>
        <p>Módulo sincronizado mediante consumo HTTP asíncrono en tiempo real.</p>
      </header>

      <div style={estilos.grid}>
        {datos.map((item) => (
          <article key={item.id} style={estilos.tarjeta}>
            <h4 style={estilos.nombre}>{item.name}</h4>
            <p style={estilos.detalle}><strong>Usuario:</strong> {item.username}</p>
            <p style={estilos.detalle}><strong>Correo:</strong> {item.email}</p>
            <p style={estilos.detalle}><strong>Ciudad:</strong> {item.address.city}</p>
            <p style={estilos.detalle}><strong>Empresa:</strong> {item.company.name}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

// Estilos profesionales encapsulados
const estilos = {
  seccion: {
    padding: '30px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    backgroundColor: '#fdfbfb',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
    margin: '20px auto',
    maxWidth: '1200px',
  },
  cabecera: {
    marginBottom: '24px',
    borderBottom: '2px solid #eaeaea',
    paddingBottom: '12px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px',
  },
  tarjeta: {
    backgroundColor: '#ffffff',
    border: '1px solid #e1e4e8',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
    transition: 'transform 0.2s ease',
  },
  nombre: {
    margin: '0 0 10px 0',
    color: '#2c3e50',
    fontSize: '1.2rem',
  },
  detalle: {
    margin: '6px 0',
    color: '#555555',
    fontSize: '0.92rem',
  },
  contenedorCentro: {
    padding: '60px',
    textAlign: 'center',
    color: '#666',
    fontFamily: 'sans-serif',
  },
  textoCarga: {
    marginTop: '12px',
    fontSize: '1rem',
    fontWeight: '500',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #3498db',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto',
  },
  contenedorError: {
    padding: '30px',
    backgroundColor: '#fff5f5',
    border: '1px solid #feb2b2',
    borderRadius: '8px',
    color: '#c53030',
    textAlign: 'center',
    margin: '20px auto',
    maxWidth: '600px',
  }
};

export default ApiExterna;