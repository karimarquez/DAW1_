import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { jsPDF } from 'jspdf';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputDirectory = path.join(projectRoot, 'public');
const outputPath = path.join(outputDirectory, 'investigacion-librerias-js-apa7.pdf');
const pdf = new jsPDF({ format: 'a4', unit: 'mm' });
const pageWidth = pdf.internal.pageSize.getWidth();
const pageHeight = pdf.internal.pageSize.getHeight();
const margin = 25.4;
const bodyWidth = pageWidth - margin * 2;
const lineHeight = 8.5;
let cursorY = margin;

pdf.setProperties({
  title: 'Investigación de librerías JavaScript aplicadas al proyecto Aesthetica',
  subject: 'Chart.js, SweetAlert2 y jsPDF en una aplicación React',
  author: 'Estudiante',
  keywords: 'JavaScript, React, Chart.js, SweetAlert2, jsPDF, APA 7',
});

const addPage = () => {
  pdf.addPage();
  cursorY = margin;
};

const ensureSpace = (height) => {
  if (cursorY + height > pageHeight - margin) addPage();
};

const addHeading = (text, level = 1) => {
  const fontSize = level === 1 ? 14 : 12;
  ensureSpace(fontSize * 0.5 + lineHeight * 2);
  cursorY += level === 1 ? 6 : 3;
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(fontSize);
  const lines = pdf.splitTextToSize(text, bodyWidth);
  pdf.text(lines, margin, cursorY);
  cursorY += lines.length * lineHeight;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(12);
};

const addParagraph = (text) => {
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(12);
  const lines = pdf.splitTextToSize(text, bodyWidth - 12.7);
  ensureSpace(lines.length * lineHeight + lineHeight);
  lines.forEach((line, index) => {
    pdf.text(line, margin + (index === 0 ? 12.7 : 0), cursorY);
    cursorY += lineHeight;
  });
  cursorY += lineHeight * 0.35;
};

const addReference = (author, title, url) => {
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(12);
  const titleLines = pdf.splitTextToSize(title, bodyWidth - 10);
  const urlLines = pdf.splitTextToSize(url, bodyWidth - 10);
  ensureSpace((titleLines.length + urlLines.length + 1) * lineHeight + lineHeight);
  pdf.text(author, margin, cursorY);
  cursorY += lineHeight;
  pdf.setFont('helvetica', 'italic');
  titleLines.forEach((line) => {
    pdf.text(line, margin + 10, cursorY);
    cursorY += lineHeight;
  });
  pdf.setFont('helvetica', 'normal');
  urlLines.forEach((line) => {
    pdf.text(line, margin + 10, cursorY);
    cursorY += lineHeight;
  });
  cursorY += lineHeight * 0.5;
};

pdf.setFont('helvetica', 'bold');
pdf.setFontSize(16);
pdf.text(
  pdf.splitTextToSize('Investigación de librerías JavaScript aplicadas al proyecto Aesthetica', bodyWidth),
  pageWidth / 2,
  74,
  { align: 'center', maxWidth: bodyWidth }
);
pdf.setFont('helvetica', 'normal');
pdf.setFontSize(12);
[
  'Nombre del estudiante: ______________________________',
  'Institución educativa: _______________________________',
  'Asignatura: Desarrollo de Aplicaciones Web',
  'Docente: ____________________________________________',
  'Avance 1 - Foro de Discusión 1',
  '20 de octubre de 2026',
].forEach((line, index) => {
  pdf.text(line, pageWidth / 2, 137 + index * 10, { align: 'center' });
});

addPage();
pdf.setFont('helvetica', 'bold');
pdf.setFontSize(14);
pdf.text(
  pdf.splitTextToSize('Investigación de librerías JavaScript aplicadas al proyecto Aesthetica', bodyWidth),
  pageWidth / 2,
  cursorY,
  { align: 'center', maxWidth: bodyWidth }
);
cursorY += 18;

addHeading('Introducción');
addParagraph(
  'Aesthetica es una aplicación académica de reservas para una clínica de belleza, construida con React y JavaScript. La rúbrica solicita interactividad, una gráfica funcional, un módulo adicional, validaciones avanzadas y documentación de investigación. Para responder a esas necesidades se usan Chart.js para representar indicadores, SweetAlert2 para comunicar y confirmar acciones, y jsPDF para producir este informe. React organiza la interfaz en componentes y permite actualizarla a partir del estado de la aplicación (Meta Open Source, s. f.).'
);
addParagraph(
  'Este documento describe qué aporta cada biblioteca, cómo se aplica en la aplicación y cuáles son sus límites. Las reservas y los usuarios se guardan en el almacenamiento local del navegador; por tanto, la demostración no representa una plataforma de producción con autenticación segura, pagos reales ni base de datos central.'
);

