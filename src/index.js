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
