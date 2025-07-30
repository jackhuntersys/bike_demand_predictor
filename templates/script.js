// Application State
let currentPrediction = null;
let isLoading = false;
let demandChart = null;

// Mock Data
const metrics = {
    totalBikes: 2450,
    activeBikes: 187,
    totalStations: 45,
    avgDemand: 128,
    peakHour: "18:00",
    currentTemp: 22,
    weatherCondition: "Clear",
    modelAccuracy: 87
};

// DOM Elements
const predictionForm = document.getElementById('prediction-form');
const predictionResults = document.getElementById('prediction-results');
const predictionContent = document.getElementById('prediction-content');
const predictBtn = document.getElementById('predict-btn');
const toastContainer = document.getElementById('toast-container');

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeForm();
    renderMetricsDashboard();
    initializeDemandChart();
});

// Form Initialization
function initializeForm() {
    const hourSelect = document.getElementById('hour');
    for (let i = 0; i < 24; i++) {
        const option = document.createElement('option');
        option.value = i.toString().padStart(2, '0');
        option.textContent = `${i.toString().padStart(2, '0')}:00`;
        hourSelect.appendChild(option);
    }
    
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').value = today;
    
    // Form submission
    predictionForm.addEventListener('submit', handlePrediction);
}

// Metrics Dashboard Rendering
function renderMetricsDashboard() {
    const metricsDashboard = document.getElementById('metrics-dashboard');
    const infoDashboard = document.getElementById('info-dashboard');
    
    const metricCards = [
        {
            title: "Total Bikes",
            value: metrics.totalBikes.toLocaleString(),
            icon: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"></path>
            </svg>`,
            description: "Available in system",
            bgColor: "bg-blue-50",
            iconColor: "text-data-primary"
        },
        {
            title: "Active Bikes",
            value: metrics.activeBikes.toString(),
            icon: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>`,
            description: "Currently in use",
            bgColor: "bg-green-50",
            iconColor: "text-data-success"
        },
        {
            title: "Total Stations",
            value: metrics.totalStations.toString(),
            icon: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>`,
            description: "Across the city",
            bgColor: "bg-purple-50",
            iconColor: "text-purple-600"
        },
        {
            title: "Avg Demand",
            value: `${metrics.avgDemand}/day`,
            icon: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>`,
            description: "Daily average",
            bgColor: "bg-orange-50",
            iconColor: "text-data-warning"
        }
    ];
    
    const infoCards = [
        {
            title: "Peak Hour",
            value: metrics.peakHour,
            icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>`,
            description: "Highest demand",
            badge: "Peak"
        },
        {
            title: "Temperature",
            value: `${metrics.currentTemp}°C`,
            icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
            </svg>`,
            description: "Current weather",
            badge: "Now"
        },
        {
            title: "Conditions",
            value: metrics.weatherCondition,
            icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path>
            </svg>`,
            description: "Weather status",
            badge: "Live"
        },
        {
            title: "Model Accuracy",
            value: `${metrics.modelAccuracy}%`,
            icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>`,
            description: "Prediction accuracy",
            badge: "ML"
        }
    ];
    
    // Render metric cards
    metricsDashboard.innerHTML = metricCards.map(card => `
        <div class="bg-card rounded-lg border border-border p-6 shadow-sm animate-fade-in">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm font-medium text-muted-foreground">${card.title}</p>
                    <p class="text-2xl font-bold mt-1">${card.value}</p>
                    <p class="text-xs text-muted-foreground mt-1">${card.description}</p>
                </div>
                <div class="p-3 ${card.bgColor} rounded-lg">
                    <div class="${card.iconColor}">${card.icon}</div>
                </div>
            </div>
        </div>
    `).join('');
    
    // Render info cards
    infoDashboard.innerHTML = infoCards.map(card => `
        <div class="bg-card rounded-lg border border-border p-4 shadow-sm animate-fade-in">
            <div class="flex items-center justify-between mb-2">
                <div class="flex items-center space-x-2">
                    <div class="text-data-primary">${card.icon}</div>
                    <span class="text-sm font-medium">${card.title}</span>
                </div>
                <span class="text-xs bg-data-primary text-white px-2 py-1 rounded-full">${card.badge}</span>
            </div>
            <div class="text-lg font-semibold">${card.value}</div>
            <div class="text-xs text-muted-foreground">${card.description}</div>
        </div>
    `).join('');
}

