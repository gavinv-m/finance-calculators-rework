import {
  Chart,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
Chart.register(DoughnutController, ArcElement, Tooltip, Legend, Title);
import ChartDataLabels from 'chartjs-plugin-datalabels';

export default function createProjectCostBreakdownChart(data) {
  const ctx = document
    .getElementById('projectCostBreakdownChart')
    .getContext('2d');

  // Combine holding-related costs into one
  const combinedHolding =
    data.holding +
    data.loanInterest +
    data.proratedTaxes +
    data.proratedInsurance;

  const labels = [
    'Purchase',
    'Renovation',
    'Holding (incl. interest, taxes, insurance)',
    'Loan Fees',
    'Resale Costs',
    'Closing Costs',
  ];

  const values = [
    data.purchase,
    data.reno,
    combinedHolding,
    data.loanFees,
    data.resaleCosts,
    data.closing,
  ];

  const total = values.reduce((a, b) => a + b, 0);

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [
        {
          data: values,
          backgroundColor: [
            '#F39655',
            '#B77CE9',
            '#55CBE5',
            '#e74c3c',
            '#1abc9c',
            '#e67e22',
          ],
          borderColor: '#ffffff',
          borderWidth: 4,
          hoverOffset: 20,
        },
      ],
    },
    options: {
      responsive: true,
      cutout: '0%',
      plugins: {
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
            return percentage >= 5;
          },
        },
        title: {
          display: true,
          text: 'Project Cost Breakdown',
          font: {
            size: 20,
            weight: 'bold',
            color: '#000000',
          },
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
      },
    },
    plugins: [ChartDataLabels],
  });
}
