import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
import ChartDataLabels from 'chartjs-plugin-datalabels';

export default function renderCashFlowPieChart(
  mortgagePaymentAnnual,
  operatingExpenses,
  cashFlowAnnual,
  timeDuration = 1
) {
  const ctx = document.getElementById('cashFlowPieChart').getContext('2d');

  if (window.cashFlowPieChart instanceof Chart) {
    window.cashFlowPieChart.destroy();
  }

  // Scale all values by time duration (in years)
  const scaledMortgage = mortgagePaymentAnnual * timeDuration;
  const scaledExpenses = operatingExpenses * timeDuration;
  const scaledCashFlow = cashFlowAnnual * timeDuration;

  const labels = ['Mortgage Payments', 'Operating Expenses'];
  const values = [scaledMortgage, scaledExpenses];
  const colors = ['#55CBE5', '#F39655'];

  const netLabel = scaledCashFlow >= 0 ? 'Net Profit' : 'Net Loss';
  const netColor = scaledCashFlow >= 0 ? '#4CAF50' : '#FF5722';

  labels.push(netLabel);
  values.push(Math.abs(scaledCashFlow));
  colors.push(netColor);

  const totalFlow = values.reduce((acc, val) => acc + val, 0);

  window.cashFlowPieChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Cash Flow Breakdown',
          data: values.map((val) => val.toFixed(2)),
          backgroundColor: colors,
          hoverOffset: 15,
          borderWidth: 3,
          borderColor: '#fff',
        },
      ],
    },
    options: {
      responsive: true,
      interaction: {
        mode: 'nearest',
        intersect: false,
      },
      plugins: {
        title: {
          display: true,
          text: `Cash Flow Breakdown (Over ${timeDuration} Year${
            timeDuration > 1 ? 's' : ''
          })`,
          font: {
            size: 22,
            weight: 'bold',
          },
          color: '#333',
        },
        tooltip: {
          enabled: true,
          mode: 'index',
          intersect: false,
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          titleFont: {
            size: 20,
            weight: 'bold',
          },
          bodyFont: {
            size: 16,
          },
          padding: 14,
          boxPadding: 6,
          borderColor: '#fff',
          borderWidth: 1,
          callbacks: {
            label: function (context) {
              const label = context.label || '';
              const value = parseFloat(context.raw);
              const percentage = ((value / totalFlow) * 100).toFixed(2);
              return `${label}: $${value.toFixed(2)} (${percentage}%)`;
            },
            afterBody: function () {
              return `Total: $${totalFlow.toFixed(2)}`;
            },
          },
        },
        legend: {
          display: true,
          labels: {
            font: {
              size: 16,
            },
            boxWidth: 25,
            usePointStyle: true,
            padding: 20,
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
              (a, b) => parseFloat(a) + parseFloat(b),
              0
            );
            const percentage = ((value / sum) * 100).toFixed(1);
            return percentage >= 5 ? `${percentage}%` : '';
          },
        },
        animation: {
          animateRotate: true,
          animateScale: true,
          duration: 1500,
          easing: 'easeOutBounce',
        },
      },
    },
    plugins: [ChartDataLabels],
  });
}
