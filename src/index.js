import './style.css';
import './budget-table.css';
import calculateHouseFlip from './calculators/house-flip';
import calculateRentalProperty from './calculators/rental';
import updateTableRange from './utils/update-table-range';
import populateYearsDropdown from './utils/populate-years-dropdown';
import initializePdfListeners from '../downloaders/pdf-event-listeners';
import calculateConstructionCost from './calculators/total-construction';

document.addEventListener('DOMContentLoaded', function () {
  // House flip
  const inputs = document.querySelectorAll(
    '#purchasePrice,#propertyAddress, #renoCosts, #holdingCosts, #desiredProfitMargin, #closingCosts, #afterRepairValue,#projectMonths,#resaleCosts,#downPaymentPercent,#gapCosts,#loanPoints,#houseLoanYear,#houseinterestRate,#houseMonthlyRent,#insurance,#propertyTaxesHF,#downPaymentType,#houseAnnualMaintenance,#houseAnnualUtilities'
  );
  inputs.forEach((input) => {
    input.addEventListener('input', calculateHouseFlip);
  });

  // Rental
  const input3 = document.querySelectorAll(
    '#managementFees, #maintenanceCosts, #insuranceCosts,#renovations,#utilities,#rentGrowth,#closingCostsRent, #propertyTaxes, #vacancyRate,#monthlyRent,#interestRate,#loanTerm,#downPayment,#propertyPrice,#timeDuration , #appreciationRate, #initialRenovations '
  );
  input3.forEach((input) => {
    input.addEventListener('input', calculateRentalProperty);
  });

  // Budgeting
  const input4 = document.querySelectorAll(
    '#plansPermitsAmount, #demolitionAmount, #foundationAmount, #roofGuttersAmount, #exteriorSlidingAmount, #windowsAmount, #garageDrivewayAmount, #framingAmount, #finishCarpentryAmount, #sheetrockInsulationAmount, #interiorPaintAmount, #flooringAmount, #kitchenAmount, #bathroomAmount, #plumbingWorkAmount, #electricalWorkAmount, #hvacWorkAmount, #appliancesAmount, #yardLandscapingAmount, #basementFinishesAmount, #miscAmount'
  );
  input4.forEach((input) => {
    input.addEventListener('input', calculateConstructionCost);
  });

  initializePdfListeners();

  // Attach event listener to dropdown for updating table range
  const yearsDropdown = document.getElementById('years_tbl');
  if (yearsDropdown) {
    yearsDropdown.addEventListener('change', updateTableRange);
  }

  // Run calculators
  calculateHouseFlip();
  calculateRentalProperty();
  calculateConstructionCost();

  // Populate rental years dropdown
  populateYearsDropdown();
});
