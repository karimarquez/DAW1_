import React from 'react';

export const BotonRosa = ({ texto, onClick, tipo = "button" }) => {
  return (
    <button 
      type={tipo} 
      onClick={onClick}
      style={{
        backgroundColor: '#ff69b4', // Rosa estético de salón de belleza
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        fontWeight: 'bold',
        cursor: 'pointer',
        boxShadow: '0px 2px 4px rgba(0,0,0,0.1)'
      }}
    >
      {texto}
    </button>
  );
};
