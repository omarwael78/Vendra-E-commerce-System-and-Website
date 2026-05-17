// charts.js
export function initCharts() {
    const ctx1 = document.getElementById('revenueBarChart').getContext('2d');
    new Chart(ctx1, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Revenue ($)',
                data: [15000, 22000, 18000, 32000, 28000, 38000],
                backgroundColor: 'red',
                borderRadius: 6
            }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    });
            const ctx2 = document.getElementById('categoryChart').getContext('2d');
            new Chart(ctx2, {
                type: 'doughnut',
                data: {
                    labels: ['Electronics', 'Fashion', 'books','sports','books'],
                    datasets: [{
                        data: [20, 30,25,15,10 ],
                        backgroundColor: ['#111827', 'red', '#9ca3af','gray','maroon'],
                        borderWidth: 0
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false,  }
            });
        };
