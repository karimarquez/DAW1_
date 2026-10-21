import Chart from 'chart.js/auto';

// Datos por año
const datosReporte = {
    '2026': [42, 58, 65, 78, 90, 85, 95, 110, 105, 98, 115, 120],
    '2025': [30, 45, 50, 60, 70, 65, 80, 85, 75, 90, 95, 100],
    '2024': [20, 25, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80]
};

const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

const ctx = document.getElementById('miGrafico').getContext('2d');

// Crear un degradado café cálido
const gradient = ctx.createLinearGradient(0, 0, 0, 400);
gradient.addColorStop(0, 'rgba(137, 86, 78, 0.92)');
gradient.addColorStop(1, 'rgba(189, 138, 120, 0.3)');

// Crear la gráfica
const miGrafico = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: meses,
        datasets: [{
            label: 'Servicios / Citas Completadas',
            data: datosReporte['2026'],
            backgroundColor: gradient,
            borderColor: '#89564e',
            borderWidth: 1.5,
            borderRadius: 8,              // Redondeado en la punta de las barras
            borderSkipped: false,
            hoverBackgroundColor: '#70443e'
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                align: 'end',
                labels: {
                    usePointStyle: true,
                    pointStyle: 'circle',
                    padding: 20,
                    font: { family: 'Inter', size: 12, weight: '500' },
                    color: '#75665f'
                }
            },
            tooltip: {
                backgroundColor: '#342b27',
                titleFont: { family: 'Inter', size: 13, weight: '600' },
                bodyFont: { family: 'Inter', size: 12 },
                padding: 12,
                cornerRadius: 8,
                displayColors: false,
                callbacks: {
                    label: function(context) {
                        return ` Total: ${context.raw} registros`;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: { display: false }, // Ocultar rejilla vertical
                ticks: {
                    color: '#75665f',
                    font: { family: 'Inter', size: 11 }
                }
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: '#eee5de',
                    drawBorder: false
                },
                ticks: {
                    color: '#75665f',
                    font: { family: 'Inter', size: 11 },
                    stepSize: 20
                }
            }
        }
    }
});

// Evento para cambiar de año
document.getElementById('selectAnio').addEventListener('change', function(e) {
    const anioSeleccionado = e.target.value;
    miGrafico.data.datasets[0].data = datosReporte[anioSeleccionado];
    miGrafico.update(); // Animación suave al actualizar
});