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
  adjustedRentIncome,
  operatingExpenses,
  cashFlowAnnual,
  timeDuration = 1
) {
  const ctx = document.getElementById('portfolioPieChart').getContext('2d');

  if (window.portfolioPieChart instanceof Chart) {
    window.portfolioPieChart.destroy();
  }

  // Scale values based on selected duration
  const scaledIncome = adjustedRentIncome * timeDuration;
  const scaledExpenses = operatingExpenses * timeDuration;
  const scaledCashFlow = cashFlowAnnual * timeDuration;

  const labels = ['Income', 'Expenses'];
  const values = [scaledIncome, scaledExpenses];
  const colors = ['#B77CE9', '#55CBE5'];

  const profitLabel = scaledCashFlow >= 0 ? 'Profit' : 'Loss';
  const profitValue = Math.abs(scaledCashFlow);
  const profitColor = scaledCashFlow >= 0 ? '#3B8D21' : '#F39655';

  labels.push(profitLabel);
  values.push(profitValue);
  colors.push(profitColor);

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
          text: `Portfolio Composition (Over ${timeDuration} Year${
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
