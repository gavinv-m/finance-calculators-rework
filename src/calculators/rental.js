import formatNumber from '../utils/format-number';
import formatNumberPercent from '../utils/format-number-percent';
import renderPortfolioPieChart from '../charts/portfolio-chart';
import renderCashFlowPieChart from '../charts/cashflow-chart';
import getTableData from '../utils/table-data';
import updateTableRange from '../utils/update-table-range';

export default function calculateRentalProperty() {
  // Get values and convert to numbers
  let propertyPrice =
    parseFloat(document.getElementById('propertyPrice').value.trim()) || 0;
  let initialRenovations =
    parseFloat(document.getElementById('initialRenovations').value.trim()) || 0;
  let downPaymentPercent =
    parseFloat(document.getElementById('downPayment').value.trim()) || 0;
  let downPayment = (downPaymentPercent / 100) * propertyPrice;
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
  let utilities =
    parseFloat(document.getElementById('utilities').value.trim()) || 0;

  let renovations =
    parseFloat(document.getElementById('renovations').value.trim()) || 0;
  let rentGrowth =
    parseFloat(document.getElementById('rentGrowth').value.trim()) || 0;
  let closingCostsPercent =
    parseFloat(document.getElementById('closingCostsRent').value.trim()) || 0;
  let closingCosts = (closingCostsPercent / 100) * propertyPrice;
  // getting time value
  let timeDuration =
    parseInt(document.getElementById('timeDuration').value.trim()) || 10;
  let appreciationRate =
    parseFloat(document.getElementById('appreciationRate').value.trim()) || 3;

  // Reference error span elements
  let errors = {
    propertyPrice: document.getElementById('errorPropertyPrice'),
    initialRenovations: document.getElementById('errorInitialRenovations'),
    downPayment: document.getElementById('errorDownPaymentPer'),
    loanTerm: document.getElementById('errorLoanTerm'),
    interestRate: document.getElementById('errorInterestRate'),
    monthlyRent: document.getElementById('errorMonthlyRent'),
    vacancyRate: document.getElementById('errorVacancyRate'),
    propertyTaxes: document.getElementById('errorPropertyTaxes'),
    insuranceCosts: document.getElementById('errorInsuranceCosts'),
    maintenanceCosts: document.getElementById('errorMaintenanceCosts'),
    managementFees: document.getElementById('errorManagementFees'),
    utilities: document.getElementById('errorUtilities'),
    renovations: document.getElementById('errorRenovations'),
    rentGrowth: document.getElementById('errorRentGrowth'),
    closingCosts: document.getElementById('errorClosingCostsRent'),
  };
  // Clear previous error messages
  Object.values(errors).forEach((error) => (error.innerText = ''));

  let isValid = true;

  // 🚨 **Validations**
  function validateInput(
    value,
    errorField,
    fieldName,
    min = 0,
    max = Infinity
  ) {
    if (fieldName == 'Down Payment (%)' && (value < min || value > max)) {
      errorField.innerText = `${fieldName} must be less than 100 .`;
    } else if (
      fieldName == 'Loan Term (Years)' &&
      (value < min || value > max)
    ) {
      errorField.innerText = `${fieldName} must be less than 30 .`;
    } else {
      if (value < min || value > max) {
        errorField.innerText = `${fieldName} must be greater than ${min} .`;
        isValid = false;
      }
    }
  }

  validateInput(propertyPrice, errors.propertyPrice, 'Property Price', 1000);
  validateInput(
    downPaymentPercent,
    errors.downPayment,
    'Down Payment (%)',
    0,
    100
  );
  validateInput(loanTerm, errors.loanTerm, 'Loan Term (Years)', 1, 30);
  validateInput(interestRate, errors.interestRate, 'Interest Rate (%)', 0, 100);
  validateInput(monthlyRent, errors.monthlyRent, 'Monthly Rent', 0);
  validateInput(vacancyRate, errors.vacancyRate, 'Vacancy Rate (%)', 0, 100);
  validateInput(
    propertyTaxes,
    errors.propertyTaxes,
    'Annual Property Taxes',
    0
  );
  validateInput(
    insuranceCosts,
    errors.insuranceCosts,
    'Annual Insurance Costs',
    0
  );
  validateInput(
    maintenanceCosts,
    errors.maintenanceCosts,
    'Annual Maintenance Costs',
    0
  );
  validateInput(
    managementFees,
    errors.managementFees,
    'Management Fees (%)',
    0,
    100
  );
  validateInput(utilities, errors.utilities, 'Utilities', 0);
  validateInput(renovations, errors.renovations, 'Renovations', 0);
  validateInput(rentGrowth, errors.rentGrowth, 'Rent Growth (%)', 0, 100);
  validateInput(
    closingCostsPercent,
    errors.closingCosts,
    'Closing Costs (%)',
    0,
    100
  );
  validateInput(
    initialRenovations,
    errors.initialRenovations,
    'Initial Renovations',
    0
  );

  if (!isValid) return;

  // ✅ Loan Calculation
  let loanAmount = propertyPrice - downPayment;
  let monthlyRate = interestRate / 100 / 12;
  let numPayments = loanTerm * 12;

  let mortgagePayment =
    monthlyRate > 0
      ? (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
        (Math.pow(1 + monthlyRate, numPayments) - 1)
      : loanTerm > 0
      ? loanAmount / numPayments
      : 0;

  // ✅ Rental Income Calculation
  let grossRentIncome = monthlyRent * 12;
  let vacancyLoss = grossRentIncome * (vacancyRate / 100);
  let adjustedRentIncome = grossRentIncome - vacancyLoss;

  // ✅ Operating Expenses Calculation
  let operatingExpenses =
    propertyTaxes +
    insuranceCosts +
    maintenanceCosts +
    adjustedRentIncome * (managementFees / 100) +
    utilities +
    renovations;
  // ✅ NOI Calculation
  let noi = adjustedRentIncome - operatingExpenses;

  // ✅ Annual Mortgage Payment
  let annualMortgagePayment = mortgagePayment * 12;

  // ✅ Cash Flow Calculation
  let cashFlowAnnual = noi - annualMortgagePayment;
  let cashFlowMonthly = cashFlowAnnual / 12;

  // ✅ Cap Rate Calculation
  let capRate = (noi / propertyPrice) * 100;

  // ✅ Cash-on-Cash Return Calculation
  let totalCashInvested = downPayment + closingCosts + initialRenovations;
  let cocReturn =
    totalCashInvested > 0 ? (cashFlowAnnual / totalCashInvested) * 100 : 0;

  // ✅ Debt Service Ratio (DSR) Calculation
  let debtServiceRatio =
    annualMortgagePayment > 0 ? noi / annualMortgagePayment : 0;
  // For charts and table projections
  let rentProjections = [];
  let adjustedRentProjections = [];

  let monthlyPropertyTaxes = propertyTaxes / 12;
  let monthlyInsurance = insuranceCosts / 12;
  let monthlyMaintenance = maintenanceCosts / 12;
  let monthlyManagementFees =
    (adjustedRentIncome * (managementFees / 100)) / 12;
  let monthlyUtilities = utilities / 12;
  let monthlyRenovations = renovations / 12;

  let totalMonthlyCosts =
    mortgagePayment +
    monthlyPropertyTaxes +
    monthlyInsurance +
    monthlyMaintenance +
    monthlyManagementFees +
    monthlyUtilities +
    monthlyRenovations;

  for (let i = 0; i < timeDuration; i++) {
    let yearRent = monthlyRent * 12 * Math.pow(1 + rentGrowth / 100, i);
    let yearVacancyLoss = yearRent * (vacancyRate / 100);
    let yearAdjustedRent = yearRent - yearVacancyLoss;
    rentProjections.push(yearRent);
    adjustedRentProjections.push(yearAdjustedRent);
  }

  // ✅ Display Results
  document.getElementById('loanAmount').innerText = formatNumber(loanAmount);
  document.getElementById('mortgagePayment').innerText =
    formatNumber(totalMonthlyCosts);
  document.getElementById('noi').innerText = formatNumber(noi);
  document.getElementById('cashFlow').innerText = formatNumber(cashFlowMonthly);
  document.getElementById('capRate').innerText =
    formatNumberPercent(capRate) + '%';
  document.getElementById('cocReturn').innerText =
    formatNumberPercent(cocReturn) + '%';
  document.getElementById('annualCashFlow').innerText =
    formatNumber(cashFlowAnnual);
  document.getElementById('cashInvestedRent').innerText =
    formatNumber(totalCashInvested);
  document.getElementById('debtServiceRatio').innerText =
    debtServiceRatio.toFixed(2);

  // Change background color if DSR is greater than 1.2
  let dsrElement = document.getElementById('debtcard');
  if (debtServiceRatio > 1.2) {
    dsrElement.style.backgroundColor = '#d0b870';
    document.querySelector('.dssr').style.color = 'black';
  } else {
    dsrElement.style.backgroundColor = 'rgb(248, 109, 109)'; // Reset to default if DSR is not > 1.2
  }
  renderPortfolioPieChart(
    adjustedRentIncome,
    operatingExpenses,
    cashFlowAnnual,
    timeDuration
  );
  renderCashFlowPieChart(
    annualMortgagePayment,
    operatingExpenses,
    cashFlowAnnual,
    timeDuration
  );
  var year = parseFloat(document.getElementById('years_tbl').value.trim()) || 1;
  // document.getElementById("year_b").innerText = year;
  getTableData(year, true);
  updateTableRange();
}
