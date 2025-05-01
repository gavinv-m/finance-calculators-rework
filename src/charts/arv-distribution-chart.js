import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
import ChartDataLabels from 'chartjs-plugin-datalabels';

export default function createARVDistributionChart(data) {
  const ctx = document.getElementById('arvDistributionChart').getContext('2d');

  const labels = ['Total Investment', 'Resale Costs', 'Net Profit'];
  const values = [data.investment, data.resaleCosts, data.netProfit];
  const total = values.reduce((a, b) => a + b, 0);

  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [
        {
          data: values,
          backgroundColor: ['#2980b9', '#f1c40f', '#2ecc71'],
          borderColor: '#ffffff',
          borderWidth: 4,
          hoverOffset: 20,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'ARV Distribution',
          font: {
            size: 20,
            weight: 'bold',
          },
          color: '#000000',
        },
        legend: {
          position: 'right',
          labels: {
            boxWidth: 14,
            padding: 16,
            font: {
              size: 14,
              color: '#000000',
            },
          },
        },
        tooltip: {
          callbacks: {
            label: function (ctx) {
              const value = ctx.parsed;
              const percentage = ((value / total) * 100).toFixed(2);
              return `${
                ctx.label
              }: $${value.toLocaleString()} (${percentage}%)`;
            },
          },
        },
        datalabels: {
          color: '#ffffff',
          font: {
            weight: 'bold',
            size: 14,
          },
          formatter: (value, context) => {
            const percentage = (value / total) * 100;
            return `${percentage.toFixed(1)}%`;
          },
          display: function (context) {
            const value = context.dataset.data[context.dataIndex];
            const percentage = (value / total) * 100;
            return percentage >= 5; // Show only if the slice is 5% or more
          },
        },
      },
    },
    plugins: [ChartDataLabels],
  });
}
