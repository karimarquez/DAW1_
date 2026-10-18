# Documento técnico: desarrollo de la maqueta y flujo funcional de la aplicación

## 1. Introducción

Este proyecto fue desarrollado como una aplicación web de tipo landing page y panel administrativo para una clínica de belleza y bienestar. La intención principal fue crear una interfaz moderna, funcional y visualmente atractiva, con secciones para servicios, reserva de citas, autenticación, gestión de usuarios y administración de contenido.

La solución fue implementada utilizando React y Vite, tecnologías que permiten una estructura modular, rápida carga y mejor organización del código.

---

## 2. Objetivo del proyecto

El objetivo del proyecto fue desarrollar una interfaz web con las siguientes características:

- Presentación visual de una marca de belleza y bienestar.
- Sección de servicios con descripción y precios.
- Proceso de reserva de citas.
- Inicio de sesión y registro de usuarios.
- Diferenciación entre roles de usuario: administrador y cliente.
- Panel administrativo para gestión de servicios.
- Persistencia de datos en el navegador mediante localStorage.
- Diseño responsive para distintos tamaños de pantalla.

---

## 3. Herramientas utilizadas

### 3.1 React
React fue utilizado para construir la interfaz basada en componentes reutilizables y para gestionar el estado de la aplicación.

### 3.2 Vite
Vite fue utilizado como entorno de desarrollo y compilación del proyecto. Permite una carga rápida del proyecto y la construcción de versiones listas para producción.

### 3.3 JavaScript
Se utilizó JavaScript para gestionar:

- estados de navegación
- validación de formularios
- autenticación simulada
- CRUD de servicios
- reservas
- renderizado dinámico

### 3.4 CSS
Los estilos fueron definidos en un archivo independiente para mantener una estructura ordenada y separada del contenido.

### 3.5 Chart.js
Se utilizó para generar la gráfica de métricas dentro del dashboard administrativo.

---

## 4. Estructura del proyecto

La estructura principal del proyecto fue la siguiente:

- index.html
- src/main.jsx
- src/App.jsx
- src/index.css
- package.json

### 4.1 index.html
Este archivo es el punto de entrada de la aplicación. No contiene la lógica visual principal, sino que solo define el contenedor raíz y carga la aplicación React.

Código base:

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Aesthetica</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

El div con id="root" es donde React monta la aplicación.

---

## 5. Montaje de la aplicación

El archivo src/main.jsx fue responsable de renderizar la aplicación en el navegador.

Código principal:

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

Con esto, la aplicación se ejecuta dentro del contenedor raíz y se renderiza la interfaz definida en App.jsx.

---

## 6. Componente principal App.jsx

La lógica principal de la interfaz se encuentra en App.jsx. Este archivo contiene:

- navegación entre vistas
- manejo de usuarios
- login y registro
- servicios y reservas
- administración
- CRUD de servicios
- localStorage
- dashboard con métricas

### 6.1 Estado principal
Se utilizaron varios estados para controlar la lógica de la app:

```jsx
const [currentView, setCurrentView] = useState('home');
const [authMode, setAuthMode] = useState('login');
const [currentUser, setCurrentUser] = useState(() => readStorage(STORAGE_KEYS.session, null));
const [users, setUsers] = useState(() => readStorage(STORAGE_KEYS.users, initialUsers));
const [services, setServices] = useState(() => readStorage(STORAGE_KEYS.services, initialServices));
const [appointments, setAppointments] = useState(() => readStorage(STORAGE_KEYS.appointments, initialAppointments));
```

Estos estados controlan la vista activa, la sesión actual y los datos almacenados por la aplicación.

---

## 7. Navegación por vistas

Para evitar la complejidad de un sistema de rutas, se gestionó la navegación mediante estados.

Ejemplo:

```jsx
<li><button onClick={() => setCurrentView('home')}>Inicio</button></li>
<li><button onClick={() => setCurrentView('booking')}>Reservar</button></li>
<li><button onClick={() => setCurrentView('login')}>Iniciar sesión</button></li>
```

Con esta lógica, la aplicación cambia entre secciones sin recargar la página.

---

## 8. Maquetación de la landing page

La interfaz principal tuvo una estructura con varias secciones.