addHeading('Chart.js: representación de estadísticas');
addParagraph(
  'Chart.js es una biblioteca de visualización que dibuja gráficas sobre un elemento canvas. Su documentación describe tipos de gráficas, opciones configurables, complementos y animaciones; también ofrece integración con bibliotecas de interfaz mediante adaptadores (Chart.js Contributors, s. f.). En Aesthetica, react-chartjs-2 conecta el componente Bar con el estado de React.'
);
addParagraph(
  'La gráfica agrupa las reservas por servicio: las etiquetas proceden de la lista de servicios y cada valor cuenta las citas asociadas. El cálculo se memoriza con useMemo y depende de los servicios y las citas; al cambiar esos datos, React vuelve a renderizar la gráfica. Las opciones mantienen el lienzo adaptable y fuerzan el eje vertical a comenzar en cero con marcas enteras. Así, la visualización representa datos de la aplicación y no una imagen decorativa.'
);
addParagraph(
  'La tarjeta de estadísticas contabiliza como ingreso únicamente las citas confirmadas. Esta definición evita sumar citas canceladas o que aún están pendientes. En una instalación real, los datos deberían provenir de una API autorizada y el servidor tendría que calcular los importes.'
);

addHeading('SweetAlert2: diálogos e interacción');
addParagraph(
  'SweetAlert2 proporciona cuadros de diálogo configurables, con botones de confirmación y cancelación y opciones de accesibilidad (SweetAlert2 Contributors, s. f.). En el proyecto se utiliza para mostrar resultados de validación y éxito, y para pedir confirmación antes de cancelar una cita o eliminar un servicio. Las acciones destructivas solo actualizan el estado si la persona confirma; cancelar el cuadro conserva los datos.'
);
addParagraph(
  'El estado de notificación de React activa los avisos generales. Las confirmaciones explícitas se esperan de forma asíncrona, por lo que el manejador puede distinguir entre aceptar y volver. Esta interacción reduce errores accidentales y proporciona retroalimentación inmediata, sin depender de los diálogos nativos del navegador.'
);

addHeading('Validaciones y módulo de citas');
addParagraph(
  'La validación se reparte entre atributos HTML y reglas JavaScript. Los campos obligatorios, longitudes, tipos de correo, rangos numéricos y formatos de duración se indican en los formularios. Antes de cambiar el estado, la lógica comprueba reglas entre campos: requisitos de contraseña, confirmación de contraseña, fecha futura, disponibilidad del horario y coherencia de los datos de demostración del pago.'
);
addParagraph(
  'El módulo adicional de gestión de citas permite al cliente consultar sus propias reservas y solicitar cancelación, mientras que el administrador puede revisar todas las reservas y confirmar o cancelar cada una. El módulo refleja los cambios en la tabla, las métricas y la gráfica porque comparten el mismo estado persistido en localStorage. La interfaz no sustituye la autorización de un servidor: un usuario puede modificar el almacenamiento local desde su propio dispositivo.'
);

addHeading('jsPDF: generación de documentos');
addParagraph(
  'jsPDF es una biblioteca JavaScript para construir archivos PDF, añadir texto y guardar el documento desde código (jsPDF Contributors, s. f.). El proyecto incluye un script reproducible que compone este informe en tamaño A4, organiza títulos y párrafos, añade una portada con campos académicos editables y genera referencias con sangría francesa. El archivo resultante queda disponible como recurso estático para su descarga desde la página.'
);
addParagraph(
  'La generación automática evita copiar manualmente el informe a otro editor cada vez que se actualiza. Antes de entregar el PDF, el estudiante debe sustituir los campos en blanco de la portada por su nombre, institución y docente, y revisar las instrucciones particulares del curso.'
);

addHeading('Conclusión');
addParagraph(
  'La combinación de Chart.js, SweetAlert2 y jsPDF conecta tres necesidades distintas del avance: análisis visual, interacción con confirmaciones y entrega de documentación. La implementación también agrega validaciones en cliente y un flujo de administración de citas. En conjunto, estas funciones son demostrables y se actualizan con datos reales de la sesión; sin embargo, la autenticación, el almacenamiento local y el pago son únicamente simulaciones educativas y requieren un backend y servicios certificados para un uso real.'
);

addHeading('Referencias');
addReference('Chart.js Contributors. (s. f.).', 'Chart.js documentation.', 'https://www.chartjs.org/docs/latest/');
addReference('jsPDF Contributors. (s. f.).', 'jsPDF: Client-side JavaScript PDF generation.', 'https://github.com/parallax/jsPDF');
addReference('Meta Open Source. (s. f.).', 'Quick start.', 'React documentation, https://react.dev/learn');
addReference('SweetAlert2 Contributors. (s. f.).', 'SweetAlert2: A beautiful, responsive, customizable, accessible replacement for JavaScript popup boxes.', 'https://sweetalert2.github.io/');

const pageCount = pdf.getNumberOfPages();
for (let page = 1; page <= pageCount; page += 1) {
  pdf.setPage(page);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.text(String(page), pageWidth - margin, 14, { align: 'right' });
}

mkdirSync(outputDirectory, { recursive: true });
pdf.save(outputPath);
console.log(`PDF generado: ${outputPath}`);