// Prediction Handler
async function handlePrediction(e) {
    e.preventDefault();
    
    if (isLoading) return;
    
    isLoading = true;
    updatePredictButton(true);
    
    // Get form data
    const formData = new FormData(predictionForm);
    const data = {
        date: formData.get('date') || document.getElementById('date').value,
        hour: formData.get('hour') || document.getElementById('hour').value,
        temperature: formData.get('temperature') || document.getElementById('temperature').value,
        humidity: formData.get('humidity') || document.getElementById('humidity').value,
        windSpeed: formData.get('windSpeed') || document.getElementById('windSpeed').value,
        weather: formData.get('weather') || document.getElementById('weather').value,
        location: formData.get('location') || document.getElementById('location').value,
        isWeekend: document.getElementById('isWeekend').checked,
        isHoliday: document.getElementById('isHoliday').checked
    };
    
    // Validate required fields
    const requiredFields = ['date', 'hour', 'temperature', 'humidity', 'windSpeed', 'weather', 'location'];
    for (const field of requiredFields) {
        if (!data[field]) {
            showToast('Please fill in all required fields', 'error');
            isLoading = false;
            updatePredictButton(false);
            return;
        }
    }
    
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Mock prediction calculation
        const baseDemand = 100;
        const tempFactor = parseInt(data.temperature) > 20 ? 1.2 : 0.8;
        const hourFactor = (parseInt(data.hour) >= 7 && parseInt(data.hour) <= 9) || 
                          (parseInt(data.hour) >= 17 && parseInt(data.hour) <= 19) ? 1.5 : 1.0;
        const weatherFactor = data.weather === 'clear' ? 1.3 : 
                             data.weather === 'cloudy' ? 1.0 : 0.7;
        const weekendFactor = data.isWeekend ? 0.8 : 1.2;
        
        const predictedDemand = Math.round(baseDemand * tempFactor * hourFactor * weatherFactor * weekendFactor);
        
        const prediction = {
            demand: predictedDemand,
            confidence: Math.round(75 + Math.random() * 20),
            trend: predictedDemand > 120 ? 'up' : predictedDemand < 80 ? 'down' : 'stable',
            category: predictedDemand < 60 ? 'low' : 
                     predictedDemand < 120 ? 'medium' : 
                     predictedDemand < 180 ? 'high' : 'very-high',
            location: data.location.charAt(0).toUpperCase() + data.location.slice(1),
            factors: {
                weather: Math.round((weatherFactor - 1) * 100),
                time: Math.round((hourFactor - 1) * 100),
                location: Math.round(Math.random() * 30 - 15),
                season: Math.round(Math.random() * 20 - 10)
            }
        };
        
        currentPrediction = prediction;
        renderPredictionResults(prediction);
        showToast('Prediction completed successfully!', 'success');
        
    } catch (error) {
        showToast('Prediction failed. Please try again.', 'error');
    } finally {
        isLoading = false;
        updatePredictButton(false);
    }
}

// Update Predict Button
function updatePredictButton(loading) {
    if (loading) {
        predictBtn.disabled = true;
        predictBtn.innerHTML = `
            <div class="flex items-center justify-center space-x-2">
                <div class="spinner"></div>
                <span>Predicting...</span>
            </div>
        `;
    } else {
        predictBtn.disabled = false;
        predictBtn.innerHTML = 'Predict Demand';
    }
}