### 8.1 Hero section
La sección principal se diseñó para destacar la marca y mostrar una oferta visualmente atractiva.

Código representativo:

```jsx
<section className="hero-section">
  <div className="container hero-inner">
    <div className="hero-copy">
      <span className="eyebrow">Belleza • bienestar • confianza</span>
      <h1 className="hero-title">Tu belleza y bienestar, en un solo lugar.</h1>
      <p className="hero-subtitle">Citas premium, servicios personalizados y atención para cada momento de tu rutina.</p>
      <div className="hero-actions">
        <button className="btn-secondary">Ver servicios</button>
        <button className="btn-primary">Reservar cita</button>
      </div>
    </div>
  </div>
</section>
```

### 8.2 Servicios
Los servicios se muestran dinámicamente desde un arreglo de objetos. Esto permite ampliar o modificar la información sin rehacer el código completo.

Ejemplo:

```jsx
const initialServices = [
  { id: 1, name: 'Limpieza facial', price: 35, duration: '45Min', description: 'Piel luminosa y revitalizada.' },
  { id: 2, name: 'Masaje corporal', price: 50, duration: '60Min', description: 'Relajación profunda y alivio muscular.' },
  { id: 3, name: 'Manicure Spa', price: 25, duration: '30Min', description: 'Cuidado premium para tus manos.' },
  { id: 4, name: 'Tratamiento facial', price: 65, duration: '75Min', description: 'Hidratación, limpieza y rejuvenecimiento.' },
];
```

Renderizado:

```jsx
{services.map((service) => (
  <article className="card" key={service.id}>
    <div className="card-topline">{service.duration}</div>
    <h3>{service.name}</h3>
    <p>{service.description}</p>
    <p className="price-tag">${service.price}.00</p>
    <button className="btn-primary">Reservar</button>
  </article>
))}
```

---

## 9. Estilos globales

El archivo src/index.css se encargó de la apariencia completa del proyecto.

### 9.1 Paleta de colores
Se definieron colores base para mantener una identidad visual consistente:

```css
:root {
  --color-primary: #5c8db0;
  --color-secondary: #7db7d9;
  --color-accent: #a8d6ea;
  --color-light-surface: #dfeaf2;
  --color-bg: #edf6fb;
  --color-text: #1f3d57;
}
```

### 9.2 Fondo y diseño del hero
```css
.hero-section {
  padding: 4.5rem 0 3.5rem;
  background: linear-gradient(135deg, #edf6fb 0%, #b8d9eb 38%, #90c1d6 100%);
}
```

### 9.3 Tarjetas y botones
```css
.card {
  background: linear-gradient(180deg, rgba(255,255,255,0.92), rgba(220,232,240,0.9));
  border-radius: 24px;
  box-shadow: 0 14px 22px rgba(31, 61, 87, 0.08);
}

.btn-primary {
  background-color: var(--color-primary);
  color: var(--color-white);
}
```

### 9.4 Diseño responsive
Para adaptarse a pantallas pequeñas, se añadió media query:

```css
@media (max-width: 768px) {
  .hero-inner {
    grid-template-columns: 1fr;
  }

  .two-columns {
    grid-template-columns: 1fr;
  }
}
```

Esto permite que la página se vea bien en móvil, tablet y escritorio.

---

## 10. Autenticación y permisos

La lógica de autenticación se implementó con validación simple en React.

### 10.1 Login
```jsx
const handleLogin = (event) => {
  event.preventDefault();

  const user = users.find(
    (item) =>
      item.email.toLowerCase() === loginForm.email.trim().toLowerCase() &&
      item.password === loginForm.password
  );

  if (!user) {
    setNotice({ type: 'error', text: 'Credenciales incorrectas.' });
    return;
  }

  setCurrentUser(user);
  setCurrentView(user.role === 'admin' ? 'admin' : 'home');
};
```

### 10.2 Registro
```jsx
if (registerForm.password.length < 6) {
  setNotice({ type: 'error', text: 'La contraseña debe tener al menos 6 caracteres.' });
  return;
}
```

### 10.3 Roles
Se asignaron dos tipos de usuarios:

- admin
- client

