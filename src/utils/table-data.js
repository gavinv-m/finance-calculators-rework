export default function getTableData(year, returnData = false) {
  // Get values and convert to numbers
  let propertyPrice =
    parseFloat(document.getElementById('propertyPrice').value.trim()) || 0;
  let downPayment =
    parseFloat(document.getElementById('downPayment').value.trim()) || 0;
  let loanTerm =
    parseFloat(document.getElementById('loanTerm').value.trim()) || 0;
  let interestRate =
    parseFloat(document.getElementById('interestRate').value.trim()) || 0;
  let monthlyRent =
    parseFloat(document.getElementById('monthlyRent').value.trim()) || 0;
  let vacancyRate =
    parseFloat(document.getElementById('vacancyRate').value.trim()) || 0;
  let propertyTaxes =
    parseFloat(document.getElementById('propertyTaxes').value.trim()) || 0;
  let insuranceCosts =
    parseFloat(document.getElementById('insuranceCosts').value.trim()) || 0;
  let maintenanceCosts =
    parseFloat(document.getElementById('maintenanceCosts').value.trim()) || 0;
  let managementFees =
    parseFloat(document.getElementById('managementFees').value.trim()) || 0;
  let appreciationRate =
    parseFloat(document.getElementById('appreciationRate').value.trim()) || 3;
  let rentIncreaseRate = 2;
  let utilities =
    parseFloat(document.getElementById('utilities').value.trim()) || 0;
  let renovations =
    parseFloat(document.getElementById('renovations').value.trim()) || 0;

  if (!year || year < 0) return;

  // Loan calculation
  let loanAmount = propertyPrice - downPayment;
  let monthlyRate = interestRate / 100 / 12;
  let numPayments = loanTerm * 12;
  let mortgagePayment =
    monthlyRate > 0
      ? (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
        (Math.pow(1 + monthlyRate, numPayments) - 1)
      : loanAmount / numPayments;

  // Appreciation and Rent growth
  let appreciationFactor = Math.pow(1 + appreciationRate / 100, year);
  let rentFactor = Math.pow(1 + rentIncreaseRate / 100, year);

  let grossRentIncome = monthlyRent * 12 * rentFactor;
  let vacancyLoss = grossRentIncome * (vacancyRate / 100);
  let adjustedRentIncome = grossRentIncome - vacancyLoss;
  let managementCost = grossRentIncome * (managementFees / 100);

  // Operating Expenses
  let operatingExpenses =
    vacancyLoss +
    propertyTaxes +
    insuranceCosts +
    maintenanceCosts +
    managementCost +
    utilities +
    renovations;

  let netOperatingIncome = grossRentIncome - operatingExpenses;
  let annualMortgagePayment = mortgagePayment * 12;
  let cashFlowAnnual = netOperatingIncome - annualMortgagePayment;

  // If returnData is true, send values back instead of updating UI
  if (returnData) {
    return {
      year,
      grossRentIncome,
      vacancyLoss,
      adjustedRentIncome,
      operatingExpenses,
      netOperatingIncome,
      annualMortgagePayment,
      capitalExpenditures: 1425, // or dynamic later
      cashFlow: cashFlowAnnual,
    };
  }

  // Update UI
  document.getElementById('year_b').innerHTML = year;
  document.getElementById('gross_rent').innerText = `$${grossRentIncome.toFixed(
    2
  )}`;
  document.getElementById('vacancy_rate').innerText = `– $${vacancyLoss.toFixed(
    2
  )}`;
  document.getElementById(
    'operating_income'
  ).innerText = `$${adjustedRentIncome.toFixed(2)}`;
  document.getElementById(
    'operating_expenses'
  ).innerText = `– $${operatingExpenses.toFixed(2)}`;
  document.getElementById(
    'net_operating_income'
  ).innerText = `$${netOperatingIncome.toFixed(2)}`;
  document.getElementById(
    'loan_payments'
  ).innerText = `– $${annualMortgagePayment.toFixed(2)}`;
  document.getElementById('cash_flow').innerText = `$${cashFlowAnnual.toFixed(
    2
  )}`;

  console.log(`Data displayed for year: ${year}`);
}
