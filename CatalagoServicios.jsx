import React from 'react';
import { BotonRosa } from './BotonRosa'; 
import { useSalon } from '../context/SalonContext'; 

export const CatalagoServicios = () => {
  const { agregarServicio } = useSalon(); // 

  const serviciosDisponibles = [
    { id: 1, nombre: "Limpieza Facial", precio: 35.00 }, 
    { id: 2, nombre: "Masaje Corporal", precio: 50.00 },
    { id: 3, nombre: "Manicure Spa", precio: 25.00 }
  ];

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h3>Módulo Secundario: Catálogo de Servicios</h3>
      <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
        {serviciosDisponibles.map((s) => (
          <div key={s.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
            <h4>{s.nombre}</h4>
            <p style={{ color: '#ff69b4', fontWeight: 'bold' }}>${s.precio.toFixed(2)}</p>
            
            <BotonRosa 
              texto="Agregar a la cita" 
              onClick={() => {
                agregarServicio(s);
                alert(`${s.nombre} agregado a tu cita`);
              }} 
            />
          </div>
        ))}
      </div>
    </div>
  );
};
