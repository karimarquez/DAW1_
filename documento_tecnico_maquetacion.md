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

### 3.6 SweetAlert2
Se utiliza para mostrar mensajes de validación y éxito y para solicitar confirmación antes de cancelar citas o eliminar servicios.

---

## 4. Estructura del proyecto

La estructura principal del proyecto fue la siguiente:

- index.html
- reportes.html
- src/main.jsx
- src/App.jsx
- src/index.css
- src/reportes.js
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

La página adicional `reportes.html` conserva el reporte anual previo de Chart.js; `src/reportes.js` contiene su gráfica interactiva. La configuración multipágina de Vite genera tanto la página principal Aesthetica como el reporte. El sitio se sirve desde la raíz del dominio para funcionar localmente y en servicios de hosting estático como Netlify.

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
  --color-primary: #89564e;
  --color-secondary: #bd8a78;
  --color-accent: #e7d4c5;
  --color-light-surface: #f2e9e0;
  --color-bg: #fbf8f4;
  --color-text: #342b27;
}
```

La identidad visual se actualizó con tonos cálidos inspirados en un espacio de bienestar. Los componentes comparten estas variables para conservar contraste y consistencia.

### 9.2 Fondo y diseño del hero
```css
.hero-section {
  background:
    radial-gradient(ellipse at 78% 25%, rgba(255, 255, 255, 0.88), transparent 32%),
    linear-gradient(120deg, #f7eee6 0%, #f1e1d4 50%, #e7cfc0 100%);
}
```

El hero y los paneles visuales utilizan gradientes CSS y formas decorativas, sin depender de imágenes externas.

### 9.3 Tarjetas, botones y accesibilidad
```css
.card {
  background: rgba(255, 255, 255, 0.82);
  border-radius: 24px;
  box-shadow: 0 14px 36px rgba(69, 49, 40, 0.055);
}

.btn-primary {
  background: var(--color-primary);
  color: var(--color-white);
}

button:focus-visible,
input:focus-visible,
select:focus-visible {
  outline: 3px solid rgba(189, 138, 120, 0.55);
  outline-offset: 3px;
}
```

### 9.4 Diseño responsive
La interfaz reorganiza el hero, los formularios y las tarjetas en pantallas pequeñas. También compacta la navegación y permite desplazar horizontalmente la tabla administrativa en móvil:

```css
@media (max-width: 768px) {
  .hero-inner,
  .split-section {
    grid-template-columns: 1fr;
  }

  .specialist-grid {
    grid-template-columns: 1fr;
  }

  .data-table {
    display: block;
    overflow-x: auto;
  }
}
```

Un segundo punto de adaptación a 480 px ajusta el encabezado, el hero y los controles para teléfonos pequeños.

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

### 10.2 Registro y validación
```jsx
if (
  registerForm.password.length < 8 ||
  !/[A-Z]/.test(registerForm.password) ||
  !/[a-z]/.test(registerForm.password) ||
  !/\d/.test(registerForm.password)
) {
  setNotice({ type: 'error', text: 'La contraseña debe tener 8 caracteres, mayúscula, minúscula y número.' });
  return;
}
```

Además, se comprueba la coincidencia de las contraseñas, que el nombre no esté vacío y que el correo no esté duplicado. Estas reglas son validaciones del lado del navegador y no reemplazan la validación de un servidor.

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
La eliminación solicita confirmación con SweetAlert2. Si se acepta, el servicio se quita del catálogo y sus citas se conservan como historial.

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

Los ingresos se calculan solo con las citas confirmadas; las canceladas y pendientes no se contabilizan como ventas.

Ejemplo:

```jsx
const dashboardStats = useMemo(() => {
  const totalRevenue = appointments
    .filter((appointment) => appointment.status === 'confirmado')
    .reduce((sum, appointment) => sum + Number(appointment.price || 0), 0);
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

## 16. Diálogos y gestión adicional de citas

SweetAlert2 se usa para comunicar resultados de validación y operaciones, y para confirmar acciones destructivas. El usuario puede confirmar o cancelar una acción antes de que se actualice el estado.

El módulo adicional de citas permite al cliente revisar sus propias reservas y solicitar cancelación. El administrador consulta la lista completa y puede confirmar o cancelar citas. La disponibilidad de horarios se filtra para evitar reservar una hora ocupada por el mismo especialista.

## 17. Validaciones avanzadas y pago de demostración

Los formularios combinan atributos HTML (`required`, `min`, `max`, `minLength`, `pattern`) con validaciones JavaScript entre campos. Se validan el formato del correo, la fortaleza y coincidencia de contraseñas, una fecha futura, la disponibilidad del horario, el precio y la duración del servicio. El modo de pago en línea comprueba formato de tarjeta, vencimiento y CVC para pruebas; no se envían ni almacenan datos de tarjeta y no se realiza un cobro real. Para el modo de pago en establecimiento no se solicita información de tarjeta.

## 18. Consideraciones finales

La aplicación fue desarrollada como una interfaz funcional y visualmente sólida, con una estructura basada en componentes y en un sistema de estados que permite simular una experiencia real de reserva y administración. Aunque se trabajó con LocalStorage para mantener la información, el proyecto sigue siendo una solución front-end, no una aplicación con backend y base de datos real.

Aun así, cumple con los objetivos principales de:

- presentar una marca visualmente atractiva
- facilitar la reserva de servicios
- permitir autenticación básica
- diferenciar usuarios por rol
- gestionar contenido desde el panel administrativo
- mantener la información en el navegador sin una base de datos externa
- presentar estadísticas, diálogos de confirmación, validaciones y gestión de citas

---

## 19. Conclusión

El proyecto logró combinar una maqueta visual moderna con una lógica funcional básica, facilitando la presentación de una aplicación de belleza y bienestar con capacidad de reserva, autenticación y administración. La utilización de React y Vite permitió mantener una estructura ordenada, versátil y fácil de mantener, además de asegurar una base sólida para futuras mejoras como backend real, conexión a base de datos o despliegue en producción.
