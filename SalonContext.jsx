import React, { createContext, useState } from 'react';

export const SalonContext = createContext();

export const SalonProvider = ({ children }) => {
  // Estado centralizado para almacenar las citas del salón
  const [citas, setCitas] = useState([
    { id: 1, cliente: "Ana Gómez", telefono: "77778888", servicio: "Manicura", fecha: "2026-11-06", hora: "15:00" }
  ]);

  const registrarCita = (nuevaCita) => {
    setCitas([...citas, { ...nuevaCita, id: Date.now() }]);
  };

  return (
    <SalonContext.Provider value={{ citas, registrarCita }}>
      {children}
    </SalonContext.Provider>
  );
};