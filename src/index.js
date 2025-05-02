import './style.css';
import calculateHouseFlip from './calculators/house-flip';
import calculateRetirement from './calculators/calculate-retirement';
import calculateRentalProperty from './calculators/rental';
import updateTableRange from './utils/update-table-range';
import initializePdfListeners from '../downloaders/pdf-event-listeners';

document.addEventListener('DOMContentLoaded', function () {
  const inputs = document.querySelectorAll(
    '#purchasePrice,#propertyAddress, #renoCosts, #holdingCosts,#closingCosts, #afterRepairValue,#projectMonths,#resaleCosts,#downPaymentPercent,#gapCosts,#loanPoints,#houseLoanYear,#houseinterestRate,#houseMonthlyRent,#insurance,#propertyTaxesHF,#downPaymentType,#houseAnnualMaintenance,#houseAnnualUtilities'
  );
  const input2 = document.querySelectorAll(
    '#currentAge, #retirementAge, #currentSavings,#lifeInsuranceMonthlyContributions,#wholeLifeInsurance, #monthlyContributions, #annualReturn,#desiredIncome,#inflationRate,#currentRealEstateEquity,#currentStockValue,#realEstateAppreciation,#mortgageBalance , #mortgageInterestRate , #mortgageTerm'
  );
  const input3 = document.querySelectorAll(
    '#managementFees, #maintenanceCosts, #insuranceCosts,#renovations,#utilities,#rentGrowth,#closingCostsRent, #propertyTaxes, #vacancyRate,#monthlyRent,#interestRate,#loanTerm,#downPayment,#propertyPrice,#timeDuration , #appreciationRate '
  );

  inputs.forEach((input) => {
    input.addEventListener('input', calculateHouseFlip);
  });
  input2.forEach((input) => {
    input.addEventListener('input', calculateRetirement);
  });
  input3.forEach((input) => {
    input.addEventListener('input', calculateRentalProperty);
  });

  initializePdfListeners();

  // Attach event listener to dropdown for updating table range
  const yearsDropdown = document.getElementById('years_tbl');
  if (yearsDropdown) {
    yearsDropdown.addEventListener('change', updateTableRange);
  }

  // Run calculators
  calculateHouseFlip();
  calculateRetirement();
  calculateRentalProperty();
});

// function getTableData(year) {
//   document.getElementById("year_b").innerHTML = year;
//   // Get values and convert to numbers
//   let propertyPrice = parseFloat(document.getElementById("propertyPrice").value.trim()) || 0;
//   let downPayment = parseFloat(document.getElementById("downPayment").value.trim()) || 0;
//   let loanTerm = parseFloat(document.getElementById("loanTerm").value.trim()) || 0;
//   let interestRate = parseFloat(document.getElementById("interestRate").value.trim()) || 0;
//   let monthlyRent = parseFloat(document.getElementById("monthlyRent").value.trim()) || 0;
//   let vacancyRate = parseFloat(document.getElementById("vacancyRate").value.trim()) || 0;
//   let propertyTaxes = parseFloat(document.getElementById("propertyTaxes").value.trim()) || 0;
//   let insuranceCosts = parseFloat(document.getElementById("insuranceCosts").value.trim()) || 0;
//   let maintenanceCosts = parseFloat(document.getElementById("maintenanceCosts").value.trim()) || 0;
//   let managementFees = parseFloat(document.getElementById("managementFees").value.trim()) || 0;
//   let appreciationRate = parseFloat(document.getElementById("appreciationRate").value.trim()) || 3;
//   let rentIncreaseRate = 2; // Assuming rent increases 2% annually

//   // Validate year parameter
//   if (!year || year < 1 || year > loanTerm) {
//     return;
//   }

//   // ✅ Loan Calculation
//   let loanAmount = propertyPrice - downPayment;
//   let monthlyRate = interestRate / 100 / 12;
//   let numPayments = loanTerm * 12;

//   let mortgagePayment = monthlyRate > 0
//     ? (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) / (Math.pow(1 + monthlyRate, numPayments) - 1)
//     : loanAmount / numPayments;

//   // ✅ Appreciation & Rent Growth Calculations
//   let appreciationFactor = Math.pow(1 + appreciationRate / 100, year);
//   let rentFactor = Math.pow(1 + rentIncreaseRate / 100, year);

//   let propertyValue = propertyPrice * appreciationFactor;
//   // let grossRentIncome = (monthlyRent * 12) * rentFactor; // Rent grows separately
//   let grossRentIncome = monthlyRent * 12;
//   let vacancyLoss = grossRentIncome * (vacancyRate / 100);
//   let managementCost = grossRentIncome * (managementFees / 100);
//   // let vacancyLoss = grossRentIncome * (vacancyRate / 100);
//   let adjustedRentIncome = grossRentIncome - vacancyLoss;