Esto permite una diferencia de acceso dentro de la aplicación.

---

## 11. Gestión de datos con localStorage

Para guardar la información sin depender de un backend, se utilizó LocalStorage.

### 11.1 Definición de claves
```jsx
const STORAGE_KEYS = {
  users: 'aesthetica_users',
  services: 'aesthetica_services',
  appointments: 'aesthetica_appointments',
  session: 'aesthetica_current_user',
};
```

### 11.2 Guardado
```jsx
useEffect(() => {
  window.localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
}, [users]);
```

Esto permite que los datos persistan mientras la app esté abierta o al recargar la página.

---

## 12. CRUD de servicios

La parte administrativa tuvo la capacidad de crear, editar y eliminar servicios.

### 12.1 Crear servicio
```jsx
const newService = {
  id: Date.now(),
  name: serviceForm.name.trim(),
  price: Number(serviceForm.price),
  duration: serviceForm.duration.trim(),
  description: serviceForm.description.trim() || 'Servicio disponible en la clínica.',
};
```

### 12.2 Editar servicio
```jsx
setServices((current) =>
  current.map((service) =>
    service.id === editingServiceId
      ? { ...service, ...serviceForm, price: Number(serviceForm.price) }
      : service
  )
);
```

### 12.3 Eliminar servicio
```jsx
setServices((current) => current.filter((service) => service.id !== serviceId));
```

---

## 13. Reserva de citas

La sección de reservas permite elegir servicio, fecha, hora y especialista.

Código representativo:

```jsx
const reservation = {
  id: Date.now(),
  userId: currentUser.id,
  serviceId: Number(bookingForm.serviceId),
  serviceName: selectedService.name,
  price: Number(selectedService.price),
  specialist: bookingForm.specialist,
  date: bookingForm.date,
  time: bookingForm.time,
  status: 'pendiente',
};
```

Luego se guarda en la lista de reservas para su posterior visualización y administración.

---

## 14. Dashboard administrativo

La vista administrativa permite ver:

- citas confirmadas
- ingresos totales
- citas pendientes
- estadísticas de servicios

Se hace con cálculos sobre el arreglo de reservas.

Ejemplo:

```jsx
const dashboardStats = useMemo(() => {
  const totalRevenue = appointments.reduce((sum, appointment) => sum + Number(appointment.price || 0), 0);
  const pending = appointments.filter((item) => item.status === 'pendiente').length;
  const confirmed = appointments.filter((item) => item.status === 'confirmado').length;

  return { totalRevenue, pending, confirmed };
}, [appointments]);
```

---

## 15. Gráfica del dashboard

Para mostrar la información de forma visual, se utilizó Chart.js.

Importación:

```jsx
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
```

Configuración de datos:

```jsx
const chartData = useMemo(() => {
  const totals = services.map((service) => {
    const serviceAppointments = appointments.filter((appointment) => appointment.serviceId === service.id);
    return serviceAppointments.length;
  });

  return {
    labels: services.map((service) => service.name),
    datasets: [{
      label: 'Servicios reservados',
      data: totals,
      backgroundColor: '#8C5158',
    }],
  };
}, [services, appointments]);
```

---

## 16. Consideraciones finales

La aplicación fue desarrollada como una interfaz funcional y visualmente sólida, con una estructura basada en componentes y en un sistema de estados que permite simular una experiencia real de reserva y administración. Aunque se trabajó con LocalStorage para mantener la información, el proyecto sigue siendo una solución front-end, no una aplicación con backend y base de datos real.

Aun así, cumple con los objetivos principales de:

- presentar una marca visualmente atractiva
- facilitar la reserva de servicios
- permitir autenticación básica
- diferenciar usuarios por rol
- gestionar contenido desde el panel administrativo
- mantener la información en el navegador sin una base de datos externa

---

## 17. Conclusión

El proyecto logró combinar una maqueta visual moderna con una lógica funcional básica, facilitando la presentación de una aplicación de belleza y bienestar con capacidad de reserva, autenticación y administración. La utilización de React y Vite permitió mantener una estructura ordenada, versátil y fácil de mantener, además de asegurar una base sólida para futuras mejoras como backend real, conexión a base de datos o despliegue en producción.
