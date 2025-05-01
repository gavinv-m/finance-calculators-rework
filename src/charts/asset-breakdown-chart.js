import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
import ChartDataLabels from 'chartjs-plugin-datalabels';

export default function renderAssetBreakdownChart(
  fvStock,
  fvRealEstate,
  fvWholeLifeInsurance,
  fvSavings
) {
  const ctx = document.getElementById('assetBreakdownChart').getContext('2d');

  const total = fvStock + fvRealEstate + fvWholeLifeInsurance + fvSavings;

  const chartData = {
    labels: ['Stocks', 'Real Estate', 'Whole Life Insurance', 'Savings'],
    datasets: [
      {
        label: 'Asset Distribution at Retirement',
        data: [fvStock, fvRealEstate, fvWholeLifeInsurance, fvSavings],
        backgroundColor: ['#F39655', '#B77CE9 ', '#55CBE5 ', '#e67e22'],
        borderColor: '#ffffff',
        borderWidth: 4,
        hoverOffset: 20,
      },
    ],
  };

  // Destroy previous chart instance if it exists
  if (window.assetBreakdownChart instanceof Chart) {
    window.assetBreakdownChart.destroy();
  }

  window.assetBreakdownChart = new Chart(ctx, {
    type: 'pie',
    data: chartData,
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Asset Allocation Breakdown at Retirement',
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
            return percentage >= 5; // Only show if 5% or more
          },
        },
      },
    },
    plugins: [ChartDataLabels],
  });
}