//   // ✅ Operating Expenses Growth
//   let totalFixedExpenses = propertyTaxes + insuranceCosts + maintenanceCosts;
//   // let operatingExpenses = (totalFixedExpenses * appreciationFactor) + (adjustedRentIncome * (managementFees / 100));
//   let operatingExpenses =
//     vacancyLoss +
//     propertyTaxes +
//     insuranceCosts +
//     maintenanceCosts +
//     managementCost +
//     utilities +
//     renovations;
//   // ✅ Net Operating Income (NOI)
//   // let noi = adjustedRentIncome - operatingExpenses;
//   let noi = grossRentIncome - operatingExpenses;

//   // ✅ Annual Mortgage Payment (remains fixed)
//   let annualMortgagePayment = mortgagePayment * 12;

//   // ✅ Cash Flow Calculation
//   let cashFlowAnnual = noi - annualMortgagePayment;
//   let cashFlowMonthly = cashFlowAnnual / 12;

//   // ✅ Display Results in Table
//   document.getElementById("gross_rent").innerText = `$${grossRentIncome.toFixed(2)}`;
//   document.getElementById("vacancy_rate").innerText = `– $${vacancyLoss.toFixed(2)}`;
//   document.getElementById("operating_income").innerText = `$${adjustedRentIncome.toFixed(2)}`;
//   document.getElementById("operating_expenses").innerText = `– $${operatingExpenses.toFixed(2)}`;
//   document.getElementById("net_operating_income").innerText = `$${noi.toFixed(2)}`;
//   document.getElementById("loan_payments").innerText = `– $${annualMortgagePayment.toFixed(2)}`;
//   document.getElementById("cash_flow").innerText = `$${cashFlowAnnual.toFixed(2)}`;

//   console.log(`Data displayed for year: ${year}`);
// }

// Function to populate the years dropdown
function populateYearsDropdown() {
  const select = document.getElementById('years_tbl');
  select.innerHTML = ''; // Clear existing options

  for (let i = 1; i <= 30; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = `${i} ${i === 1 ? 'Year' : 'Years'}`;

    // Set 10 years as the default selected value
    if (i === 1) {
      option.selected = true;
    }

    select.appendChild(option);
  }
}

// Call the function to populate the dropdown on page load
window.onload = populateYearsDropdown;

// function generateYearTable(data, year) {
//   const div = document.createElement("div");
//   div.classList.add("mb-5");
//   div.innerHTML = `
//     <h5>Year ${year}</h5>
//     <table class="table table-bordered">
//       <thead>
//         <tr><th>Category</th><th>Amount</th></tr>
//       </thead>
//       <tbody>
//         <tr><td>Gross Rent</td><td>$${data.grossRentIncome.toFixed(2)}</td></tr>
//         <tr><td>Vacancy</td><td>– $${data.vacancyLoss.toFixed(2)}</td></tr>
//         <tr><td>Operating Income</td><td>$${data.adjustedRentIncome.toFixed(2)}</td></tr>
//         <tr><td>Operating Expenses</td><td>– $${data.operatingExpenses.toFixed(2)}</td></tr>
//         <tr><td class="ps-4">Property Taxes</td><td>$${parseFloat(document.getElementById("propertyTaxes").value || 0).toFixed(2)}</td></tr>
//         <tr><td class="ps-4">Insurance</td><td>$${parseFloat(document.getElementById("insuranceCosts").value || 0).toFixed(2)}</td></tr>
//         <tr><td class="ps-4">Maintenance</td><td>$${parseFloat(document.getElementById("maintenanceCosts").value || 0).toFixed(2)}</td></tr>
//         <tr><td class="ps-4">Management Fees</td><td>$${(data.adjustedRentIncome * (parseFloat(document.getElementById("managementFees").value || 0) / 100)).toFixed(2)}</td></tr>
//         <tr><td class="ps-4">Vacancy Loss</td><td>$${data.vacancyLoss.toFixed(2)}</td></tr>
//         <tr><td class="ps-4">Utilities</td><td>$${parseFloat(document.getElementById("utilities").value || 0).toFixed(2)}</td></tr>
//         <tr><td class="ps-4">Renovations</td><td>$${parseFloat(document.getElementById("renovations").value || 0).toFixed(2)}</td></tr>
//         <tr class="fw-bold"><td>Net Operating Income (NOI)</td><td>$${data.netOperatingIncome.toFixed(2)}</td></tr>
//         <tr><td>Loan Payments</td><td>– $${data.annualMortgagePayment.toFixed(2)}</td></tr>
//         <tr><td>Capital Expenditures</td><td>– $${data.capitalExpenditures.toFixed(2)}</td></tr>
//         <tr class="fw-bold"><td>Cash Flow</td><td>$${data.cashFlow.toFixed(2)}</td></tr>
//       </tbody>
//     </table>
//   `;
//   return div;
// }
