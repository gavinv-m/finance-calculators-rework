export default function generateCombinedYearTable(dataArray) {
  const dynamicCategories = [
    'Gross Rent',
    'Vacancy',
    'Operating Income',
    'Operating Expenses',
    'Management Fees',
    'Vacancy Loss',
    'Net Operating Income (NOI)',
    'Loan Payments',
    'Capital Expenditures',
    'Cash Flow',
  ];

  const staticExpenses = {
    'Property Taxes':
      parseFloat(document.getElementById('propertyTaxes').value) || 0,
    Insurance: parseFloat(document.getElementById('insuranceCosts').value) || 0,
    Maintenance:
      parseFloat(document.getElementById('maintenanceCosts').value) || 0,
    Utilities: parseFloat(document.getElementById('utilities').value) || 0,
    Renovations: parseFloat(document.getElementById('renovations').value) || 0,
  };

  const div = document.createElement('div');
  div.classList.add('mb-5', 'table-design');

  // 🌟 Static Expenses Table
  let staticTable = `
      <h5>Fixed Annual Expenses</h5>
      <table class="table table-bordered">
        <thead class="clr-bg" style="background-color: #333333; color: white;">
          <tr><th>Category</th><th>Amount</th></tr>
        </thead>
        <tbody>
          ${Object.entries(staticExpenses)
            .map(
              ([key, val]) => `
            <tr><td>${key}</td><td>$${val.toFixed(2)}</td></tr>
          `
            )
            .join('')}
        </tbody>
      </table>
    `;

  // 📅 Yearly Data Table (Dynamic Values)
  let dynamicTable = `
      <h5>Yearly Financials: Years ${dataArray
        .map((d) => d.year)
        .join(', ')}</h5>
      <table class="table table-bordered">
        <thead class="clr-bg" style="background-color: #333333; color: white;">
          <tr>
            <th>Category</th>
            ${dataArray.map((d) => `<th>Year ${d.year}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
    `;

  dynamicCategories.forEach((cat) => {
    dynamicTable += `<tr><td>${cat}</td>`;
    dataArray.forEach((data) => {
      let value = 0;
      switch (cat) {
        case 'Gross Rent':
          value = data.grossRentIncome;
          break;
        case 'Vacancy':
          value = data.vacancyLoss;
          break;
        case 'Operating Income':
          value = data.adjustedRentIncome;
          break;
        case 'Operating Expenses':
          value = data.operatingExpenses;
          break;
        case 'Management Fees':
          value =
            (data.adjustedRentIncome *
              (parseFloat(document.getElementById('managementFees').value) ||
                0)) /
            100;
          break;
        case 'Vacancy Loss':
          value = data.vacancyLoss;
          break;
        case 'Net Operating Income (NOI)':
          value = data.netOperatingIncome;
          break;
        case 'Loan Payments':
          value = -data.annualMortgagePayment;
          break;
        case 'Capital Expenditures':
          value = -data.capitalExpenditures;
          break;
        case 'Cash Flow':
          value = data.cashFlow;
          break;
      }
      dynamicTable += `<td>$${value.toFixed(2)}</td>`;
    });
    dynamicTable += `</tr>`;
  });

  dynamicTable += `</tbody></table>`;

  // 🧩 Combine and Return
  div.innerHTML = dynamicTable + staticTable;
  return div;
}
