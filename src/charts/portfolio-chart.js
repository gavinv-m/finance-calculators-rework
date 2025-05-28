import {
  Chart,
  PieController,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
Chart.register(PieController, ArcElement, Tooltip, Legend, Title);
import ChartDataLabels from 'chartjs-plugin-datalabels';

export default function renderPortfolioPieChart(
  cumulativeIncome,
  cumulativeExpenses,
  cumulativeCashFlow,
  timeDuration = 1
) {
  const ctx = document.getElementById('portfolioPieChart').getContext('2d');

  if (window.portfolioPieChart instanceof Chart) {
    window.portfolioPieChart.destroy();
  }

  const labels = ['Income', 'Expenses'];
  const values = [cumulativeIncome, cumulativeExpenses];
  const colors = ['#B77CE9', '#55CBE5'];

  const total = values.reduce((a, b) => a + b, 0);

  window.portfolioPieChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [
        {
          data: values,
          backgroundColor: colors,
          borderColor: '#fff',
          borderWidth: 2,
          hoverOffset: 12,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: 'black',
            font: {
              size: 14,
              family: 'Arial, sans-serif',
            },
            padding: 15,
          },
        },
        title: {
          display: true,
          text: `Income vs Expenses (Over ${timeDuration} Year${
            timeDuration > 1 ? 's' : ''
          })`,
          font: {
            size: 20,
            weight: 'bold',
            family: 'Arial, sans-serif',
          },
          color: '#333',
          padding: {
            top: 10,
            bottom: 20,
          },
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const value = parseFloat(context.raw);
              const percentage = ((value / total) * 100).toFixed(1);
              return `${context.label}: $${value.toFixed(2)} (${percentage}%)`;
            },
            afterBody: function () {
              return `Total: $${total.toFixed(2)}`;
            },
          },
        },
        datalabels: {
          color: 'white',
          font: {
            size: 14,
            weight: 'bold',
          },
          formatter: (value, context) => {
            const sum = context.chart.data.datasets[0].data.reduce(
              (a, b) => a + b,
              0
            );
            const percentage = ((value / sum) * 100).toFixed(1);
            return percentage >= 5 ? `${percentage}%` : '';
          },
        },
      },
    },
    plugins: [ChartDataLabels],
  });
}
