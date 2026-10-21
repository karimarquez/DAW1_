import React, { useEffect, useMemo, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const STORAGE_KEYS = {
  users: 'aesthetica_users',
  services: 'aesthetica_services',
  appointments: 'aesthetica_appointments',
  session: 'aesthetica_current_user',
};

const initialUsers = [
  { id: 1, name: 'Administrador', email: 'admin@aesthetica.com', password: 'admin123', role: 'admin' },
  { id: 2, name: 'Cliente Demo', email: 'cliente@aesthetica.com', password: 'cliente123', role: 'client' },
];

const initialServices = [
  { id: 1, name: 'Limpieza facial', price: 35, duration: '45Min', description: 'Piel luminosa y revitalizada.' },
  { id: 2, name: 'Masaje corporal', price: 50, duration: '60Min', description: 'Relajación profunda y alivio muscular.' },
  { id: 3, name: 'Manicure Spa', price: 25, duration: '30Min', description: 'Cuidado premium para tus manos.' },
  { id: 4, name: 'Tratamiento facial', price: 65, duration: '75Min', description: 'Hidratación, limpieza y rejuvenecimiento.' },
];

const timeOptions = ['10:00', '11:00', '13:00', '14:30', '16:00', '17:30'];
const specialistOptions = ['Ana Martínez', 'Juan Alberto', 'Elena Gómez'];

const dateOffset = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

const initialAppointments = [
  { id: 1, userId: 2, serviceId: 1, serviceName: 'Limpieza facial', price: 35, specialist: 'Ana Martínez', date: dateOffset(3), time: '10:00', status: 'confirmado' },
  { id: 2, userId: 2, serviceId: 2, serviceName: 'Masaje corporal', price: 50, specialist: 'Juan Alberto', date: dateOffset(4), time: '13:30', status: 'pendiente' },
];

const loadAppointments = () => {
  const savedAppointments = readStorage(STORAGE_KEYS.appointments, initialAppointments);
  if (!Array.isArray(savedAppointments)) return initialAppointments;

  return savedAppointments.map((appointment) => {
    const firstLegacyDemo = appointment.id === 1
      && appointment.userId === 2
      && appointment.serviceName === 'Limpieza facial'
      && appointment.specialist === 'Ana Martínez'
      && appointment.date === '2026-09-28';
    const secondLegacyDemo = appointment.id === 2
      && appointment.userId === 2
      && appointment.serviceName === 'Masaje corporal'
      && appointment.specialist === 'Juan Alberto'
      && appointment.date === '2026-09-29';

    if (firstLegacyDemo) return { ...appointment, date: dateOffset(3) };
    if (secondLegacyDemo) return { ...appointment, date: dateOffset(4) };
    return appointment;
  });
};

const readStorage = (key, fallback) => {
  if (typeof window === 'undefined') return fallback;

  try {
    const saved = window.localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
};

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [authMode, setAuthMode] = useState('login');
  const [currentUser, setCurrentUser] = useState(() => readStorage(STORAGE_KEYS.session, null));
  const [users, setUsers] = useState(() => readStorage(STORAGE_KEYS.users, initialUsers));
  const [services, setServices] = useState(() => readStorage(STORAGE_KEYS.services, initialServices));
  const [appointments, setAppointments] = useState(loadAppointments);
  const [pendingReservation, setPendingReservation] = useState(null);
  const [loginForm, setLoginForm] = useState({ email: 'admin@aesthetica.com', password: 'admin123' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [bookingForm, setBookingForm] = useState({
    serviceId: initialServices[0].id,
    date: dateOffset(1),
    time: '10:00',
    specialist: specialistOptions[0],
  });
  const [paymentForm, setPaymentForm] = useState({ method: 'online', card: '', exp: '', cvc: '' });
  const [serviceForm, setServiceForm] = useState({ name: '', price: '', duration: '', description: '' });
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [notice, setNotice] = useState({ type: '', text: '' });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.services, JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.appointments, JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    if (currentUser) {
      window.localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(currentUser));
    } else {
      window.localStorage.removeItem(STORAGE_KEYS.session);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser && currentUser.role === 'admin' && currentView !== 'admin') {
      setCurrentView('admin');
    }
  }, [currentUser, currentView]);

  useEffect(() => {
    if (!notice.text) return;

    Swal.fire({
      icon: notice.type === 'error' ? 'error' : 'success',
      title: notice.type === 'error' ? 'Revisa los datos' : '¡Listo!',
      text: notice.text,
      confirmButtonColor: '#89564e',
    });
  }, [notice]);

  const selectedService = useMemo(
    () => services.find((service) => service.id === Number(bookingForm.serviceId)) || services[0] || null,
    [services, bookingForm.serviceId]
  );

  const availableTimes = useMemo(
    () => timeOptions.filter((time) => !appointments.some((appointment) =>
      appointment.date === bookingForm.date
      && appointment.time === time
      && appointment.specialist === bookingForm.specialist
      && appointment.status !== 'cancelado'
    )),
    [appointments, bookingForm.date, bookingForm.specialist]
  );

  useEffect(() => {
    if (availableTimes.length > 0 && !availableTimes.includes(bookingForm.time)) {
      setBookingForm((current) => ({ ...current, time: availableTimes[0] }));
    }
  }, [availableTimes, bookingForm.time]);

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

  const dashboardStats = useMemo(() => {
    const totalRevenue = appointments
      .filter((appointment) => appointment.status === 'confirmado')
      .reduce((sum, appointment) => sum + Number(appointment.price || 0), 0);
    const pending = appointments.filter((item) => item.status === 'pendiente').length;
    const confirmed = appointments.filter((item) => item.status === 'confirmado').length;

    return {
      totalRevenue,
      pending,
      confirmed,
    };
  }, [appointments]);

  const handleLogin = (event) => {
    event.preventDefault();

    if (!loginForm.email.trim() || !loginForm.password) {
      setNotice({ type: 'error', text: 'Escribe tu correo y contraseña para continuar.' });
      return;
    }

    const user = users.find(
      (item) => item.email.toLowerCase() === loginForm.email.trim().toLowerCase() && item.password === loginForm.password
    );

    if (!user) {
      setNotice({ type: 'error', text: 'Correo o contraseña incorrectos.' });
      return;
    }

    setCurrentUser(user);
    setNotice({ type: 'success', text: `Bienvenido ${user.name}` });
    setCurrentView(user.role === 'admin' ? 'admin' : 'home');
    setLoginForm({ email: '', password: '' });
  };

  const handleRegister = (event) => {
    event.preventDefault();

    if (!registerForm.name.trim() || !registerForm.email.trim() || !registerForm.password || !registerForm.confirmPassword) {
      setNotice({ type: 'error', text: 'Todos los campos son obligatorios.' });
      return;
    }

    if (registerForm.name.trim().length < 2) {
      setNotice({ type: 'error', text: 'El nombre debe tener al menos 2 caracteres.' });
      return;
    }

    if (registerForm.password.length < 8 || !/[A-Z]/.test(registerForm.password) || !/[a-z]/.test(registerForm.password) || !/\d/.test(registerForm.password)) {
      setNotice({ type: 'error', text: 'Usa al menos 8 caracteres con una mayúscula, una minúscula y un número.' });
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      setNotice({ type: 'error', text: 'Las contraseñas no coinciden.' });
      return;
    }

    const emailExists = users.some((user) => user.email.toLowerCase() === registerForm.email.trim().toLowerCase());
    if (emailExists) {
      setNotice({ type: 'error', text: 'Ese correo ya está registrado.' });
      return;
    }

    const newUser = {
      id: Date.now(),
      name: registerForm.name.trim(),
      email: registerForm.email.trim(),
      password: registerForm.password,
      role: 'client',
    };

    setUsers((current) => [...current, newUser]);
    setNotice({ type: 'success', text: 'Usuario registrado correctamente.' });
    setAuthMode('login');
    setRegisterForm({ name: '', email: '', password: '', confirmPassword: '' });
  };

  const handleBooking = (event) => {
    event.preventDefault();

    if (!currentUser) {
      setCurrentView('login');
      setNotice({ type: 'error', text: 'Debes iniciar sesión para reservar.' });
      return;
    }

    if (!selectedService) {
      setNotice({ type: 'error', text: 'No hay servicios disponibles. Contacta con la clínica.' });
      return;
    }

    if (bookingForm.date < dateOffset(1)) {
      setNotice({ type: 'error', text: 'Selecciona una fecha a partir de mañana.' });
      return;
    }

    if (!availableTimes.includes(bookingForm.time)) {
      setNotice({ type: 'error', text: 'Ese horario ya no está disponible para el especialista. Elige otro.' });
      return;
    }

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

    setPendingReservation(reservation);
    setCurrentView('payment');
  };

  const handlePayment = (event) => {
    event.preventDefault();

    if (!pendingReservation) {
      setNotice({ type: 'error', text: 'No hay reserva pendiente.' });
      return;
    }

    if (paymentForm.method === 'online') {
      const cardNumber = paymentForm.card.replace(/\D/g, '');
      const digitSum = [...cardNumber].reverse().reduce((sum, digit, index) => {
        let value = Number(digit);
        if (index % 2 === 1) {
          value *= 2;
          if (value > 9) value -= 9;
        }
        return sum + value;
      }, 0);
      const expiration = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(paymentForm.exp);
      const currentMonth = new Date().getFullYear() % 100 * 12 + new Date().getMonth();
      const expiryMonth = expiration ? Number(expiration[2]) * 12 + Number(expiration[1]) - 1 : -1;

      if (cardNumber.length < 13 || cardNumber.length > 19 || digitSum % 10 !== 0) {
        setNotice({ type: 'error', text: 'Revisa el número de tarjeta de prueba (debe tener entre 13 y 19 dígitos válidos).' });
        return;
      }

      if (!expiration || expiryMonth < currentMonth) {
        setNotice({ type: 'error', text: 'Escribe una fecha válida y vigente con el formato MM/AA.' });
        return;
      }

      if (!/^\d{3,4}$/.test(paymentForm.cvc)) {
        setNotice({ type: 'error', text: 'El código de seguridad debe tener 3 o 4 dígitos.' });
        return;
      }
    }

    const confirmedReservation = {
      ...pendingReservation,
      status: paymentForm.method === 'online' ? 'confirmado' : 'pendiente',
    };

    setAppointments((current) => [confirmedReservation, ...current]);
    setPendingReservation(null);
    setPaymentForm({ method: 'online', card: '', exp: '', cvc: '' });
    setCurrentView('home');
    setNotice({
      type: 'success',
      text: paymentForm.method === 'online'
        ? 'Reserva confirmada. El cobro es una simulación académica; no se procesó ningún pago real.'
        : 'Cita registrada. El pago se realizará en el establecimiento.',
    });
  };

  const handleServiceSubmit = (event) => {
    event.preventDefault();

    if (!serviceForm.name.trim() || !serviceForm.price || !serviceForm.duration.trim()) {
      setNotice({ type: 'error', text: 'Nombre, precio y duración son obligatorios.' });
      return;
    }

    if (serviceForm.name.trim().length < 3 || Number(serviceForm.price) <= 0 || !Number.isFinite(Number(serviceForm.price))) {
      setNotice({ type: 'error', text: 'El nombre debe tener al menos 3 caracteres y el precio debe ser mayor que cero.' });
      return;
    }

    if (!/^\d{1,3}\s?(min|mins|minutos|h|hora|horas)$/i.test(serviceForm.duration.trim())) {
      setNotice({ type: 'error', text: 'Indica la duración en minutos u horas, por ejemplo: 45 min.' });
      return;
    }

    if (editingServiceId) {
      setServices((current) =>
        current.map((service) =>
          service.id === editingServiceId ? { ...service, ...serviceForm, price: Number(serviceForm.price) } : service
        )
      );
      setNotice({ type: 'success', text: 'Servicio actualizado correctamente.' });
    } else {
      const newService = {
        id: Date.now(),
        name: serviceForm.name.trim(),
        price: Number(serviceForm.price),
        duration: serviceForm.duration.trim(),
        description: serviceForm.description.trim() || 'Servicio disponible en la clínica.',
      };

      setServices((current) => [newService, ...current]);
      setNotice({ type: 'success', text: 'Servicio agregado correctamente.' });
    }

    setServiceForm({ name: '', price: '', duration: '', description: '' });
    setEditingServiceId(null);
  };

  const handleEditService = (service) => {
    setEditingServiceId(service.id);
    setServiceForm({
      name: service.name,
      price: service.price,
      duration: service.duration,
      description: service.description,
    });
  };

  const handleDeleteService = async (serviceId) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: '¿Eliminar este servicio?',
      text: 'Las citas existentes se conservarán en el historial.',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Conservar',
      confirmButtonColor: '#b95a52',
    });

    if (!result.isConfirmed) return;

    setServices((current) => current.filter((service) => service.id !== serviceId));
    setNotice({ type: 'success', text: 'Servicio eliminado.' });
  };

  const handleAppointmentStatus = async (appointment, status) => {
    const action = status === 'confirmado' ? 'confirmar' : 'cancelar';
    const result = await Swal.fire({
      icon: 'question',
      title: `¿${action} esta cita?`,
      text: `${appointment.serviceName} · ${appointment.date} a las ${appointment.time}`,
      showCancelButton: true,
      confirmButtonText: `Sí, ${action}`,
      cancelButtonText: 'Volver',
      confirmButtonColor: status === 'cancelado' ? '#b95a52' : '#89564e',
    });

    if (!result.isConfirmed) return;

    setAppointments((current) => current.map((item) =>
      item.id === appointment.id ? { ...item, status } : item
    ));
    setNotice({ type: 'success', text: `Cita ${status === 'confirmado' ? 'confirmada' : 'cancelada'}.` });
  };

  const clientAppointments = appointments.filter((appointment) => appointment.userId === currentUser?.id);

  const logout = () => {
    setCurrentUser(null);
    setCurrentView('home');
    setNotice({ type: 'success', text: 'Sesión cerrada.' });
  };

  return (
    <div className="app-shell">
      <header className="navbar">
        <div className="brand-logo">Aesthetica</div>
        <nav>
          <ul className="nav-links">
            <li><button onClick={() => setCurrentView('home')}>Inicio</button></li>
            <li><button onClick={() => setCurrentView('home')}>Servicios</button></li>
            <li><button onClick={() => setCurrentView('booking')}>Reservar</button></li>
            {currentUser?.role === 'admin' ? (
              <>
                <li><button onClick={() => setCurrentView('admin')}>Admin</button></li>
                <li><button className="btn-primary" onClick={logout}>Cerrar sesión</button></li>
              </>
            ) : currentUser ? (
              <>
                <li><button onClick={() => setCurrentView('appointments')}>Mis citas</button></li>
                <li><button className="btn-primary" onClick={logout}>Cerrar sesión</button></li>
              </>
            ) : (
              <li><button className="btn-primary" onClick={() => setCurrentView('login')}>Iniciar sesión</button></li>
            )}
          </ul>
        </nav>
      </header>

      {currentView === 'home' && (
        <main>
          <section className="hero-section">
            <div className="container hero-inner">
              <div className="hero-copy">
                <span className="eyebrow">Belleza • bienestar • confianza</span>
                <h1 className="hero-title">Tu belleza y bienestar, en un solo lugar.</h1>
                <p className="hero-subtitle">Citas premium, servicios personalizados y atención para cada momento de tu rutina.</p>
                <div className="hero-actions">
                  <button className="btn-secondary" onClick={() => setCurrentView('home')}>Ver servicios</button>
                  <button className="btn-primary" onClick={() => setCurrentView('booking')}>Reservar cita</button>
                </div>
                <div className="stats-row">
                  <div>
                    <strong>10k+</strong>
                    <span>Clientes felices</span>
                  </div>
                  <div>
                    <strong>4.9/5</strong>
                    <span>Valoración</span>
                  </div>
                  <div>
                    <strong>15+</strong>
                    <span>Especialistas</span>
                  </div>
                </div>
              </div>

              <div className="hero-visual" aria-label="hero visual">
                <div className="hero-glow" />
                <div className="visual-badge">Aesthetica</div>
                <div className="visual-card large-card">
                  <span>Tratamiento facial</span>
                  <strong>Revitaliza tu piel</strong>
                  <div className="mini-tag">Desde $35</div>
                </div>
                <div className="visual-card mini-card">
                  <strong>99%</strong>
                  <span>pacientes satisfechos</span>
                </div>
              </div>
            </div>
          </section>

          <section className="container section-block">
            <div className="section-header">
              <span className="eyebrow">Servicios</span>
              <h2 className="section-title">Nuestros tratamientos</h2>
            </div>
            <div className="grid-3">
              {services.map((service) => (
                <article className="card" key={service.id}>
                  <div className="card-topline">{service.duration}</div>
                  <h3>{service.name}</h3>
                  <p>{service.description}</p>
                  <p className="price-tag">${service.price}.00</p>
                  <button
                    className="btn-primary"
                    onClick={() => {
                      setBookingForm((current) => ({ ...current, serviceId: service.id }));
                      setCurrentView('booking');
                    }}
                  >
                    Reservar
                  </button>
                </article>
              ))}
            </div>
          </section>

          <section className="container section-block split-section">
            <div className="info-panel">
              <span className="eyebrow">Nuestra diferencia</span>
              <h3>Tu cuidado, diseñado para sentirse único.</h3>
              <ul>
                <li>Consulta personalizada con cada cliente.</li>
                <li>Productos premium y protocolos actualizados.</li>
                <li>Ambiente tranquilo, limpio y exclusivo.</li>
              </ul>
              <button className="btn-primary" onClick={() => setCurrentView('booking')}>Agendar ahora</button>
            </div>

            <div className="image-panel">
              <div className="image-box">
                <span>Consulta personalizada</span>
              </div>
            </div>
          </section>

          <section className="container section-block specialists-section">
            <div className="section-header">
              <span className="eyebrow">Especialistas</span>
              <h2 className="section-title">Conoce a nuestro equipo</h2>
            </div>
            <div className="specialist-grid">
              {['Ana Martínez', 'Juan Alberto', 'Elena Gómez'].map((person, index) => (
                <div className="specialist-item" key={person}>
                  <div className="avatar">{person.split(' ')[0].slice(0, 1)}</div>
                  <h4>{person}</h4>
                  <p>{index === 0 ? 'Especialista facial' : index === 1 ? 'Masajista corporal' : 'Manicurista'}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="container section-block cta-banner">
            <div>
              <span className="eyebrow">Reserva tu cita</span>
              <h3>Cuida tu bienestar con una experiencia premium.</h3>
            </div>
            <button className="btn-primary" onClick={() => setCurrentView('booking')}>Reservar ahora</button>
          </section>

          <section className="container section-block">
            <h2 className="section-title">Encuéntranos</h2>
            <div className="map-container">Soyapango, San Salvador · Atención de lunes a domingo</div>
          </section>

          <section className="container section-block report-cta">
            <div>
              <span className="eyebrow">Aesthetica en cifras</span>
              <h2 className="section-title">Consulta nuestras estadísticas</h2>
              <p>Explora el rendimiento de los servicios y compara los resultados por año.</p>
            </div>
            <a className="btn-primary" href="./reportes.html">
              Ver gráficas
            </a>
          </section>

        </main>
      )}

      {currentView === 'booking' && (
        <main className="container section-block">
          <h2 className="section-title">Reserva tu cita</h2>
          <form onSubmit={handleBooking} className="booking-form">
            <div className="two-columns">
              <div className="selection-box">
                <h3>SELECCIONA EL SERVICIO</h3>
                <div className="form-group">
                  <label htmlFor="booking-service">Servicio</label>
                  <select
                    id="booking-service"
                    className="form-input"
                    value={bookingForm.serviceId}
                    onChange={(event) => setBookingForm({ ...bookingForm, serviceId: Number(event.target.value) })}
                    required
                  >
                    {services.length === 0 && <option value="">No hay servicios disponibles</option>}
                    {services.map((service) => (
                      <option key={service.id} value={service.id}>{service.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="booking-date">Fecha</label>
                  <input
                    id="booking-date"
                    type="date"
                    className="form-input"
                    value={bookingForm.date}
                    min={dateOffset(1)}
                    onChange={(event) => setBookingForm({ ...bookingForm, date: event.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Hora</label>
                  <div className="time-slots">
                    {availableTimes.map((time) => (
                      <button
                        key={time}
                        type="button"
                        className={`slot-btn ${bookingForm.time === time ? 'active' : ''}`}
                        onClick={() => setBookingForm({ ...bookingForm, time })}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                  {availableTimes.length === 0 && <p className="form-hint">No hay horarios para este día. Prueba otra fecha o especialista.</p>}
                </div>
              </div>

              <div className="selection-box">
                <h3>ELIGE TU ESPECIALISTA</h3>
                <div className="specialist-list">
                  {specialistOptions.map((person) => (
                    <label
                      key={person}
                      className={`specialist-card ${bookingForm.specialist === person ? 'selected' : ''}`}
                    >
                      <input
                        type="radio"
                        name="specialist"
                        value={person}
                        checked={bookingForm.specialist === person}
                        onChange={() => setBookingForm({ ...bookingForm, specialist: person })}
                        required
                      />
                      <div>
                        <strong>{person}</strong>
                        <small>Especialista</small>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="booking-resume-box">
              <div>
                <strong>RESUMEN:</strong> {selectedService.name} | {bookingForm.date} | {bookingForm.time} | {bookingForm.specialist} | ${selectedService.price}.00
              </div>
              <button className="btn-primary" type="submit">Continuar al pago</button>
            </div>
          </form>
        </main>
      )}

      {currentView === 'appointments' && currentUser?.role === 'client' && (
        <main className="container section-block">
          <div className="section-header">
            <div>
              <span className="eyebrow">Tu bienestar, a tu ritmo</span>
              <h2 className="section-title">Mis citas</h2>
            </div>
            <button className="btn-primary" onClick={() => setCurrentView('booking')}>Reservar una cita</button>
          </div>
          {clientAppointments.length === 0 ? (
            <div className="selection-box empty-state">
              <h3>Aún no tienes citas</h3>
              <p>Cuando reserves un servicio, aquí podrás consultar su fecha y estado.</p>
            </div>
          ) : (
            <div className="appointment-list">
              {clientAppointments.map((appointment) => (
                <article className="selection-box appointment-card" key={appointment.id}>
                  <div>
                    <span className={`status-pill status-${appointment.status}`}>{appointment.status}</span>
                    <h3>{appointment.serviceName}</h3>
                    <p>{appointment.date} · {appointment.time} · {appointment.specialist}</p>
                    <strong>${appointment.price}.00</strong>
                  </div>
                  {appointment.status !== 'cancelado' && appointment.date >= dateOffset(0) && (
                    <button
                      className="btn-primary danger"
                      onClick={() => handleAppointmentStatus(appointment, 'cancelado')}
                    >
                      Cancelar cita
                    </button>
                  )}
                </article>
              ))}
            </div>
          )}
        </main>
      )}

      {currentView === 'login' && (
        <main className="container auth-container section-block">
          <div className="selection-box auth-box">
            <div className="auth-tabs">
              <button type="button" className={authMode === 'login' ? 'tab active' : 'tab'} onClick={() => setAuthMode('login')}>Iniciar sesión</button>
              <button type="button" className={authMode === 'register' ? 'tab active' : 'tab'} onClick={() => setAuthMode('register')}>Registrarse</button>
            </div>

            {authMode === 'login' ? (
              <form onSubmit={handleLogin}>
                <h2>Acceso a tu cuenta</h2>
                <p className="form-hint">Cuentas de demostración: admin@aesthetica.com / admin123 · cliente@aesthetica.com / cliente123</p>
                <div className="form-group auth-group">
                  <label htmlFor="login-email">Correo electrónico</label>
                  <input
                    id="login-email"
                    type="email"
                    className="form-input"
                    value={loginForm.email}
                    onChange={(event) => setLoginForm({ ...loginForm, email: event.target.value })}
                    placeholder="usuario@ejemplo.com"
                    autoComplete="email"
                    required
                  />
                </div>
                <div className="form-group auth-group">
                  <label htmlFor="login-password">Contraseña</label>
                  <input
                    id="login-password"
                    type="password"
                    className="form-input"
                    value={loginForm.password}
                    onChange={(event) => setLoginForm({ ...loginForm, password: event.target.value })}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    minLength={8}
                    required
                  />
                </div>
                <button className="btn-primary auth-button" type="submit">Ingresar</button>
              </form>
            ) : (
              <form onSubmit={handleRegister}>
                <h2>Crear cuenta</h2>
                <div className="form-group auth-group">
                  <label htmlFor="register-name">Nombre</label>
                  <input
                    id="register-name"
                    type="text"
                    className="form-input"
                    value={registerForm.name}
                    onChange={(event) => setRegisterForm({ ...registerForm, name: event.target.value })}
                    placeholder="Tu nombre"
                    minLength={2}
                    maxLength={80}
                    autoComplete="name"
                    required
                  />
                </div>
                <div className="form-group auth-group">
                  <label htmlFor="register-email">Correo electrónico</label>
                  <input
                    id="register-email"
                    type="email"
                    className="form-input"
                    value={registerForm.email}
                    onChange={(event) => setRegisterForm({ ...registerForm, email: event.target.value })}
                    placeholder="correo@ejemplo.com"
                    autoComplete="email"
                    required
                  />
                </div>
                <div className="form-group auth-group">
                  <label htmlFor="register-password">Contraseña</label>
                  <input
                    id="register-password"
                    type="password"
                    className="form-input"
                    value={registerForm.password}
                    onChange={(event) => setRegisterForm({ ...registerForm, password: event.target.value })}
                    placeholder="8 caracteres, mayúscula, minúscula y número"
                    minLength={8}
                    pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}"
                    autoComplete="new-password"
                    required
                  />
                </div>
                <div className="form-group auth-group">
                  <label htmlFor="register-confirm-password">Confirmar contraseña</label>
                  <input
                    id="register-confirm-password"
                    type="password"
                    className="form-input"
                    value={registerForm.confirmPassword}
                    onChange={(event) => setRegisterForm({ ...registerForm, confirmPassword: event.target.value })}
                    placeholder="Repite tu contraseña"
                    minLength={8}
                    pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}"
                    autoComplete="new-password"
                    required
                  />
                </div>
                <button className="btn-primary auth-button" type="submit">Registrarme</button>
              </form>
            )}
          </div>
        </main>
      )}

      {currentView === 'payment' && (
        <main className="container section-block">
          <h2 className="section-title">Confirmación y Pago</h2>
          <form onSubmit={handlePayment} className="two-columns">
            <div className="selection-box">
              <h3>MÉTODOS DE PAGO</h3>
              <div className="payment-methods">
                <label className={paymentForm.method === 'online' ? 'selected-payment' : ''}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentForm.method === 'online'}
                    onChange={() => setPaymentForm({ ...paymentForm, method: 'online' })}
                    required
                  />
                  Pagar en línea
                </label>
                <label className={paymentForm.method === 'local' ? 'selected-payment' : ''}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentForm.method === 'local'}
                    onChange={() => setPaymentForm({ ...paymentForm, method: 'local' })}
                  />
                  Pagar en establecimiento
                </label>
              </div>

              {paymentForm.method === 'online' && (
                <div className="payment-demo-fields">
                  <p className="form-hint">Demostración académica: no introduzcas datos de una tarjeta real. No se procesa ningún pago.</p>
                  <div className="form-group">
                    <label htmlFor="demo-card">Número de tarjeta de prueba</label>
                    <input
                      id="demo-card"
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      maxLength={19}
                      className="form-input"
                      value={paymentForm.card}
                      onChange={(event) => setPaymentForm({ ...paymentForm, card: event.target.value.replace(/\D/g, '').slice(0, 19) })}
                      placeholder="4242 4242 4242 4242"
                      required
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group half">
                      <label htmlFor="demo-exp">Vencimiento de prueba</label>
                  <input
                    id="demo-exp"
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    maxLength={5}
                    className="form-input"
                    value={paymentForm.exp}
                    onChange={(event) => {
                      const digits = event.target.value.replace(/\D/g, '').slice(0, 4);
                      setPaymentForm({ ...paymentForm, exp: digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits });
                    }}
                    placeholder="MM/AA"
                    required
                  />
                </div>
                <div className="form-group half">
                  <label htmlFor="demo-cvc">CVC de prueba</label>
                  <input
                    id="demo-cvc"
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    maxLength={4}
                    className="form-input"
                    value={paymentForm.cvc}
                    onChange={(event) => setPaymentForm({ ...paymentForm, cvc: event.target.value.replace(/\D/g, '').slice(0, 4) })}
                    placeholder="123 o 1234"
                    required
                  />
                </div>
              </div>
                </div>
              )}
            </div>

            <div className="selection-box payment-summary">
              <h3>RESUMEN DE COMPRA</h3>
              <div className="summary-list">
                <p><strong>Servicio:</strong> {pendingReservation?.serviceName || selectedService?.name || 'No disponible'}</p>
                <p><strong>Fecha:</strong> {pendingReservation?.date || bookingForm.date}</p>
                <p><strong>Hora:</strong> {pendingReservation?.time || bookingForm.time}</p>
                <p><strong>Especialista:</strong> {pendingReservation?.specialist || bookingForm.specialist}</p>
                <hr />
                <p><strong>Total:</strong> ${pendingReservation?.price || selectedService?.price || 0}.00</p>
                <p className="payment-total"><strong>Anticipo:</strong> $10.00</p>
              </div>
              <button className="btn-primary payment-submit" type="submit">
                {paymentForm.method === 'online' ? 'Confirmar simulación' : 'Registrar cita'}
              </button>
            </div>
          </form>
        </main>
      )}

      {currentView === 'admin' && (
        <div className="admin-layout">
          <aside className="sidebar">
            <h3>Aesthetica Admin</h3>
            <ul className="sidebar-menu">
              <li className="active">Dashboard</li>
              <li>Citas</li>
              <li>Servicios</li>
              <li>Personal</li>
            </ul>
            <button className="btn-secondary sidebar-logout" onClick={logout}>Cerrar sesión</button>
          </aside>

          <main className="admin-content">
            <header className="admin-header">
              <h2>Panel de administración</h2>
              <div>Bienvenido, {currentUser?.name}</div>
            </header>

            <div className="metrics-grid">
              <div className="metric-card">
                <div>Citas confirmadas</div>
                <div className="metric-value">{dashboardStats.confirmed}</div>
              </div>
              <div className="metric-card">
                <div>Ingresos</div>
                <div className="metric-value">${dashboardStats.totalRevenue}.00</div>
              </div>
              <div className="metric-card">
                <div>Pendientes</div>
                <div className="metric-value">{dashboardStats.pending}</div>
              </div>
            </div>

            <div className="admin-panels">
              <div className="selection-box chart-box">
                <h3>RENDIMIENTO DE SERVICIOS</h3>
                <div className="chart-wrapper">
                  <Bar
                    data={chartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: { legend: { display: false } },
                      scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
                    }}
                  />
                </div>
              </div>

              <section className="selection-box table-box">
                <div className="section-header">
                  <div>
                    <h3>GESTIÓN DE CITAS</h3>
                    <p>Confirma o cancela las reservas de tus clientes.</p>
                  </div>
                </div>
                {appointments.length === 0 ? (
                  <p>No hay citas registradas.</p>
                ) : (
                  <div className="table-scroll">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Cliente</th>
                          <th>Servicio</th>
                          <th>Fecha y hora</th>
                          <th>Especialista</th>
                          <th>Estado</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {appointments.map((appointment) => (
                          <tr key={appointment.id}>
                            <td>{users.find((user) => user.id === appointment.userId)?.name || 'Cliente'}</td>
                            <td>{appointment.serviceName}</td>
                            <td>{appointment.date} · {appointment.time}</td>
                            <td>{appointment.specialist}</td>
                            <td><span className={`status-pill status-${appointment.status}`}>{appointment.status}</span></td>
                            <td className="actions-cell">
                              {appointment.status !== 'confirmado' && appointment.status !== 'cancelado' && (
                                <button className="btn-secondary small" onClick={() => handleAppointmentStatus(appointment, 'confirmado')}>
                                  Confirmar
                                </button>
                              )}
                              {appointment.status !== 'cancelado' && (
                                <button className="btn-primary small danger" onClick={() => handleAppointmentStatus(appointment, 'cancelado')}>
                                  Cancelar
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>

              <div className="selection-box table-box">
                <h3>CRUD DE SERVICIOS</h3>
                <form onSubmit={handleServiceSubmit} className="service-form">
                  <div className="form-row">
                    <div className="form-group half">
                      <label>Nombre</label>
                      <input
                        type="text"
                        className="form-input"
                        value={serviceForm.name}
                        onChange={(event) => setServiceForm({ ...serviceForm, name: event.target.value })}
                        minLength={3}
                        maxLength={80}
                        required
                      />
                    </div>
                    <div className="form-group half">
                      <label>Precio</label>
                      <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        className="form-input"
                        value={serviceForm.price}
                        onChange={(event) => setServiceForm({ ...serviceForm, price: event.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group half">
                      <label>Duración</label>
                      <input
                        type="text"
                        className="form-input"
                        value={serviceForm.duration}
                        onChange={(event) => setServiceForm({ ...serviceForm, duration: event.target.value })}
                        placeholder="45 min"
                        pattern="[0-9]{1,3}\s?[a-zA-Z]+"
                        title="Indica la duración en minutos u horas (por ejemplo, 45 min)"
                        required
                      />
                    </div>
                    <div className="form-group half">
                      <label>Descripción</label>
                      <input
                        type="text"
                        className="form-input"
                        value={serviceForm.description}
                        onChange={(event) => setServiceForm({ ...serviceForm, description: event.target.value })}
                        maxLength={240}
                      />
                    </div>
                  </div>
                  <button className="btn-primary" type="submit">
                    {editingServiceId ? 'Guardar cambios' : 'Añadir servicio'}
                  </button>
                  {editingServiceId && (
                    <button
                      className="btn-secondary service-cancel"
                      type="button"
                      onClick={() => {
                        setEditingServiceId(null);
                        setServiceForm({ name: '', price: '', duration: '', description: '' });
                      }}
                    >
                      Cancelar edición
                    </button>
                  )}
                </form>

                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Servicio</th>
                      <th>Precio</th>
                      <th>Tiempo</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((service) => (
                      <tr key={service.id}>
                        <td>{service.name}</td>
                        <td>${service.price}.00</td>
                        <td>{service.duration}</td>
                        <td className="actions-cell">
                          <button className="btn-secondary small" onClick={() => handleEditService(service)}>Editar</button>
                          <button className="btn-primary small danger" onClick={() => handleDeleteService(service.id)}>Eliminar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      )}
    </div>
  );
}
