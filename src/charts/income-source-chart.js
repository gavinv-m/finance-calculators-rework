import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
import ChartDataLabels from 'chartjs-plugin-datalabels';

let incomeSourceChartInstance;

export default function renderIncomeSourcePie(
  contributions,
  stock,
  realEstate,
  insurance
) {
  const ctx = document.getElementById('incomeSourceChart').getContext('2d');

  const dataValues = [contributions, stock, realEstate, insurance];
  const total = dataValues.reduce((a, b) => a + b, 0);

  if (incomeSourceChartInstance) {
    incomeSourceChartInstance.destroy();
  }

  incomeSourceChartInstance = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Contributions', 'Stock', 'Real Estate', 'Whole Life Insurance'],
      datasets: [
        {
          label: 'Income Source Contribution at Retirement',
          data: dataValues,
          backgroundColor: ['#55CBE5', '#e74c3c', '#F39655', '#B77CE9'],
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
          text: `Income Sources at Retirement`,
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
          color: 'white',
          font: {
            weight: 'bold',
            size: 14,
          },
          formatter: (value, ctx) => {
            const percentage = (value / total) * 100;
            return percentage >= 5 ? `${percentage.toFixed(1)}%` : '';
          },
        },
      },
      animation: {
        animateRotate: true,
        animateScale: true,
        duration: 1500,
        easing: 'easeOutBounce',
      },
    },
    plugins: [ChartDataLabels],
  });
}