// Render Prediction Results
function renderPredictionResults(prediction) {
    const getTrendIcon = (trend) => {
        switch (trend) {
            case 'up':
                return `<svg class="w-5 h-5 text-data-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                </svg>`;
            case 'down':
                return `<svg class="w-5 h-5 text-data-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path>
                </svg>`;
            default:
                return `<svg class="w-5 h-5 text-data-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h8"></path>
                </svg>`;
        }
    };
    
    const getCategoryColor = (category) => {
        switch (category) {
            case 'low': return 'bg-blue-100 text-blue-800';
            case 'medium': return 'bg-green-100 text-green-800';
            case 'high': return 'bg-yellow-100 text-yellow-800';
            case 'very-high': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    
    predictionContent.innerHTML = `
        <div class="space-y-6 animate-fade-in">
            <!-- Main Prediction -->
            <div class="text-center">
                <div class="text-4xl font-bold text-data-primary mb-2">${prediction.demand}</div>
                <div class="text-lg text-muted-foreground mb-4">Predicted Bikes Needed</div>
                <div class="flex items-center justify-center space-x-4">
                    <span class="px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(prediction.category)}">
                        ${prediction.category.replace('-', ' ').toUpperCase()} DEMAND
                    </span>
                    <div class="flex items-center space-x-1">
                        ${getTrendIcon(prediction.trend)}
                        <span class="text-sm font-medium">${prediction.trend.toUpperCase()}</span>
                    </div>
                </div>
            </div>
            
            <!-- Details -->
            <div class="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div class="text-center">
                    <div class="text-2xl font-bold text-data-secondary">${prediction.confidence}%</div>
                    <div class="text-sm text-muted-foreground">Confidence</div>
                </div>
                <div class="text-center">
                    <div class="text-2xl font-bold">${prediction.location}</div>
                    <div class="text-sm text-muted-foreground">Location</div>
                </div>
            </div>
            
            <!-- Contributing Factors -->
            <div class="pt-4 border-t border-border">
                <h4 class="text-sm font-semibold mb-3">Contributing Factors</h4>
                <div class="grid grid-cols-2 gap-2">
                    ${Object.entries(prediction.factors).map(([factor, impact]) => `
                        <div class="flex items-center justify-between text-sm">
                            <span class="capitalize">${factor}:</span>
                            <span class="font-medium ${impact > 0 ? 'text-data-success' : impact < 0 ? 'text-data-error' : 'text-muted-foreground'}">
                                ${impact > 0 ? '+' : ''}${impact}%
                            </span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

// Initialize Demand Chart
function initializeDemandChart() {
    const ctx = document.getElementById('demand-chart').getContext('2d');
    
    // Mock chart data
    const chartData = {
        labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
        datasets: [
            {
                label: 'Actual Demand',
                data: [20, 15, 85, 65, 120, 95],
                borderColor: 'hsl(200, 100%, 45%)',
                backgroundColor: 'hsl(200, 100%, 45%, 0.1)',
                tension: 0.4,
                fill: true
            },
            {
                label: 'Predicted Demand',
                data: [18, 12, 90, 70, 115, 100],
                borderColor: 'hsl(180, 100%, 50%)',
                backgroundColor: 'hsl(180, 100%, 50%, 0.1)',
                tension: 0.4,
                fill: true,
                borderDash: [5, 5]
            }
        ]
    };
    
    demandChart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 20
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Bikes Demanded'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Time of Day'
                    }
                }
            }
        }
    });
}

// Toast Notifications
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div class="flex items-center space-x-2">
            <div class="flex-shrink-0">
                ${type === 'success' ? 
                    `<svg class="w-5 h-5 text-data-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>` :
                    `<svg class="w-5 h-5 text-data-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>`
                }
            </div>
            <div class="flex-1 text-sm font-medium">${message}</div>
            <button onclick="this.parentElement.parentElement.remove()" class="flex-shrink-0">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (toast.parentElement) {
            toast.remove();
        }
    }, 5000);
}