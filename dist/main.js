/******/ (() => { // webpackBootstrap
/*!***************************!*\
  !*** ./src/calculator.js ***!
  \***************************/
document.addEventListener('DOMContentLoaded', function () {
  const inputs = document.querySelectorAll('#purchasePrice,#propertyAddress, #renoCosts, #holdingCosts,#closingCosts, #afterRepairValue,#projectMonths,#resaleCosts,#downPaymentPercent,#gapCosts,#loanPoints,#houseLoanYear,#houseinterestRate,#houseMonthlyRent,#insurance,#propertyTaxesHF,#downPaymentType,#houseAnnualMaintenance,#houseAnnualUtilities');
  const input2 = document.querySelectorAll('#currentAge, #retirementAge, #currentSavings,#lifeInsuranceMonthlyContributions,#wholeLifeInsurance, #monthlyContributions, #annualReturn,#desiredIncome,#inflationRate,#currentRealEstateEquity,#currentStockValue,#realEstateAppreciation,#mortgageBalance , #mortgageInterestRate , #mortgageTerm');
  const input3 = document.querySelectorAll('#managementFees, #maintenanceCosts, #insuranceCosts,#renovations,#utilities,#rentGrowth,#closingCostsRent, #propertyTaxes, #vacancyRate,#monthlyRent,#interestRate,#loanTerm,#downPayment,#propertyPrice,#timeDuration , #appreciationRate ');
  inputs.forEach(input => {
    input.addEventListener('input', calculateHouseFlip);
  });
  input2.forEach(input => {
    input.addEventListener('input', calculateRetirement);
  });
  input3.forEach(input => {
    input.addEventListener('input', calculateRentalProperty);
  });
});
document.addEventListener('DOMContentLoaded', function () {
  calculateHouseFlip();
  calculateRetirement();
  calculateRentalProperty();
});
function formatNumber(value) {
  let formattedValue = value % 1 === 0 ? Math.abs(value).toLocaleString() : Math.abs(value).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  return value < 0 ? `- $${formattedValue}` : `$${formattedValue}`;
}
function formatNumberPercent(value) {
  return value % 1 === 0 ? value.toLocaleString() : value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}
function calculateHouseFlip() {
  let purchase = parseFloat(document.getElementById('purchasePrice').value) || 0;
  let reno = parseFloat(document.getElementById('renoCosts').value) || 0;
  let holding = parseFloat(document.getElementById('holdingCosts').value) || 0;
  let arv = parseFloat(document.getElementById('afterRepairValue').value) || 0;
  let desiredProfitMargin = parseFloat(document.getElementById('desiredProfitMargin').value) || 0;
  // Loan & Gap Fields
  let interestRate = parseFloat(document.getElementById('houseinterestRate').value) || 0;
  let loanPoints = parseFloat(document.getElementById('loanPoints').value) || 0;
  let termYears = parseFloat(document.getElementById('houseLoanYear').value) || 0;
  let totalPayments = termYears * 12;
  let gapFundingRate = parseFloat(document.getElementById('gapCosts').value) || 0;
  // Additional Fields
  let downPaymentPercent = parseFloat(document.getElementById('downPaymentPercent').value) || 0;
  // let commissionPercent = parseFloat(document.getElementById("commissionPercent").value) || 0;
  let resaleCostPercent = parseFloat(document.getElementById('resaleCosts').value) || 0;
  let resaleCosts = arv * resaleCostPercent / 100;
  let address = document.getElementById('propertyAddress').value;
  let months = parseFloat(document.getElementById('projectMonths').value) || 0;
  let monthlyRent = parseFloat(document.getElementById('houseMonthlyRent').value) || 0;
  let annualPropertyTaxes = parseFloat(document.getElementById('propertyTaxesHF').value) || 0;
  let annualInsurance = parseFloat(document.getElementById('insurance').value) || 0;
  let annualMaintenance = parseFloat(document.getElementById('houseAnnualMaintenance').value) || 0;
  let annualUtilities = parseFloat(document.getElementById('houseAnnualUtilities').value) || 0;
  document.querySelector('.housecharts').style.display = 'block';
  let downPaymentType = document.getElementById('downPaymentType').value;
  let downPaymentBase = downPaymentType === 'purchaseAndReno' ? purchase + reno : purchase;
  let closingPercent = parseFloat(document.getElementById('closingCosts').value) || 0;
  let closing = downPaymentBase * closingPercent / 100;
  let downPayment = downPaymentBase * downPaymentPercent / 100;
  let monthlyRate = interestRate / 100 / 12;
  let loanAmount = downPaymentType === 'purchaseAndReno' ? purchase + reno - downPayment : purchase - downPayment;
  let proratedMaintenance = annualMaintenance / 12 * months;
  let proratedUtilities = annualUtilities / 12 * months;

  // let loanInterest = (loanAmount * (interestRate / 100)) * (months / 12);
  let loanFees = loanAmount * loanPoints / 100;
  let proratedTaxes = annualPropertyTaxes / 12 * months;
  let proratedInsurance = annualInsurance / 12 * months;
  let monthlyMortgagePayment = termYears > 0 ? loanAmount * monthlyRate / (1 - Math.pow(1 + monthlyRate, -totalPayments)) : 0;
  let totalMortgagePaid = monthlyMortgagePayment * months;
  let principalPaid = 0;
  let interestPaid = totalMortgagePaid;
  loanInterest = interestPaid;
  let totalProjectCost = purchase + reno + holding + closing + resaleCosts + loanInterest + loanFees + proratedTaxes + proratedInsurance;
  // **Corrected Investment Calculation**
  let gapCosts = totalProjectCost - (loanAmount + downPayment);
  let gapFundingFees = gapCosts > 0 ? gapCosts * gapFundingRate / 100 : 0;
  let totalInvestment = purchase + reno + holding + closing + loanInterest + loanFees + gapFundingFees + proratedTaxes + proratedInsurance;
  let totalCashInvested = downPaymentBase + holding + closing + resaleCosts + proratedTaxes + proratedInsurance;
  // ✅ Profit Calculation
  let grossProfit = arv - purchase;
  let netProfit = arv - totalInvestment;

  // ✅ Profit Margin & Cash-on-Cash Return
  let profitMargin = arv > 0 ? netProfit / arv * 100 : 0;
  let cashOnCashReturn = totalCashInvested > 0 ? netProfit / totalCashInvested * 100 : 0;

  // ✅ Break-even Years Calculation
  let monthlyRentalProfit = (arv * 0.01 - holding / months).toFixed(2);
  let breakEvenYears = monthlyRentalProfit > 0 ? (netProfit / (monthlyRentalProfit * 12)).toFixed(2) : 'N/A';
  let totalHoldingExpenses = holding + proratedTaxes + proratedInsurance + proratedMaintenance + proratedUtilities + loanInterest + loanFees + gapFundingFees;
  let monthlyHoldingCost = months > 0 ? (totalHoldingExpenses / months).toFixed(2) : 0;

  // ✅ Flipping vs. Rental Analysis
  let rentalVsFlip = netProfit > 0 && monthlyRent > 0 ? (netProfit / (monthlyRent * 12)).toFixed(2) : 'N/A';
  // ✅ Profit Min % and $ Calculation
  let profitMinPercent = (profitMargin * 0.8).toFixed(2); // Assuming 80% of profit margin as min
  let profitMinDollar = (netProfit * 0.8).toFixed(2); // 80% of the net profit as min
  let projection = (netProfit * 0.9).toFixed(2); // Projection at 90% of the net profit

  // ✅ Deal? Logic
  let deal = profitMargin >= 10 && netProfit > 0 ? 'YES' : 'NO';
  let requiredARV = desiredProfitMargin > 0 ? totalInvestment / (1 - desiredProfitMargin / 100) : 0;
  let totalInvestmentExcludingPurchase = reno + holding + loanInterest + loanFees + gapFundingFees + proratedTaxes + proratedInsurance;
  let targetNetProfit = (totalInvestmentExcludingPurchase + purchase) * (desiredProfitMargin / 100);

  // But since we want to solve for purchase (maxPurchasePrice), we need to restructure:
  let allOtherCosts = reno + holding + closing + resaleCosts + loanInterest + loanFees + gapFundingFees + proratedTaxes + proratedInsurance;
  let maxPurchasePrice = (arv - allOtherCosts) / (1 + desiredProfitMargin / 100);

  // ✅ Display Results
  // document.getElementById("grossProfit").innerText = formatNumber(grossProfit);
  document.getElementById('totalInvestment').innerText = formatNumber(totalInvestment);
  document.getElementById('netProfit').innerText = formatNumber(netProfit);
  document.getElementById('totalCashInvested').innerText = formatNumber(totalCashInvested);
  document.getElementById('profitMargin').innerText = formatNumberPercent(profitMargin) + '%';
  document.getElementById('cashOnCashReturn').innerText = formatNumberPercent(cashOnCashReturn) + '%';
  document.getElementById('breakEvenYears').innerText = breakEvenYears;
  document.getElementById('rentalVsFlip').innerText = rentalVsFlip !== 'N/A' ? `${rentalVsFlip} years to match flip profit with rental income.` : 'N/A';
  // document.getElementById("profitMinPercent").innerText = `${profitMinPercent}%`;
  // document.getElementById("profitMinDollar").innerText = `${formatNumber(profitMinDollar)}`;
  // document.getElementById("projection").innerText = `${formatNumber(projection)}`;
  document.getElementById('dealStatus').innerText = deal;
  document.getElementById('monthlyHoldingCost').innerText = `${formatNumber(monthlyHoldingCost)}`;
  // document.getElementById("proratedTaxes").innerText = formatNumber(proratedTaxes);
  // document.getElementById("proratedInsurance").innerText = formatNumber(proratedInsurance);
  document.getElementById('displayedAddress').innerText = address ? `📍 ${address}` : '';
  if (gapFundingRate > 0) {
    document.getElementById('calculatedGapCost').innerText = formatNumber(gapFundingFees);
  }
  // document.getElementById("requiredARV").innerText = formatNumber(requiredARV);
  document.getElementById('maxPurchasePrice').innerText = formatNumber(maxPurchasePrice);

  // ✅ Color Code Cards
  // let grossProfitCard = document.querySelector(".grossProfitcard");
  // grossProfitCard.style.backgroundColor = grossProfit >= 0 ? "#d0b870" : "#f86d6d";
  // document.querySelector(".grosspro").style.color = grossProfit >= 0 ? "black" : "#d0b870";

  let netProfitEl = document.getElementById('netProfit');
  let netprocard = document.querySelector('.netprocard');
  let netprocardhead = document.querySelector('.netprocardhead');
  netProfitEl.style.color = netProfit > 0 ? 'black' : 'black'; // gold if profit, red if loss
  netprocardhead.style.color = netProfit > 0 ? 'black' : '#d0b870'; // gold if profit, red if loss
  netprocard.style.background = netProfit > 0 ? '#d0b870' : '#f86d6d';
  let profitMarginEl = document.getElementById('profitMargin');
  let promarcard = document.querySelector('.promarcard');
  let promarcardhead = document.querySelector('.promarcardhead');
  profitMarginEl.style.color = profitMargin >= desiredProfitMargin ? 'black' : 'black';
  promarcardhead.style.color = profitMargin >= desiredProfitMargin ? 'black' : '#d0b870'; // gold if profit, red if loss
  promarcard.style.background = profitMargin >= desiredProfitMargin ? '#d0b870' : '#f86d6d';
  let rentalVsFlipEl = document.getElementById('rentalVsFlip');
  let rvfcard = document.querySelector('.rvfcard');
  let rvfcardhead = document.querySelector('.rvfcardhead');
  rentalVsFlipEl.style.color = rentalVsFlip !== 'N/A' && rentalVsFlip < 5 ? 'black' : 'black';
  rvfcardhead.style.color = rentalVsFlip !== 'N/A' && rentalVsFlip < 5 ? 'black' : '#d0b870'; // gold if profit, red if loss
  rvfcard.style.background = rentalVsFlip !== 'N/A' && rentalVsFlip < 5 ? '#d0b870' : '#f86d6d';
  let dealCardd = document.querySelector('.dealCardd');
  let dealCarddhead = document.querySelector('.dealCarddhead');
  document.getElementById('dealStatus').style.color = deal === 'YES' ? 'black' : 'black';
  dealCarddhead.style.color = rentalVsFlip !== 'N/A' && rentalVsFlip < 5 ? 'black' : '#d0b870'; // gold if profit, red if loss
  dealCardd.style.background = rentalVsFlip !== 'N/A' && rentalVsFlip < 5 ? '#d0b870' : '#f86d6d';
  // ✅ Reset Charts Before Rendering
  resetCanvas('projectCostBreakdownChart');
  resetCanvas('arvDistributionChart');
  createProjectCostBreakdownChart({
    purchase,
    reno,
    holding,
    loanInterest,
    loanFees,
    resaleCosts,
    closing,
    proratedTaxes,
    proratedInsurance
  });
  createARVDistributionChart({
    investment: totalInvestment,
    resaleCosts,
    netProfit
  });
}
function resetCanvas(id) {
  let canvasWrapper = document.getElementById(id).parentNode;
  canvasWrapper.innerHTML = `<canvas id="${id}"></canvas>`;
}
Chart.register(ChartDataLabels);
function createProjectCostBreakdownChart(data) {
  const ctx = document.getElementById('projectCostBreakdownChart').getContext('2d');

  // Combine holding-related costs into one
  const combinedHolding = data.holding + data.loanInterest + data.proratedTaxes + data.proratedInsurance;
  const labels = ['Purchase', 'Renovation', 'Holding (incl. interest, taxes, insurance)', 'Loan Fees', 'Resale Costs', 'Closing Costs'];
  const values = [data.purchase, data.reno, combinedHolding, data.loanFees, data.resaleCosts, data.closing];
  const total = values.reduce((a, b) => a + b, 0);
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: values,
        backgroundColor: ['#F39655', '#B77CE9', '#55CBE5', '#e74c3c', '#1abc9c', '#e67e22'],
        borderColor: '#ffffff',
        borderWidth: 4,
        hoverOffset: 20
      }]
    },
    options: {
      responsive: true,
      cutout: '0%',
      plugins: {
        datalabels: {
          color: '#ffffff',
          font: {
            weight: 'bold',
            size: 14
          },
          formatter: (value, context) => {
            const percentage = value / total * 100;
            return `${percentage.toFixed(1)}%`;
          },
          display: function (context) {
            const value = context.dataset.data[context.dataIndex];
            const percentage = value / total * 100;
            return percentage >= 5;
          }
        },
        title: {
          display: true,
          text: 'Project Cost Breakdown',
          font: {
            size: 20,
            weight: 'bold',
            color: '#000000'
          }
        },
        legend: {
          position: 'right',
          labels: {
            boxWidth: 14,
            padding: 16,
            font: {
              size: 14,
              color: '#000000'
            }
          }
        },
        tooltip: {
          callbacks: {
            label: function (ctx) {
              const value = ctx.parsed;
              const percentage = (value / total * 100).toFixed(2);
              return `${ctx.label}: $${value.toLocaleString()} (${percentage}%)`;
            }
          }
        }
      }
    },
    plugins: [ChartDataLabels]
  });
}
function createARVDistributionChart(data) {
  const ctx = document.getElementById('arvDistributionChart').getContext('2d');
  const labels = ['Total Investment', 'Resale Costs', 'Net Profit'];
  const values = [data.investment, data.resaleCosts, data.netProfit];
  const total = values.reduce((a, b) => a + b, 0);
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        data: values,
        backgroundColor: ['#2980b9', '#f1c40f', '#2ecc71'],
        borderColor: '#ffffff',
        borderWidth: 4,
        hoverOffset: 20
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'ARV Distribution',
          font: {
            size: 20,
            weight: 'bold'
          },
          color: '#000000'
        },
        legend: {
          position: 'right',
          labels: {
            boxWidth: 14,
            padding: 16,
            font: {
              size: 14,
              color: '#000000'
            }
          }
        },
        tooltip: {
          callbacks: {
            label: function (ctx) {
              const value = ctx.parsed;
              const percentage = (value / total * 100).toFixed(2);
              return `${ctx.label}: $${value.toLocaleString()} (${percentage}%)`;
            }
          }
        },
        datalabels: {
          color: '#ffffff',
          font: {
            weight: 'bold',
            size: 14
          },
          formatter: (value, context) => {
            const percentage = value / total * 100;
            return `${percentage.toFixed(1)}%`;
          },
          display: function (context) {
            const value = context.dataset.data[context.dataIndex];
            const percentage = value / total * 100;
            return percentage >= 5; // Show only if the slice is 5% or more
          }
        }
      }
    },
    plugins: [ChartDataLabels]
  });
}
function calculateRetirement() {
  let currentAge = document.getElementById('currentAge');
  let retirementAge = document.getElementById('retirementAge');
  let currentSavings = document.getElementById('currentSavings');
  let monthlyContributions = document.getElementById('monthlyContributions');
  let annualReturn = document.getElementById('annualReturn');
  let inflationRate = document.getElementById('inflationRate');
  let desiredIncome = document.getElementById('desiredIncome');
  let realEstateAppreciation = document.getElementById('realEstateAppreciation');
  let mortgageBalance = document.getElementById('mortgageBalance');
  let wholeLifeInsurance = document.getElementById('wholeLifeInsurance');
  let lifeInsuranceMonthlyContributions = document.getElementById('lifeInsuranceMonthlyContributions');
  let mortgageTerm = document.getElementById('mortgageTerm');
  let mortgageInterestRate = document.getElementById('mortgageInterestRate');
  // 🆕 New inputs for Stock and Real Estate
  let currentStockValue = document.getElementById('currentStockValue');
  let currentRealEstateEquity = document.getElementById('currentRealEstateEquity');
  document.querySelector('.retirecharts').style.display = 'block';

  // ✅ Error messages
  let errors = {
    currentAge: document.getElementById('errorCurrentAge'),
    retirementAge: document.getElementById('errorRetirementAge'),
    currentSavings: document.getElementById('errorCurrentSavings'),
    monthlyContributions: document.getElementById('errorMonthlyContributions'),
    annualReturn: document.getElementById('errorAnnualReturn'),
    inflationRate: document.getElementById('errorInflationRate'),
    desiredIncome: document.getElementById('errorDesiredIncome'),
    currentStockValue: document.getElementById('errorCurrentStockValue'),
    currentRealEstateEquity: document.getElementById('errorCurrentRealEstateEquity'),
    realEstateAppreciation: document.getElementById('errorRealEstateAppreciation'),
    mortgageBalance: document.getElementById('errormortgageBalance'),
    wholeLifeInsurance: document.getElementById('errorwholeLifeInsurance'),
    lifeInsuranceMonthlyContributions: document.getElementById('errorLifeInsuranceMonthlyContributions'),
    mortgageTerm: document.getElementById('errorMortgageTerm'),
    mortgageInterestRate: document.getElementById('errorMortgageInterestRate')
  };
  // ✅ Clear previous errors
  Object.values(errors).forEach(error => error.innerText = '');
  let isValid = true;

  // ✅ Validation function
  function validateInput(input, errorField, fieldName) {
    let min = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    let max = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : Infinity;
    let value = parseFloat(input.value) || 0; // Fallback to 0 if empty
    if (value < min || value > max) {
      errorField.innerText = `${fieldName} must be a valid number (${min} - ${max}).`;
      isValid = false;
    }
  }

  // ✅ Validate all inputs
  validateInput(currentAge, errors.currentAge, 'Current Age', 18, 100);
  validateInput(retirementAge, errors.retirementAge, 'Retirement Age', 18, 100);
  validateInput(currentSavings, errors.currentSavings, 'Current Savings', 0);
  validateInput(monthlyContributions, errors.monthlyContributions, 'Monthly Contributions', 0);
  validateInput(annualReturn, errors.annualReturn, 'Expected Annual Return (%)', 0, 100);
  validateInput(inflationRate, errors.inflationRate, 'Inflation Rate (%)', 0, 100);
  validateInput(desiredIncome, errors.desiredIncome, 'Desired Retirement Income', 0);
  validateInput(currentStockValue, errors.currentStockValue, 'Current Stock Value', 0);
  validateInput(currentRealEstateEquity, errors.currentRealEstateEquity, 'Current Real Estate Equity', 0);
  validateInput(realEstateAppreciation, errors.realEstateAppreciation, 'Real Estate Appreciation (%)', 0, 100);
  validateInput(mortgageBalance, errors.mortgageBalance, 'Mortgage Balance', 0);
  validateInput(wholeLifeInsurance, errors.wholeLifeInsurance, 'Whole Life Insurance', 0);
  validateInput(lifeInsuranceMonthlyContributions, errors.lifeInsuranceMonthlyContributions, 'Life Insurance Monthly Contributions', 0);
  // validateInput(mortgageTerm, errors.mortgageTerm, "Mortgage Term", 1, 50);
  validateInput(mortgageInterestRate, errors.mortgageInterestRate, 'Mortgage Interest Rate', 0, 100);
  if (parseInt(currentAge.value) >= parseInt(retirementAge.value)) {
    errors.retirementAge.innerText = 'Retirement age must be greater than current age.';
    isValid = false;
  }
  if (!isValid) return;

  // ✅ Variables for calculation
  let yearsToRetirement = parseInt(retirementAge.value) - parseInt(currentAge.value);
  let n = 12; // Monthly compounding
  let r = (parseFloat(annualReturn.value) || 0) / 100 / n; // Handle empty return gracefully
  let t = yearsToRetirement * n;

  // ✅ Future Value Calculations (Avoid NaN)
  let fvCurrentSavings = (parseFloat(currentSavings.value) || 0) * Math.pow(1 + (parseFloat(annualReturn.value) || 0) / 100, yearsToRetirement);
  let fvContributions = (parseFloat(monthlyContributions.value) || 0) * ((Math.pow(1 + r, t) - 1) / r) * (1 + r);

  // ✅ Stock and Real Estate appreciation (Avoid NaN)
  let fvStock = (parseFloat(currentStockValue.value) || 0) * Math.pow(1 + 0.03, yearsToRetirement);
  let realEstateRate = (parseFloat(realEstateAppreciation.value) || 0) / 100;
  let adjustedMortgage = parseFloat(mortgageBalance.value) || 0;

  // Real estate equity: owned portion of equity minus owned mortgage
  let fvRealEstate = (parseFloat(currentRealEstateEquity.value) || 0) * Math.pow(1 + realEstateRate, yearsToRetirement) - adjustedMortgage;
  if (isNaN(fvRealEstate)) fvRealEstate = 0;
  // ✅ Total Savings (Check for NaN and fallback to 0)
  let lifeInsuranceMonthly = parseFloat(lifeInsuranceMonthlyContributions.value) || 0;
  let fvLifeInsuranceContributions = lifeInsuranceMonthly * ((Math.pow(1 + r, t) - 1) / r) * (1 + r);
  let fvWholeLifeInsurance = (parseFloat(wholeLifeInsurance.value) || 0) + fvLifeInsuranceContributions;
  let totalSavings = (isNaN(fvCurrentSavings) ? 0 : fvCurrentSavings) + (isNaN(fvContributions) ? 0 : fvContributions) + (isNaN(fvStock) ? 0 : fvStock) + (isNaN(fvRealEstate) ? 0 : fvRealEstate) + fvWholeLifeInsurance;
  // 🆕 Add remaining mortgage payments to savings if it ends before retirement
  const mortgageEndYears = mortgageTerm / 12;
  if (mortgageEndYears < yearsToRetirement) {
    const remainingYears = yearsToRetirement - mortgageEndYears;
    const futureExtraSavings = monthlyPayment * 12 * ((Math.pow(1 + r, remainingYears * n) - 1) / r) * (1 + r);
    totalSavings += isNaN(futureExtraSavings) ? 0 : futureExtraSavings;
  }

  // ✅ Adjusted Income with Inflation (Fallback to 0)
  let adjustedIncome = (parseFloat(desiredIncome.value) || 0) * Math.pow(1 + (parseFloat(inflationRate.value) || 0) / 100, yearsToRetirement);

  // ✅ Time-based projections for all assets
  let projections = [];
  let stockGrowthRate = 0.03; // Still fixed unless you want to make that editable too

  for (let i = 5; i <= yearsToRetirement; i += 5) {
    const realEstateValue = (parseFloat(currentRealEstateEquity.value) || 0) * Math.pow(1 + realEstateRate, i);
    const principal = adjustedMortgage;
    const termMonths = parseFloat(mortgageTerm.value || 0) * 12;
    const monthlyRate = parseFloat(mortgageInterestRate.value || 0) / 100 / 12;
    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / (Math.pow(1 + monthlyRate, termMonths) - 1);
    const monthsPaid = Math.min(i * 12, termMonths);
    const remainingMortgage = principal * Math.pow(1 + monthlyRate, monthsPaid) - monthlyPayment * (Math.pow(1 + monthlyRate, monthsPaid) - 1) / monthlyRate;
    const netRealEstate = isNaN(realEstateValue - remainingMortgage) ? 0 : realEstateValue - remainingMortgage;

    // 🆕 If mortgage is paid off, calculate the extra savings
    let extraInvestmentValue = 0;
    if (i * 12 > termMonths) {
      const extraMonths = i * 12 - termMonths;
      const extraMonthly = monthlyPayment;
      const extraYears = extraMonths / 12;
      extraInvestmentValue = extraMonthly * 12 * ((Math.pow(1 + r, extraYears * n) - 1) / r) * (1 + r);
    }

    // 🧠 Insurance + extra investment FV
    const insuranceContributionFV = lifeInsuranceMonthly * ((Math.pow(1 + r, i * n) - 1) / r) * (1 + r);
    const totalInsuranceValue = (parseFloat(wholeLifeInsurance.value) || 0) + insuranceContributionFV;
    projections.push({
      year: i,
      stockValue: (parseFloat(currentStockValue.value) || 0) * Math.pow(1 + stockGrowthRate, i),
      realEstateValue: netRealEstate,
      insuranceValue: totalInsuranceValue,
      extraInvestmentValue: isNaN(extraInvestmentValue) ? 0 : extraInvestmentValue
    });
  }

  // ✅ Withdrawal Simulation
  let withdrawalYears = 0;
  let remainingBalance = totalSavings;
  let yearlyWithdrawal = adjustedIncome;
  let yearsArray = [];
  let balanceArray = [];
  while (remainingBalance > 0) {
    yearsArray.push(withdrawalYears);
    balanceArray.push(remainingBalance);
    withdrawalYears++;

    // Prevent infinite loops
    if (withdrawalYears > 100) break;
    remainingBalance -= yearlyWithdrawal;
    remainingBalance *= 1 + (parseFloat(annualReturn.value) || 0) / 100;
    yearlyWithdrawal *= 1 + (parseFloat(inflationRate.value) || 0) / 100;
  }
  let expectedLifespan = 90;
  let retirementYears = expectedLifespan - parseInt(retirementAge.value);
  let shortfallSurplusDiv = document.querySelector('.short');
  let shortfallSurplus;
  if (withdrawalYears >= retirementYears) {
    shortfallSurplus = 'Surplus (Funds last throughout retirement)';
    shortfallSurplusDiv.style.backgroundColor = '#d0b870';
    document.querySelector('.shortcap').style.color = 'black';
  } else {
    document.querySelector('.shortcap').style.color = '#d0b870';
    shortfallSurplus = `Funds wont last throughout the retirement years, short by ${retirementYears - withdrawalYears} years)`;
    shortfallSurplusDiv.style.backgroundColor = '#f86d6d';
  }

  // ✅ Display Output
  if (annualReturn.value != '') {
    document.getElementById('totalSavings').innerHTML = `${formatNumber(totalSavings)}`;
    let totalSavingsEl = document.getElementById('totalSavings');
    let totalSavingsCard = document.querySelector('.totalSavingsCard');
    let totalSavingshead = document.querySelector('.totalSavingshead');
    totalSavingsEl.style.color = 'black';
    totalSavingshead.style.color = 'black';
    totalSavingsCard.style.background = '#d0b870';
  }
  document.getElementById('annualWithdrawal').innerHTML = `${formatNumber(adjustedIncome)}`;
  document.getElementById('yearsUntilDepletion').innerHTML = `${isNaN(withdrawalYears) ? 'N/A' : withdrawalYears}`;
  document.getElementById('shortfallSurplus').innerHTML = isNaN(withdrawalYears) ? 'N/A' : shortfallSurplus;

  // ✅ Display New Projections
  let projectionsDiv = document.getElementById('projections');
  projectionsDiv.innerHTML = `<h3 class="dynamicHead">Time-based Asset Projections:</h3>`;
  projections.forEach(proj => {
    const total = proj.stockValue + proj.realEstateValue + proj.insuranceValue;
    projectionsDiv.innerHTML += `
      <p class="dynamicPara">In <strong>${proj.year} years:</strong></p>
      <ul>
        <li class="dynamicList">Stock Value: ${formatNumber(proj.stockValue)}</li>
        <li class="dynamicList">Real Estate Value: ${formatNumber(proj.realEstateValue)}</li>
        <li class="dynamicList">Life Insurance Value: ${formatNumber(proj.insuranceValue)}</li>
        <li class="dynamicList"><strong>Total Value: ${formatNumber(total)}</strong></li>
      </ul>`;
  });
  if (fvStock > 0 || fvRealEstate > 0 || fvWholeLifeInsurance > 0 || fvContributions > 0) {
    renderAssetBreakdownChart(fvStock, fvRealEstate, fvWholeLifeInsurance, fvCurrentSavings + fvContributions);
    renderIncomeSourcePie(fvContributions, fvStock, fvRealEstate, fvWholeLifeInsurance);
  }
}

// charts
function renderAssetBreakdownChart(fvStock, fvRealEstate, fvWholeLifeInsurance, fvSavings) {
  const ctx = document.getElementById('assetBreakdownChart').getContext('2d');
  const total = fvStock + fvRealEstate + fvWholeLifeInsurance + fvSavings;
  const chartData = {
    labels: ['Stocks', 'Real Estate', 'Whole Life Insurance', 'Savings'],
    datasets: [{
      label: 'Asset Distribution at Retirement',
      data: [fvStock, fvRealEstate, fvWholeLifeInsurance, fvSavings],
      backgroundColor: ['#F39655', '#B77CE9 ', '#55CBE5 ', '#e67e22'],
      borderColor: '#ffffff',
      borderWidth: 4,
      hoverOffset: 20
    }]
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
            weight: 'bold'
          },
          color: '#000000'
        },
        legend: {
          position: 'right',
          labels: {
            boxWidth: 14,
            padding: 16,
            font: {
              size: 14,
              color: '#000000'
            }
          }
        },
        tooltip: {
          callbacks: {
            label: function (ctx) {
              const value = ctx.parsed;
              const percentage = (value / total * 100).toFixed(2);
              return `${ctx.label}: $${value.toLocaleString()} (${percentage}%)`;
            }
          }
        },
        datalabels: {
          color: '#ffffff',
          font: {
            weight: 'bold',
            size: 14
          },
          formatter: (value, context) => {
            const percentage = value / total * 100;
            return `${percentage.toFixed(1)}%`;
          },
          display: function (context) {
            const value = context.dataset.data[context.dataIndex];
            const percentage = value / total * 100;
            return percentage >= 5; // Only show if 5% or more
          }
        }
      }
    },
    plugins: [ChartDataLabels]
  });
}
let incomeSourceChartInstance;
function renderIncomeSourcePie(contributions, stock, realEstate, insurance) {
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
      datasets: [{
        label: 'Income Source Contribution at Retirement',
        data: dataValues,
        backgroundColor: ['#55CBE5', '#e74c3c', '#F39655', '#B77CE9'],
        borderColor: '#ffffff',
        borderWidth: 4,
        hoverOffset: 20
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: `Income Sources at Retirement`,
          font: {
            size: 20,
            weight: 'bold'
          },
          color: '#000000'
        },
        legend: {
          position: 'right',
          labels: {
            boxWidth: 14,
            padding: 16,
            font: {
              size: 14,
              color: '#000000'
            }
          }
        },
        tooltip: {
          callbacks: {
            label: function (ctx) {
              const value = ctx.parsed;
              const percentage = (value / total * 100).toFixed(2);
              return `${ctx.label}: $${value.toLocaleString()} (${percentage}%)`;
            }
          }
        },
        datalabels: {
          color: 'white',
          font: {
            weight: 'bold',
            size: 14
          },
          formatter: (value, ctx) => {
            const percentage = value / total * 100;
            return percentage >= 5 ? `${percentage.toFixed(1)}%` : '';
          }
        }
      },
      animation: {
        animateRotate: true,
        animateScale: true,
        duration: 1500,
        easing: 'easeOutBounce'
      }
    },
    plugins: [ChartDataLabels]
  });
}
function calculateRentalProperty() {
  // Get values and convert to numbers
  let propertyPrice = parseFloat(document.getElementById('propertyPrice').value.trim()) || 0;
  let downPaymentPercent = parseFloat(document.getElementById('downPayment').value.trim()) || 0;
  let downPayment = downPaymentPercent / 100 * propertyPrice;
  let loanTerm = parseFloat(document.getElementById('loanTerm').value.trim()) || 0;
  let interestRate = parseFloat(document.getElementById('interestRate').value.trim()) || 0;
  let monthlyRent = parseFloat(document.getElementById('monthlyRent').value.trim()) || 0;
  let vacancyRate = parseFloat(document.getElementById('vacancyRate').value.trim()) || 0;
  let propertyTaxes = parseFloat(document.getElementById('propertyTaxes').value.trim()) || 0;
  let insuranceCosts = parseFloat(document.getElementById('insuranceCosts').value.trim()) || 0;
  let maintenanceCosts = parseFloat(document.getElementById('maintenanceCosts').value.trim()) || 0;
  let managementFees = parseFloat(document.getElementById('managementFees').value.trim()) || 0;
  let utilities = parseFloat(document.getElementById('utilities').value.trim()) || 0;
  let renovations = parseFloat(document.getElementById('renovations').value.trim()) || 0;
  let rentGrowth = parseFloat(document.getElementById('rentGrowth').value.trim()) || 0;
  let closingCostsPercent = parseFloat(document.getElementById('closingCostsRent').value.trim()) || 0;
  let closingCosts = closingCostsPercent / 100 * propertyPrice;
  // getting time value
  let timeDuration = parseInt(document.getElementById('timeDuration').value.trim()) || 10;
  let appreciationRate = parseFloat(document.getElementById('appreciationRate').value.trim()) || 3;

  // Reference error span elements
  let errors = {
    propertyPrice: document.getElementById('errorPropertyPrice'),
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
    closingCosts: document.getElementById('errorClosingCostsRent')
  };
  document.querySelector('.rentalcharts').style.display = 'block';
  // Clear previous error messages
  Object.values(errors).forEach(error => error.innerText = '');
  let isValid = true;

  // 🚨 **Validations**
  function validateInput(value, errorField, fieldName) {
    let min = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    let max = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : Infinity;
    if (fieldName == 'Down Payment (%)' && (value < min || value > max)) {
      errorField.innerText = `${fieldName} must be less than 100 .`;
    } else if (fieldName == 'Loan Term (Years)' && (value < min || value > max)) {
      errorField.innerText = `${fieldName} must be less than 30 .`;
    } else {
      if (value < min || value > max) {
        errorField.innerText = `${fieldName} must be greater than ${min} .`;
        isValid = false;
      }
    }
  }
  validateInput(propertyPrice, errors.propertyPrice, 'Property Price', 1000);
  validateInput(downPaymentPercent, errors.downPayment, 'Down Payment (%)', 0, 100);
  validateInput(loanTerm, errors.loanTerm, 'Loan Term (Years)', 1, 30);
  validateInput(interestRate, errors.interestRate, 'Interest Rate (%)', 0, 100);
  validateInput(monthlyRent, errors.monthlyRent, 'Monthly Rent', 0);
  validateInput(vacancyRate, errors.vacancyRate, 'Vacancy Rate (%)', 0, 100);
  validateInput(propertyTaxes, errors.propertyTaxes, 'Annual Property Taxes', 0);
  validateInput(insuranceCosts, errors.insuranceCosts, 'Annual Insurance Costs', 0);
  validateInput(maintenanceCosts, errors.maintenanceCosts, 'Annual Maintenance Costs', 0);
  validateInput(managementFees, errors.managementFees, 'Management Fees (%)', 0, 100);
  validateInput(utilities, errors.utilities, 'Utilities', 0);
  validateInput(renovations, errors.renovations, 'Renovations', 0);
  validateInput(rentGrowth, errors.rentGrowth, 'Rent Growth (%)', 0, 100);
  validateInput(closingCostsPercent, errors.closingCosts, 'Closing Costs (%)', 0, 100);
  if (!isValid) return;

  // ✅ Loan Calculation
  let loanAmount = propertyPrice - downPayment;
  let monthlyRate = interestRate / 100 / 12;
  let numPayments = loanTerm * 12;
  let mortgagePayment = monthlyRate > 0 ? loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1) : loanTerm > 0 ? loanAmount / numPayments : 0;

  // ✅ Rental Income Calculation
  let grossRentIncome = monthlyRent * 12;
  let vacancyLoss = grossRentIncome * (vacancyRate / 100);
  let adjustedRentIncome = grossRentIncome - vacancyLoss;

  // ✅ Operating Expenses Calculation
  let operatingExpenses = propertyTaxes + insuranceCosts + maintenanceCosts + adjustedRentIncome * (managementFees / 100) + utilities + renovations;
  // ✅ NOI Calculation
  let noi = adjustedRentIncome - operatingExpenses;

  // ✅ Annual Mortgage Payment
  let annualMortgagePayment = mortgagePayment * 12;

  // ✅ Cash Flow Calculation
  let cashFlowAnnual = noi - annualMortgagePayment;
  let cashFlowMonthly = cashFlowAnnual / 12;

  // ✅ Cap Rate Calculation
  let capRate = noi / propertyPrice * 100;

  // ✅ Cash-on-Cash Return Calculation
  let totalCashInvested = downPayment + closingCosts + renovations;
  let cocReturn = totalCashInvested > 0 ? cashFlowAnnual / totalCashInvested * 100 : 0;

  // ✅ Debt Service Ratio (DSR) Calculation
  let debtServiceRatio = annualMortgagePayment > 0 ? noi / annualMortgagePayment : 0;
  // For charts and table projections
  let rentProjections = [];
  let adjustedRentProjections = [];
  let monthlyPropertyTaxes = propertyTaxes / 12;
  let monthlyInsurance = insuranceCosts / 12;
  let monthlyMaintenance = maintenanceCosts / 12;
  let monthlyManagementFees = adjustedRentIncome * (managementFees / 100) / 12;
  let monthlyUtilities = utilities / 12;
  let monthlyRenovations = renovations / 12;
  let totalMonthlyCosts = mortgagePayment + monthlyPropertyTaxes + monthlyInsurance + monthlyMaintenance + monthlyManagementFees + monthlyUtilities + monthlyRenovations;
  for (let i = 0; i < timeDuration; i++) {
    let yearRent = monthlyRent * 12 * Math.pow(1 + rentGrowth / 100, i);
    let yearVacancyLoss = yearRent * (vacancyRate / 100);
    let yearAdjustedRent = yearRent - yearVacancyLoss;
    rentProjections.push(yearRent);
    adjustedRentProjections.push(yearAdjustedRent);
  }

  // ✅ Display Results
  document.getElementById('loanAmount').innerText = formatNumber(loanAmount);
  document.getElementById('mortgagePayment').innerText = formatNumber(totalMonthlyCosts);
  document.getElementById('noi').innerText = formatNumber(noi);
  document.getElementById('cashFlow').innerText = formatNumber(cashFlowMonthly);
  document.getElementById('capRate').innerText = formatNumberPercent(capRate) + '%';
  document.getElementById('cocReturn').innerText = formatNumberPercent(cocReturn) + '%';
  document.getElementById('annualCashFlow').innerText = formatNumber(cashFlowAnnual);
  document.getElementById('cashInvestedRent').innerText = formatNumber(totalCashInvested);
  document.getElementById('debtServiceRatio').innerText = debtServiceRatio.toFixed(2);

  // Change background color if DSR is greater than 1.2
  let dsrElement = document.getElementById('debtcard');
  if (debtServiceRatio > 1.2) {
    dsrElement.style.backgroundColor = '#d0b870';
    document.querySelector('.dssr').style.color = 'black';
  } else {
    dsrElement.style.backgroundColor = 'rgb(248, 109, 109)'; // Reset to default if DSR is not > 1.2
  }
  renderPortfolioPieChart(adjustedRentIncome, operatingExpenses, cashFlowAnnual, timeDuration);
  renderCashFlowPieChart(annualMortgagePayment, operatingExpenses, cashFlowAnnual, timeDuration);
  var year = parseFloat(document.getElementById('years_tbl').value.trim()) || 1;
  // document.getElementById("year_b").innerText = year;
  getTableData(year, true);
  updateTableRange();
}
function renderPortfolioPieChart(adjustedRentIncome, operatingExpenses, cashFlowAnnual) {
  let timeDuration = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
  const ctx = document.getElementById('portfolioPieChart').getContext('2d');
  if (window.portfolioPieChart instanceof Chart) {
    window.portfolioPieChart.destroy();
  }

  // Scale values based on selected duration
  const scaledIncome = adjustedRentIncome * timeDuration;
  const scaledExpenses = operatingExpenses * timeDuration;
  const scaledCashFlow = cashFlowAnnual * timeDuration;
  const labels = ['Income', 'Expenses'];
  const values = [scaledIncome, scaledExpenses];
  const colors = ['#B77CE9', '#55CBE5'];
  const profitLabel = scaledCashFlow >= 0 ? 'Profit' : 'Loss';
  const profitValue = Math.abs(scaledCashFlow);
  const profitColor = scaledCashFlow >= 0 ? '#3B8D21' : '#F39655';
  labels.push(profitLabel);
  values.push(profitValue);
  colors.push(profitColor);
  const total = values.reduce((a, b) => a + b, 0);
  window.portfolioPieChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        data: values,
        backgroundColor: colors,
        borderColor: '#fff',
        borderWidth: 2,
        hoverOffset: 12
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: 'black',
            font: {
              size: 14,
              family: 'Arial, sans-serif'
            },
            padding: 15
          }
        },
        title: {
          display: true,
          text: `Portfolio Composition (Over ${timeDuration} Year${timeDuration > 1 ? 's' : ''})`,
          font: {
            size: 20,
            weight: 'bold',
            family: 'Arial, sans-serif'
          },
          color: '#333',
          padding: {
            top: 10,
            bottom: 20
          }
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const value = parseFloat(context.raw);
              const percentage = (value / total * 100).toFixed(1);
              return `${context.label}: $${value.toFixed(2)} (${percentage}%)`;
            },
            afterBody: function () {
              return `Total: $${total.toFixed(2)}`;
            }
          }
        },
        datalabels: {
          color: 'white',
          font: {
            size: 14,
            weight: 'bold'
          },
          formatter: (value, context) => {
            const sum = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
            const percentage = (value / sum * 100).toFixed(1);
            return percentage >= 5 ? `${percentage}%` : '';
          }
        }
      }
    },
    plugins: [ChartDataLabels]
  });
}
function renderCashFlowPieChart(mortgagePaymentAnnual, operatingExpenses, cashFlowAnnual) {
  let timeDuration = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
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
      datasets: [{
        label: 'Cash Flow Breakdown',
        data: values.map(val => val.toFixed(2)),
        backgroundColor: colors,
        hoverOffset: 15,
        borderWidth: 3,
        borderColor: '#fff'
      }]
    },
    options: {
      responsive: true,
      interaction: {
        mode: 'nearest',
        intersect: false
      },
      plugins: {
        title: {
          display: true,
          text: `Cash Flow Breakdown (Over ${timeDuration} Year${timeDuration > 1 ? 's' : ''})`,
          font: {
            size: 22,
            weight: 'bold'
          },
          color: '#333'
        },
        tooltip: {
          enabled: true,
          mode: 'index',
          intersect: false,
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          titleFont: {
            size: 20,
            weight: 'bold'
          },
          bodyFont: {
            size: 16
          },
          padding: 14,
          boxPadding: 6,
          borderColor: '#fff',
          borderWidth: 1,
          callbacks: {
            label: function (context) {
              const label = context.label || '';
              const value = parseFloat(context.raw);
              const percentage = (value / totalFlow * 100).toFixed(2);
              return `${label}: $${value.toFixed(2)} (${percentage}%)`;
            },
            afterBody: function () {
              return `Total: $${totalFlow.toFixed(2)}`;
            }
          }
        },
        legend: {
          display: true,
          labels: {
            font: {
              size: 16
            },
            boxWidth: 25,
            usePointStyle: true,
            padding: 20
          }
        },
        datalabels: {
          color: 'white',
          font: {
            size: 14,
            weight: 'bold'
          },
          formatter: (value, context) => {
            const sum = context.chart.data.datasets[0].data.reduce((a, b) => parseFloat(a) + parseFloat(b), 0);
            const percentage = (value / sum * 100).toFixed(1);
            return percentage >= 5 ? `${percentage}%` : '';
          }
        },
        animation: {
          animateRotate: true,
          animateScale: true,
          duration: 1500,
          easing: 'easeOutBounce'
        }
      }
    },
    plugins: [ChartDataLabels]
  });
}
document.getElementById('download-pdf').addEventListener('click', function () {
  if (window.jspdf && typeof html2canvas !== 'undefined') {
    const {
      jsPDF
    } = window.jspdf;
    const doc = new jsPDF();

    // Function to get values from input fields
    function getValue(id) {
      const element = document.getElementById(id);
      return element && element.value ? element.value : 'N/A';
    }

    // Combine existing content and house flipping analysis into a single div
    const combinedDiv = document.createElement('div');
    combinedDiv.id = 'combinedContent';
    combinedDiv.style.padding = '20px';
    combinedDiv.style.backgroundColor = '#fff';
    combinedDiv.style.color = '#000';
    combinedDiv.style.width = '800px';
    combinedDiv.style.margin = 'auto';

    // Clone the original content
    const contentDiv = document.getElementById('contentPDF');
    combinedDiv.appendChild(contentDiv.cloneNode(true));

    // Create results section
    const resultsDiv = document.createElement('div');
    resultsDiv.innerHTML = `
      <h2 style="text-align:center; margin-top: 20px;">Inputs</h2>
      <table border="1" cellspacing="0" cellpadding="5" style="width:100%; text-align:left;">
        <tr><td><strong>Property Address:</strong></td><td>$${getValue('propertyAddress')}</td></tr>
        <tr><td><strong>Property Purchase Price:</strong></td><td>$${getValue('purchasePrice')}</td></tr>
        <tr><td><strong>Renovation Costs:</strong></td><td>$${getValue('renoCosts')}</td></tr>
        <tr><td><strong>Closing Costs:</strong></td><td>${getValue('closingCosts')}%</td></tr>
        <tr><td><strong>Holding Costs:</strong></td><td>$${getValue('holdingCosts')}</td></tr>
        <tr><td><strong>After Repair Value:</strong></td><td>$${getValue('afterRepairValue')}</td></tr>
        <tr><td><strong>Project Months:</strong></td><td>${getValue('projectMonths')} Months</td></tr>
        <tr><td><strong>House Monthly Rent:</strong></td><td>$${getValue('houseMonthlyRent')}</td></tr>
        <tr><td><strong>House Interest Rate:</strong></td><td>${getValue('houseinterestRate')}%</td></tr>
        <tr><td><strong>Loan Points:</strong></td><td>${getValue('loanPoints')}%</td></tr>
        <tr><td><strong>Loan Term:</strong></td><td>${getValue('houseLoanYear')} Years</td></tr>
        <tr><td><strong>Gap Costs:</strong></td><td>$${getValue('gapCosts')}</td></tr>
        <tr><td><strong>Down Payment Percent:</strong></td><td>${getValue('downPaymentPercent')}%</td></tr>
        <tr><td><strong>Resale Costs:</strong></td><td>$${getValue('resaleCosts')}</td></tr>
        <tr><td><strong>Desired Profit Margin:</strong></td><td>${getValue('desiredProfitMargin')}%</td></tr>
        <tr><td><strong>Down Payment Based On:</strong></td><td>$${getValue('downPaymentType')}</td></tr>
        <tr><td><strong>Annual Maintenance:</strong></td><td>$${getValue('houseAnnualMaintenance')}</td></tr>
        <tr><td><strong>Annual Utilities:</strong></td><td>$${getValue('houseAnnualUtilities')}</td></tr>
        <tr><td><strong>Annual Insurance:</strong></td><td>$${getValue('insurance')}</td></tr>
        <tr><td><strong>Annual Property Taxes:</strong></td><td>$${getValue('propertyTaxesHF')}</td></tr>
      </table>
    `;
    combinedDiv.appendChild(resultsDiv);
    document.body.appendChild(combinedDiv); // Append to document for rendering

    // Capture content as multiple images
    html2canvas(combinedDiv, {
      scale: 2,
      useCORS: true
    }).then(canvas => {
      const imgWidth = 190;
      const pageHeight = doc.internal.pageSize.height;
      let imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      let position = 10;
      const imgData = canvas.toDataURL('image/png');

      // Add first page
      doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight - 20;

      // Add additional pages if content overflows
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight - 20;
      }
      doc.save('house_flipping_analysis.pdf');
      combinedDiv.remove(); // Clean up temporary div
    }).catch(error => {
      console.error('Error capturing HTML content:', error);
    });
  } else {
    console.error('jsPDF or html2canvas not loaded correctly.');
  }
});
document.getElementById('download-pdf2').addEventListener('click', function () {
  if (window.jspdf && typeof html2canvas !== 'undefined') {
    const {
      jsPDF
    } = window.jspdf;
    const doc = new jsPDF();

    // Function to get values from input fields
    function getValue(id) {
      const element = document.getElementById(id);
      return element && element.value ? element.value : 'N/A';
    }

    // Combine the existing content and retirement planning analysis into a single div
    const combinedDiv = document.createElement('div');
    combinedDiv.id = 'combinedContent';
    combinedDiv.style.padding = '20px';
    combinedDiv.style.backgroundColor = '#fff';
    combinedDiv.style.color = '#000';
    combinedDiv.style.width = '800px';
    combinedDiv.style.margin = 'auto';

    // Clone the original content
    const contentDiv = document.getElementById('contentPDF2');
    combinedDiv.appendChild(contentDiv.cloneNode(true));

    // Create results section
    const resultsDiv = document.createElement('div');
    resultsDiv.innerHTML = `
      <h2 style="text-align:center; margin-top: 20px;">Retirement Planning Inputs</h2>
      <table border="1" cellspacing="0" cellpadding="5" style="width:100%; text-align:left;">
        <tr><td><strong>Current Age:</strong></td><td>${getValue('currentAge')}</td></tr>
        <tr><td><strong>Retirement Age:</strong></td><td>${getValue('retirementAge')}</td></tr>
        <tr><td><strong>Current Savings:</strong></td><td>$${getValue('currentSavings')}</td></tr>
        <tr><td><strong>Monthly Contributions:</strong></td><td>$${getValue('monthlyContributions')}</td></tr>
        <tr><td><strong>Annual Return:</strong></td><td>${getValue('annualReturn')}%</td></tr>
        <tr><td><strong>Inflation Rate:</strong></td><td>${getValue('inflationRate')}%</td></tr>
        <tr><td><strong>Desired Income:</strong></td><td>$${getValue('desiredIncome')}</td></tr>
        <tr><td><strong>Whole Life Insurance Value:</strong></td><td>$${getValue('wholeLifeInsurance')}</td></tr>
        <tr><td><strong>Monthly Contributions to Whole Life Insurance:</strong></td><td>$${getValue('lifeInsuranceMonthlyContributions')}</td></tr>
        <tr><td><strong>Current Stock Value:</strong></td><td>$${getValue('currentStockValue')}</td></tr>
        <tr><td><strong>Current Real Estate Equity:</strong></td><td>$${getValue('currentRealEstateEquity')}</td></tr>
        <tr><td><strong>Current Mortgage Balance:</strong></td><td>$${getValue('mortgageBalance')}</td></tr>
        <tr><td><strong>Mortgage Term (Years):</strong></td><td>$${getValue('mortgageTerm')}</td></tr>
        <tr><td><strong>Mortgage Interest Rate (%):</strong></td><td>$${getValue('mortgageInterestRate')}</td></tr>
      </table>
    `;
    combinedDiv.appendChild(resultsDiv);
    document.body.appendChild(combinedDiv); // Append to document for rendering

    // Capture content as multiple images
    html2canvas(combinedDiv, {
      scale: 2,
      useCORS: true
    }).then(canvas => {
      const imgWidth = 190;
      const pageHeight = doc.internal.pageSize.height;
      let imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      let position = 10;
      const imgData = canvas.toDataURL('image/png');

      // Add first page
      doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight - 20;

      // Add additional pages if content overflows
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight - 20;
      }
      doc.save('retirement_planning_calculator.pdf');
      combinedDiv.remove(); // Clean up temporary div
    }).catch(error => {
      console.error('Error capturing HTML content:', error);
    });
  } else {
    console.error('jsPDF or html2canvas not loaded correctly.');
  }
});
document.getElementById('download-pdf3').addEventListener('click', function () {
  if (window.jspdf && typeof html2canvas !== 'undefined') {
    const {
      jsPDF
    } = window.jspdf;
    const doc = new jsPDF();

    // Function to get values from input fields
    function getValue(id) {
      const element = document.getElementById(id);
      return element && element.value ? element.value : 'N/A';
    }
    const contentDiv = document.getElementById('contentPDF3'); // First page content

    // Step 1: Capture the first section (contentPDF3)
    html2canvas(contentDiv, {
      scale: 2,
      useCORS: true
    }).then(canvas => {
      const imgWidth = 190;
      const pageHeight = doc.internal.pageSize.height;
      let imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      let position = 10;
      const imgData = canvas.toDataURL('image/png');

      // Add first page content
      doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight - 20;

      // Add new pages if necessary
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight - 20;
      }
      doc.addPage(); // Move to next page for input data

      // Step 2: Create results section
      const resultsDiv = document.createElement('div');
      resultsDiv.style.padding = '20px';
      resultsDiv.style.backgroundColor = '#fff';
      resultsDiv.style.color = '#000';
      resultsDiv.style.width = '800px';
      resultsDiv.style.margin = 'auto';
      resultsDiv.innerHTML = `
        <h2 style="text-align:center; margin-top: 20px;">Rental Property Inputs</h2>
        <table border="1" cellspacing="0" cellpadding="5" style="width:100%; text-align:left;">
          <tr><td><strong>Property Price:</strong></td><td>$${getValue('propertyPrice')}</td></tr>
          <tr><td><strong>Down Payment:</strong></td><td>$${getValue('downPayment')}</td></tr>
          <tr><td><strong>Loan Term:</strong></td><td>${getValue('loanTerm')} Years</td></tr>
          <tr><td><strong>Interest Rate:</strong></td><td>${getValue('interestRate')}%</td></tr>
          <tr><td><strong>Monthly Rent:</strong></td><td>$${getValue('monthlyRent')}</td></tr>
          <tr><td><strong>Vacancy Rate:</strong></td><td>${getValue('vacancyRate')}%</td></tr>
          <tr><td><strong>Closing Cost:</strong></td><td>${getValue('closingCostsRent')}%</td></tr>
          <tr><td><strong>Property Taxes:</strong></td><td>$${getValue('propertyTaxes')}</td></tr>
          <tr><td><strong>Annual Renovations:</strong></td><td>$${getValue('renovations')}</td></tr>
          <tr><td><strong>Annual Utilities:</strong></td><td>$${getValue('utilities')}</td></tr>
          <tr><td><strong>Insurance Costs:</strong></td><td>$${getValue('insuranceCosts')}</td></tr>
          <tr><td><strong>Maintenance Costs:</strong></td><td>$${getValue('maintenanceCosts')}</td></tr>
          <tr><td><strong>Management Fees:</strong></td><td>$${getValue('managementFees')}</td></tr>
          <tr><td><strong>Property Appreciation Rate:</strong></td><td>${getValue('appreciationRate')}%</td></tr>
          <tr><td><strong>Annual Rent Growth:</strong></td><td>${getValue('rentGrowth')}%</td></tr>
        </table>
      `;
      document.body.appendChild(resultsDiv); // Append to document for rendering

      // Step 3: Capture the results section
      html2canvas(resultsDiv, {
        scale: 2,
        useCORS: true
      }).then(canvas2 => {
        const imgData2 = canvas2.toDataURL('image/png');
        const imgWidth2 = 190;
        const imgHeight2 = canvas2.height * imgWidth2 / canvas2.width;
        let heightLeft2 = imgHeight2;
        let position2 = 10;

        // Add new pages if needed
        while (heightLeft2 > 0) {
          doc.addImage(imgData2, 'PNG', 10, position2, imgWidth2, imgHeight2);
          heightLeft2 -= pageHeight - 20;
          if (heightLeft2 > 0) doc.addPage();
        }
        doc.save('rental_property_evaluation.pdf'); // Save PDF
        resultsDiv.remove(); // Clean up temporary div
      });
    }).catch(error => {
      console.error('Error capturing HTML content:', error);
    });
  } else {
    console.error('jsPDF or html2canvas not loaded correctly.');
  }
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
document.getElementById('years_tbl').addEventListener('change', function () {
  let selectedValue = this.value;
  getTableData(selectedValue);
});

// Call the function to populate the dropdown on page load
window.onload = populateYearsDropdown;
function printSpecificSection(classNames) {
  if (!Array.isArray(classNames) || classNames.length === 0) return;
  const chartContainer = document.querySelector(classNames[0]);
  const contentContainer = document.querySelector(classNames[1]);
  if (!chartContainer || !contentContainer) return;
  const canvases = chartContainer.querySelectorAll('canvas');
  setTimeout(() => {
    const tempDiv = document.createElement('div');
    const clonedContent = contentContainer.cloneNode(true);
    tempDiv.appendChild(clonedContent);
    // 1. Render canvas charts to images
    canvases.forEach(canvas => {
      const img = document.createElement('img');
      img.src = canvas.toDataURL('image/png');
      img.style.width = '100%';
      img.style.marginBottom = '20px';
      tempDiv.appendChild(img);
    });

    // 3. Open a print window
    const printWindow = window.open('', '', 'width=1000,height=800');
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Section</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            img { max-width: 100%; margin-bottom: 20px; }
            .card {
              border: 1px solid #ccc;
              padding: 15px;
              margin: 10px;
              border-radius: 10px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .result {
              font-weight: bold;
              color: #333;
              margin-top: 5px;
            }
            h1, h4 {
              color: #bfa046;
              margin: 10px 0;
            }
            .dssr {
              background: #d8c07c;
              padding: 10px;
              border-radius: 6px;
              display: inline-block;
            }
            .text-dark { color: #333; }
            .text-center { text-align: center; }
            /* Add any extra styles used in your '.retire' content */
          </style>
        </head>
        <body>
          ${tempDiv.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  }, 300);
}
function printChartsAndTable(chartClass, tableClass, summaryDivId) {
  const chartContainer = document.querySelector(chartClass);
  const tableContainer = document.querySelector(tableClass);
  const summaryDiv = document.querySelector(summaryDivId);
  if (!chartContainer || !tableContainer || !summaryDiv) return;
  const canvases = chartContainer.querySelectorAll('canvas');
  setTimeout(() => {
    const tempDiv = document.createElement('div');

    // Clone the summary section
    const summaryClone = summaryDiv.cloneNode(true);
    summaryClone.style.marginBottom = '40px';
    tempDiv.appendChild(summaryClone);

    // Add charts as images
    canvases.forEach(canvas => {
      const img = document.createElement('img');
      img.src = canvas.toDataURL('image/png');
      img.style.width = '100%';
      img.style.marginBottom = '20px';
      tempDiv.appendChild(img);
    });

    // Clone the table HTML
    const tableClone = tableContainer.cloneNode(true);
    tableClone.style.marginTop = '40px';
    tableClone.style.border = '1px solid #ccc';
    tempDiv.appendChild(tableClone);
    const printWindow = window.open('', '', 'width=1000,height=800');
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Report</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
            }
            h1, h4 {
              color: #bfa046;
              margin: 10px 0;
            }
            img {
              max-width: 100%;
              margin-bottom: 20px;
            }
            .card {
              border: 1px solid #ccc;
              padding: 15px;
              margin: 10px;
              border-radius: 10px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              padding: 10px;
              border: 1px solid #ccc;
              text-align: left;
            }
            tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            .result {
              font-weight: bold;
              color: #333;
              margin-top: 5px;
            }
            .dssr {
              background: #d8c07c;
              padding: 10px;
              border-radius: 6px;
              display: inline-block;
            }
            .text-dark {
              color: #333;
            }
            .text-center {
              text-align: center;
            }
          </style>
        </head>
        <body>
          ${tempDiv.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  }, 300);
}
function updateTableRange() {
  const selectedYear = parseInt(document.getElementById('years_tbl').value);
  const tableContainer = document.getElementById('yearlyTables');
  tableContainer.innerHTML = '';
  let years = [];
  if (selectedYear <= 1) {
    years = [0, 1, 2];
  } else if (selectedYear >= 30) {
    years = [28, 29, 30];
  } else {
    years = [selectedYear - 1, selectedYear, selectedYear + 1];
  }
  const tableData = years.map(year => getTableData(year, true)).filter(Boolean);
  if (tableData.length > 0) {
    const combinedTable = generateCombinedYearTable(tableData);
    tableContainer.appendChild(combinedTable);
  }
}
function getTableData(year) {
  let returnData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  // Get values and convert to numbers
  let propertyPrice = parseFloat(document.getElementById('propertyPrice').value.trim()) || 0;
  let downPayment = parseFloat(document.getElementById('downPayment').value.trim()) || 0;
  let loanTerm = parseFloat(document.getElementById('loanTerm').value.trim()) || 0;
  let interestRate = parseFloat(document.getElementById('interestRate').value.trim()) || 0;
  let monthlyRent = parseFloat(document.getElementById('monthlyRent').value.trim()) || 0;
  let vacancyRate = parseFloat(document.getElementById('vacancyRate').value.trim()) || 0;
  let propertyTaxes = parseFloat(document.getElementById('propertyTaxes').value.trim()) || 0;
  let insuranceCosts = parseFloat(document.getElementById('insuranceCosts').value.trim()) || 0;
  let maintenanceCosts = parseFloat(document.getElementById('maintenanceCosts').value.trim()) || 0;
  let managementFees = parseFloat(document.getElementById('managementFees').value.trim()) || 0;
  let appreciationRate = parseFloat(document.getElementById('appreciationRate').value.trim()) || 3;
  let rentIncreaseRate = 2;
  let utilities = parseFloat(document.getElementById('utilities').value.trim()) || 0;
  let renovations = parseFloat(document.getElementById('renovations').value.trim()) || 0;
  if (!year || year < 0) return;

  // Loan calculation
  let loanAmount = propertyPrice - downPayment;
  let monthlyRate = interestRate / 100 / 12;
  let numPayments = loanTerm * 12;
  let mortgagePayment = monthlyRate > 0 ? loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1) : loanAmount / numPayments;

  // Appreciation and Rent growth
  let appreciationFactor = Math.pow(1 + appreciationRate / 100, year);
  let rentFactor = Math.pow(1 + rentIncreaseRate / 100, year);
  let grossRentIncome = monthlyRent * 12 * rentFactor;
  let vacancyLoss = grossRentIncome * (vacancyRate / 100);
  let adjustedRentIncome = grossRentIncome - vacancyLoss;
  let managementCost = grossRentIncome * (managementFees / 100);

  // Operating Expenses
  let operatingExpenses = vacancyLoss + propertyTaxes + insuranceCosts + maintenanceCosts + managementCost + utilities + renovations;
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
      capitalExpenditures: 1425,
      // or dynamic later
      cashFlow: cashFlowAnnual
    };
  }

  // Update UI
  document.getElementById('year_b').innerHTML = year;
  document.getElementById('gross_rent').innerText = `$${grossRentIncome.toFixed(2)}`;
  document.getElementById('vacancy_rate').innerText = `– $${vacancyLoss.toFixed(2)}`;
  document.getElementById('operating_income').innerText = `$${adjustedRentIncome.toFixed(2)}`;
  document.getElementById('operating_expenses').innerText = `– $${operatingExpenses.toFixed(2)}`;
  document.getElementById('net_operating_income').innerText = `$${netOperatingIncome.toFixed(2)}`;
  document.getElementById('loan_payments').innerText = `– $${annualMortgagePayment.toFixed(2)}`;
  document.getElementById('cash_flow').innerText = `$${cashFlowAnnual.toFixed(2)}`;
  console.log(`Data displayed for year: ${year}`);
}

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
function generateCombinedYearTable(dataArray) {
  const dynamicCategories = ['Gross Rent', 'Vacancy', 'Operating Income', 'Operating Expenses', 'Management Fees', 'Vacancy Loss', 'Net Operating Income (NOI)', 'Loan Payments', 'Capital Expenditures', 'Cash Flow'];
  const staticExpenses = {
    'Property Taxes': parseFloat(document.getElementById('propertyTaxes').value) || 0,
    Insurance: parseFloat(document.getElementById('insuranceCosts').value) || 0,
    Maintenance: parseFloat(document.getElementById('maintenanceCosts').value) || 0,
    Utilities: parseFloat(document.getElementById('utilities').value) || 0,
    Renovations: parseFloat(document.getElementById('renovations').value) || 0
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
        ${Object.entries(staticExpenses).map(_ref => {
    let [key, val] = _ref;
    return `
          <tr><td>${key}</td><td>$${val.toFixed(2)}</td></tr>
        `;
  }).join('')}
      </tbody>
    </table>
  `;

  // 📅 Yearly Data Table (Dynamic Values)
  let dynamicTable = `
    <h5>Yearly Financials: Years ${dataArray.map(d => d.year).join(', ')}</h5>
    <table class="table table-bordered">
      <thead class="clr-bg" style="background-color: #333333; color: white;">
        <tr>
          <th>Category</th>
          ${dataArray.map(d => `<th>Year ${d.year}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
  `;
  dynamicCategories.forEach(cat => {
    dynamicTable += `<tr><td>${cat}</td>`;
    dataArray.forEach(data => {
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
          value = data.adjustedRentIncome * (parseFloat(document.getElementById('managementFees').value) || 0) / 100;
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
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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S0FBSyxHQUNGcUcsSUFBSSxDQUFDNkosa0JBQWtCLElBQ3JCeFAsVUFBVSxDQUFDdEIsUUFBUSxDQUFDdUIsY0FBYyxDQUFDLGdCQUFnQixDQUFDLENBQUNYLEtBQUssQ0FBQyxJQUMxRCxDQUFDLENBQUMsR0FDTixHQUFHO1VBQ0w7UUFDRixLQUFLLGNBQWM7VUFDakJBLEtBQUssR0FBR3FHLElBQUksQ0FBQzRKLFdBQVc7VUFDeEI7UUFDRixLQUFLLDRCQUE0QjtVQUMvQmpRLEtBQUssR0FBR3FHLElBQUksQ0FBQytTLGtCQUFrQjtVQUMvQjtRQUNGLEtBQUssZUFBZTtVQUNsQnBaLEtBQUssR0FBRyxDQUFDcUcsSUFBSSxDQUFDZ0sscUJBQXFCO1VBQ25DO1FBQ0YsS0FBSyxzQkFBc0I7VUFDekJyUSxLQUFLLEdBQUcsQ0FBQ3FHLElBQUksQ0FBQ2dULG1CQUFtQjtVQUNqQztRQUNGLEtBQUssV0FBVztVQUNkclosS0FBSyxHQUFHcUcsSUFBSSxDQUFDaVQsUUFBUTtVQUNyQjtNQUNKO01BQ0FpQixZQUFZLElBQUksUUFBUXZhLEtBQUssQ0FBQzhELE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTztJQUNqRCxDQUFDLENBQUM7SUFDRnlXLFlBQVksSUFBSSxPQUFPO0VBQ3pCLENBQUMsQ0FBQztFQUVGQSxZQUFZLElBQUksa0JBQWtCOztFQUVsQztFQUNBUixHQUFHLENBQUM5VCxTQUFTLEdBQUdzVSxZQUFZLEdBQUdMLFdBQVc7RUFDMUMsT0FBT0gsR0FBRztBQUNaLEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9maW5hbmNlLWNhbGN1bGF0b3JzLXJld29yay8uL3NyYy9jYWxjdWxhdG9yLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiAoKSB7XHJcbiAgY29uc3QgaW5wdXRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcclxuICAgICcjcHVyY2hhc2VQcmljZSwjcHJvcGVydHlBZGRyZXNzLCAjcmVub0Nvc3RzLCAjaG9sZGluZ0Nvc3RzLCNjbG9zaW5nQ29zdHMsICNhZnRlclJlcGFpclZhbHVlLCNwcm9qZWN0TW9udGhzLCNyZXNhbGVDb3N0cywjZG93blBheW1lbnRQZXJjZW50LCNnYXBDb3N0cywjbG9hblBvaW50cywjaG91c2VMb2FuWWVhciwjaG91c2VpbnRlcmVzdFJhdGUsI2hvdXNlTW9udGhseVJlbnQsI2luc3VyYW5jZSwjcHJvcGVydHlUYXhlc0hGLCNkb3duUGF5bWVudFR5cGUsI2hvdXNlQW5udWFsTWFpbnRlbmFuY2UsI2hvdXNlQW5udWFsVXRpbGl0aWVzJ1xyXG4gICk7XHJcbiAgY29uc3QgaW5wdXQyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcclxuICAgICcjY3VycmVudEFnZSwgI3JldGlyZW1lbnRBZ2UsICNjdXJyZW50U2F2aW5ncywjbGlmZUluc3VyYW5jZU1vbnRobHlDb250cmlidXRpb25zLCN3aG9sZUxpZmVJbnN1cmFuY2UsICNtb250aGx5Q29udHJpYnV0aW9ucywgI2FubnVhbFJldHVybiwjZGVzaXJlZEluY29tZSwjaW5mbGF0aW9uUmF0ZSwjY3VycmVudFJlYWxFc3RhdGVFcXVpdHksI2N1cnJlbnRTdG9ja1ZhbHVlLCNyZWFsRXN0YXRlQXBwcmVjaWF0aW9uLCNtb3J0Z2FnZUJhbGFuY2UgLCAjbW9ydGdhZ2VJbnRlcmVzdFJhdGUgLCAjbW9ydGdhZ2VUZXJtJ1xyXG4gICk7XHJcbiAgY29uc3QgaW5wdXQzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcclxuICAgICcjbWFuYWdlbWVudEZlZXMsICNtYWludGVuYW5jZUNvc3RzLCAjaW5zdXJhbmNlQ29zdHMsI3Jlbm92YXRpb25zLCN1dGlsaXRpZXMsI3JlbnRHcm93dGgsI2Nsb3NpbmdDb3N0c1JlbnQsICNwcm9wZXJ0eVRheGVzLCAjdmFjYW5jeVJhdGUsI21vbnRobHlSZW50LCNpbnRlcmVzdFJhdGUsI2xvYW5UZXJtLCNkb3duUGF5bWVudCwjcHJvcGVydHlQcmljZSwjdGltZUR1cmF0aW9uICwgI2FwcHJlY2lhdGlvblJhdGUgJ1xyXG4gICk7XHJcblxyXG4gIGlucHV0cy5mb3JFYWNoKChpbnB1dCkgPT4ge1xyXG4gICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBjYWxjdWxhdGVIb3VzZUZsaXApO1xyXG4gIH0pO1xyXG4gIGlucHV0Mi5mb3JFYWNoKChpbnB1dCkgPT4ge1xyXG4gICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBjYWxjdWxhdGVSZXRpcmVtZW50KTtcclxuICB9KTtcclxuICBpbnB1dDMuZm9yRWFjaCgoaW5wdXQpID0+IHtcclxuICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgY2FsY3VsYXRlUmVudGFsUHJvcGVydHkpO1xyXG4gIH0pO1xyXG59KTtcclxuXHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiAoKSB7XHJcbiAgY2FsY3VsYXRlSG91c2VGbGlwKCk7XHJcbiAgY2FsY3VsYXRlUmV0aXJlbWVudCgpO1xyXG4gIGNhbGN1bGF0ZVJlbnRhbFByb3BlcnR5KCk7XHJcbn0pO1xyXG5cclxuZnVuY3Rpb24gZm9ybWF0TnVtYmVyKHZhbHVlKSB7XHJcbiAgbGV0IGZvcm1hdHRlZFZhbHVlID1cclxuICAgIHZhbHVlICUgMSA9PT0gMFxyXG4gICAgICA/IE1hdGguYWJzKHZhbHVlKS50b0xvY2FsZVN0cmluZygpXHJcbiAgICAgIDogTWF0aC5hYnModmFsdWUpLnRvTG9jYWxlU3RyaW5nKHVuZGVmaW5lZCwge1xyXG4gICAgICAgICAgbWluaW11bUZyYWN0aW9uRGlnaXRzOiAyLFxyXG4gICAgICAgICAgbWF4aW11bUZyYWN0aW9uRGlnaXRzOiAyLFxyXG4gICAgICAgIH0pO1xyXG5cclxuICByZXR1cm4gdmFsdWUgPCAwID8gYC0gJCR7Zm9ybWF0dGVkVmFsdWV9YCA6IGAkJHtmb3JtYXR0ZWRWYWx1ZX1gO1xyXG59XHJcbmZ1bmN0aW9uIGZvcm1hdE51bWJlclBlcmNlbnQodmFsdWUpIHtcclxuICByZXR1cm4gdmFsdWUgJSAxID09PSAwXHJcbiAgICA/IHZhbHVlLnRvTG9jYWxlU3RyaW5nKClcclxuICAgIDogdmFsdWUudG9Mb2NhbGVTdHJpbmcodW5kZWZpbmVkLCB7XHJcbiAgICAgICAgbWluaW11bUZyYWN0aW9uRGlnaXRzOiAyLFxyXG4gICAgICAgIG1heGltdW1GcmFjdGlvbkRpZ2l0czogMixcclxuICAgICAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNhbGN1bGF0ZUhvdXNlRmxpcCgpIHtcclxuICBsZXQgcHVyY2hhc2UgPVxyXG4gICAgcGFyc2VGbG9hdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncHVyY2hhc2VQcmljZScpLnZhbHVlKSB8fCAwO1xyXG4gIGxldCByZW5vID0gcGFyc2VGbG9hdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVub0Nvc3RzJykudmFsdWUpIHx8IDA7XHJcbiAgbGV0IGhvbGRpbmcgPSBwYXJzZUZsb2F0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdob2xkaW5nQ29zdHMnKS52YWx1ZSkgfHwgMDtcclxuICBsZXQgYXJ2ID0gcGFyc2VGbG9hdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWZ0ZXJSZXBhaXJWYWx1ZScpLnZhbHVlKSB8fCAwO1xyXG4gIGxldCBkZXNpcmVkUHJvZml0TWFyZ2luID1cclxuICAgIHBhcnNlRmxvYXQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Rlc2lyZWRQcm9maXRNYXJnaW4nKS52YWx1ZSkgfHwgMDtcclxuICAvLyBMb2FuICYgR2FwIEZpZWxkc1xyXG4gIGxldCBpbnRlcmVzdFJhdGUgPVxyXG4gICAgcGFyc2VGbG9hdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaG91c2VpbnRlcmVzdFJhdGUnKS52YWx1ZSkgfHwgMDtcclxuICBsZXQgbG9hblBvaW50cyA9IHBhcnNlRmxvYXQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xvYW5Qb2ludHMnKS52YWx1ZSkgfHwgMDtcclxuICBsZXQgdGVybVllYXJzID1cclxuICAgIHBhcnNlRmxvYXQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2hvdXNlTG9hblllYXInKS52YWx1ZSkgfHwgMDtcclxuICBsZXQgdG90YWxQYXltZW50cyA9IHRlcm1ZZWFycyAqIDEyO1xyXG4gIGxldCBnYXBGdW5kaW5nUmF0ZSA9XHJcbiAgICBwYXJzZUZsb2F0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnYXBDb3N0cycpLnZhbHVlKSB8fCAwO1xyXG4gIC8vIEFkZGl0aW9uYWwgRmllbGRzXHJcbiAgbGV0IGRvd25QYXltZW50UGVyY2VudCA9XHJcbiAgICBwYXJzZUZsb2F0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkb3duUGF5bWVudFBlcmNlbnQnKS52YWx1ZSkgfHwgMDtcclxuICAvLyBsZXQgY29tbWlzc2lvblBlcmNlbnQgPSBwYXJzZUZsb2F0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29tbWlzc2lvblBlcmNlbnRcIikudmFsdWUpIHx8IDA7XHJcbiAgbGV0IHJlc2FsZUNvc3RQZXJjZW50ID1cclxuICAgIHBhcnNlRmxvYXQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc2FsZUNvc3RzJykudmFsdWUpIHx8IDA7XHJcbiAgbGV0IHJlc2FsZUNvc3RzID0gKGFydiAqIHJlc2FsZUNvc3RQZXJjZW50KSAvIDEwMDtcclxuICBsZXQgYWRkcmVzcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwcm9wZXJ0eUFkZHJlc3MnKS52YWx1ZTtcclxuICBsZXQgbW9udGhzID0gcGFyc2VGbG9hdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncHJvamVjdE1vbnRocycpLnZhbHVlKSB8fCAwO1xyXG4gIGxldCBtb250aGx5UmVudCA9XHJcbiAgICBwYXJzZUZsb2F0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdob3VzZU1vbnRobHlSZW50JykudmFsdWUpIHx8IDA7XHJcbiAgbGV0IGFubnVhbFByb3BlcnR5VGF4ZXMgPVxyXG4gICAgcGFyc2VGbG9hdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncHJvcGVydHlUYXhlc0hGJykudmFsdWUpIHx8IDA7XHJcbiAgbGV0IGFubnVhbEluc3VyYW5jZSA9XHJcbiAgICBwYXJzZUZsb2F0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbnN1cmFuY2UnKS52YWx1ZSkgfHwgMDtcclxuICBsZXQgYW5udWFsTWFpbnRlbmFuY2UgPVxyXG4gICAgcGFyc2VGbG9hdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaG91c2VBbm51YWxNYWludGVuYW5jZScpLnZhbHVlKSB8fCAwO1xyXG4gIGxldCBhbm51YWxVdGlsaXRpZXMgPVxyXG4gICAgcGFyc2VGbG9hdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaG91c2VBbm51YWxVdGlsaXRpZXMnKS52YWx1ZSkgfHwgMDtcclxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaG91c2VjaGFydHMnKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcclxuXHJcbiAgbGV0IGRvd25QYXltZW50VHlwZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkb3duUGF5bWVudFR5cGUnKS52YWx1ZTtcclxuXHJcbiAgbGV0IGRvd25QYXltZW50QmFzZSA9XHJcbiAgICBkb3duUGF5bWVudFR5cGUgPT09ICdwdXJjaGFzZUFuZFJlbm8nID8gcHVyY2hhc2UgKyByZW5vIDogcHVyY2hhc2U7XHJcbiAgbGV0IGNsb3NpbmdQZXJjZW50ID1cclxuICAgIHBhcnNlRmxvYXQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Nsb3NpbmdDb3N0cycpLnZhbHVlKSB8fCAwO1xyXG4gIGxldCBjbG9zaW5nID0gKGRvd25QYXltZW50QmFzZSAqIGNsb3NpbmdQZXJjZW50KSAvIDEwMDtcclxuICBsZXQgZG93blBheW1lbnQgPSAoZG93blBheW1lbnRCYXNlICogZG93blBheW1lbnRQZXJjZW50KSAvIDEwMDtcclxuICBsZXQgbW9udGhseVJhdGUgPSBpbnRlcmVzdFJhdGUgLyAxMDAgLyAxMjtcclxuICBsZXQgbG9hbkFtb3VudCA9XHJcbiAgICBkb3duUGF5bWVudFR5cGUgPT09ICdwdXJjaGFzZUFuZFJlbm8nXHJcbiAgICAgID8gcHVyY2hhc2UgKyByZW5vIC0gZG93blBheW1lbnRcclxuICAgICAgOiBwdXJjaGFzZSAtIGRvd25QYXltZW50O1xyXG4gIGxldCBwcm9yYXRlZE1haW50ZW5hbmNlID0gKGFubnVhbE1haW50ZW5hbmNlIC8gMTIpICogbW9udGhzO1xyXG4gIGxldCBwcm9yYXRlZFV0aWxpdGllcyA9IChhbm51YWxVdGlsaXRpZXMgLyAxMikgKiBtb250aHM7XHJcblxyXG4gIC8vIGxldCBsb2FuSW50ZXJlc3QgPSAobG9hbkFtb3VudCAqIChpbnRlcmVzdFJhdGUgLyAxMDApKSAqIChtb250aHMgLyAxMik7XHJcbiAgbGV0IGxvYW5GZWVzID0gKGxvYW5BbW91bnQgKiBsb2FuUG9pbnRzKSAvIDEwMDtcclxuICBsZXQgcHJvcmF0ZWRUYXhlcyA9IChhbm51YWxQcm9wZXJ0eVRheGVzIC8gMTIpICogbW9udGhzO1xyXG4gIGxldCBwcm9yYXRlZEluc3VyYW5jZSA9IChhbm51YWxJbnN1cmFuY2UgLyAxMikgKiBtb250aHM7XHJcbiAgbGV0IG1vbnRobHlNb3J0Z2FnZVBheW1lbnQgPVxyXG4gICAgdGVybVllYXJzID4gMFxyXG4gICAgICA/IChsb2FuQW1vdW50ICogbW9udGhseVJhdGUpIC9cclxuICAgICAgICAoMSAtIE1hdGgucG93KDEgKyBtb250aGx5UmF0ZSwgLXRvdGFsUGF5bWVudHMpKVxyXG4gICAgICA6IDA7XHJcbiAgbGV0IHRvdGFsTW9ydGdhZ2VQYWlkID0gbW9udGhseU1vcnRnYWdlUGF5bWVudCAqIG1vbnRocztcclxuICBsZXQgcHJpbmNpcGFsUGFpZCA9IDA7XHJcbiAgbGV0IGludGVyZXN0UGFpZCA9IHRvdGFsTW9ydGdhZ2VQYWlkO1xyXG4gIGxvYW5JbnRlcmVzdCA9IGludGVyZXN0UGFpZDtcclxuICBsZXQgdG90YWxQcm9qZWN0Q29zdCA9XHJcbiAgICBwdXJjaGFzZSArXHJcbiAgICByZW5vICtcclxuICAgIGhvbGRpbmcgK1xyXG4gICAgY2xvc2luZyArXHJcbiAgICByZXNhbGVDb3N0cyArXHJcbiAgICBsb2FuSW50ZXJlc3QgK1xyXG4gICAgbG9hbkZlZXMgK1xyXG4gICAgcHJvcmF0ZWRUYXhlcyArXHJcbiAgICBwcm9yYXRlZEluc3VyYW5jZTtcclxuICAvLyAqKkNvcnJlY3RlZCBJbnZlc3RtZW50IENhbGN1bGF0aW9uKipcclxuICBsZXQgZ2FwQ29zdHMgPSB0b3RhbFByb2plY3RDb3N0IC0gKGxvYW5BbW91bnQgKyBkb3duUGF5bWVudCk7XHJcbiAgbGV0IGdhcEZ1bmRpbmdGZWVzID0gZ2FwQ29zdHMgPiAwID8gKGdhcENvc3RzICogZ2FwRnVuZGluZ1JhdGUpIC8gMTAwIDogMDtcclxuXHJcbiAgbGV0IHRvdGFsSW52ZXN0bWVudCA9XHJcbiAgICBwdXJjaGFzZSArXHJcbiAgICByZW5vICtcclxuICAgIGhvbGRpbmcgK1xyXG4gICAgY2xvc2luZyArXHJcbiAgICBsb2FuSW50ZXJlc3QgK1xyXG4gICAgbG9hbkZlZXMgK1xyXG4gICAgZ2FwRnVuZGluZ0ZlZXMgK1xyXG4gICAgcHJvcmF0ZWRUYXhlcyArXHJcbiAgICBwcm9yYXRlZEluc3VyYW5jZTtcclxuXHJcbiAgbGV0IHRvdGFsQ2FzaEludmVzdGVkID1cclxuICAgIGRvd25QYXltZW50QmFzZSArXHJcbiAgICBob2xkaW5nICtcclxuICAgIGNsb3NpbmcgK1xyXG4gICAgcmVzYWxlQ29zdHMgK1xyXG4gICAgcHJvcmF0ZWRUYXhlcyArXHJcbiAgICBwcm9yYXRlZEluc3VyYW5jZTtcclxuICAvLyDinIUgUHJvZml0IENhbGN1bGF0aW9uXHJcbiAgbGV0IGdyb3NzUHJvZml0ID0gYXJ2IC0gcHVyY2hhc2U7XHJcbiAgbGV0IG5ldFByb2ZpdCA9IGFydiAtIHRvdGFsSW52ZXN0bWVudDtcclxuXHJcbiAgLy8g4pyFIFByb2ZpdCBNYXJnaW4gJiBDYXNoLW9uLUNhc2ggUmV0dXJuXHJcbiAgbGV0IHByb2ZpdE1hcmdpbiA9IGFydiA+IDAgPyAobmV0UHJvZml0IC8gYXJ2KSAqIDEwMCA6IDA7XHJcbiAgbGV0IGNhc2hPbkNhc2hSZXR1cm4gPVxyXG4gICAgdG90YWxDYXNoSW52ZXN0ZWQgPiAwID8gKG5ldFByb2ZpdCAvIHRvdGFsQ2FzaEludmVzdGVkKSAqIDEwMCA6IDA7XHJcblxyXG4gIC8vIOKchSBCcmVhay1ldmVuIFllYXJzIENhbGN1bGF0aW9uXHJcbiAgbGV0IG1vbnRobHlSZW50YWxQcm9maXQgPSAoYXJ2ICogMC4wMSAtIGhvbGRpbmcgLyBtb250aHMpLnRvRml4ZWQoMik7XHJcbiAgbGV0IGJyZWFrRXZlblllYXJzID1cclxuICAgIG1vbnRobHlSZW50YWxQcm9maXQgPiAwXHJcbiAgICAgID8gKG5ldFByb2ZpdCAvIChtb250aGx5UmVudGFsUHJvZml0ICogMTIpKS50b0ZpeGVkKDIpXHJcbiAgICAgIDogJ04vQSc7XHJcblxyXG4gIGxldCB0b3RhbEhvbGRpbmdFeHBlbnNlcyA9XHJcbiAgICBob2xkaW5nICtcclxuICAgIHByb3JhdGVkVGF4ZXMgK1xyXG4gICAgcHJvcmF0ZWRJbnN1cmFuY2UgK1xyXG4gICAgcHJvcmF0ZWRNYWludGVuYW5jZSArXHJcbiAgICBwcm9yYXRlZFV0aWxpdGllcyArXHJcbiAgICBsb2FuSW50ZXJlc3QgK1xyXG4gICAgbG9hbkZlZXMgK1xyXG4gICAgZ2FwRnVuZGluZ0ZlZXM7XHJcblxyXG4gIGxldCBtb250aGx5SG9sZGluZ0Nvc3QgPVxyXG4gICAgbW9udGhzID4gMCA/ICh0b3RhbEhvbGRpbmdFeHBlbnNlcyAvIG1vbnRocykudG9GaXhlZCgyKSA6IDA7XHJcblxyXG4gIC8vIOKchSBGbGlwcGluZyB2cy4gUmVudGFsIEFuYWx5c2lzXHJcbiAgbGV0IHJlbnRhbFZzRmxpcCA9XHJcbiAgICBuZXRQcm9maXQgPiAwICYmIG1vbnRobHlSZW50ID4gMFxyXG4gICAgICA/IChuZXRQcm9maXQgLyAobW9udGhseVJlbnQgKiAxMikpLnRvRml4ZWQoMilcclxuICAgICAgOiAnTi9BJztcclxuICAvLyDinIUgUHJvZml0IE1pbiAlIGFuZCAkIENhbGN1bGF0aW9uXHJcbiAgbGV0IHByb2ZpdE1pblBlcmNlbnQgPSAocHJvZml0TWFyZ2luICogMC44KS50b0ZpeGVkKDIpOyAvLyBBc3N1bWluZyA4MCUgb2YgcHJvZml0IG1hcmdpbiBhcyBtaW5cclxuICBsZXQgcHJvZml0TWluRG9sbGFyID0gKG5ldFByb2ZpdCAqIDAuOCkudG9GaXhlZCgyKTsgLy8gODAlIG9mIHRoZSBuZXQgcHJvZml0IGFzIG1pblxyXG4gIGxldCBwcm9qZWN0aW9uID0gKG5ldFByb2ZpdCAqIDAuOSkudG9GaXhlZCgyKTsgLy8gUHJvamVjdGlvbiBhdCA5MCUgb2YgdGhlIG5ldCBwcm9maXRcclxuXHJcbiAgLy8g4pyFIERlYWw/IExvZ2ljXHJcbiAgbGV0IGRlYWwgPSBwcm9maXRNYXJnaW4gPj0gMTAgJiYgbmV0UHJvZml0ID4gMCA/ICdZRVMnIDogJ05PJztcclxuICBsZXQgcmVxdWlyZWRBUlYgPVxyXG4gICAgZGVzaXJlZFByb2ZpdE1hcmdpbiA+IDBcclxuICAgICAgPyB0b3RhbEludmVzdG1lbnQgLyAoMSAtIGRlc2lyZWRQcm9maXRNYXJnaW4gLyAxMDApXHJcbiAgICAgIDogMDtcclxuICBsZXQgdG90YWxJbnZlc3RtZW50RXhjbHVkaW5nUHVyY2hhc2UgPVxyXG4gICAgcmVubyArXHJcbiAgICBob2xkaW5nICtcclxuICAgIGxvYW5JbnRlcmVzdCArXHJcbiAgICBsb2FuRmVlcyArXHJcbiAgICBnYXBGdW5kaW5nRmVlcyArXHJcbiAgICBwcm9yYXRlZFRheGVzICtcclxuICAgIHByb3JhdGVkSW5zdXJhbmNlO1xyXG5cclxuICBsZXQgdGFyZ2V0TmV0UHJvZml0ID1cclxuICAgICh0b3RhbEludmVzdG1lbnRFeGNsdWRpbmdQdXJjaGFzZSArIHB1cmNoYXNlKSAqIChkZXNpcmVkUHJvZml0TWFyZ2luIC8gMTAwKTtcclxuXHJcbiAgLy8gQnV0IHNpbmNlIHdlIHdhbnQgdG8gc29sdmUgZm9yIHB1cmNoYXNlIChtYXhQdXJjaGFzZVByaWNlKSwgd2UgbmVlZCB0byByZXN0cnVjdHVyZTpcclxuICBsZXQgYWxsT3RoZXJDb3N0cyA9XHJcbiAgICByZW5vICtcclxuICAgIGhvbGRpbmcgK1xyXG4gICAgY2xvc2luZyArXHJcbiAgICByZXNhbGVDb3N0cyArXHJcbiAgICBsb2FuSW50ZXJlc3QgK1xyXG4gICAgbG9hbkZlZXMgK1xyXG4gICAgZ2FwRnVuZGluZ0ZlZXMgK1xyXG4gICAgcHJvcmF0ZWRUYXhlcyArXHJcbiAgICBwcm9yYXRlZEluc3VyYW5jZTtcclxuXHJcbiAgbGV0IG1heFB1cmNoYXNlUHJpY2UgPVxyXG4gICAgKGFydiAtIGFsbE90aGVyQ29zdHMpIC8gKDEgKyBkZXNpcmVkUHJvZml0TWFyZ2luIC8gMTAwKTtcclxuXHJcbiAgLy8g4pyFIERpc3BsYXkgUmVzdWx0c1xyXG4gIC8vIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ3Jvc3NQcm9maXRcIikuaW5uZXJUZXh0ID0gZm9ybWF0TnVtYmVyKGdyb3NzUHJvZml0KTtcclxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndG90YWxJbnZlc3RtZW50JykuaW5uZXJUZXh0ID1cclxuICAgIGZvcm1hdE51bWJlcih0b3RhbEludmVzdG1lbnQpO1xyXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduZXRQcm9maXQnKS5pbm5lclRleHQgPSBmb3JtYXROdW1iZXIobmV0UHJvZml0KTtcclxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndG90YWxDYXNoSW52ZXN0ZWQnKS5pbm5lclRleHQgPVxyXG4gICAgZm9ybWF0TnVtYmVyKHRvdGFsQ2FzaEludmVzdGVkKTtcclxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncHJvZml0TWFyZ2luJykuaW5uZXJUZXh0ID1cclxuICAgIGZvcm1hdE51bWJlclBlcmNlbnQocHJvZml0TWFyZ2luKSArICclJztcclxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FzaE9uQ2FzaFJldHVybicpLmlubmVyVGV4dCA9XHJcbiAgICBmb3JtYXROdW1iZXJQZXJjZW50KGNhc2hPbkNhc2hSZXR1cm4pICsgJyUnO1xyXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdicmVha0V2ZW5ZZWFycycpLmlubmVyVGV4dCA9IGJyZWFrRXZlblllYXJzO1xyXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZW50YWxWc0ZsaXAnKS5pbm5lclRleHQgPVxyXG4gICAgcmVudGFsVnNGbGlwICE9PSAnTi9BJ1xyXG4gICAgICA/IGAke3JlbnRhbFZzRmxpcH0geWVhcnMgdG8gbWF0Y2ggZmxpcCBwcm9maXQgd2l0aCByZW50YWwgaW5jb21lLmBcclxuICAgICAgOiAnTi9BJztcclxuICAvLyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInByb2ZpdE1pblBlcmNlbnRcIikuaW5uZXJUZXh0ID0gYCR7cHJvZml0TWluUGVyY2VudH0lYDtcclxuICAvLyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInByb2ZpdE1pbkRvbGxhclwiKS5pbm5lclRleHQgPSBgJHtmb3JtYXROdW1iZXIocHJvZml0TWluRG9sbGFyKX1gO1xyXG4gIC8vIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHJvamVjdGlvblwiKS5pbm5lclRleHQgPSBgJHtmb3JtYXROdW1iZXIocHJvamVjdGlvbil9YDtcclxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGVhbFN0YXR1cycpLmlubmVyVGV4dCA9IGRlYWw7XHJcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vbnRobHlIb2xkaW5nQ29zdCcpLmlubmVyVGV4dCA9IGAke2Zvcm1hdE51bWJlcihcclxuICAgIG1vbnRobHlIb2xkaW5nQ29zdFxyXG4gICl9YDtcclxuICAvLyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInByb3JhdGVkVGF4ZXNcIikuaW5uZXJUZXh0ID0gZm9ybWF0TnVtYmVyKHByb3JhdGVkVGF4ZXMpO1xyXG4gIC8vIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHJvcmF0ZWRJbnN1cmFuY2VcIikuaW5uZXJUZXh0ID0gZm9ybWF0TnVtYmVyKHByb3JhdGVkSW5zdXJhbmNlKTtcclxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGlzcGxheWVkQWRkcmVzcycpLmlubmVyVGV4dCA9IGFkZHJlc3NcclxuICAgID8gYPCfk40gJHthZGRyZXNzfWBcclxuICAgIDogJyc7XHJcbiAgaWYgKGdhcEZ1bmRpbmdSYXRlID4gMCkge1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhbGN1bGF0ZWRHYXBDb3N0JykuaW5uZXJUZXh0ID1cclxuICAgICAgZm9ybWF0TnVtYmVyKGdhcEZ1bmRpbmdGZWVzKTtcclxuICB9XHJcbiAgLy8gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZXF1aXJlZEFSVlwiKS5pbm5lclRleHQgPSBmb3JtYXROdW1iZXIocmVxdWlyZWRBUlYpO1xyXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXhQdXJjaGFzZVByaWNlJykuaW5uZXJUZXh0ID1cclxuICAgIGZvcm1hdE51bWJlcihtYXhQdXJjaGFzZVByaWNlKTtcclxuXHJcbiAgLy8g4pyFIENvbG9yIENvZGUgQ2FyZHNcclxuICAvLyBsZXQgZ3Jvc3NQcm9maXRDYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5ncm9zc1Byb2ZpdGNhcmRcIik7XHJcbiAgLy8gZ3Jvc3NQcm9maXRDYXJkLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGdyb3NzUHJvZml0ID49IDAgPyBcIiNkMGI4NzBcIiA6IFwiI2Y4NmQ2ZFwiO1xyXG4gIC8vIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZ3Jvc3Nwcm9cIikuc3R5bGUuY29sb3IgPSBncm9zc1Byb2ZpdCA+PSAwID8gXCJibGFja1wiIDogXCIjZDBiODcwXCI7XHJcblxyXG4gIGxldCBuZXRQcm9maXRFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduZXRQcm9maXQnKTtcclxuICBsZXQgbmV0cHJvY2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5uZXRwcm9jYXJkJyk7XHJcbiAgbGV0IG5ldHByb2NhcmRoZWFkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm5ldHByb2NhcmRoZWFkJyk7XHJcbiAgbmV0UHJvZml0RWwuc3R5bGUuY29sb3IgPSBuZXRQcm9maXQgPiAwID8gJ2JsYWNrJyA6ICdibGFjayc7IC8vIGdvbGQgaWYgcHJvZml0LCByZWQgaWYgbG9zc1xyXG4gIG5ldHByb2NhcmRoZWFkLnN0eWxlLmNvbG9yID0gbmV0UHJvZml0ID4gMCA/ICdibGFjaycgOiAnI2QwYjg3MCc7IC8vIGdvbGQgaWYgcHJvZml0LCByZWQgaWYgbG9zc1xyXG4gIG5ldHByb2NhcmQuc3R5bGUuYmFja2dyb3VuZCA9IG5ldFByb2ZpdCA+IDAgPyAnI2QwYjg3MCcgOiAnI2Y4NmQ2ZCc7XHJcblxyXG4gIGxldCBwcm9maXRNYXJnaW5FbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwcm9maXRNYXJnaW4nKTtcclxuICBsZXQgcHJvbWFyY2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wcm9tYXJjYXJkJyk7XHJcbiAgbGV0IHByb21hcmNhcmRoZWFkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnByb21hcmNhcmRoZWFkJyk7XHJcbiAgcHJvZml0TWFyZ2luRWwuc3R5bGUuY29sb3IgPVxyXG4gICAgcHJvZml0TWFyZ2luID49IGRlc2lyZWRQcm9maXRNYXJnaW4gPyAnYmxhY2snIDogJ2JsYWNrJztcclxuICBwcm9tYXJjYXJkaGVhZC5zdHlsZS5jb2xvciA9XHJcbiAgICBwcm9maXRNYXJnaW4gPj0gZGVzaXJlZFByb2ZpdE1hcmdpbiA/ICdibGFjaycgOiAnI2QwYjg3MCc7IC8vIGdvbGQgaWYgcHJvZml0LCByZWQgaWYgbG9zc1xyXG4gIHByb21hcmNhcmQuc3R5bGUuYmFja2dyb3VuZCA9XHJcbiAgICBwcm9maXRNYXJnaW4gPj0gZGVzaXJlZFByb2ZpdE1hcmdpbiA/ICcjZDBiODcwJyA6ICcjZjg2ZDZkJztcclxuXHJcbiAgbGV0IHJlbnRhbFZzRmxpcEVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3JlbnRhbFZzRmxpcCcpO1xyXG4gIGxldCBydmZjYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnJ2ZmNhcmQnKTtcclxuICBsZXQgcnZmY2FyZGhlYWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucnZmY2FyZGhlYWQnKTtcclxuICByZW50YWxWc0ZsaXBFbC5zdHlsZS5jb2xvciA9XHJcbiAgICByZW50YWxWc0ZsaXAgIT09ICdOL0EnICYmIHJlbnRhbFZzRmxpcCA8IDUgPyAnYmxhY2snIDogJ2JsYWNrJztcclxuICBydmZjYXJkaGVhZC5zdHlsZS5jb2xvciA9XHJcbiAgICByZW50YWxWc0ZsaXAgIT09ICdOL0EnICYmIHJlbnRhbFZzRmxpcCA8IDUgPyAnYmxhY2snIDogJyNkMGI4NzAnOyAvLyBnb2xkIGlmIHByb2ZpdCwgcmVkIGlmIGxvc3NcclxuICBydmZjYXJkLnN0eWxlLmJhY2tncm91bmQgPVxyXG4gICAgcmVudGFsVnNGbGlwICE9PSAnTi9BJyAmJiByZW50YWxWc0ZsaXAgPCA1ID8gJyNkMGI4NzAnIDogJyNmODZkNmQnO1xyXG5cclxuICBsZXQgZGVhbENhcmRkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmRlYWxDYXJkZCcpO1xyXG4gIGxldCBkZWFsQ2FyZGRoZWFkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmRlYWxDYXJkZGhlYWQnKTtcclxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGVhbFN0YXR1cycpLnN0eWxlLmNvbG9yID1cclxuICAgIGRlYWwgPT09ICdZRVMnID8gJ2JsYWNrJyA6ICdibGFjayc7XHJcbiAgZGVhbENhcmRkaGVhZC5zdHlsZS5jb2xvciA9XHJcbiAgICByZW50YWxWc0ZsaXAgIT09ICdOL0EnICYmIHJlbnRhbFZzRmxpcCA8IDUgPyAnYmxhY2snIDogJyNkMGI4NzAnOyAvLyBnb2xkIGlmIHByb2ZpdCwgcmVkIGlmIGxvc3NcclxuICBkZWFsQ2FyZGQuc3R5bGUuYmFja2dyb3VuZCA9XHJcbiAgICByZW50YWxWc0ZsaXAgIT09ICdOL0EnICYmIHJlbnRhbFZzRmxpcCA8IDUgPyAnI2QwYjg3MCcgOiAnI2Y4NmQ2ZCc7XHJcbiAgLy8g4pyFIFJlc2V0IENoYXJ0cyBCZWZvcmUgUmVuZGVyaW5nXHJcbiAgcmVzZXRDYW52YXMoJ3Byb2plY3RDb3N0QnJlYWtkb3duQ2hhcnQnKTtcclxuICByZXNldENhbnZhcygnYXJ2RGlzdHJpYnV0aW9uQ2hhcnQnKTtcclxuXHJcbiAgY3JlYXRlUHJvamVjdENvc3RCcmVha2Rvd25DaGFydCh7XHJcbiAgICBwdXJjaGFzZSxcclxuICAgIHJlbm8sXHJcbiAgICBob2xkaW5nLFxyXG4gICAgbG9hbkludGVyZXN0LFxyXG4gICAgbG9hbkZlZXMsXHJcbiAgICByZXNhbGVDb3N0cyxcclxuICAgIGNsb3NpbmcsXHJcbiAgICBwcm9yYXRlZFRheGVzLFxyXG4gICAgcHJvcmF0ZWRJbnN1cmFuY2UsXHJcbiAgfSk7XHJcbiAgY3JlYXRlQVJWRGlzdHJpYnV0aW9uQ2hhcnQoe1xyXG4gICAgaW52ZXN0bWVudDogdG90YWxJbnZlc3RtZW50LFxyXG4gICAgcmVzYWxlQ29zdHMsXHJcbiAgICBuZXRQcm9maXQsXHJcbiAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlc2V0Q2FudmFzKGlkKSB7XHJcbiAgbGV0IGNhbnZhc1dyYXBwZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCkucGFyZW50Tm9kZTtcclxuICBjYW52YXNXcmFwcGVyLmlubmVySFRNTCA9IGA8Y2FudmFzIGlkPVwiJHtpZH1cIj48L2NhbnZhcz5gO1xyXG59XHJcblxyXG5DaGFydC5yZWdpc3RlcihDaGFydERhdGFMYWJlbHMpO1xyXG5cclxuZnVuY3Rpb24gY3JlYXRlUHJvamVjdENvc3RCcmVha2Rvd25DaGFydChkYXRhKSB7XHJcbiAgY29uc3QgY3R4ID0gZG9jdW1lbnRcclxuICAgIC5nZXRFbGVtZW50QnlJZCgncHJvamVjdENvc3RCcmVha2Rvd25DaGFydCcpXHJcbiAgICAuZ2V0Q29udGV4dCgnMmQnKTtcclxuXHJcbiAgLy8gQ29tYmluZSBob2xkaW5nLXJlbGF0ZWQgY29zdHMgaW50byBvbmVcclxuICBjb25zdCBjb21iaW5lZEhvbGRpbmcgPVxyXG4gICAgZGF0YS5ob2xkaW5nICtcclxuICAgIGRhdGEubG9hbkludGVyZXN0ICtcclxuICAgIGRhdGEucHJvcmF0ZWRUYXhlcyArXHJcbiAgICBkYXRhLnByb3JhdGVkSW5zdXJhbmNlO1xyXG5cclxuICBjb25zdCBsYWJlbHMgPSBbXHJcbiAgICAnUHVyY2hhc2UnLFxyXG4gICAgJ1Jlbm92YXRpb24nLFxyXG4gICAgJ0hvbGRpbmcgKGluY2wuIGludGVyZXN0LCB0YXhlcywgaW5zdXJhbmNlKScsXHJcbiAgICAnTG9hbiBGZWVzJyxcclxuICAgICdSZXNhbGUgQ29zdHMnLFxyXG4gICAgJ0Nsb3NpbmcgQ29zdHMnLFxyXG4gIF07XHJcblxyXG4gIGNvbnN0IHZhbHVlcyA9IFtcclxuICAgIGRhdGEucHVyY2hhc2UsXHJcbiAgICBkYXRhLnJlbm8sXHJcbiAgICBjb21iaW5lZEhvbGRpbmcsXHJcbiAgICBkYXRhLmxvYW5GZWVzLFxyXG4gICAgZGF0YS5yZXNhbGVDb3N0cyxcclxuICAgIGRhdGEuY2xvc2luZyxcclxuICBdO1xyXG5cclxuICBjb25zdCB0b3RhbCA9IHZhbHVlcy5yZWR1Y2UoKGEsIGIpID0+IGEgKyBiLCAwKTtcclxuXHJcbiAgbmV3IENoYXJ0KGN0eCwge1xyXG4gICAgdHlwZTogJ2RvdWdobnV0JyxcclxuICAgIGRhdGE6IHtcclxuICAgICAgbGFiZWxzOiBsYWJlbHMsXHJcbiAgICAgIGRhdGFzZXRzOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgZGF0YTogdmFsdWVzLFxyXG4gICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBbXHJcbiAgICAgICAgICAgICcjRjM5NjU1JyxcclxuICAgICAgICAgICAgJyNCNzdDRTknLFxyXG4gICAgICAgICAgICAnIzU1Q0JFNScsXHJcbiAgICAgICAgICAgICcjZTc0YzNjJyxcclxuICAgICAgICAgICAgJyMxYWJjOWMnLFxyXG4gICAgICAgICAgICAnI2U2N2UyMicsXHJcbiAgICAgICAgICBdLFxyXG4gICAgICAgICAgYm9yZGVyQ29sb3I6ICcjZmZmZmZmJyxcclxuICAgICAgICAgIGJvcmRlcldpZHRoOiA0LFxyXG4gICAgICAgICAgaG92ZXJPZmZzZXQ6IDIwLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIF0sXHJcbiAgICB9LFxyXG4gICAgb3B0aW9uczoge1xyXG4gICAgICByZXNwb25zaXZlOiB0cnVlLFxyXG4gICAgICBjdXRvdXQ6ICcwJScsXHJcbiAgICAgIHBsdWdpbnM6IHtcclxuICAgICAgICBkYXRhbGFiZWxzOiB7XHJcbiAgICAgICAgICBjb2xvcjogJyNmZmZmZmYnLFxyXG4gICAgICAgICAgZm9udDoge1xyXG4gICAgICAgICAgICB3ZWlnaHQ6ICdib2xkJyxcclxuICAgICAgICAgICAgc2l6ZTogMTQsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgZm9ybWF0dGVyOiAodmFsdWUsIGNvbnRleHQpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgcGVyY2VudGFnZSA9ICh2YWx1ZSAvIHRvdGFsKSAqIDEwMDtcclxuICAgICAgICAgICAgcmV0dXJuIGAke3BlcmNlbnRhZ2UudG9GaXhlZCgxKX0lYDtcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBkaXNwbGF5OiBmdW5jdGlvbiAoY29udGV4dCkge1xyXG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IGNvbnRleHQuZGF0YXNldC5kYXRhW2NvbnRleHQuZGF0YUluZGV4XTtcclxuICAgICAgICAgICAgY29uc3QgcGVyY2VudGFnZSA9ICh2YWx1ZSAvIHRvdGFsKSAqIDEwMDtcclxuICAgICAgICAgICAgcmV0dXJuIHBlcmNlbnRhZ2UgPj0gNTtcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgICB0aXRsZToge1xyXG4gICAgICAgICAgZGlzcGxheTogdHJ1ZSxcclxuICAgICAgICAgIHRleHQ6ICdQcm9qZWN0IENvc3QgQnJlYWtkb3duJyxcclxuICAgICAgICAgIGZvbnQ6IHtcclxuICAgICAgICAgICAgc2l6ZTogMjAsXHJcbiAgICAgICAgICAgIHdlaWdodDogJ2JvbGQnLFxyXG4gICAgICAgICAgICBjb2xvcjogJyMwMDAwMDAnLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIGxlZ2VuZDoge1xyXG4gICAgICAgICAgcG9zaXRpb246ICdyaWdodCcsXHJcbiAgICAgICAgICBsYWJlbHM6IHtcclxuICAgICAgICAgICAgYm94V2lkdGg6IDE0LFxyXG4gICAgICAgICAgICBwYWRkaW5nOiAxNixcclxuICAgICAgICAgICAgZm9udDoge1xyXG4gICAgICAgICAgICAgIHNpemU6IDE0LFxyXG4gICAgICAgICAgICAgIGNvbG9yOiAnIzAwMDAwMCcsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdG9vbHRpcDoge1xyXG4gICAgICAgICAgY2FsbGJhY2tzOiB7XHJcbiAgICAgICAgICAgIGxhYmVsOiBmdW5jdGlvbiAoY3R4KSB7XHJcbiAgICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBjdHgucGFyc2VkO1xyXG4gICAgICAgICAgICAgIGNvbnN0IHBlcmNlbnRhZ2UgPSAoKHZhbHVlIC8gdG90YWwpICogMTAwKS50b0ZpeGVkKDIpO1xyXG4gICAgICAgICAgICAgIHJldHVybiBgJHtcclxuICAgICAgICAgICAgICAgIGN0eC5sYWJlbFxyXG4gICAgICAgICAgICAgIH06ICQke3ZhbHVlLnRvTG9jYWxlU3RyaW5nKCl9ICgke3BlcmNlbnRhZ2V9JSlgO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHBsdWdpbnM6IFtDaGFydERhdGFMYWJlbHNdLFxyXG4gIH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVBUlZEaXN0cmlidXRpb25DaGFydChkYXRhKSB7XHJcbiAgY29uc3QgY3R4ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FydkRpc3RyaWJ1dGlvbkNoYXJ0JykuZ2V0Q29udGV4dCgnMmQnKTtcclxuXHJcbiAgY29uc3QgbGFiZWxzID0gWydUb3RhbCBJbnZlc3RtZW50JywgJ1Jlc2FsZSBDb3N0cycsICdOZXQgUHJvZml0J107XHJcbiAgY29uc3QgdmFsdWVzID0gW2RhdGEuaW52ZXN0bWVudCwgZGF0YS5yZXNhbGVDb3N0cywgZGF0YS5uZXRQcm9maXRdO1xyXG4gIGNvbnN0IHRvdGFsID0gdmFsdWVzLnJlZHVjZSgoYSwgYikgPT4gYSArIGIsIDApO1xyXG5cclxuICBuZXcgQ2hhcnQoY3R4LCB7XHJcbiAgICB0eXBlOiAncGllJyxcclxuICAgIGRhdGE6IHtcclxuICAgICAgbGFiZWxzOiBsYWJlbHMsXHJcbiAgICAgIGRhdGFzZXRzOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgZGF0YTogdmFsdWVzLFxyXG4gICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBbJyMyOTgwYjknLCAnI2YxYzQwZicsICcjMmVjYzcxJ10sXHJcbiAgICAgICAgICBib3JkZXJDb2xvcjogJyNmZmZmZmYnLFxyXG4gICAgICAgICAgYm9yZGVyV2lkdGg6IDQsXHJcbiAgICAgICAgICBob3Zlck9mZnNldDogMjAsXHJcbiAgICAgICAgfSxcclxuICAgICAgXSxcclxuICAgIH0sXHJcbiAgICBvcHRpb25zOiB7XHJcbiAgICAgIHJlc3BvbnNpdmU6IHRydWUsXHJcbiAgICAgIHBsdWdpbnM6IHtcclxuICAgICAgICB0aXRsZToge1xyXG4gICAgICAgICAgZGlzcGxheTogdHJ1ZSxcclxuICAgICAgICAgIHRleHQ6ICdBUlYgRGlzdHJpYnV0aW9uJyxcclxuICAgICAgICAgIGZvbnQ6IHtcclxuICAgICAgICAgICAgc2l6ZTogMjAsXHJcbiAgICAgICAgICAgIHdlaWdodDogJ2JvbGQnLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGNvbG9yOiAnIzAwMDAwMCcsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBsZWdlbmQ6IHtcclxuICAgICAgICAgIHBvc2l0aW9uOiAncmlnaHQnLFxyXG4gICAgICAgICAgbGFiZWxzOiB7XHJcbiAgICAgICAgICAgIGJveFdpZHRoOiAxNCxcclxuICAgICAgICAgICAgcGFkZGluZzogMTYsXHJcbiAgICAgICAgICAgIGZvbnQ6IHtcclxuICAgICAgICAgICAgICBzaXplOiAxNCxcclxuICAgICAgICAgICAgICBjb2xvcjogJyMwMDAwMDAnLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHRvb2x0aXA6IHtcclxuICAgICAgICAgIGNhbGxiYWNrczoge1xyXG4gICAgICAgICAgICBsYWJlbDogZnVuY3Rpb24gKGN0eCkge1xyXG4gICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gY3R4LnBhcnNlZDtcclxuICAgICAgICAgICAgICBjb25zdCBwZXJjZW50YWdlID0gKCh2YWx1ZSAvIHRvdGFsKSAqIDEwMCkudG9GaXhlZCgyKTtcclxuICAgICAgICAgICAgICByZXR1cm4gYCR7XHJcbiAgICAgICAgICAgICAgICBjdHgubGFiZWxcclxuICAgICAgICAgICAgICB9OiAkJHt2YWx1ZS50b0xvY2FsZVN0cmluZygpfSAoJHtwZXJjZW50YWdlfSUpYDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgICBkYXRhbGFiZWxzOiB7XHJcbiAgICAgICAgICBjb2xvcjogJyNmZmZmZmYnLFxyXG4gICAgICAgICAgZm9udDoge1xyXG4gICAgICAgICAgICB3ZWlnaHQ6ICdib2xkJyxcclxuICAgICAgICAgICAgc2l6ZTogMTQsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgZm9ybWF0dGVyOiAodmFsdWUsIGNvbnRleHQpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgcGVyY2VudGFnZSA9ICh2YWx1ZSAvIHRvdGFsKSAqIDEwMDtcclxuICAgICAgICAgICAgcmV0dXJuIGAke3BlcmNlbnRhZ2UudG9GaXhlZCgxKX0lYDtcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBkaXNwbGF5OiBmdW5jdGlvbiAoY29udGV4dCkge1xyXG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IGNvbnRleHQuZGF0YXNldC5kYXRhW2NvbnRleHQuZGF0YUluZGV4XTtcclxuICAgICAgICAgICAgY29uc3QgcGVyY2VudGFnZSA9ICh2YWx1ZSAvIHRvdGFsKSAqIDEwMDtcclxuICAgICAgICAgICAgcmV0dXJuIHBlcmNlbnRhZ2UgPj0gNTsgLy8gU2hvdyBvbmx5IGlmIHRoZSBzbGljZSBpcyA1JSBvciBtb3JlXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgcGx1Z2luczogW0NoYXJ0RGF0YUxhYmVsc10sXHJcbiAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNhbGN1bGF0ZVJldGlyZW1lbnQoKSB7XHJcbiAgbGV0IGN1cnJlbnRBZ2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY3VycmVudEFnZScpO1xyXG4gIGxldCByZXRpcmVtZW50QWdlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3JldGlyZW1lbnRBZ2UnKTtcclxuICBsZXQgY3VycmVudFNhdmluZ3MgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY3VycmVudFNhdmluZ3MnKTtcclxuICBsZXQgbW9udGhseUNvbnRyaWJ1dGlvbnMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW9udGhseUNvbnRyaWJ1dGlvbnMnKTtcclxuICBsZXQgYW5udWFsUmV0dXJuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FubnVhbFJldHVybicpO1xyXG4gIGxldCBpbmZsYXRpb25SYXRlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2luZmxhdGlvblJhdGUnKTtcclxuICBsZXQgZGVzaXJlZEluY29tZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkZXNpcmVkSW5jb21lJyk7XHJcbiAgbGV0IHJlYWxFc3RhdGVBcHByZWNpYXRpb24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgICdyZWFsRXN0YXRlQXBwcmVjaWF0aW9uJ1xyXG4gICk7XHJcbiAgbGV0IG1vcnRnYWdlQmFsYW5jZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb3J0Z2FnZUJhbGFuY2UnKTtcclxuICBsZXQgd2hvbGVMaWZlSW5zdXJhbmNlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3dob2xlTGlmZUluc3VyYW5jZScpO1xyXG4gIGxldCBsaWZlSW5zdXJhbmNlTW9udGhseUNvbnRyaWJ1dGlvbnMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgICdsaWZlSW5zdXJhbmNlTW9udGhseUNvbnRyaWJ1dGlvbnMnXHJcbiAgKTtcclxuICBsZXQgbW9ydGdhZ2VUZXJtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vcnRnYWdlVGVybScpO1xyXG4gIGxldCBtb3J0Z2FnZUludGVyZXN0UmF0ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb3J0Z2FnZUludGVyZXN0UmF0ZScpO1xyXG4gIC8vIPCfhpUgTmV3IGlucHV0cyBmb3IgU3RvY2sgYW5kIFJlYWwgRXN0YXRlXHJcbiAgbGV0IGN1cnJlbnRTdG9ja1ZhbHVlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2N1cnJlbnRTdG9ja1ZhbHVlJyk7XHJcbiAgbGV0IGN1cnJlbnRSZWFsRXN0YXRlRXF1aXR5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICAnY3VycmVudFJlYWxFc3RhdGVFcXVpdHknXHJcbiAgKTtcclxuXHJcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnJldGlyZWNoYXJ0cycpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xyXG5cclxuICAvLyDinIUgRXJyb3IgbWVzc2FnZXNcclxuICBsZXQgZXJyb3JzID0ge1xyXG4gICAgY3VycmVudEFnZTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Vycm9yQ3VycmVudEFnZScpLFxyXG4gICAgcmV0aXJlbWVudEFnZTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Vycm9yUmV0aXJlbWVudEFnZScpLFxyXG4gICAgY3VycmVudFNhdmluZ3M6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlcnJvckN1cnJlbnRTYXZpbmdzJyksXHJcbiAgICBtb250aGx5Q29udHJpYnV0aW9uczogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Vycm9yTW9udGhseUNvbnRyaWJ1dGlvbnMnKSxcclxuICAgIGFubnVhbFJldHVybjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Vycm9yQW5udWFsUmV0dXJuJyksXHJcbiAgICBpbmZsYXRpb25SYXRlOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZXJyb3JJbmZsYXRpb25SYXRlJyksXHJcbiAgICBkZXNpcmVkSW5jb21lOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZXJyb3JEZXNpcmVkSW5jb21lJyksXHJcbiAgICBjdXJyZW50U3RvY2tWYWx1ZTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Vycm9yQ3VycmVudFN0b2NrVmFsdWUnKSxcclxuICAgIGN1cnJlbnRSZWFsRXN0YXRlRXF1aXR5OiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgICAgJ2Vycm9yQ3VycmVudFJlYWxFc3RhdGVFcXVpdHknXHJcbiAgICApLFxyXG4gICAgcmVhbEVzdGF0ZUFwcHJlY2lhdGlvbjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICAgICdlcnJvclJlYWxFc3RhdGVBcHByZWNpYXRpb24nXHJcbiAgICApLFxyXG4gICAgbW9ydGdhZ2VCYWxhbmNlOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZXJyb3Jtb3J0Z2FnZUJhbGFuY2UnKSxcclxuICAgIHdob2xlTGlmZUluc3VyYW5jZTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Vycm9yd2hvbGVMaWZlSW5zdXJhbmNlJyksXHJcbiAgICBsaWZlSW5zdXJhbmNlTW9udGhseUNvbnRyaWJ1dGlvbnM6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICAnZXJyb3JMaWZlSW5zdXJhbmNlTW9udGhseUNvbnRyaWJ1dGlvbnMnXHJcbiAgICApLFxyXG4gICAgbW9ydGdhZ2VUZXJtOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZXJyb3JNb3J0Z2FnZVRlcm0nKSxcclxuICAgIG1vcnRnYWdlSW50ZXJlc3RSYXRlOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZXJyb3JNb3J0Z2FnZUludGVyZXN0UmF0ZScpLFxyXG4gIH07XHJcbiAgLy8g4pyFIENsZWFyIHByZXZpb3VzIGVycm9yc1xyXG4gIE9iamVjdC52YWx1ZXMoZXJyb3JzKS5mb3JFYWNoKChlcnJvcikgPT4gKGVycm9yLmlubmVyVGV4dCA9ICcnKSk7XHJcblxyXG4gIGxldCBpc1ZhbGlkID0gdHJ1ZTtcclxuXHJcbiAgLy8g4pyFIFZhbGlkYXRpb24gZnVuY3Rpb25cclxuICBmdW5jdGlvbiB2YWxpZGF0ZUlucHV0KFxyXG4gICAgaW5wdXQsXHJcbiAgICBlcnJvckZpZWxkLFxyXG4gICAgZmllbGROYW1lLFxyXG4gICAgbWluID0gMCxcclxuICAgIG1heCA9IEluZmluaXR5XHJcbiAgKSB7XHJcbiAgICBsZXQgdmFsdWUgPSBwYXJzZUZsb2F0KGlucHV0LnZhbHVlKSB8fCAwOyAvLyBGYWxsYmFjayB0byAwIGlmIGVtcHR5XHJcbiAgICBpZiAodmFsdWUgPCBtaW4gfHwgdmFsdWUgPiBtYXgpIHtcclxuICAgICAgZXJyb3JGaWVsZC5pbm5lclRleHQgPSBgJHtmaWVsZE5hbWV9IG11c3QgYmUgYSB2YWxpZCBudW1iZXIgKCR7bWlufSAtICR7bWF4fSkuYDtcclxuICAgICAgaXNWYWxpZCA9IGZhbHNlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8g4pyFIFZhbGlkYXRlIGFsbCBpbnB1dHNcclxuICB2YWxpZGF0ZUlucHV0KGN1cnJlbnRBZ2UsIGVycm9ycy5jdXJyZW50QWdlLCAnQ3VycmVudCBBZ2UnLCAxOCwgMTAwKTtcclxuICB2YWxpZGF0ZUlucHV0KHJldGlyZW1lbnRBZ2UsIGVycm9ycy5yZXRpcmVtZW50QWdlLCAnUmV0aXJlbWVudCBBZ2UnLCAxOCwgMTAwKTtcclxuICB2YWxpZGF0ZUlucHV0KGN1cnJlbnRTYXZpbmdzLCBlcnJvcnMuY3VycmVudFNhdmluZ3MsICdDdXJyZW50IFNhdmluZ3MnLCAwKTtcclxuICB2YWxpZGF0ZUlucHV0KFxyXG4gICAgbW9udGhseUNvbnRyaWJ1dGlvbnMsXHJcbiAgICBlcnJvcnMubW9udGhseUNvbnRyaWJ1dGlvbnMsXHJcbiAgICAnTW9udGhseSBDb250cmlidXRpb25zJyxcclxuICAgIDBcclxuICApO1xyXG4gIHZhbGlkYXRlSW5wdXQoXHJcbiAgICBhbm51YWxSZXR1cm4sXHJcbiAgICBlcnJvcnMuYW5udWFsUmV0dXJuLFxyXG4gICAgJ0V4cGVjdGVkIEFubnVhbCBSZXR1cm4gKCUpJyxcclxuICAgIDAsXHJcbiAgICAxMDBcclxuICApO1xyXG4gIHZhbGlkYXRlSW5wdXQoXHJcbiAgICBpbmZsYXRpb25SYXRlLFxyXG4gICAgZXJyb3JzLmluZmxhdGlvblJhdGUsXHJcbiAgICAnSW5mbGF0aW9uIFJhdGUgKCUpJyxcclxuICAgIDAsXHJcbiAgICAxMDBcclxuICApO1xyXG4gIHZhbGlkYXRlSW5wdXQoXHJcbiAgICBkZXNpcmVkSW5jb21lLFxyXG4gICAgZXJyb3JzLmRlc2lyZWRJbmNvbWUsXHJcbiAgICAnRGVzaXJlZCBSZXRpcmVtZW50IEluY29tZScsXHJcbiAgICAwXHJcbiAgKTtcclxuICB2YWxpZGF0ZUlucHV0KFxyXG4gICAgY3VycmVudFN0b2NrVmFsdWUsXHJcbiAgICBlcnJvcnMuY3VycmVudFN0b2NrVmFsdWUsXHJcbiAgICAnQ3VycmVudCBTdG9jayBWYWx1ZScsXHJcbiAgICAwXHJcbiAgKTtcclxuICB2YWxpZGF0ZUlucHV0KFxyXG4gICAgY3VycmVudFJlYWxFc3RhdGVFcXVpdHksXHJcbiAgICBlcnJvcnMuY3VycmVudFJlYWxFc3RhdGVFcXVpdHksXHJcbiAgICAnQ3VycmVudCBSZWFsIEVzdGF0ZSBFcXVpdHknLFxyXG4gICAgMFxyXG4gICk7XHJcbiAgdmFsaWRhdGVJbnB1dChcclxuICAgIHJlYWxFc3RhdGVBcHByZWNpYXRpb24sXHJcbiAgICBlcnJvcnMucmVhbEVzdGF0ZUFwcHJlY2lhdGlvbixcclxuICAgICdSZWFsIEVzdGF0ZSBBcHByZWNpYXRpb24gKCUpJyxcclxuICAgIDAsXHJcbiAgICAxMDBcclxuICApO1xyXG4gIHZhbGlkYXRlSW5wdXQobW9ydGdhZ2VCYWxhbmNlLCBlcnJvcnMubW9ydGdhZ2VCYWxhbmNlLCAnTW9ydGdhZ2UgQmFsYW5jZScsIDApO1xyXG4gIHZhbGlkYXRlSW5wdXQoXHJcbiAgICB3aG9sZUxpZmVJbnN1cmFuY2UsXHJcbiAgICBlcnJvcnMud2hvbGVMaWZlSW5zdXJhbmNlLFxyXG4gICAgJ1dob2xlIExpZmUgSW5zdXJhbmNlJyxcclxuICAgIDBcclxuICApO1xyXG4gIHZhbGlkYXRlSW5wdXQoXHJcbiAgICBsaWZlSW5zdXJhbmNlTW9udGhseUNvbnRyaWJ1dGlvbnMsXHJcbiAgICBlcnJvcnMubGlmZUluc3VyYW5jZU1vbnRobHlDb250cmlidXRpb25zLFxyXG4gICAgJ0xpZmUgSW5zdXJhbmNlIE1vbnRobHkgQ29udHJpYnV0aW9ucycsXHJcbiAgICAwXHJcbiAgKTtcclxuICAvLyB2YWxpZGF0ZUlucHV0KG1vcnRnYWdlVGVybSwgZXJyb3JzLm1vcnRnYWdlVGVybSwgXCJNb3J0Z2FnZSBUZXJtXCIsIDEsIDUwKTtcclxuICB2YWxpZGF0ZUlucHV0KFxyXG4gICAgbW9ydGdhZ2VJbnRlcmVzdFJhdGUsXHJcbiAgICBlcnJvcnMubW9ydGdhZ2VJbnRlcmVzdFJhdGUsXHJcbiAgICAnTW9ydGdhZ2UgSW50ZXJlc3QgUmF0ZScsXHJcbiAgICAwLFxyXG4gICAgMTAwXHJcbiAgKTtcclxuXHJcbiAgaWYgKHBhcnNlSW50KGN1cnJlbnRBZ2UudmFsdWUpID49IHBhcnNlSW50KHJldGlyZW1lbnRBZ2UudmFsdWUpKSB7XHJcbiAgICBlcnJvcnMucmV0aXJlbWVudEFnZS5pbm5lclRleHQgPVxyXG4gICAgICAnUmV0aXJlbWVudCBhZ2UgbXVzdCBiZSBncmVhdGVyIHRoYW4gY3VycmVudCBhZ2UuJztcclxuICAgIGlzVmFsaWQgPSBmYWxzZTtcclxuICB9XHJcblxyXG4gIGlmICghaXNWYWxpZCkgcmV0dXJuO1xyXG5cclxuICAvLyDinIUgVmFyaWFibGVzIGZvciBjYWxjdWxhdGlvblxyXG4gIGxldCB5ZWFyc1RvUmV0aXJlbWVudCA9XHJcbiAgICBwYXJzZUludChyZXRpcmVtZW50QWdlLnZhbHVlKSAtIHBhcnNlSW50KGN1cnJlbnRBZ2UudmFsdWUpO1xyXG4gIGxldCBuID0gMTI7IC8vIE1vbnRobHkgY29tcG91bmRpbmdcclxuICBsZXQgciA9IChwYXJzZUZsb2F0KGFubnVhbFJldHVybi52YWx1ZSkgfHwgMCkgLyAxMDAgLyBuOyAvLyBIYW5kbGUgZW1wdHkgcmV0dXJuIGdyYWNlZnVsbHlcclxuICBsZXQgdCA9IHllYXJzVG9SZXRpcmVtZW50ICogbjtcclxuXHJcbiAgLy8g4pyFIEZ1dHVyZSBWYWx1ZSBDYWxjdWxhdGlvbnMgKEF2b2lkIE5hTilcclxuICBsZXQgZnZDdXJyZW50U2F2aW5ncyA9XHJcbiAgICAocGFyc2VGbG9hdChjdXJyZW50U2F2aW5ncy52YWx1ZSkgfHwgMCkgKlxyXG4gICAgTWF0aC5wb3coXHJcbiAgICAgIDEgKyAocGFyc2VGbG9hdChhbm51YWxSZXR1cm4udmFsdWUpIHx8IDApIC8gMTAwLFxyXG4gICAgICB5ZWFyc1RvUmV0aXJlbWVudFxyXG4gICAgKTtcclxuXHJcbiAgbGV0IGZ2Q29udHJpYnV0aW9ucyA9XHJcbiAgICAocGFyc2VGbG9hdChtb250aGx5Q29udHJpYnV0aW9ucy52YWx1ZSkgfHwgMCkgKlxyXG4gICAgKChNYXRoLnBvdygxICsgciwgdCkgLSAxKSAvIHIpICpcclxuICAgICgxICsgcik7XHJcblxyXG4gIC8vIOKchSBTdG9jayBhbmQgUmVhbCBFc3RhdGUgYXBwcmVjaWF0aW9uIChBdm9pZCBOYU4pXHJcbiAgbGV0IGZ2U3RvY2sgPVxyXG4gICAgKHBhcnNlRmxvYXQoY3VycmVudFN0b2NrVmFsdWUudmFsdWUpIHx8IDApICpcclxuICAgIE1hdGgucG93KDEgKyAwLjAzLCB5ZWFyc1RvUmV0aXJlbWVudCk7XHJcblxyXG4gIGxldCByZWFsRXN0YXRlUmF0ZSA9IChwYXJzZUZsb2F0KHJlYWxFc3RhdGVBcHByZWNpYXRpb24udmFsdWUpIHx8IDApIC8gMTAwO1xyXG4gIGxldCBhZGp1c3RlZE1vcnRnYWdlID0gcGFyc2VGbG9hdChtb3J0Z2FnZUJhbGFuY2UudmFsdWUpIHx8IDA7XHJcblxyXG4gIC8vIFJlYWwgZXN0YXRlIGVxdWl0eTogb3duZWQgcG9ydGlvbiBvZiBlcXVpdHkgbWludXMgb3duZWQgbW9ydGdhZ2VcclxuICBsZXQgZnZSZWFsRXN0YXRlID1cclxuICAgIChwYXJzZUZsb2F0KGN1cnJlbnRSZWFsRXN0YXRlRXF1aXR5LnZhbHVlKSB8fCAwKSAqXHJcbiAgICAgIE1hdGgucG93KDEgKyByZWFsRXN0YXRlUmF0ZSwgeWVhcnNUb1JldGlyZW1lbnQpIC1cclxuICAgIGFkanVzdGVkTW9ydGdhZ2U7XHJcbiAgaWYgKGlzTmFOKGZ2UmVhbEVzdGF0ZSkpIGZ2UmVhbEVzdGF0ZSA9IDA7XHJcbiAgLy8g4pyFIFRvdGFsIFNhdmluZ3MgKENoZWNrIGZvciBOYU4gYW5kIGZhbGxiYWNrIHRvIDApXHJcbiAgbGV0IGxpZmVJbnN1cmFuY2VNb250aGx5ID1cclxuICAgIHBhcnNlRmxvYXQobGlmZUluc3VyYW5jZU1vbnRobHlDb250cmlidXRpb25zLnZhbHVlKSB8fCAwO1xyXG4gIGxldCBmdkxpZmVJbnN1cmFuY2VDb250cmlidXRpb25zID1cclxuICAgIGxpZmVJbnN1cmFuY2VNb250aGx5ICogKChNYXRoLnBvdygxICsgciwgdCkgLSAxKSAvIHIpICogKDEgKyByKTtcclxuICBsZXQgZnZXaG9sZUxpZmVJbnN1cmFuY2UgPVxyXG4gICAgKHBhcnNlRmxvYXQod2hvbGVMaWZlSW5zdXJhbmNlLnZhbHVlKSB8fCAwKSArIGZ2TGlmZUluc3VyYW5jZUNvbnRyaWJ1dGlvbnM7XHJcblxyXG4gIGxldCB0b3RhbFNhdmluZ3MgPVxyXG4gICAgKGlzTmFOKGZ2Q3VycmVudFNhdmluZ3MpID8gMCA6IGZ2Q3VycmVudFNhdmluZ3MpICtcclxuICAgIChpc05hTihmdkNvbnRyaWJ1dGlvbnMpID8gMCA6IGZ2Q29udHJpYnV0aW9ucykgK1xyXG4gICAgKGlzTmFOKGZ2U3RvY2spID8gMCA6IGZ2U3RvY2spICtcclxuICAgIChpc05hTihmdlJlYWxFc3RhdGUpID8gMCA6IGZ2UmVhbEVzdGF0ZSkgK1xyXG4gICAgZnZXaG9sZUxpZmVJbnN1cmFuY2U7XHJcbiAgLy8g8J+GlSBBZGQgcmVtYWluaW5nIG1vcnRnYWdlIHBheW1lbnRzIHRvIHNhdmluZ3MgaWYgaXQgZW5kcyBiZWZvcmUgcmV0aXJlbWVudFxyXG4gIGNvbnN0IG1vcnRnYWdlRW5kWWVhcnMgPSBtb3J0Z2FnZVRlcm0gLyAxMjtcclxuICBpZiAobW9ydGdhZ2VFbmRZZWFycyA8IHllYXJzVG9SZXRpcmVtZW50KSB7XHJcbiAgICBjb25zdCByZW1haW5pbmdZZWFycyA9IHllYXJzVG9SZXRpcmVtZW50IC0gbW9ydGdhZ2VFbmRZZWFycztcclxuICAgIGNvbnN0IGZ1dHVyZUV4dHJhU2F2aW5ncyA9XHJcbiAgICAgIG1vbnRobHlQYXltZW50ICpcclxuICAgICAgMTIgKlxyXG4gICAgICAoKE1hdGgucG93KDEgKyByLCByZW1haW5pbmdZZWFycyAqIG4pIC0gMSkgLyByKSAqXHJcbiAgICAgICgxICsgcik7XHJcbiAgICB0b3RhbFNhdmluZ3MgKz0gaXNOYU4oZnV0dXJlRXh0cmFTYXZpbmdzKSA/IDAgOiBmdXR1cmVFeHRyYVNhdmluZ3M7XHJcbiAgfVxyXG5cclxuICAvLyDinIUgQWRqdXN0ZWQgSW5jb21lIHdpdGggSW5mbGF0aW9uIChGYWxsYmFjayB0byAwKVxyXG4gIGxldCBhZGp1c3RlZEluY29tZSA9XHJcbiAgICAocGFyc2VGbG9hdChkZXNpcmVkSW5jb21lLnZhbHVlKSB8fCAwKSAqXHJcbiAgICBNYXRoLnBvdyhcclxuICAgICAgMSArIChwYXJzZUZsb2F0KGluZmxhdGlvblJhdGUudmFsdWUpIHx8IDApIC8gMTAwLFxyXG4gICAgICB5ZWFyc1RvUmV0aXJlbWVudFxyXG4gICAgKTtcclxuXHJcbiAgLy8g4pyFIFRpbWUtYmFzZWQgcHJvamVjdGlvbnMgZm9yIGFsbCBhc3NldHNcclxuICBsZXQgcHJvamVjdGlvbnMgPSBbXTtcclxuICBsZXQgc3RvY2tHcm93dGhSYXRlID0gMC4wMzsgLy8gU3RpbGwgZml4ZWQgdW5sZXNzIHlvdSB3YW50IHRvIG1ha2UgdGhhdCBlZGl0YWJsZSB0b29cclxuXHJcbiAgZm9yIChsZXQgaSA9IDU7IGkgPD0geWVhcnNUb1JldGlyZW1lbnQ7IGkgKz0gNSkge1xyXG4gICAgY29uc3QgcmVhbEVzdGF0ZVZhbHVlID1cclxuICAgICAgKHBhcnNlRmxvYXQoY3VycmVudFJlYWxFc3RhdGVFcXVpdHkudmFsdWUpIHx8IDApICpcclxuICAgICAgTWF0aC5wb3coMSArIHJlYWxFc3RhdGVSYXRlLCBpKTtcclxuXHJcbiAgICBjb25zdCBwcmluY2lwYWwgPSBhZGp1c3RlZE1vcnRnYWdlO1xyXG4gICAgY29uc3QgdGVybU1vbnRocyA9IHBhcnNlRmxvYXQobW9ydGdhZ2VUZXJtLnZhbHVlIHx8IDApICogMTI7XHJcbiAgICBjb25zdCBtb250aGx5UmF0ZSA9IHBhcnNlRmxvYXQobW9ydGdhZ2VJbnRlcmVzdFJhdGUudmFsdWUgfHwgMCkgLyAxMDAgLyAxMjtcclxuXHJcbiAgICBjb25zdCBtb250aGx5UGF5bWVudCA9XHJcbiAgICAgIChwcmluY2lwYWwgKiAobW9udGhseVJhdGUgKiBNYXRoLnBvdygxICsgbW9udGhseVJhdGUsIHRlcm1Nb250aHMpKSkgL1xyXG4gICAgICAoTWF0aC5wb3coMSArIG1vbnRobHlSYXRlLCB0ZXJtTW9udGhzKSAtIDEpO1xyXG4gICAgY29uc3QgbW9udGhzUGFpZCA9IE1hdGgubWluKGkgKiAxMiwgdGVybU1vbnRocyk7XHJcblxyXG4gICAgY29uc3QgcmVtYWluaW5nTW9ydGdhZ2UgPVxyXG4gICAgICBwcmluY2lwYWwgKiBNYXRoLnBvdygxICsgbW9udGhseVJhdGUsIG1vbnRoc1BhaWQpIC1cclxuICAgICAgKG1vbnRobHlQYXltZW50ICogKE1hdGgucG93KDEgKyBtb250aGx5UmF0ZSwgbW9udGhzUGFpZCkgLSAxKSkgL1xyXG4gICAgICAgIG1vbnRobHlSYXRlO1xyXG5cclxuICAgIGNvbnN0IG5ldFJlYWxFc3RhdGUgPSBpc05hTihyZWFsRXN0YXRlVmFsdWUgLSByZW1haW5pbmdNb3J0Z2FnZSlcclxuICAgICAgPyAwXHJcbiAgICAgIDogcmVhbEVzdGF0ZVZhbHVlIC0gcmVtYWluaW5nTW9ydGdhZ2U7XHJcblxyXG4gICAgLy8g8J+GlSBJZiBtb3J0Z2FnZSBpcyBwYWlkIG9mZiwgY2FsY3VsYXRlIHRoZSBleHRyYSBzYXZpbmdzXHJcbiAgICBsZXQgZXh0cmFJbnZlc3RtZW50VmFsdWUgPSAwO1xyXG4gICAgaWYgKGkgKiAxMiA+IHRlcm1Nb250aHMpIHtcclxuICAgICAgY29uc3QgZXh0cmFNb250aHMgPSBpICogMTIgLSB0ZXJtTW9udGhzO1xyXG4gICAgICBjb25zdCBleHRyYU1vbnRobHkgPSBtb250aGx5UGF5bWVudDtcclxuICAgICAgY29uc3QgZXh0cmFZZWFycyA9IGV4dHJhTW9udGhzIC8gMTI7XHJcbiAgICAgIGV4dHJhSW52ZXN0bWVudFZhbHVlID1cclxuICAgICAgICBleHRyYU1vbnRobHkgKlxyXG4gICAgICAgIDEyICpcclxuICAgICAgICAoKE1hdGgucG93KDEgKyByLCBleHRyYVllYXJzICogbikgLSAxKSAvIHIpICpcclxuICAgICAgICAoMSArIHIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIPCfp6AgSW5zdXJhbmNlICsgZXh0cmEgaW52ZXN0bWVudCBGVlxyXG4gICAgY29uc3QgaW5zdXJhbmNlQ29udHJpYnV0aW9uRlYgPVxyXG4gICAgICBsaWZlSW5zdXJhbmNlTW9udGhseSAqICgoTWF0aC5wb3coMSArIHIsIGkgKiBuKSAtIDEpIC8gcikgKiAoMSArIHIpO1xyXG4gICAgY29uc3QgdG90YWxJbnN1cmFuY2VWYWx1ZSA9XHJcbiAgICAgIChwYXJzZUZsb2F0KHdob2xlTGlmZUluc3VyYW5jZS52YWx1ZSkgfHwgMCkgKyBpbnN1cmFuY2VDb250cmlidXRpb25GVjtcclxuXHJcbiAgICBwcm9qZWN0aW9ucy5wdXNoKHtcclxuICAgICAgeWVhcjogaSxcclxuICAgICAgc3RvY2tWYWx1ZTpcclxuICAgICAgICAocGFyc2VGbG9hdChjdXJyZW50U3RvY2tWYWx1ZS52YWx1ZSkgfHwgMCkgKlxyXG4gICAgICAgIE1hdGgucG93KDEgKyBzdG9ja0dyb3d0aFJhdGUsIGkpLFxyXG4gICAgICByZWFsRXN0YXRlVmFsdWU6IG5ldFJlYWxFc3RhdGUsXHJcbiAgICAgIGluc3VyYW5jZVZhbHVlOiB0b3RhbEluc3VyYW5jZVZhbHVlLFxyXG4gICAgICBleHRyYUludmVzdG1lbnRWYWx1ZTogaXNOYU4oZXh0cmFJbnZlc3RtZW50VmFsdWUpXHJcbiAgICAgICAgPyAwXHJcbiAgICAgICAgOiBleHRyYUludmVzdG1lbnRWYWx1ZSxcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLy8g4pyFIFdpdGhkcmF3YWwgU2ltdWxhdGlvblxyXG4gIGxldCB3aXRoZHJhd2FsWWVhcnMgPSAwO1xyXG4gIGxldCByZW1haW5pbmdCYWxhbmNlID0gdG90YWxTYXZpbmdzO1xyXG4gIGxldCB5ZWFybHlXaXRoZHJhd2FsID0gYWRqdXN0ZWRJbmNvbWU7XHJcblxyXG4gIGxldCB5ZWFyc0FycmF5ID0gW107XHJcbiAgbGV0IGJhbGFuY2VBcnJheSA9IFtdO1xyXG5cclxuICB3aGlsZSAocmVtYWluaW5nQmFsYW5jZSA+IDApIHtcclxuICAgIHllYXJzQXJyYXkucHVzaCh3aXRoZHJhd2FsWWVhcnMpO1xyXG4gICAgYmFsYW5jZUFycmF5LnB1c2gocmVtYWluaW5nQmFsYW5jZSk7XHJcblxyXG4gICAgd2l0aGRyYXdhbFllYXJzKys7XHJcblxyXG4gICAgLy8gUHJldmVudCBpbmZpbml0ZSBsb29wc1xyXG4gICAgaWYgKHdpdGhkcmF3YWxZZWFycyA+IDEwMCkgYnJlYWs7XHJcblxyXG4gICAgcmVtYWluaW5nQmFsYW5jZSAtPSB5ZWFybHlXaXRoZHJhd2FsO1xyXG4gICAgcmVtYWluaW5nQmFsYW5jZSAqPSAxICsgKHBhcnNlRmxvYXQoYW5udWFsUmV0dXJuLnZhbHVlKSB8fCAwKSAvIDEwMDtcclxuICAgIHllYXJseVdpdGhkcmF3YWwgKj0gMSArIChwYXJzZUZsb2F0KGluZmxhdGlvblJhdGUudmFsdWUpIHx8IDApIC8gMTAwO1xyXG4gIH1cclxuXHJcbiAgbGV0IGV4cGVjdGVkTGlmZXNwYW4gPSA5MDtcclxuICBsZXQgcmV0aXJlbWVudFllYXJzID0gZXhwZWN0ZWRMaWZlc3BhbiAtIHBhcnNlSW50KHJldGlyZW1lbnRBZ2UudmFsdWUpO1xyXG4gIGxldCBzaG9ydGZhbGxTdXJwbHVzRGl2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNob3J0Jyk7XHJcbiAgbGV0IHNob3J0ZmFsbFN1cnBsdXM7XHJcblxyXG4gIGlmICh3aXRoZHJhd2FsWWVhcnMgPj0gcmV0aXJlbWVudFllYXJzKSB7XHJcbiAgICBzaG9ydGZhbGxTdXJwbHVzID0gJ1N1cnBsdXMgKEZ1bmRzIGxhc3QgdGhyb3VnaG91dCByZXRpcmVtZW50KSc7XHJcbiAgICBzaG9ydGZhbGxTdXJwbHVzRGl2LnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICcjZDBiODcwJztcclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zaG9ydGNhcCcpLnN0eWxlLmNvbG9yID0gJ2JsYWNrJztcclxuICB9IGVsc2Uge1xyXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNob3J0Y2FwJykuc3R5bGUuY29sb3IgPSAnI2QwYjg3MCc7XHJcbiAgICBzaG9ydGZhbGxTdXJwbHVzID0gYEZ1bmRzIHdvbnQgbGFzdCB0aHJvdWdob3V0IHRoZSByZXRpcmVtZW50IHllYXJzLCBzaG9ydCBieSAke1xyXG4gICAgICByZXRpcmVtZW50WWVhcnMgLSB3aXRoZHJhd2FsWWVhcnNcclxuICAgIH0geWVhcnMpYDtcclxuICAgIHNob3J0ZmFsbFN1cnBsdXNEaXYuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJyNmODZkNmQnO1xyXG4gIH1cclxuXHJcbiAgLy8g4pyFIERpc3BsYXkgT3V0cHV0XHJcbiAgaWYgKGFubnVhbFJldHVybi52YWx1ZSAhPSAnJykge1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RvdGFsU2F2aW5ncycpLmlubmVySFRNTCA9IGAke2Zvcm1hdE51bWJlcihcclxuICAgICAgdG90YWxTYXZpbmdzXHJcbiAgICApfWA7XHJcbiAgICBsZXQgdG90YWxTYXZpbmdzRWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndG90YWxTYXZpbmdzJyk7XHJcbiAgICBsZXQgdG90YWxTYXZpbmdzQ2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50b3RhbFNhdmluZ3NDYXJkJyk7XHJcbiAgICBsZXQgdG90YWxTYXZpbmdzaGVhZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50b3RhbFNhdmluZ3NoZWFkJyk7XHJcbiAgICB0b3RhbFNhdmluZ3NFbC5zdHlsZS5jb2xvciA9ICdibGFjayc7XHJcbiAgICB0b3RhbFNhdmluZ3NoZWFkLnN0eWxlLmNvbG9yID0gJ2JsYWNrJztcclxuICAgIHRvdGFsU2F2aW5nc0NhcmQuc3R5bGUuYmFja2dyb3VuZCA9ICcjZDBiODcwJztcclxuICB9XHJcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FubnVhbFdpdGhkcmF3YWwnKS5pbm5lckhUTUwgPSBgJHtmb3JtYXROdW1iZXIoXHJcbiAgICBhZGp1c3RlZEluY29tZVxyXG4gICl9YDtcclxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgneWVhcnNVbnRpbERlcGxldGlvbicpLmlubmVySFRNTCA9IGAke1xyXG4gICAgaXNOYU4od2l0aGRyYXdhbFllYXJzKSA/ICdOL0EnIDogd2l0aGRyYXdhbFllYXJzXHJcbiAgfWA7XHJcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Nob3J0ZmFsbFN1cnBsdXMnKS5pbm5lckhUTUwgPSBpc05hTih3aXRoZHJhd2FsWWVhcnMpXHJcbiAgICA/ICdOL0EnXHJcbiAgICA6IHNob3J0ZmFsbFN1cnBsdXM7XHJcblxyXG4gIC8vIOKchSBEaXNwbGF5IE5ldyBQcm9qZWN0aW9uc1xyXG4gIGxldCBwcm9qZWN0aW9uc0RpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwcm9qZWN0aW9ucycpO1xyXG4gIHByb2plY3Rpb25zRGl2LmlubmVySFRNTCA9IGA8aDMgY2xhc3M9XCJkeW5hbWljSGVhZFwiPlRpbWUtYmFzZWQgQXNzZXQgUHJvamVjdGlvbnM6PC9oMz5gO1xyXG4gIHByb2plY3Rpb25zLmZvckVhY2goKHByb2opID0+IHtcclxuICAgIGNvbnN0IHRvdGFsID0gcHJvai5zdG9ja1ZhbHVlICsgcHJvai5yZWFsRXN0YXRlVmFsdWUgKyBwcm9qLmluc3VyYW5jZVZhbHVlO1xyXG5cclxuICAgIHByb2plY3Rpb25zRGl2LmlubmVySFRNTCArPSBgXHJcbiAgICAgIDxwIGNsYXNzPVwiZHluYW1pY1BhcmFcIj5JbiA8c3Ryb25nPiR7cHJvai55ZWFyfSB5ZWFyczo8L3N0cm9uZz48L3A+XHJcbiAgICAgIDx1bD5cclxuICAgICAgICA8bGkgY2xhc3M9XCJkeW5hbWljTGlzdFwiPlN0b2NrIFZhbHVlOiAke2Zvcm1hdE51bWJlcihcclxuICAgICAgICAgIHByb2ouc3RvY2tWYWx1ZVxyXG4gICAgICAgICl9PC9saT5cclxuICAgICAgICA8bGkgY2xhc3M9XCJkeW5hbWljTGlzdFwiPlJlYWwgRXN0YXRlIFZhbHVlOiAke2Zvcm1hdE51bWJlcihcclxuICAgICAgICAgIHByb2oucmVhbEVzdGF0ZVZhbHVlXHJcbiAgICAgICAgKX08L2xpPlxyXG4gICAgICAgIDxsaSBjbGFzcz1cImR5bmFtaWNMaXN0XCI+TGlmZSBJbnN1cmFuY2UgVmFsdWU6ICR7Zm9ybWF0TnVtYmVyKFxyXG4gICAgICAgICAgcHJvai5pbnN1cmFuY2VWYWx1ZVxyXG4gICAgICAgICl9PC9saT5cclxuICAgICAgICA8bGkgY2xhc3M9XCJkeW5hbWljTGlzdFwiPjxzdHJvbmc+VG90YWwgVmFsdWU6ICR7Zm9ybWF0TnVtYmVyKFxyXG4gICAgICAgICAgdG90YWxcclxuICAgICAgICApfTwvc3Ryb25nPjwvbGk+XHJcbiAgICAgIDwvdWw+YDtcclxuICB9KTtcclxuXHJcbiAgaWYgKFxyXG4gICAgZnZTdG9jayA+IDAgfHxcclxuICAgIGZ2UmVhbEVzdGF0ZSA+IDAgfHxcclxuICAgIGZ2V2hvbGVMaWZlSW5zdXJhbmNlID4gMCB8fFxyXG4gICAgZnZDb250cmlidXRpb25zID4gMFxyXG4gICkge1xyXG4gICAgcmVuZGVyQXNzZXRCcmVha2Rvd25DaGFydChcclxuICAgICAgZnZTdG9jayxcclxuICAgICAgZnZSZWFsRXN0YXRlLFxyXG4gICAgICBmdldob2xlTGlmZUluc3VyYW5jZSxcclxuICAgICAgZnZDdXJyZW50U2F2aW5ncyArIGZ2Q29udHJpYnV0aW9uc1xyXG4gICAgKTtcclxuICAgIHJlbmRlckluY29tZVNvdXJjZVBpZShcclxuICAgICAgZnZDb250cmlidXRpb25zLFxyXG4gICAgICBmdlN0b2NrLFxyXG4gICAgICBmdlJlYWxFc3RhdGUsXHJcbiAgICAgIGZ2V2hvbGVMaWZlSW5zdXJhbmNlXHJcbiAgICApO1xyXG4gIH1cclxufVxyXG5cclxuLy8gY2hhcnRzXHJcbmZ1bmN0aW9uIHJlbmRlckFzc2V0QnJlYWtkb3duQ2hhcnQoXHJcbiAgZnZTdG9jayxcclxuICBmdlJlYWxFc3RhdGUsXHJcbiAgZnZXaG9sZUxpZmVJbnN1cmFuY2UsXHJcbiAgZnZTYXZpbmdzXHJcbikge1xyXG4gIGNvbnN0IGN0eCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhc3NldEJyZWFrZG93bkNoYXJ0JykuZ2V0Q29udGV4dCgnMmQnKTtcclxuXHJcbiAgY29uc3QgdG90YWwgPSBmdlN0b2NrICsgZnZSZWFsRXN0YXRlICsgZnZXaG9sZUxpZmVJbnN1cmFuY2UgKyBmdlNhdmluZ3M7XHJcblxyXG4gIGNvbnN0IGNoYXJ0RGF0YSA9IHtcclxuICAgIGxhYmVsczogWydTdG9ja3MnLCAnUmVhbCBFc3RhdGUnLCAnV2hvbGUgTGlmZSBJbnN1cmFuY2UnLCAnU2F2aW5ncyddLFxyXG4gICAgZGF0YXNldHM6IFtcclxuICAgICAge1xyXG4gICAgICAgIGxhYmVsOiAnQXNzZXQgRGlzdHJpYnV0aW9uIGF0IFJldGlyZW1lbnQnLFxyXG4gICAgICAgIGRhdGE6IFtmdlN0b2NrLCBmdlJlYWxFc3RhdGUsIGZ2V2hvbGVMaWZlSW5zdXJhbmNlLCBmdlNhdmluZ3NdLFxyXG4gICAgICAgIGJhY2tncm91bmRDb2xvcjogWycjRjM5NjU1JywgJyNCNzdDRTkgJywgJyM1NUNCRTUgJywgJyNlNjdlMjInXSxcclxuICAgICAgICBib3JkZXJDb2xvcjogJyNmZmZmZmYnLFxyXG4gICAgICAgIGJvcmRlcldpZHRoOiA0LFxyXG4gICAgICAgIGhvdmVyT2Zmc2V0OiAyMCxcclxuICAgICAgfSxcclxuICAgIF0sXHJcbiAgfTtcclxuXHJcbiAgLy8gRGVzdHJveSBwcmV2aW91cyBjaGFydCBpbnN0YW5jZSBpZiBpdCBleGlzdHNcclxuICBpZiAod2luZG93LmFzc2V0QnJlYWtkb3duQ2hhcnQgaW5zdGFuY2VvZiBDaGFydCkge1xyXG4gICAgd2luZG93LmFzc2V0QnJlYWtkb3duQ2hhcnQuZGVzdHJveSgpO1xyXG4gIH1cclxuXHJcbiAgd2luZG93LmFzc2V0QnJlYWtkb3duQ2hhcnQgPSBuZXcgQ2hhcnQoY3R4LCB7XHJcbiAgICB0eXBlOiAncGllJyxcclxuICAgIGRhdGE6IGNoYXJ0RGF0YSxcclxuICAgIG9wdGlvbnM6IHtcclxuICAgICAgcmVzcG9uc2l2ZTogdHJ1ZSxcclxuICAgICAgcGx1Z2luczoge1xyXG4gICAgICAgIHRpdGxlOiB7XHJcbiAgICAgICAgICBkaXNwbGF5OiB0cnVlLFxyXG4gICAgICAgICAgdGV4dDogJ0Fzc2V0IEFsbG9jYXRpb24gQnJlYWtkb3duIGF0IFJldGlyZW1lbnQnLFxyXG4gICAgICAgICAgZm9udDoge1xyXG4gICAgICAgICAgICBzaXplOiAyMCxcclxuICAgICAgICAgICAgd2VpZ2h0OiAnYm9sZCcsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgY29sb3I6ICcjMDAwMDAwJyxcclxuICAgICAgICB9LFxyXG4gICAgICAgIGxlZ2VuZDoge1xyXG4gICAgICAgICAgcG9zaXRpb246ICdyaWdodCcsXHJcbiAgICAgICAgICBsYWJlbHM6IHtcclxuICAgICAgICAgICAgYm94V2lkdGg6IDE0LFxyXG4gICAgICAgICAgICBwYWRkaW5nOiAxNixcclxuICAgICAgICAgICAgZm9udDoge1xyXG4gICAgICAgICAgICAgIHNpemU6IDE0LFxyXG4gICAgICAgICAgICAgIGNvbG9yOiAnIzAwMDAwMCcsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdG9vbHRpcDoge1xyXG4gICAgICAgICAgY2FsbGJhY2tzOiB7XHJcbiAgICAgICAgICAgIGxhYmVsOiBmdW5jdGlvbiAoY3R4KSB7XHJcbiAgICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBjdHgucGFyc2VkO1xyXG4gICAgICAgICAgICAgIGNvbnN0IHBlcmNlbnRhZ2UgPSAoKHZhbHVlIC8gdG90YWwpICogMTAwKS50b0ZpeGVkKDIpO1xyXG4gICAgICAgICAgICAgIHJldHVybiBgJHtcclxuICAgICAgICAgICAgICAgIGN0eC5sYWJlbFxyXG4gICAgICAgICAgICAgIH06ICQke3ZhbHVlLnRvTG9jYWxlU3RyaW5nKCl9ICgke3BlcmNlbnRhZ2V9JSlgO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRhdGFsYWJlbHM6IHtcclxuICAgICAgICAgIGNvbG9yOiAnI2ZmZmZmZicsXHJcbiAgICAgICAgICBmb250OiB7XHJcbiAgICAgICAgICAgIHdlaWdodDogJ2JvbGQnLFxyXG4gICAgICAgICAgICBzaXplOiAxNCxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBmb3JtYXR0ZXI6ICh2YWx1ZSwgY29udGV4dCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBwZXJjZW50YWdlID0gKHZhbHVlIC8gdG90YWwpICogMTAwO1xyXG4gICAgICAgICAgICByZXR1cm4gYCR7cGVyY2VudGFnZS50b0ZpeGVkKDEpfSVgO1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGRpc3BsYXk6IGZ1bmN0aW9uIChjb250ZXh0KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gY29udGV4dC5kYXRhc2V0LmRhdGFbY29udGV4dC5kYXRhSW5kZXhdO1xyXG4gICAgICAgICAgICBjb25zdCBwZXJjZW50YWdlID0gKHZhbHVlIC8gdG90YWwpICogMTAwO1xyXG4gICAgICAgICAgICByZXR1cm4gcGVyY2VudGFnZSA+PSA1OyAvLyBPbmx5IHNob3cgaWYgNSUgb3IgbW9yZVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHBsdWdpbnM6IFtDaGFydERhdGFMYWJlbHNdLFxyXG4gIH0pO1xyXG59XHJcblxyXG5sZXQgaW5jb21lU291cmNlQ2hhcnRJbnN0YW5jZTtcclxuXHJcbmZ1bmN0aW9uIHJlbmRlckluY29tZVNvdXJjZVBpZShjb250cmlidXRpb25zLCBzdG9jaywgcmVhbEVzdGF0ZSwgaW5zdXJhbmNlKSB7XHJcbiAgY29uc3QgY3R4ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2luY29tZVNvdXJjZUNoYXJ0JykuZ2V0Q29udGV4dCgnMmQnKTtcclxuXHJcbiAgY29uc3QgZGF0YVZhbHVlcyA9IFtjb250cmlidXRpb25zLCBzdG9jaywgcmVhbEVzdGF0ZSwgaW5zdXJhbmNlXTtcclxuICBjb25zdCB0b3RhbCA9IGRhdGFWYWx1ZXMucmVkdWNlKChhLCBiKSA9PiBhICsgYiwgMCk7XHJcblxyXG4gIGlmIChpbmNvbWVTb3VyY2VDaGFydEluc3RhbmNlKSB7XHJcbiAgICBpbmNvbWVTb3VyY2VDaGFydEluc3RhbmNlLmRlc3Ryb3koKTtcclxuICB9XHJcblxyXG4gIGluY29tZVNvdXJjZUNoYXJ0SW5zdGFuY2UgPSBuZXcgQ2hhcnQoY3R4LCB7XHJcbiAgICB0eXBlOiAncGllJyxcclxuICAgIGRhdGE6IHtcclxuICAgICAgbGFiZWxzOiBbJ0NvbnRyaWJ1dGlvbnMnLCAnU3RvY2snLCAnUmVhbCBFc3RhdGUnLCAnV2hvbGUgTGlmZSBJbnN1cmFuY2UnXSxcclxuICAgICAgZGF0YXNldHM6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBsYWJlbDogJ0luY29tZSBTb3VyY2UgQ29udHJpYnV0aW9uIGF0IFJldGlyZW1lbnQnLFxyXG4gICAgICAgICAgZGF0YTogZGF0YVZhbHVlcyxcclxuICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogWycjNTVDQkU1JywgJyNlNzRjM2MnLCAnI0YzOTY1NScsICcjQjc3Q0U5J10sXHJcbiAgICAgICAgICBib3JkZXJDb2xvcjogJyNmZmZmZmYnLFxyXG4gICAgICAgICAgYm9yZGVyV2lkdGg6IDQsXHJcbiAgICAgICAgICBob3Zlck9mZnNldDogMjAsXHJcbiAgICAgICAgfSxcclxuICAgICAgXSxcclxuICAgIH0sXHJcbiAgICBvcHRpb25zOiB7XHJcbiAgICAgIHJlc3BvbnNpdmU6IHRydWUsXHJcbiAgICAgIHBsdWdpbnM6IHtcclxuICAgICAgICB0aXRsZToge1xyXG4gICAgICAgICAgZGlzcGxheTogdHJ1ZSxcclxuICAgICAgICAgIHRleHQ6IGBJbmNvbWUgU291cmNlcyBhdCBSZXRpcmVtZW50YCxcclxuICAgICAgICAgIGZvbnQ6IHtcclxuICAgICAgICAgICAgc2l6ZTogMjAsXHJcbiAgICAgICAgICAgIHdlaWdodDogJ2JvbGQnLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGNvbG9yOiAnIzAwMDAwMCcsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBsZWdlbmQ6IHtcclxuICAgICAgICAgIHBvc2l0aW9uOiAncmlnaHQnLFxyXG4gICAgICAgICAgbGFiZWxzOiB7XHJcbiAgICAgICAgICAgIGJveFdpZHRoOiAxNCxcclxuICAgICAgICAgICAgcGFkZGluZzogMTYsXHJcbiAgICAgICAgICAgIGZvbnQ6IHtcclxuICAgICAgICAgICAgICBzaXplOiAxNCxcclxuICAgICAgICAgICAgICBjb2xvcjogJyMwMDAwMDAnLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHRvb2x0aXA6IHtcclxuICAgICAgICAgIGNhbGxiYWNrczoge1xyXG4gICAgICAgICAgICBsYWJlbDogZnVuY3Rpb24gKGN0eCkge1xyXG4gICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gY3R4LnBhcnNlZDtcclxuICAgICAgICAgICAgICBjb25zdCBwZXJjZW50YWdlID0gKCh2YWx1ZSAvIHRvdGFsKSAqIDEwMCkudG9GaXhlZCgyKTtcclxuICAgICAgICAgICAgICByZXR1cm4gYCR7XHJcbiAgICAgICAgICAgICAgICBjdHgubGFiZWxcclxuICAgICAgICAgICAgICB9OiAkJHt2YWx1ZS50b0xvY2FsZVN0cmluZygpfSAoJHtwZXJjZW50YWdlfSUpYDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgICBkYXRhbGFiZWxzOiB7XHJcbiAgICAgICAgICBjb2xvcjogJ3doaXRlJyxcclxuICAgICAgICAgIGZvbnQ6IHtcclxuICAgICAgICAgICAgd2VpZ2h0OiAnYm9sZCcsXHJcbiAgICAgICAgICAgIHNpemU6IDE0LFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGZvcm1hdHRlcjogKHZhbHVlLCBjdHgpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgcGVyY2VudGFnZSA9ICh2YWx1ZSAvIHRvdGFsKSAqIDEwMDtcclxuICAgICAgICAgICAgcmV0dXJuIHBlcmNlbnRhZ2UgPj0gNSA/IGAke3BlcmNlbnRhZ2UudG9GaXhlZCgxKX0lYCA6ICcnO1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgICBhbmltYXRpb246IHtcclxuICAgICAgICBhbmltYXRlUm90YXRlOiB0cnVlLFxyXG4gICAgICAgIGFuaW1hdGVTY2FsZTogdHJ1ZSxcclxuICAgICAgICBkdXJhdGlvbjogMTUwMCxcclxuICAgICAgICBlYXNpbmc6ICdlYXNlT3V0Qm91bmNlJyxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICBwbHVnaW5zOiBbQ2hhcnREYXRhTGFiZWxzXSxcclxuICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gY2FsY3VsYXRlUmVudGFsUHJvcGVydHkoKSB7XHJcbiAgLy8gR2V0IHZhbHVlcyBhbmQgY29udmVydCB0byBudW1iZXJzXHJcbiAgbGV0IHByb3BlcnR5UHJpY2UgPVxyXG4gICAgcGFyc2VGbG9hdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncHJvcGVydHlQcmljZScpLnZhbHVlLnRyaW0oKSkgfHwgMDtcclxuICBsZXQgZG93blBheW1lbnRQZXJjZW50ID1cclxuICAgIHBhcnNlRmxvYXQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Rvd25QYXltZW50JykudmFsdWUudHJpbSgpKSB8fCAwO1xyXG4gIGxldCBkb3duUGF5bWVudCA9IChkb3duUGF5bWVudFBlcmNlbnQgLyAxMDApICogcHJvcGVydHlQcmljZTtcclxuICBsZXQgbG9hblRlcm0gPVxyXG4gICAgcGFyc2VGbG9hdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbG9hblRlcm0nKS52YWx1ZS50cmltKCkpIHx8IDA7XHJcbiAgbGV0IGludGVyZXN0UmF0ZSA9XHJcbiAgICBwYXJzZUZsb2F0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbnRlcmVzdFJhdGUnKS52YWx1ZS50cmltKCkpIHx8IDA7XHJcbiAgbGV0IG1vbnRobHlSZW50ID1cclxuICAgIHBhcnNlRmxvYXQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vbnRobHlSZW50JykudmFsdWUudHJpbSgpKSB8fCAwO1xyXG4gIGxldCB2YWNhbmN5UmF0ZSA9XHJcbiAgICBwYXJzZUZsb2F0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2YWNhbmN5UmF0ZScpLnZhbHVlLnRyaW0oKSkgfHwgMDtcclxuICBsZXQgcHJvcGVydHlUYXhlcyA9XHJcbiAgICBwYXJzZUZsb2F0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwcm9wZXJ0eVRheGVzJykudmFsdWUudHJpbSgpKSB8fCAwO1xyXG4gIGxldCBpbnN1cmFuY2VDb3N0cyA9XHJcbiAgICBwYXJzZUZsb2F0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbnN1cmFuY2VDb3N0cycpLnZhbHVlLnRyaW0oKSkgfHwgMDtcclxuICBsZXQgbWFpbnRlbmFuY2VDb3N0cyA9XHJcbiAgICBwYXJzZUZsb2F0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYWludGVuYW5jZUNvc3RzJykudmFsdWUudHJpbSgpKSB8fCAwO1xyXG4gIGxldCBtYW5hZ2VtZW50RmVlcyA9XHJcbiAgICBwYXJzZUZsb2F0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYW5hZ2VtZW50RmVlcycpLnZhbHVlLnRyaW0oKSkgfHwgMDtcclxuICBsZXQgdXRpbGl0aWVzID1cclxuICAgIHBhcnNlRmxvYXQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3V0aWxpdGllcycpLnZhbHVlLnRyaW0oKSkgfHwgMDtcclxuICBsZXQgcmVub3ZhdGlvbnMgPVxyXG4gICAgcGFyc2VGbG9hdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVub3ZhdGlvbnMnKS52YWx1ZS50cmltKCkpIHx8IDA7XHJcbiAgbGV0IHJlbnRHcm93dGggPVxyXG4gICAgcGFyc2VGbG9hdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVudEdyb3d0aCcpLnZhbHVlLnRyaW0oKSkgfHwgMDtcclxuICBsZXQgY2xvc2luZ0Nvc3RzUGVyY2VudCA9XHJcbiAgICBwYXJzZUZsb2F0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjbG9zaW5nQ29zdHNSZW50JykudmFsdWUudHJpbSgpKSB8fCAwO1xyXG4gIGxldCBjbG9zaW5nQ29zdHMgPSAoY2xvc2luZ0Nvc3RzUGVyY2VudCAvIDEwMCkgKiBwcm9wZXJ0eVByaWNlO1xyXG4gIC8vIGdldHRpbmcgdGltZSB2YWx1ZVxyXG4gIGxldCB0aW1lRHVyYXRpb24gPVxyXG4gICAgcGFyc2VJbnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RpbWVEdXJhdGlvbicpLnZhbHVlLnRyaW0oKSkgfHwgMTA7XHJcbiAgbGV0IGFwcHJlY2lhdGlvblJhdGUgPVxyXG4gICAgcGFyc2VGbG9hdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBwcmVjaWF0aW9uUmF0ZScpLnZhbHVlLnRyaW0oKSkgfHwgMztcclxuXHJcbiAgLy8gUmVmZXJlbmNlIGVycm9yIHNwYW4gZWxlbWVudHNcclxuICBsZXQgZXJyb3JzID0ge1xyXG4gICAgcHJvcGVydHlQcmljZTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Vycm9yUHJvcGVydHlQcmljZScpLFxyXG4gICAgZG93blBheW1lbnQ6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlcnJvckRvd25QYXltZW50UGVyJyksXHJcbiAgICBsb2FuVGVybTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Vycm9yTG9hblRlcm0nKSxcclxuICAgIGludGVyZXN0UmF0ZTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Vycm9ySW50ZXJlc3RSYXRlJyksXHJcbiAgICBtb250aGx5UmVudDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Vycm9yTW9udGhseVJlbnQnKSxcclxuICAgIHZhY2FuY3lSYXRlOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZXJyb3JWYWNhbmN5UmF0ZScpLFxyXG4gICAgcHJvcGVydHlUYXhlczogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Vycm9yUHJvcGVydHlUYXhlcycpLFxyXG4gICAgaW5zdXJhbmNlQ29zdHM6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlcnJvckluc3VyYW5jZUNvc3RzJyksXHJcbiAgICBtYWludGVuYW5jZUNvc3RzOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZXJyb3JNYWludGVuYW5jZUNvc3RzJyksXHJcbiAgICBtYW5hZ2VtZW50RmVlczogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Vycm9yTWFuYWdlbWVudEZlZXMnKSxcclxuICAgIHV0aWxpdGllczogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Vycm9yVXRpbGl0aWVzJyksXHJcbiAgICByZW5vdmF0aW9uczogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Vycm9yUmVub3ZhdGlvbnMnKSxcclxuICAgIHJlbnRHcm93dGg6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlcnJvclJlbnRHcm93dGgnKSxcclxuICAgIGNsb3NpbmdDb3N0czogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Vycm9yQ2xvc2luZ0Nvc3RzUmVudCcpLFxyXG4gIH07XHJcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnJlbnRhbGNoYXJ0cycpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xyXG4gIC8vIENsZWFyIHByZXZpb3VzIGVycm9yIG1lc3NhZ2VzXHJcbiAgT2JqZWN0LnZhbHVlcyhlcnJvcnMpLmZvckVhY2goKGVycm9yKSA9PiAoZXJyb3IuaW5uZXJUZXh0ID0gJycpKTtcclxuXHJcbiAgbGV0IGlzVmFsaWQgPSB0cnVlO1xyXG5cclxuICAvLyDwn5qoICoqVmFsaWRhdGlvbnMqKlxyXG4gIGZ1bmN0aW9uIHZhbGlkYXRlSW5wdXQoXHJcbiAgICB2YWx1ZSxcclxuICAgIGVycm9yRmllbGQsXHJcbiAgICBmaWVsZE5hbWUsXHJcbiAgICBtaW4gPSAwLFxyXG4gICAgbWF4ID0gSW5maW5pdHlcclxuICApIHtcclxuICAgIGlmIChmaWVsZE5hbWUgPT0gJ0Rvd24gUGF5bWVudCAoJSknICYmICh2YWx1ZSA8IG1pbiB8fCB2YWx1ZSA+IG1heCkpIHtcclxuICAgICAgZXJyb3JGaWVsZC5pbm5lclRleHQgPSBgJHtmaWVsZE5hbWV9IG11c3QgYmUgbGVzcyB0aGFuIDEwMCAuYDtcclxuICAgIH0gZWxzZSBpZiAoXHJcbiAgICAgIGZpZWxkTmFtZSA9PSAnTG9hbiBUZXJtIChZZWFycyknICYmXHJcbiAgICAgICh2YWx1ZSA8IG1pbiB8fCB2YWx1ZSA+IG1heClcclxuICAgICkge1xyXG4gICAgICBlcnJvckZpZWxkLmlubmVyVGV4dCA9IGAke2ZpZWxkTmFtZX0gbXVzdCBiZSBsZXNzIHRoYW4gMzAgLmA7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAodmFsdWUgPCBtaW4gfHwgdmFsdWUgPiBtYXgpIHtcclxuICAgICAgICBlcnJvckZpZWxkLmlubmVyVGV4dCA9IGAke2ZpZWxkTmFtZX0gbXVzdCBiZSBncmVhdGVyIHRoYW4gJHttaW59IC5gO1xyXG4gICAgICAgIGlzVmFsaWQgPSBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdmFsaWRhdGVJbnB1dChwcm9wZXJ0eVByaWNlLCBlcnJvcnMucHJvcGVydHlQcmljZSwgJ1Byb3BlcnR5IFByaWNlJywgMTAwMCk7XHJcbiAgdmFsaWRhdGVJbnB1dChcclxuICAgIGRvd25QYXltZW50UGVyY2VudCxcclxuICAgIGVycm9ycy5kb3duUGF5bWVudCxcclxuICAgICdEb3duIFBheW1lbnQgKCUpJyxcclxuICAgIDAsXHJcbiAgICAxMDBcclxuICApO1xyXG4gIHZhbGlkYXRlSW5wdXQobG9hblRlcm0sIGVycm9ycy5sb2FuVGVybSwgJ0xvYW4gVGVybSAoWWVhcnMpJywgMSwgMzApO1xyXG4gIHZhbGlkYXRlSW5wdXQoaW50ZXJlc3RSYXRlLCBlcnJvcnMuaW50ZXJlc3RSYXRlLCAnSW50ZXJlc3QgUmF0ZSAoJSknLCAwLCAxMDApO1xyXG4gIHZhbGlkYXRlSW5wdXQobW9udGhseVJlbnQsIGVycm9ycy5tb250aGx5UmVudCwgJ01vbnRobHkgUmVudCcsIDApO1xyXG4gIHZhbGlkYXRlSW5wdXQodmFjYW5jeVJhdGUsIGVycm9ycy52YWNhbmN5UmF0ZSwgJ1ZhY2FuY3kgUmF0ZSAoJSknLCAwLCAxMDApO1xyXG4gIHZhbGlkYXRlSW5wdXQoXHJcbiAgICBwcm9wZXJ0eVRheGVzLFxyXG4gICAgZXJyb3JzLnByb3BlcnR5VGF4ZXMsXHJcbiAgICAnQW5udWFsIFByb3BlcnR5IFRheGVzJyxcclxuICAgIDBcclxuICApO1xyXG4gIHZhbGlkYXRlSW5wdXQoXHJcbiAgICBpbnN1cmFuY2VDb3N0cyxcclxuICAgIGVycm9ycy5pbnN1cmFuY2VDb3N0cyxcclxuICAgICdBbm51YWwgSW5zdXJhbmNlIENvc3RzJyxcclxuICAgIDBcclxuICApO1xyXG4gIHZhbGlkYXRlSW5wdXQoXHJcbiAgICBtYWludGVuYW5jZUNvc3RzLFxyXG4gICAgZXJyb3JzLm1haW50ZW5hbmNlQ29zdHMsXHJcbiAgICAnQW5udWFsIE1haW50ZW5hbmNlIENvc3RzJyxcclxuICAgIDBcclxuICApO1xyXG4gIHZhbGlkYXRlSW5wdXQoXHJcbiAgICBtYW5hZ2VtZW50RmVlcyxcclxuICAgIGVycm9ycy5tYW5hZ2VtZW50RmVlcyxcclxuICAgICdNYW5hZ2VtZW50IEZlZXMgKCUpJyxcclxuICAgIDAsXHJcbiAgICAxMDBcclxuICApO1xyXG4gIHZhbGlkYXRlSW5wdXQodXRpbGl0aWVzLCBlcnJvcnMudXRpbGl0aWVzLCAnVXRpbGl0aWVzJywgMCk7XHJcbiAgdmFsaWRhdGVJbnB1dChyZW5vdmF0aW9ucywgZXJyb3JzLnJlbm92YXRpb25zLCAnUmVub3ZhdGlvbnMnLCAwKTtcclxuICB2YWxpZGF0ZUlucHV0KHJlbnRHcm93dGgsIGVycm9ycy5yZW50R3Jvd3RoLCAnUmVudCBHcm93dGggKCUpJywgMCwgMTAwKTtcclxuICB2YWxpZGF0ZUlucHV0KFxyXG4gICAgY2xvc2luZ0Nvc3RzUGVyY2VudCxcclxuICAgIGVycm9ycy5jbG9zaW5nQ29zdHMsXHJcbiAgICAnQ2xvc2luZyBDb3N0cyAoJSknLFxyXG4gICAgMCxcclxuICAgIDEwMFxyXG4gICk7XHJcbiAgaWYgKCFpc1ZhbGlkKSByZXR1cm47XHJcblxyXG4gIC8vIOKchSBMb2FuIENhbGN1bGF0aW9uXHJcbiAgbGV0IGxvYW5BbW91bnQgPSBwcm9wZXJ0eVByaWNlIC0gZG93blBheW1lbnQ7XHJcbiAgbGV0IG1vbnRobHlSYXRlID0gaW50ZXJlc3RSYXRlIC8gMTAwIC8gMTI7XHJcbiAgbGV0IG51bVBheW1lbnRzID0gbG9hblRlcm0gKiAxMjtcclxuXHJcbiAgbGV0IG1vcnRnYWdlUGF5bWVudCA9XHJcbiAgICBtb250aGx5UmF0ZSA+IDBcclxuICAgICAgPyAobG9hbkFtb3VudCAqIChtb250aGx5UmF0ZSAqIE1hdGgucG93KDEgKyBtb250aGx5UmF0ZSwgbnVtUGF5bWVudHMpKSkgL1xyXG4gICAgICAgIChNYXRoLnBvdygxICsgbW9udGhseVJhdGUsIG51bVBheW1lbnRzKSAtIDEpXHJcbiAgICAgIDogbG9hblRlcm0gPiAwXHJcbiAgICAgID8gbG9hbkFtb3VudCAvIG51bVBheW1lbnRzXHJcbiAgICAgIDogMDtcclxuXHJcbiAgLy8g4pyFIFJlbnRhbCBJbmNvbWUgQ2FsY3VsYXRpb25cclxuICBsZXQgZ3Jvc3NSZW50SW5jb21lID0gbW9udGhseVJlbnQgKiAxMjtcclxuICBsZXQgdmFjYW5jeUxvc3MgPSBncm9zc1JlbnRJbmNvbWUgKiAodmFjYW5jeVJhdGUgLyAxMDApO1xyXG4gIGxldCBhZGp1c3RlZFJlbnRJbmNvbWUgPSBncm9zc1JlbnRJbmNvbWUgLSB2YWNhbmN5TG9zcztcclxuXHJcbiAgLy8g4pyFIE9wZXJhdGluZyBFeHBlbnNlcyBDYWxjdWxhdGlvblxyXG4gIGxldCBvcGVyYXRpbmdFeHBlbnNlcyA9XHJcbiAgICBwcm9wZXJ0eVRheGVzICtcclxuICAgIGluc3VyYW5jZUNvc3RzICtcclxuICAgIG1haW50ZW5hbmNlQ29zdHMgK1xyXG4gICAgYWRqdXN0ZWRSZW50SW5jb21lICogKG1hbmFnZW1lbnRGZWVzIC8gMTAwKSArXHJcbiAgICB1dGlsaXRpZXMgK1xyXG4gICAgcmVub3ZhdGlvbnM7XHJcbiAgLy8g4pyFIE5PSSBDYWxjdWxhdGlvblxyXG4gIGxldCBub2kgPSBhZGp1c3RlZFJlbnRJbmNvbWUgLSBvcGVyYXRpbmdFeHBlbnNlcztcclxuXHJcbiAgLy8g4pyFIEFubnVhbCBNb3J0Z2FnZSBQYXltZW50XHJcbiAgbGV0IGFubnVhbE1vcnRnYWdlUGF5bWVudCA9IG1vcnRnYWdlUGF5bWVudCAqIDEyO1xyXG5cclxuICAvLyDinIUgQ2FzaCBGbG93IENhbGN1bGF0aW9uXHJcbiAgbGV0IGNhc2hGbG93QW5udWFsID0gbm9pIC0gYW5udWFsTW9ydGdhZ2VQYXltZW50O1xyXG4gIGxldCBjYXNoRmxvd01vbnRobHkgPSBjYXNoRmxvd0FubnVhbCAvIDEyO1xyXG5cclxuICAvLyDinIUgQ2FwIFJhdGUgQ2FsY3VsYXRpb25cclxuICBsZXQgY2FwUmF0ZSA9IChub2kgLyBwcm9wZXJ0eVByaWNlKSAqIDEwMDtcclxuXHJcbiAgLy8g4pyFIENhc2gtb24tQ2FzaCBSZXR1cm4gQ2FsY3VsYXRpb25cclxuICBsZXQgdG90YWxDYXNoSW52ZXN0ZWQgPSBkb3duUGF5bWVudCArIGNsb3NpbmdDb3N0cyArIHJlbm92YXRpb25zO1xyXG4gIGxldCBjb2NSZXR1cm4gPVxyXG4gICAgdG90YWxDYXNoSW52ZXN0ZWQgPiAwID8gKGNhc2hGbG93QW5udWFsIC8gdG90YWxDYXNoSW52ZXN0ZWQpICogMTAwIDogMDtcclxuXHJcbiAgLy8g4pyFIERlYnQgU2VydmljZSBSYXRpbyAoRFNSKSBDYWxjdWxhdGlvblxyXG4gIGxldCBkZWJ0U2VydmljZVJhdGlvID1cclxuICAgIGFubnVhbE1vcnRnYWdlUGF5bWVudCA+IDAgPyBub2kgLyBhbm51YWxNb3J0Z2FnZVBheW1lbnQgOiAwO1xyXG4gIC8vIEZvciBjaGFydHMgYW5kIHRhYmxlIHByb2plY3Rpb25zXHJcbiAgbGV0IHJlbnRQcm9qZWN0aW9ucyA9IFtdO1xyXG4gIGxldCBhZGp1c3RlZFJlbnRQcm9qZWN0aW9ucyA9IFtdO1xyXG5cclxuICBsZXQgbW9udGhseVByb3BlcnR5VGF4ZXMgPSBwcm9wZXJ0eVRheGVzIC8gMTI7XHJcbiAgbGV0IG1vbnRobHlJbnN1cmFuY2UgPSBpbnN1cmFuY2VDb3N0cyAvIDEyO1xyXG4gIGxldCBtb250aGx5TWFpbnRlbmFuY2UgPSBtYWludGVuYW5jZUNvc3RzIC8gMTI7XHJcbiAgbGV0IG1vbnRobHlNYW5hZ2VtZW50RmVlcyA9XHJcbiAgICAoYWRqdXN0ZWRSZW50SW5jb21lICogKG1hbmFnZW1lbnRGZWVzIC8gMTAwKSkgLyAxMjtcclxuICBsZXQgbW9udGhseVV0aWxpdGllcyA9IHV0aWxpdGllcyAvIDEyO1xyXG4gIGxldCBtb250aGx5UmVub3ZhdGlvbnMgPSByZW5vdmF0aW9ucyAvIDEyO1xyXG5cclxuICBsZXQgdG90YWxNb250aGx5Q29zdHMgPVxyXG4gICAgbW9ydGdhZ2VQYXltZW50ICtcclxuICAgIG1vbnRobHlQcm9wZXJ0eVRheGVzICtcclxuICAgIG1vbnRobHlJbnN1cmFuY2UgK1xyXG4gICAgbW9udGhseU1haW50ZW5hbmNlICtcclxuICAgIG1vbnRobHlNYW5hZ2VtZW50RmVlcyArXHJcbiAgICBtb250aGx5VXRpbGl0aWVzICtcclxuICAgIG1vbnRobHlSZW5vdmF0aW9ucztcclxuXHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aW1lRHVyYXRpb247IGkrKykge1xyXG4gICAgbGV0IHllYXJSZW50ID0gbW9udGhseVJlbnQgKiAxMiAqIE1hdGgucG93KDEgKyByZW50R3Jvd3RoIC8gMTAwLCBpKTtcclxuICAgIGxldCB5ZWFyVmFjYW5jeUxvc3MgPSB5ZWFyUmVudCAqICh2YWNhbmN5UmF0ZSAvIDEwMCk7XHJcbiAgICBsZXQgeWVhckFkanVzdGVkUmVudCA9IHllYXJSZW50IC0geWVhclZhY2FuY3lMb3NzO1xyXG4gICAgcmVudFByb2plY3Rpb25zLnB1c2goeWVhclJlbnQpO1xyXG4gICAgYWRqdXN0ZWRSZW50UHJvamVjdGlvbnMucHVzaCh5ZWFyQWRqdXN0ZWRSZW50KTtcclxuICB9XHJcblxyXG4gIC8vIOKchSBEaXNwbGF5IFJlc3VsdHNcclxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbG9hbkFtb3VudCcpLmlubmVyVGV4dCA9IGZvcm1hdE51bWJlcihsb2FuQW1vdW50KTtcclxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW9ydGdhZ2VQYXltZW50JykuaW5uZXJUZXh0ID1cclxuICAgIGZvcm1hdE51bWJlcih0b3RhbE1vbnRobHlDb3N0cyk7XHJcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25vaScpLmlubmVyVGV4dCA9IGZvcm1hdE51bWJlcihub2kpO1xyXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYXNoRmxvdycpLmlubmVyVGV4dCA9IGZvcm1hdE51bWJlcihjYXNoRmxvd01vbnRobHkpO1xyXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYXBSYXRlJykuaW5uZXJUZXh0ID1cclxuICAgIGZvcm1hdE51bWJlclBlcmNlbnQoY2FwUmF0ZSkgKyAnJSc7XHJcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvY1JldHVybicpLmlubmVyVGV4dCA9XHJcbiAgICBmb3JtYXROdW1iZXJQZXJjZW50KGNvY1JldHVybikgKyAnJSc7XHJcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FubnVhbENhc2hGbG93JykuaW5uZXJUZXh0ID1cclxuICAgIGZvcm1hdE51bWJlcihjYXNoRmxvd0FubnVhbCk7XHJcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Nhc2hJbnZlc3RlZFJlbnQnKS5pbm5lclRleHQgPVxyXG4gICAgZm9ybWF0TnVtYmVyKHRvdGFsQ2FzaEludmVzdGVkKTtcclxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGVidFNlcnZpY2VSYXRpbycpLmlubmVyVGV4dCA9XHJcbiAgICBkZWJ0U2VydmljZVJhdGlvLnRvRml4ZWQoMik7XHJcblxyXG4gIC8vIENoYW5nZSBiYWNrZ3JvdW5kIGNvbG9yIGlmIERTUiBpcyBncmVhdGVyIHRoYW4gMS4yXHJcbiAgbGV0IGRzckVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGVidGNhcmQnKTtcclxuICBpZiAoZGVidFNlcnZpY2VSYXRpbyA+IDEuMikge1xyXG4gICAgZHNyRWxlbWVudC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAnI2QwYjg3MCc7XHJcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZHNzcicpLnN0eWxlLmNvbG9yID0gJ2JsYWNrJztcclxuICB9IGVsc2Uge1xyXG4gICAgZHNyRWxlbWVudC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAncmdiKDI0OCwgMTA5LCAxMDkpJzsgLy8gUmVzZXQgdG8gZGVmYXVsdCBpZiBEU1IgaXMgbm90ID4gMS4yXHJcbiAgfVxyXG4gIHJlbmRlclBvcnRmb2xpb1BpZUNoYXJ0KFxyXG4gICAgYWRqdXN0ZWRSZW50SW5jb21lLFxyXG4gICAgb3BlcmF0aW5nRXhwZW5zZXMsXHJcbiAgICBjYXNoRmxvd0FubnVhbCxcclxuICAgIHRpbWVEdXJhdGlvblxyXG4gICk7XHJcbiAgcmVuZGVyQ2FzaEZsb3dQaWVDaGFydChcclxuICAgIGFubnVhbE1vcnRnYWdlUGF5bWVudCxcclxuICAgIG9wZXJhdGluZ0V4cGVuc2VzLFxyXG4gICAgY2FzaEZsb3dBbm51YWwsXHJcbiAgICB0aW1lRHVyYXRpb25cclxuICApO1xyXG4gIHZhciB5ZWFyID0gcGFyc2VGbG9hdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgneWVhcnNfdGJsJykudmFsdWUudHJpbSgpKSB8fCAxO1xyXG4gIC8vIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwieWVhcl9iXCIpLmlubmVyVGV4dCA9IHllYXI7XHJcbiAgZ2V0VGFibGVEYXRhKHllYXIsIHRydWUpO1xyXG4gIHVwZGF0ZVRhYmxlUmFuZ2UoKTtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVuZGVyUG9ydGZvbGlvUGllQ2hhcnQoXHJcbiAgYWRqdXN0ZWRSZW50SW5jb21lLFxyXG4gIG9wZXJhdGluZ0V4cGVuc2VzLFxyXG4gIGNhc2hGbG93QW5udWFsLFxyXG4gIHRpbWVEdXJhdGlvbiA9IDFcclxuKSB7XHJcbiAgY29uc3QgY3R4ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BvcnRmb2xpb1BpZUNoYXJ0JykuZ2V0Q29udGV4dCgnMmQnKTtcclxuXHJcbiAgaWYgKHdpbmRvdy5wb3J0Zm9saW9QaWVDaGFydCBpbnN0YW5jZW9mIENoYXJ0KSB7XHJcbiAgICB3aW5kb3cucG9ydGZvbGlvUGllQ2hhcnQuZGVzdHJveSgpO1xyXG4gIH1cclxuXHJcbiAgLy8gU2NhbGUgdmFsdWVzIGJhc2VkIG9uIHNlbGVjdGVkIGR1cmF0aW9uXHJcbiAgY29uc3Qgc2NhbGVkSW5jb21lID0gYWRqdXN0ZWRSZW50SW5jb21lICogdGltZUR1cmF0aW9uO1xyXG4gIGNvbnN0IHNjYWxlZEV4cGVuc2VzID0gb3BlcmF0aW5nRXhwZW5zZXMgKiB0aW1lRHVyYXRpb247XHJcbiAgY29uc3Qgc2NhbGVkQ2FzaEZsb3cgPSBjYXNoRmxvd0FubnVhbCAqIHRpbWVEdXJhdGlvbjtcclxuXHJcbiAgY29uc3QgbGFiZWxzID0gWydJbmNvbWUnLCAnRXhwZW5zZXMnXTtcclxuICBjb25zdCB2YWx1ZXMgPSBbc2NhbGVkSW5jb21lLCBzY2FsZWRFeHBlbnNlc107XHJcbiAgY29uc3QgY29sb3JzID0gWycjQjc3Q0U5JywgJyM1NUNCRTUnXTtcclxuXHJcbiAgY29uc3QgcHJvZml0TGFiZWwgPSBzY2FsZWRDYXNoRmxvdyA+PSAwID8gJ1Byb2ZpdCcgOiAnTG9zcyc7XHJcbiAgY29uc3QgcHJvZml0VmFsdWUgPSBNYXRoLmFicyhzY2FsZWRDYXNoRmxvdyk7XHJcbiAgY29uc3QgcHJvZml0Q29sb3IgPSBzY2FsZWRDYXNoRmxvdyA+PSAwID8gJyMzQjhEMjEnIDogJyNGMzk2NTUnO1xyXG5cclxuICBsYWJlbHMucHVzaChwcm9maXRMYWJlbCk7XHJcbiAgdmFsdWVzLnB1c2gocHJvZml0VmFsdWUpO1xyXG4gIGNvbG9ycy5wdXNoKHByb2ZpdENvbG9yKTtcclxuXHJcbiAgY29uc3QgdG90YWwgPSB2YWx1ZXMucmVkdWNlKChhLCBiKSA9PiBhICsgYiwgMCk7XHJcblxyXG4gIHdpbmRvdy5wb3J0Zm9saW9QaWVDaGFydCA9IG5ldyBDaGFydChjdHgsIHtcclxuICAgIHR5cGU6ICdwaWUnLFxyXG4gICAgZGF0YToge1xyXG4gICAgICBsYWJlbHM6IGxhYmVscyxcclxuICAgICAgZGF0YXNldHM6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBkYXRhOiB2YWx1ZXMsXHJcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IGNvbG9ycyxcclxuICAgICAgICAgIGJvcmRlckNvbG9yOiAnI2ZmZicsXHJcbiAgICAgICAgICBib3JkZXJXaWR0aDogMixcclxuICAgICAgICAgIGhvdmVyT2Zmc2V0OiAxMixcclxuICAgICAgICB9LFxyXG4gICAgICBdLFxyXG4gICAgfSxcclxuICAgIG9wdGlvbnM6IHtcclxuICAgICAgcmVzcG9uc2l2ZTogdHJ1ZSxcclxuICAgICAgcGx1Z2luczoge1xyXG4gICAgICAgIGxlZ2VuZDoge1xyXG4gICAgICAgICAgcG9zaXRpb246ICdib3R0b20nLFxyXG4gICAgICAgICAgbGFiZWxzOiB7XHJcbiAgICAgICAgICAgIGNvbG9yOiAnYmxhY2snLFxyXG4gICAgICAgICAgICBmb250OiB7XHJcbiAgICAgICAgICAgICAgc2l6ZTogMTQsXHJcbiAgICAgICAgICAgICAgZmFtaWx5OiAnQXJpYWwsIHNhbnMtc2VyaWYnLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBwYWRkaW5nOiAxNSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgICB0aXRsZToge1xyXG4gICAgICAgICAgZGlzcGxheTogdHJ1ZSxcclxuICAgICAgICAgIHRleHQ6IGBQb3J0Zm9saW8gQ29tcG9zaXRpb24gKE92ZXIgJHt0aW1lRHVyYXRpb259IFllYXIke1xyXG4gICAgICAgICAgICB0aW1lRHVyYXRpb24gPiAxID8gJ3MnIDogJydcclxuICAgICAgICAgIH0pYCxcclxuICAgICAgICAgIGZvbnQ6IHtcclxuICAgICAgICAgICAgc2l6ZTogMjAsXHJcbiAgICAgICAgICAgIHdlaWdodDogJ2JvbGQnLFxyXG4gICAgICAgICAgICBmYW1pbHk6ICdBcmlhbCwgc2Fucy1zZXJpZicsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgY29sb3I6ICcjMzMzJyxcclxuICAgICAgICAgIHBhZGRpbmc6IHtcclxuICAgICAgICAgICAgdG9wOiAxMCxcclxuICAgICAgICAgICAgYm90dG9tOiAyMCxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgICB0b29sdGlwOiB7XHJcbiAgICAgICAgICBjYWxsYmFja3M6IHtcclxuICAgICAgICAgICAgbGFiZWw6IGZ1bmN0aW9uIChjb250ZXh0KSB7XHJcbiAgICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBwYXJzZUZsb2F0KGNvbnRleHQucmF3KTtcclxuICAgICAgICAgICAgICBjb25zdCBwZXJjZW50YWdlID0gKCh2YWx1ZSAvIHRvdGFsKSAqIDEwMCkudG9GaXhlZCgxKTtcclxuICAgICAgICAgICAgICByZXR1cm4gYCR7Y29udGV4dC5sYWJlbH06ICQke3ZhbHVlLnRvRml4ZWQoMil9ICgke3BlcmNlbnRhZ2V9JSlgO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBhZnRlckJvZHk6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gYFRvdGFsOiAkJHt0b3RhbC50b0ZpeGVkKDIpfWA7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGF0YWxhYmVsczoge1xyXG4gICAgICAgICAgY29sb3I6ICd3aGl0ZScsXHJcbiAgICAgICAgICBmb250OiB7XHJcbiAgICAgICAgICAgIHNpemU6IDE0LFxyXG4gICAgICAgICAgICB3ZWlnaHQ6ICdib2xkJyxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBmb3JtYXR0ZXI6ICh2YWx1ZSwgY29udGV4dCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBzdW0gPSBjb250ZXh0LmNoYXJ0LmRhdGEuZGF0YXNldHNbMF0uZGF0YS5yZWR1Y2UoXHJcbiAgICAgICAgICAgICAgKGEsIGIpID0+IGEgKyBiLFxyXG4gICAgICAgICAgICAgIDBcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgY29uc3QgcGVyY2VudGFnZSA9ICgodmFsdWUgLyBzdW0pICogMTAwKS50b0ZpeGVkKDEpO1xyXG4gICAgICAgICAgICByZXR1cm4gcGVyY2VudGFnZSA+PSA1ID8gYCR7cGVyY2VudGFnZX0lYCA6ICcnO1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHBsdWdpbnM6IFtDaGFydERhdGFMYWJlbHNdLFxyXG4gIH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiByZW5kZXJDYXNoRmxvd1BpZUNoYXJ0KFxyXG4gIG1vcnRnYWdlUGF5bWVudEFubnVhbCxcclxuICBvcGVyYXRpbmdFeHBlbnNlcyxcclxuICBjYXNoRmxvd0FubnVhbCxcclxuICB0aW1lRHVyYXRpb24gPSAxXHJcbikge1xyXG4gIGNvbnN0IGN0eCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYXNoRmxvd1BpZUNoYXJ0JykuZ2V0Q29udGV4dCgnMmQnKTtcclxuXHJcbiAgaWYgKHdpbmRvdy5jYXNoRmxvd1BpZUNoYXJ0IGluc3RhbmNlb2YgQ2hhcnQpIHtcclxuICAgIHdpbmRvdy5jYXNoRmxvd1BpZUNoYXJ0LmRlc3Ryb3koKTtcclxuICB9XHJcblxyXG4gIC8vIFNjYWxlIGFsbCB2YWx1ZXMgYnkgdGltZSBkdXJhdGlvbiAoaW4geWVhcnMpXHJcbiAgY29uc3Qgc2NhbGVkTW9ydGdhZ2UgPSBtb3J0Z2FnZVBheW1lbnRBbm51YWwgKiB0aW1lRHVyYXRpb247XHJcbiAgY29uc3Qgc2NhbGVkRXhwZW5zZXMgPSBvcGVyYXRpbmdFeHBlbnNlcyAqIHRpbWVEdXJhdGlvbjtcclxuICBjb25zdCBzY2FsZWRDYXNoRmxvdyA9IGNhc2hGbG93QW5udWFsICogdGltZUR1cmF0aW9uO1xyXG5cclxuICBjb25zdCBsYWJlbHMgPSBbJ01vcnRnYWdlIFBheW1lbnRzJywgJ09wZXJhdGluZyBFeHBlbnNlcyddO1xyXG4gIGNvbnN0IHZhbHVlcyA9IFtzY2FsZWRNb3J0Z2FnZSwgc2NhbGVkRXhwZW5zZXNdO1xyXG4gIGNvbnN0IGNvbG9ycyA9IFsnIzU1Q0JFNScsICcjRjM5NjU1J107XHJcblxyXG4gIGNvbnN0IG5ldExhYmVsID0gc2NhbGVkQ2FzaEZsb3cgPj0gMCA/ICdOZXQgUHJvZml0JyA6ICdOZXQgTG9zcyc7XHJcbiAgY29uc3QgbmV0Q29sb3IgPSBzY2FsZWRDYXNoRmxvdyA+PSAwID8gJyM0Q0FGNTAnIDogJyNGRjU3MjInO1xyXG5cclxuICBsYWJlbHMucHVzaChuZXRMYWJlbCk7XHJcbiAgdmFsdWVzLnB1c2goTWF0aC5hYnMoc2NhbGVkQ2FzaEZsb3cpKTtcclxuICBjb2xvcnMucHVzaChuZXRDb2xvcik7XHJcblxyXG4gIGNvbnN0IHRvdGFsRmxvdyA9IHZhbHVlcy5yZWR1Y2UoKGFjYywgdmFsKSA9PiBhY2MgKyB2YWwsIDApO1xyXG5cclxuICB3aW5kb3cuY2FzaEZsb3dQaWVDaGFydCA9IG5ldyBDaGFydChjdHgsIHtcclxuICAgIHR5cGU6ICdwaWUnLFxyXG4gICAgZGF0YToge1xyXG4gICAgICBsYWJlbHM6IGxhYmVscyxcclxuICAgICAgZGF0YXNldHM6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBsYWJlbDogJ0Nhc2ggRmxvdyBCcmVha2Rvd24nLFxyXG4gICAgICAgICAgZGF0YTogdmFsdWVzLm1hcCgodmFsKSA9PiB2YWwudG9GaXhlZCgyKSksXHJcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IGNvbG9ycyxcclxuICAgICAgICAgIGhvdmVyT2Zmc2V0OiAxNSxcclxuICAgICAgICAgIGJvcmRlcldpZHRoOiAzLFxyXG4gICAgICAgICAgYm9yZGVyQ29sb3I6ICcjZmZmJyxcclxuICAgICAgICB9LFxyXG4gICAgICBdLFxyXG4gICAgfSxcclxuICAgIG9wdGlvbnM6IHtcclxuICAgICAgcmVzcG9uc2l2ZTogdHJ1ZSxcclxuICAgICAgaW50ZXJhY3Rpb246IHtcclxuICAgICAgICBtb2RlOiAnbmVhcmVzdCcsXHJcbiAgICAgICAgaW50ZXJzZWN0OiBmYWxzZSxcclxuICAgICAgfSxcclxuICAgICAgcGx1Z2luczoge1xyXG4gICAgICAgIHRpdGxlOiB7XHJcbiAgICAgICAgICBkaXNwbGF5OiB0cnVlLFxyXG4gICAgICAgICAgdGV4dDogYENhc2ggRmxvdyBCcmVha2Rvd24gKE92ZXIgJHt0aW1lRHVyYXRpb259IFllYXIke1xyXG4gICAgICAgICAgICB0aW1lRHVyYXRpb24gPiAxID8gJ3MnIDogJydcclxuICAgICAgICAgIH0pYCxcclxuICAgICAgICAgIGZvbnQ6IHtcclxuICAgICAgICAgICAgc2l6ZTogMjIsXHJcbiAgICAgICAgICAgIHdlaWdodDogJ2JvbGQnLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGNvbG9yOiAnIzMzMycsXHJcbiAgICAgICAgfSxcclxuICAgICAgICB0b29sdGlwOiB7XHJcbiAgICAgICAgICBlbmFibGVkOiB0cnVlLFxyXG4gICAgICAgICAgbW9kZTogJ2luZGV4JyxcclxuICAgICAgICAgIGludGVyc2VjdDogZmFsc2UsXHJcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICdyZ2JhKDAsIDAsIDAsIDAuOSknLFxyXG4gICAgICAgICAgdGl0bGVGb250OiB7XHJcbiAgICAgICAgICAgIHNpemU6IDIwLFxyXG4gICAgICAgICAgICB3ZWlnaHQ6ICdib2xkJyxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBib2R5Rm9udDoge1xyXG4gICAgICAgICAgICBzaXplOiAxNixcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBwYWRkaW5nOiAxNCxcclxuICAgICAgICAgIGJveFBhZGRpbmc6IDYsXHJcbiAgICAgICAgICBib3JkZXJDb2xvcjogJyNmZmYnLFxyXG4gICAgICAgICAgYm9yZGVyV2lkdGg6IDEsXHJcbiAgICAgICAgICBjYWxsYmFja3M6IHtcclxuICAgICAgICAgICAgbGFiZWw6IGZ1bmN0aW9uIChjb250ZXh0KSB7XHJcbiAgICAgICAgICAgICAgY29uc3QgbGFiZWwgPSBjb250ZXh0LmxhYmVsIHx8ICcnO1xyXG4gICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gcGFyc2VGbG9hdChjb250ZXh0LnJhdyk7XHJcbiAgICAgICAgICAgICAgY29uc3QgcGVyY2VudGFnZSA9ICgodmFsdWUgLyB0b3RhbEZsb3cpICogMTAwKS50b0ZpeGVkKDIpO1xyXG4gICAgICAgICAgICAgIHJldHVybiBgJHtsYWJlbH06ICQke3ZhbHVlLnRvRml4ZWQoMil9ICgke3BlcmNlbnRhZ2V9JSlgO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBhZnRlckJvZHk6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gYFRvdGFsOiAkJHt0b3RhbEZsb3cudG9GaXhlZCgyKX1gO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIGxlZ2VuZDoge1xyXG4gICAgICAgICAgZGlzcGxheTogdHJ1ZSxcclxuICAgICAgICAgIGxhYmVsczoge1xyXG4gICAgICAgICAgICBmb250OiB7XHJcbiAgICAgICAgICAgICAgc2l6ZTogMTYsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGJveFdpZHRoOiAyNSxcclxuICAgICAgICAgICAgdXNlUG9pbnRTdHlsZTogdHJ1ZSxcclxuICAgICAgICAgICAgcGFkZGluZzogMjAsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGF0YWxhYmVsczoge1xyXG4gICAgICAgICAgY29sb3I6ICd3aGl0ZScsXHJcbiAgICAgICAgICBmb250OiB7XHJcbiAgICAgICAgICAgIHNpemU6IDE0LFxyXG4gICAgICAgICAgICB3ZWlnaHQ6ICdib2xkJyxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBmb3JtYXR0ZXI6ICh2YWx1ZSwgY29udGV4dCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBzdW0gPSBjb250ZXh0LmNoYXJ0LmRhdGEuZGF0YXNldHNbMF0uZGF0YS5yZWR1Y2UoXHJcbiAgICAgICAgICAgICAgKGEsIGIpID0+IHBhcnNlRmxvYXQoYSkgKyBwYXJzZUZsb2F0KGIpLFxyXG4gICAgICAgICAgICAgIDBcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgY29uc3QgcGVyY2VudGFnZSA9ICgodmFsdWUgLyBzdW0pICogMTAwKS50b0ZpeGVkKDEpO1xyXG4gICAgICAgICAgICByZXR1cm4gcGVyY2VudGFnZSA+PSA1ID8gYCR7cGVyY2VudGFnZX0lYCA6ICcnO1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIGFuaW1hdGlvbjoge1xyXG4gICAgICAgICAgYW5pbWF0ZVJvdGF0ZTogdHJ1ZSxcclxuICAgICAgICAgIGFuaW1hdGVTY2FsZTogdHJ1ZSxcclxuICAgICAgICAgIGR1cmF0aW9uOiAxNTAwLFxyXG4gICAgICAgICAgZWFzaW5nOiAnZWFzZU91dEJvdW5jZScsXHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICBwbHVnaW5zOiBbQ2hhcnREYXRhTGFiZWxzXSxcclxuICB9KTtcclxufVxyXG5cclxuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Rvd25sb2FkLXBkZicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gIGlmICh3aW5kb3cuanNwZGYgJiYgdHlwZW9mIGh0bWwyY2FudmFzICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgY29uc3QgeyBqc1BERiB9ID0gd2luZG93LmpzcGRmO1xyXG4gICAgY29uc3QgZG9jID0gbmV3IGpzUERGKCk7XHJcblxyXG4gICAgLy8gRnVuY3Rpb24gdG8gZ2V0IHZhbHVlcyBmcm9tIGlucHV0IGZpZWxkc1xyXG4gICAgZnVuY3Rpb24gZ2V0VmFsdWUoaWQpIHtcclxuICAgICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcclxuICAgICAgcmV0dXJuIGVsZW1lbnQgJiYgZWxlbWVudC52YWx1ZSA/IGVsZW1lbnQudmFsdWUgOiAnTi9BJztcclxuICAgIH1cclxuXHJcbiAgICAvLyBDb21iaW5lIGV4aXN0aW5nIGNvbnRlbnQgYW5kIGhvdXNlIGZsaXBwaW5nIGFuYWx5c2lzIGludG8gYSBzaW5nbGUgZGl2XHJcbiAgICBjb25zdCBjb21iaW5lZERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgY29tYmluZWREaXYuaWQgPSAnY29tYmluZWRDb250ZW50JztcclxuICAgIGNvbWJpbmVkRGl2LnN0eWxlLnBhZGRpbmcgPSAnMjBweCc7XHJcbiAgICBjb21iaW5lZERpdi5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAnI2ZmZic7XHJcbiAgICBjb21iaW5lZERpdi5zdHlsZS5jb2xvciA9ICcjMDAwJztcclxuICAgIGNvbWJpbmVkRGl2LnN0eWxlLndpZHRoID0gJzgwMHB4JztcclxuICAgIGNvbWJpbmVkRGl2LnN0eWxlLm1hcmdpbiA9ICdhdXRvJztcclxuXHJcbiAgICAvLyBDbG9uZSB0aGUgb3JpZ2luYWwgY29udGVudFxyXG4gICAgY29uc3QgY29udGVudERpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250ZW50UERGJyk7XHJcbiAgICBjb21iaW5lZERpdi5hcHBlbmRDaGlsZChjb250ZW50RGl2LmNsb25lTm9kZSh0cnVlKSk7XHJcblxyXG4gICAgLy8gQ3JlYXRlIHJlc3VsdHMgc2VjdGlvblxyXG4gICAgY29uc3QgcmVzdWx0c0RpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgcmVzdWx0c0Rpdi5pbm5lckhUTUwgPSBgXHJcbiAgICAgIDxoMiBzdHlsZT1cInRleHQtYWxpZ246Y2VudGVyOyBtYXJnaW4tdG9wOiAyMHB4O1wiPklucHV0czwvaDI+XHJcbiAgICAgIDx0YWJsZSBib3JkZXI9XCIxXCIgY2VsbHNwYWNpbmc9XCIwXCIgY2VsbHBhZGRpbmc9XCI1XCIgc3R5bGU9XCJ3aWR0aDoxMDAlOyB0ZXh0LWFsaWduOmxlZnQ7XCI+XHJcbiAgICAgICAgPHRyPjx0ZD48c3Ryb25nPlByb3BlcnR5IEFkZHJlc3M6PC9zdHJvbmc+PC90ZD48dGQ+JCR7Z2V0VmFsdWUoXHJcbiAgICAgICAgICAncHJvcGVydHlBZGRyZXNzJ1xyXG4gICAgICAgICl9PC90ZD48L3RyPlxyXG4gICAgICAgIDx0cj48dGQ+PHN0cm9uZz5Qcm9wZXJ0eSBQdXJjaGFzZSBQcmljZTo8L3N0cm9uZz48L3RkPjx0ZD4kJHtnZXRWYWx1ZShcclxuICAgICAgICAgICdwdXJjaGFzZVByaWNlJ1xyXG4gICAgICAgICl9PC90ZD48L3RyPlxyXG4gICAgICAgIDx0cj48dGQ+PHN0cm9uZz5SZW5vdmF0aW9uIENvc3RzOjwvc3Ryb25nPjwvdGQ+PHRkPiQke2dldFZhbHVlKFxyXG4gICAgICAgICAgJ3Jlbm9Db3N0cydcclxuICAgICAgICApfTwvdGQ+PC90cj5cclxuICAgICAgICA8dHI+PHRkPjxzdHJvbmc+Q2xvc2luZyBDb3N0czo8L3N0cm9uZz48L3RkPjx0ZD4ke2dldFZhbHVlKFxyXG4gICAgICAgICAgJ2Nsb3NpbmdDb3N0cydcclxuICAgICAgICApfSU8L3RkPjwvdHI+XHJcbiAgICAgICAgPHRyPjx0ZD48c3Ryb25nPkhvbGRpbmcgQ29zdHM6PC9zdHJvbmc+PC90ZD48dGQ+JCR7Z2V0VmFsdWUoXHJcbiAgICAgICAgICAnaG9sZGluZ0Nvc3RzJ1xyXG4gICAgICAgICl9PC90ZD48L3RyPlxyXG4gICAgICAgIDx0cj48dGQ+PHN0cm9uZz5BZnRlciBSZXBhaXIgVmFsdWU6PC9zdHJvbmc+PC90ZD48dGQ+JCR7Z2V0VmFsdWUoXHJcbiAgICAgICAgICAnYWZ0ZXJSZXBhaXJWYWx1ZSdcclxuICAgICAgICApfTwvdGQ+PC90cj5cclxuICAgICAgICA8dHI+PHRkPjxzdHJvbmc+UHJvamVjdCBNb250aHM6PC9zdHJvbmc+PC90ZD48dGQ+JHtnZXRWYWx1ZShcclxuICAgICAgICAgICdwcm9qZWN0TW9udGhzJ1xyXG4gICAgICAgICl9IE1vbnRoczwvdGQ+PC90cj5cclxuICAgICAgICA8dHI+PHRkPjxzdHJvbmc+SG91c2UgTW9udGhseSBSZW50Ojwvc3Ryb25nPjwvdGQ+PHRkPiQke2dldFZhbHVlKFxyXG4gICAgICAgICAgJ2hvdXNlTW9udGhseVJlbnQnXHJcbiAgICAgICAgKX08L3RkPjwvdHI+XHJcbiAgICAgICAgPHRyPjx0ZD48c3Ryb25nPkhvdXNlIEludGVyZXN0IFJhdGU6PC9zdHJvbmc+PC90ZD48dGQ+JHtnZXRWYWx1ZShcclxuICAgICAgICAgICdob3VzZWludGVyZXN0UmF0ZSdcclxuICAgICAgICApfSU8L3RkPjwvdHI+XHJcbiAgICAgICAgPHRyPjx0ZD48c3Ryb25nPkxvYW4gUG9pbnRzOjwvc3Ryb25nPjwvdGQ+PHRkPiR7Z2V0VmFsdWUoXHJcbiAgICAgICAgICAnbG9hblBvaW50cydcclxuICAgICAgICApfSU8L3RkPjwvdHI+XHJcbiAgICAgICAgPHRyPjx0ZD48c3Ryb25nPkxvYW4gVGVybTo8L3N0cm9uZz48L3RkPjx0ZD4ke2dldFZhbHVlKFxyXG4gICAgICAgICAgJ2hvdXNlTG9hblllYXInXHJcbiAgICAgICAgKX0gWWVhcnM8L3RkPjwvdHI+XHJcbiAgICAgICAgPHRyPjx0ZD48c3Ryb25nPkdhcCBDb3N0czo8L3N0cm9uZz48L3RkPjx0ZD4kJHtnZXRWYWx1ZShcclxuICAgICAgICAgICdnYXBDb3N0cydcclxuICAgICAgICApfTwvdGQ+PC90cj5cclxuICAgICAgICA8dHI+PHRkPjxzdHJvbmc+RG93biBQYXltZW50IFBlcmNlbnQ6PC9zdHJvbmc+PC90ZD48dGQ+JHtnZXRWYWx1ZShcclxuICAgICAgICAgICdkb3duUGF5bWVudFBlcmNlbnQnXHJcbiAgICAgICAgKX0lPC90ZD48L3RyPlxyXG4gICAgICAgIDx0cj48dGQ+PHN0cm9uZz5SZXNhbGUgQ29zdHM6PC9zdHJvbmc+PC90ZD48dGQ+JCR7Z2V0VmFsdWUoXHJcbiAgICAgICAgICAncmVzYWxlQ29zdHMnXHJcbiAgICAgICAgKX08L3RkPjwvdHI+XHJcbiAgICAgICAgPHRyPjx0ZD48c3Ryb25nPkRlc2lyZWQgUHJvZml0IE1hcmdpbjo8L3N0cm9uZz48L3RkPjx0ZD4ke2dldFZhbHVlKFxyXG4gICAgICAgICAgJ2Rlc2lyZWRQcm9maXRNYXJnaW4nXHJcbiAgICAgICAgKX0lPC90ZD48L3RyPlxyXG4gICAgICAgIDx0cj48dGQ+PHN0cm9uZz5Eb3duIFBheW1lbnQgQmFzZWQgT246PC9zdHJvbmc+PC90ZD48dGQ+JCR7Z2V0VmFsdWUoXHJcbiAgICAgICAgICAnZG93blBheW1lbnRUeXBlJ1xyXG4gICAgICAgICl9PC90ZD48L3RyPlxyXG4gICAgICAgIDx0cj48dGQ+PHN0cm9uZz5Bbm51YWwgTWFpbnRlbmFuY2U6PC9zdHJvbmc+PC90ZD48dGQ+JCR7Z2V0VmFsdWUoXHJcbiAgICAgICAgICAnaG91c2VBbm51YWxNYWludGVuYW5jZSdcclxuICAgICAgICApfTwvdGQ+PC90cj5cclxuICAgICAgICA8dHI+PHRkPjxzdHJvbmc+QW5udWFsIFV0aWxpdGllczo8L3N0cm9uZz48L3RkPjx0ZD4kJHtnZXRWYWx1ZShcclxuICAgICAgICAgICdob3VzZUFubnVhbFV0aWxpdGllcydcclxuICAgICAgICApfTwvdGQ+PC90cj5cclxuICAgICAgICA8dHI+PHRkPjxzdHJvbmc+QW5udWFsIEluc3VyYW5jZTo8L3N0cm9uZz48L3RkPjx0ZD4kJHtnZXRWYWx1ZShcclxuICAgICAgICAgICdpbnN1cmFuY2UnXHJcbiAgICAgICAgKX08L3RkPjwvdHI+XHJcbiAgICAgICAgPHRyPjx0ZD48c3Ryb25nPkFubnVhbCBQcm9wZXJ0eSBUYXhlczo8L3N0cm9uZz48L3RkPjx0ZD4kJHtnZXRWYWx1ZShcclxuICAgICAgICAgICdwcm9wZXJ0eVRheGVzSEYnXHJcbiAgICAgICAgKX08L3RkPjwvdHI+XHJcbiAgICAgIDwvdGFibGU+XHJcbiAgICBgO1xyXG4gICAgY29tYmluZWREaXYuYXBwZW5kQ2hpbGQocmVzdWx0c0Rpdik7XHJcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGNvbWJpbmVkRGl2KTsgLy8gQXBwZW5kIHRvIGRvY3VtZW50IGZvciByZW5kZXJpbmdcclxuXHJcbiAgICAvLyBDYXB0dXJlIGNvbnRlbnQgYXMgbXVsdGlwbGUgaW1hZ2VzXHJcbiAgICBodG1sMmNhbnZhcyhjb21iaW5lZERpdiwgeyBzY2FsZTogMiwgdXNlQ09SUzogdHJ1ZSB9KVxyXG4gICAgICAudGhlbigoY2FudmFzKSA9PiB7XHJcbiAgICAgICAgY29uc3QgaW1nV2lkdGggPSAxOTA7XHJcbiAgICAgICAgY29uc3QgcGFnZUhlaWdodCA9IGRvYy5pbnRlcm5hbC5wYWdlU2l6ZS5oZWlnaHQ7XHJcbiAgICAgICAgbGV0IGltZ0hlaWdodCA9IChjYW52YXMuaGVpZ2h0ICogaW1nV2lkdGgpIC8gY2FudmFzLndpZHRoO1xyXG4gICAgICAgIGxldCBoZWlnaHRMZWZ0ID0gaW1nSGVpZ2h0O1xyXG4gICAgICAgIGxldCBwb3NpdGlvbiA9IDEwO1xyXG5cclxuICAgICAgICBjb25zdCBpbWdEYXRhID0gY2FudmFzLnRvRGF0YVVSTCgnaW1hZ2UvcG5nJyk7XHJcblxyXG4gICAgICAgIC8vIEFkZCBmaXJzdCBwYWdlXHJcbiAgICAgICAgZG9jLmFkZEltYWdlKGltZ0RhdGEsICdQTkcnLCAxMCwgcG9zaXRpb24sIGltZ1dpZHRoLCBpbWdIZWlnaHQpO1xyXG4gICAgICAgIGhlaWdodExlZnQgLT0gcGFnZUhlaWdodCAtIDIwO1xyXG5cclxuICAgICAgICAvLyBBZGQgYWRkaXRpb25hbCBwYWdlcyBpZiBjb250ZW50IG92ZXJmbG93c1xyXG4gICAgICAgIHdoaWxlIChoZWlnaHRMZWZ0ID4gMCkge1xyXG4gICAgICAgICAgcG9zaXRpb24gPSBoZWlnaHRMZWZ0IC0gaW1nSGVpZ2h0O1xyXG4gICAgICAgICAgZG9jLmFkZFBhZ2UoKTtcclxuICAgICAgICAgIGRvYy5hZGRJbWFnZShpbWdEYXRhLCAnUE5HJywgMTAsIHBvc2l0aW9uLCBpbWdXaWR0aCwgaW1nSGVpZ2h0KTtcclxuICAgICAgICAgIGhlaWdodExlZnQgLT0gcGFnZUhlaWdodCAtIDIwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZG9jLnNhdmUoJ2hvdXNlX2ZsaXBwaW5nX2FuYWx5c2lzLnBkZicpO1xyXG4gICAgICAgIGNvbWJpbmVkRGl2LnJlbW92ZSgpOyAvLyBDbGVhbiB1cCB0ZW1wb3JhcnkgZGl2XHJcbiAgICAgIH0pXHJcbiAgICAgIC5jYXRjaCgoZXJyb3IpID0+IHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBjYXB0dXJpbmcgSFRNTCBjb250ZW50OicsIGVycm9yKTtcclxuICAgICAgfSk7XHJcbiAgfSBlbHNlIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoJ2pzUERGIG9yIGh0bWwyY2FudmFzIG5vdCBsb2FkZWQgY29ycmVjdGx5LicpO1xyXG4gIH1cclxufSk7XHJcblxyXG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZG93bmxvYWQtcGRmMicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gIGlmICh3aW5kb3cuanNwZGYgJiYgdHlwZW9mIGh0bWwyY2FudmFzICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgY29uc3QgeyBqc1BERiB9ID0gd2luZG93LmpzcGRmO1xyXG4gICAgY29uc3QgZG9jID0gbmV3IGpzUERGKCk7XHJcblxyXG4gICAgLy8gRnVuY3Rpb24gdG8gZ2V0IHZhbHVlcyBmcm9tIGlucHV0IGZpZWxkc1xyXG4gICAgZnVuY3Rpb24gZ2V0VmFsdWUoaWQpIHtcclxuICAgICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcclxuICAgICAgcmV0dXJuIGVsZW1lbnQgJiYgZWxlbWVudC52YWx1ZSA/IGVsZW1lbnQudmFsdWUgOiAnTi9BJztcclxuICAgIH1cclxuXHJcbiAgICAvLyBDb21iaW5lIHRoZSBleGlzdGluZyBjb250ZW50IGFuZCByZXRpcmVtZW50IHBsYW5uaW5nIGFuYWx5c2lzIGludG8gYSBzaW5nbGUgZGl2XHJcbiAgICBjb25zdCBjb21iaW5lZERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgY29tYmluZWREaXYuaWQgPSAnY29tYmluZWRDb250ZW50JztcclxuICAgIGNvbWJpbmVkRGl2LnN0eWxlLnBhZGRpbmcgPSAnMjBweCc7XHJcbiAgICBjb21iaW5lZERpdi5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAnI2ZmZic7XHJcbiAgICBjb21iaW5lZERpdi5zdHlsZS5jb2xvciA9ICcjMDAwJztcclxuICAgIGNvbWJpbmVkRGl2LnN0eWxlLndpZHRoID0gJzgwMHB4JztcclxuICAgIGNvbWJpbmVkRGl2LnN0eWxlLm1hcmdpbiA9ICdhdXRvJztcclxuXHJcbiAgICAvLyBDbG9uZSB0aGUgb3JpZ2luYWwgY29udGVudFxyXG4gICAgY29uc3QgY29udGVudERpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250ZW50UERGMicpO1xyXG4gICAgY29tYmluZWREaXYuYXBwZW5kQ2hpbGQoY29udGVudERpdi5jbG9uZU5vZGUodHJ1ZSkpO1xyXG5cclxuICAgIC8vIENyZWF0ZSByZXN1bHRzIHNlY3Rpb25cclxuICAgIGNvbnN0IHJlc3VsdHNEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIHJlc3VsdHNEaXYuaW5uZXJIVE1MID0gYFxyXG4gICAgICA8aDIgc3R5bGU9XCJ0ZXh0LWFsaWduOmNlbnRlcjsgbWFyZ2luLXRvcDogMjBweDtcIj5SZXRpcmVtZW50IFBsYW5uaW5nIElucHV0czwvaDI+XHJcbiAgICAgIDx0YWJsZSBib3JkZXI9XCIxXCIgY2VsbHNwYWNpbmc9XCIwXCIgY2VsbHBhZGRpbmc9XCI1XCIgc3R5bGU9XCJ3aWR0aDoxMDAlOyB0ZXh0LWFsaWduOmxlZnQ7XCI+XHJcbiAgICAgICAgPHRyPjx0ZD48c3Ryb25nPkN1cnJlbnQgQWdlOjwvc3Ryb25nPjwvdGQ+PHRkPiR7Z2V0VmFsdWUoXHJcbiAgICAgICAgICAnY3VycmVudEFnZSdcclxuICAgICAgICApfTwvdGQ+PC90cj5cclxuICAgICAgICA8dHI+PHRkPjxzdHJvbmc+UmV0aXJlbWVudCBBZ2U6PC9zdHJvbmc+PC90ZD48dGQ+JHtnZXRWYWx1ZShcclxuICAgICAgICAgICdyZXRpcmVtZW50QWdlJ1xyXG4gICAgICAgICl9PC90ZD48L3RyPlxyXG4gICAgICAgIDx0cj48dGQ+PHN0cm9uZz5DdXJyZW50IFNhdmluZ3M6PC9zdHJvbmc+PC90ZD48dGQ+JCR7Z2V0VmFsdWUoXHJcbiAgICAgICAgICAnY3VycmVudFNhdmluZ3MnXHJcbiAgICAgICAgKX08L3RkPjwvdHI+XHJcbiAgICAgICAgPHRyPjx0ZD48c3Ryb25nPk1vbnRobHkgQ29udHJpYnV0aW9uczo8L3N0cm9uZz48L3RkPjx0ZD4kJHtnZXRWYWx1ZShcclxuICAgICAgICAgICdtb250aGx5Q29udHJpYnV0aW9ucydcclxuICAgICAgICApfTwvdGQ+PC90cj5cclxuICAgICAgICA8dHI+PHRkPjxzdHJvbmc+QW5udWFsIFJldHVybjo8L3N0cm9uZz48L3RkPjx0ZD4ke2dldFZhbHVlKFxyXG4gICAgICAgICAgJ2FubnVhbFJldHVybidcclxuICAgICAgICApfSU8L3RkPjwvdHI+XHJcbiAgICAgICAgPHRyPjx0ZD48c3Ryb25nPkluZmxhdGlvbiBSYXRlOjwvc3Ryb25nPjwvdGQ+PHRkPiR7Z2V0VmFsdWUoXHJcbiAgICAgICAgICAnaW5mbGF0aW9uUmF0ZSdcclxuICAgICAgICApfSU8L3RkPjwvdHI+XHJcbiAgICAgICAgPHRyPjx0ZD48c3Ryb25nPkRlc2lyZWQgSW5jb21lOjwvc3Ryb25nPjwvdGQ+PHRkPiQke2dldFZhbHVlKFxyXG4gICAgICAgICAgJ2Rlc2lyZWRJbmNvbWUnXHJcbiAgICAgICAgKX08L3RkPjwvdHI+XHJcbiAgICAgICAgPHRyPjx0ZD48c3Ryb25nPldob2xlIExpZmUgSW5zdXJhbmNlIFZhbHVlOjwvc3Ryb25nPjwvdGQ+PHRkPiQke2dldFZhbHVlKFxyXG4gICAgICAgICAgJ3dob2xlTGlmZUluc3VyYW5jZSdcclxuICAgICAgICApfTwvdGQ+PC90cj5cclxuICAgICAgICA8dHI+PHRkPjxzdHJvbmc+TW9udGhseSBDb250cmlidXRpb25zIHRvIFdob2xlIExpZmUgSW5zdXJhbmNlOjwvc3Ryb25nPjwvdGQ+PHRkPiQke2dldFZhbHVlKFxyXG4gICAgICAgICAgJ2xpZmVJbnN1cmFuY2VNb250aGx5Q29udHJpYnV0aW9ucydcclxuICAgICAgICApfTwvdGQ+PC90cj5cclxuICAgICAgICA8dHI+PHRkPjxzdHJvbmc+Q3VycmVudCBTdG9jayBWYWx1ZTo8L3N0cm9uZz48L3RkPjx0ZD4kJHtnZXRWYWx1ZShcclxuICAgICAgICAgICdjdXJyZW50U3RvY2tWYWx1ZSdcclxuICAgICAgICApfTwvdGQ+PC90cj5cclxuICAgICAgICA8dHI+PHRkPjxzdHJvbmc+Q3VycmVudCBSZWFsIEVzdGF0ZSBFcXVpdHk6PC9zdHJvbmc+PC90ZD48dGQ+JCR7Z2V0VmFsdWUoXHJcbiAgICAgICAgICAnY3VycmVudFJlYWxFc3RhdGVFcXVpdHknXHJcbiAgICAgICAgKX08L3RkPjwvdHI+XHJcbiAgICAgICAgPHRyPjx0ZD48c3Ryb25nPkN1cnJlbnQgTW9ydGdhZ2UgQmFsYW5jZTo8L3N0cm9uZz48L3RkPjx0ZD4kJHtnZXRWYWx1ZShcclxuICAgICAgICAgICdtb3J0Z2FnZUJhbGFuY2UnXHJcbiAgICAgICAgKX08L3RkPjwvdHI+XHJcbiAgICAgICAgPHRyPjx0ZD48c3Ryb25nPk1vcnRnYWdlIFRlcm0gKFllYXJzKTo8L3N0cm9uZz48L3RkPjx0ZD4kJHtnZXRWYWx1ZShcclxuICAgICAgICAgICdtb3J0Z2FnZVRlcm0nXHJcbiAgICAgICAgKX08L3RkPjwvdHI+XHJcbiAgICAgICAgPHRyPjx0ZD48c3Ryb25nPk1vcnRnYWdlIEludGVyZXN0IFJhdGUgKCUpOjwvc3Ryb25nPjwvdGQ+PHRkPiQke2dldFZhbHVlKFxyXG4gICAgICAgICAgJ21vcnRnYWdlSW50ZXJlc3RSYXRlJ1xyXG4gICAgICAgICl9PC90ZD48L3RyPlxyXG4gICAgICA8L3RhYmxlPlxyXG4gICAgYDtcclxuICAgIGNvbWJpbmVkRGl2LmFwcGVuZENoaWxkKHJlc3VsdHNEaXYpO1xyXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChjb21iaW5lZERpdik7IC8vIEFwcGVuZCB0byBkb2N1bWVudCBmb3IgcmVuZGVyaW5nXHJcblxyXG4gICAgLy8gQ2FwdHVyZSBjb250ZW50IGFzIG11bHRpcGxlIGltYWdlc1xyXG4gICAgaHRtbDJjYW52YXMoY29tYmluZWREaXYsIHsgc2NhbGU6IDIsIHVzZUNPUlM6IHRydWUgfSlcclxuICAgICAgLnRoZW4oKGNhbnZhcykgPT4ge1xyXG4gICAgICAgIGNvbnN0IGltZ1dpZHRoID0gMTkwO1xyXG4gICAgICAgIGNvbnN0IHBhZ2VIZWlnaHQgPSBkb2MuaW50ZXJuYWwucGFnZVNpemUuaGVpZ2h0O1xyXG4gICAgICAgIGxldCBpbWdIZWlnaHQgPSAoY2FudmFzLmhlaWdodCAqIGltZ1dpZHRoKSAvIGNhbnZhcy53aWR0aDtcclxuICAgICAgICBsZXQgaGVpZ2h0TGVmdCA9IGltZ0hlaWdodDtcclxuICAgICAgICBsZXQgcG9zaXRpb24gPSAxMDtcclxuXHJcbiAgICAgICAgY29uc3QgaW1nRGF0YSA9IGNhbnZhcy50b0RhdGFVUkwoJ2ltYWdlL3BuZycpO1xyXG5cclxuICAgICAgICAvLyBBZGQgZmlyc3QgcGFnZVxyXG4gICAgICAgIGRvYy5hZGRJbWFnZShpbWdEYXRhLCAnUE5HJywgMTAsIHBvc2l0aW9uLCBpbWdXaWR0aCwgaW1nSGVpZ2h0KTtcclxuICAgICAgICBoZWlnaHRMZWZ0IC09IHBhZ2VIZWlnaHQgLSAyMDtcclxuXHJcbiAgICAgICAgLy8gQWRkIGFkZGl0aW9uYWwgcGFnZXMgaWYgY29udGVudCBvdmVyZmxvd3NcclxuICAgICAgICB3aGlsZSAoaGVpZ2h0TGVmdCA+IDApIHtcclxuICAgICAgICAgIHBvc2l0aW9uID0gaGVpZ2h0TGVmdCAtIGltZ0hlaWdodDtcclxuICAgICAgICAgIGRvYy5hZGRQYWdlKCk7XHJcbiAgICAgICAgICBkb2MuYWRkSW1hZ2UoaW1nRGF0YSwgJ1BORycsIDEwLCBwb3NpdGlvbiwgaW1nV2lkdGgsIGltZ0hlaWdodCk7XHJcbiAgICAgICAgICBoZWlnaHRMZWZ0IC09IHBhZ2VIZWlnaHQgLSAyMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGRvYy5zYXZlKCdyZXRpcmVtZW50X3BsYW5uaW5nX2NhbGN1bGF0b3IucGRmJyk7XHJcbiAgICAgICAgY29tYmluZWREaXYucmVtb3ZlKCk7IC8vIENsZWFuIHVwIHRlbXBvcmFyeSBkaXZcclxuICAgICAgfSlcclxuICAgICAgLmNhdGNoKChlcnJvcikgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGNhcHR1cmluZyBIVE1MIGNvbnRlbnQ6JywgZXJyb3IpO1xyXG4gICAgICB9KTtcclxuICB9IGVsc2Uge1xyXG4gICAgY29uc29sZS5lcnJvcignanNQREYgb3IgaHRtbDJjYW52YXMgbm90IGxvYWRlZCBjb3JyZWN0bHkuJyk7XHJcbiAgfVxyXG59KTtcclxuXHJcbmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkb3dubG9hZC1wZGYzJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgaWYgKHdpbmRvdy5qc3BkZiAmJiB0eXBlb2YgaHRtbDJjYW52YXMgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICBjb25zdCB7IGpzUERGIH0gPSB3aW5kb3cuanNwZGY7XHJcbiAgICBjb25zdCBkb2MgPSBuZXcganNQREYoKTtcclxuXHJcbiAgICAvLyBGdW5jdGlvbiB0byBnZXQgdmFsdWVzIGZyb20gaW5wdXQgZmllbGRzXHJcbiAgICBmdW5jdGlvbiBnZXRWYWx1ZShpZCkge1xyXG4gICAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xyXG4gICAgICByZXR1cm4gZWxlbWVudCAmJiBlbGVtZW50LnZhbHVlID8gZWxlbWVudC52YWx1ZSA6ICdOL0EnO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGNvbnRlbnREaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGVudFBERjMnKTsgLy8gRmlyc3QgcGFnZSBjb250ZW50XHJcblxyXG4gICAgLy8gU3RlcCAxOiBDYXB0dXJlIHRoZSBmaXJzdCBzZWN0aW9uIChjb250ZW50UERGMylcclxuICAgIGh0bWwyY2FudmFzKGNvbnRlbnREaXYsIHsgc2NhbGU6IDIsIHVzZUNPUlM6IHRydWUgfSlcclxuICAgICAgLnRoZW4oKGNhbnZhcykgPT4ge1xyXG4gICAgICAgIGNvbnN0IGltZ1dpZHRoID0gMTkwO1xyXG4gICAgICAgIGNvbnN0IHBhZ2VIZWlnaHQgPSBkb2MuaW50ZXJuYWwucGFnZVNpemUuaGVpZ2h0O1xyXG4gICAgICAgIGxldCBpbWdIZWlnaHQgPSAoY2FudmFzLmhlaWdodCAqIGltZ1dpZHRoKSAvIGNhbnZhcy53aWR0aDtcclxuICAgICAgICBsZXQgaGVpZ2h0TGVmdCA9IGltZ0hlaWdodDtcclxuICAgICAgICBsZXQgcG9zaXRpb24gPSAxMDtcclxuXHJcbiAgICAgICAgY29uc3QgaW1nRGF0YSA9IGNhbnZhcy50b0RhdGFVUkwoJ2ltYWdlL3BuZycpO1xyXG5cclxuICAgICAgICAvLyBBZGQgZmlyc3QgcGFnZSBjb250ZW50XHJcbiAgICAgICAgZG9jLmFkZEltYWdlKGltZ0RhdGEsICdQTkcnLCAxMCwgcG9zaXRpb24sIGltZ1dpZHRoLCBpbWdIZWlnaHQpO1xyXG4gICAgICAgIGhlaWdodExlZnQgLT0gcGFnZUhlaWdodCAtIDIwO1xyXG5cclxuICAgICAgICAvLyBBZGQgbmV3IHBhZ2VzIGlmIG5lY2Vzc2FyeVxyXG4gICAgICAgIHdoaWxlIChoZWlnaHRMZWZ0ID4gMCkge1xyXG4gICAgICAgICAgcG9zaXRpb24gPSBoZWlnaHRMZWZ0IC0gaW1nSGVpZ2h0O1xyXG4gICAgICAgICAgZG9jLmFkZFBhZ2UoKTtcclxuICAgICAgICAgIGRvYy5hZGRJbWFnZShpbWdEYXRhLCAnUE5HJywgMTAsIHBvc2l0aW9uLCBpbWdXaWR0aCwgaW1nSGVpZ2h0KTtcclxuICAgICAgICAgIGhlaWdodExlZnQgLT0gcGFnZUhlaWdodCAtIDIwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZG9jLmFkZFBhZ2UoKTsgLy8gTW92ZSB0byBuZXh0IHBhZ2UgZm9yIGlucHV0IGRhdGFcclxuXHJcbiAgICAgICAgLy8gU3RlcCAyOiBDcmVhdGUgcmVzdWx0cyBzZWN0aW9uXHJcbiAgICAgICAgY29uc3QgcmVzdWx0c0RpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHJlc3VsdHNEaXYuc3R5bGUucGFkZGluZyA9ICcyMHB4JztcclxuICAgICAgICByZXN1bHRzRGl2LnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICcjZmZmJztcclxuICAgICAgICByZXN1bHRzRGl2LnN0eWxlLmNvbG9yID0gJyMwMDAnO1xyXG4gICAgICAgIHJlc3VsdHNEaXYuc3R5bGUud2lkdGggPSAnODAwcHgnO1xyXG4gICAgICAgIHJlc3VsdHNEaXYuc3R5bGUubWFyZ2luID0gJ2F1dG8nO1xyXG4gICAgICAgIHJlc3VsdHNEaXYuaW5uZXJIVE1MID0gYFxyXG4gICAgICAgIDxoMiBzdHlsZT1cInRleHQtYWxpZ246Y2VudGVyOyBtYXJnaW4tdG9wOiAyMHB4O1wiPlJlbnRhbCBQcm9wZXJ0eSBJbnB1dHM8L2gyPlxyXG4gICAgICAgIDx0YWJsZSBib3JkZXI9XCIxXCIgY2VsbHNwYWNpbmc9XCIwXCIgY2VsbHBhZGRpbmc9XCI1XCIgc3R5bGU9XCJ3aWR0aDoxMDAlOyB0ZXh0LWFsaWduOmxlZnQ7XCI+XHJcbiAgICAgICAgICA8dHI+PHRkPjxzdHJvbmc+UHJvcGVydHkgUHJpY2U6PC9zdHJvbmc+PC90ZD48dGQ+JCR7Z2V0VmFsdWUoXHJcbiAgICAgICAgICAgICdwcm9wZXJ0eVByaWNlJ1xyXG4gICAgICAgICAgKX08L3RkPjwvdHI+XHJcbiAgICAgICAgICA8dHI+PHRkPjxzdHJvbmc+RG93biBQYXltZW50Ojwvc3Ryb25nPjwvdGQ+PHRkPiQke2dldFZhbHVlKFxyXG4gICAgICAgICAgICAnZG93blBheW1lbnQnXHJcbiAgICAgICAgICApfTwvdGQ+PC90cj5cclxuICAgICAgICAgIDx0cj48dGQ+PHN0cm9uZz5Mb2FuIFRlcm06PC9zdHJvbmc+PC90ZD48dGQ+JHtnZXRWYWx1ZShcclxuICAgICAgICAgICAgJ2xvYW5UZXJtJ1xyXG4gICAgICAgICAgKX0gWWVhcnM8L3RkPjwvdHI+XHJcbiAgICAgICAgICA8dHI+PHRkPjxzdHJvbmc+SW50ZXJlc3QgUmF0ZTo8L3N0cm9uZz48L3RkPjx0ZD4ke2dldFZhbHVlKFxyXG4gICAgICAgICAgICAnaW50ZXJlc3RSYXRlJ1xyXG4gICAgICAgICAgKX0lPC90ZD48L3RyPlxyXG4gICAgICAgICAgPHRyPjx0ZD48c3Ryb25nPk1vbnRobHkgUmVudDo8L3N0cm9uZz48L3RkPjx0ZD4kJHtnZXRWYWx1ZShcclxuICAgICAgICAgICAgJ21vbnRobHlSZW50J1xyXG4gICAgICAgICAgKX08L3RkPjwvdHI+XHJcbiAgICAgICAgICA8dHI+PHRkPjxzdHJvbmc+VmFjYW5jeSBSYXRlOjwvc3Ryb25nPjwvdGQ+PHRkPiR7Z2V0VmFsdWUoXHJcbiAgICAgICAgICAgICd2YWNhbmN5UmF0ZSdcclxuICAgICAgICAgICl9JTwvdGQ+PC90cj5cclxuICAgICAgICAgIDx0cj48dGQ+PHN0cm9uZz5DbG9zaW5nIENvc3Q6PC9zdHJvbmc+PC90ZD48dGQ+JHtnZXRWYWx1ZShcclxuICAgICAgICAgICAgJ2Nsb3NpbmdDb3N0c1JlbnQnXHJcbiAgICAgICAgICApfSU8L3RkPjwvdHI+XHJcbiAgICAgICAgICA8dHI+PHRkPjxzdHJvbmc+UHJvcGVydHkgVGF4ZXM6PC9zdHJvbmc+PC90ZD48dGQ+JCR7Z2V0VmFsdWUoXHJcbiAgICAgICAgICAgICdwcm9wZXJ0eVRheGVzJ1xyXG4gICAgICAgICAgKX08L3RkPjwvdHI+XHJcbiAgICAgICAgICA8dHI+PHRkPjxzdHJvbmc+QW5udWFsIFJlbm92YXRpb25zOjwvc3Ryb25nPjwvdGQ+PHRkPiQke2dldFZhbHVlKFxyXG4gICAgICAgICAgICAncmVub3ZhdGlvbnMnXHJcbiAgICAgICAgICApfTwvdGQ+PC90cj5cclxuICAgICAgICAgIDx0cj48dGQ+PHN0cm9uZz5Bbm51YWwgVXRpbGl0aWVzOjwvc3Ryb25nPjwvdGQ+PHRkPiQke2dldFZhbHVlKFxyXG4gICAgICAgICAgICAndXRpbGl0aWVzJ1xyXG4gICAgICAgICAgKX08L3RkPjwvdHI+XHJcbiAgICAgICAgICA8dHI+PHRkPjxzdHJvbmc+SW5zdXJhbmNlIENvc3RzOjwvc3Ryb25nPjwvdGQ+PHRkPiQke2dldFZhbHVlKFxyXG4gICAgICAgICAgICAnaW5zdXJhbmNlQ29zdHMnXHJcbiAgICAgICAgICApfTwvdGQ+PC90cj5cclxuICAgICAgICAgIDx0cj48dGQ+PHN0cm9uZz5NYWludGVuYW5jZSBDb3N0czo8L3N0cm9uZz48L3RkPjx0ZD4kJHtnZXRWYWx1ZShcclxuICAgICAgICAgICAgJ21haW50ZW5hbmNlQ29zdHMnXHJcbiAgICAgICAgICApfTwvdGQ+PC90cj5cclxuICAgICAgICAgIDx0cj48dGQ+PHN0cm9uZz5NYW5hZ2VtZW50IEZlZXM6PC9zdHJvbmc+PC90ZD48dGQ+JCR7Z2V0VmFsdWUoXHJcbiAgICAgICAgICAgICdtYW5hZ2VtZW50RmVlcydcclxuICAgICAgICAgICl9PC90ZD48L3RyPlxyXG4gICAgICAgICAgPHRyPjx0ZD48c3Ryb25nPlByb3BlcnR5IEFwcHJlY2lhdGlvbiBSYXRlOjwvc3Ryb25nPjwvdGQ+PHRkPiR7Z2V0VmFsdWUoXHJcbiAgICAgICAgICAgICdhcHByZWNpYXRpb25SYXRlJ1xyXG4gICAgICAgICAgKX0lPC90ZD48L3RyPlxyXG4gICAgICAgICAgPHRyPjx0ZD48c3Ryb25nPkFubnVhbCBSZW50IEdyb3d0aDo8L3N0cm9uZz48L3RkPjx0ZD4ke2dldFZhbHVlKFxyXG4gICAgICAgICAgICAncmVudEdyb3d0aCdcclxuICAgICAgICAgICl9JTwvdGQ+PC90cj5cclxuICAgICAgICA8L3RhYmxlPlxyXG4gICAgICBgO1xyXG5cclxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHJlc3VsdHNEaXYpOyAvLyBBcHBlbmQgdG8gZG9jdW1lbnQgZm9yIHJlbmRlcmluZ1xyXG5cclxuICAgICAgICAvLyBTdGVwIDM6IENhcHR1cmUgdGhlIHJlc3VsdHMgc2VjdGlvblxyXG4gICAgICAgIGh0bWwyY2FudmFzKHJlc3VsdHNEaXYsIHsgc2NhbGU6IDIsIHVzZUNPUlM6IHRydWUgfSkudGhlbigoY2FudmFzMikgPT4ge1xyXG4gICAgICAgICAgY29uc3QgaW1nRGF0YTIgPSBjYW52YXMyLnRvRGF0YVVSTCgnaW1hZ2UvcG5nJyk7XHJcbiAgICAgICAgICBjb25zdCBpbWdXaWR0aDIgPSAxOTA7XHJcbiAgICAgICAgICBjb25zdCBpbWdIZWlnaHQyID0gKGNhbnZhczIuaGVpZ2h0ICogaW1nV2lkdGgyKSAvIGNhbnZhczIud2lkdGg7XHJcbiAgICAgICAgICBsZXQgaGVpZ2h0TGVmdDIgPSBpbWdIZWlnaHQyO1xyXG4gICAgICAgICAgbGV0IHBvc2l0aW9uMiA9IDEwO1xyXG5cclxuICAgICAgICAgIC8vIEFkZCBuZXcgcGFnZXMgaWYgbmVlZGVkXHJcbiAgICAgICAgICB3aGlsZSAoaGVpZ2h0TGVmdDIgPiAwKSB7XHJcbiAgICAgICAgICAgIGRvYy5hZGRJbWFnZShpbWdEYXRhMiwgJ1BORycsIDEwLCBwb3NpdGlvbjIsIGltZ1dpZHRoMiwgaW1nSGVpZ2h0Mik7XHJcbiAgICAgICAgICAgIGhlaWdodExlZnQyIC09IHBhZ2VIZWlnaHQgLSAyMDtcclxuICAgICAgICAgICAgaWYgKGhlaWdodExlZnQyID4gMCkgZG9jLmFkZFBhZ2UoKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBkb2Muc2F2ZSgncmVudGFsX3Byb3BlcnR5X2V2YWx1YXRpb24ucGRmJyk7IC8vIFNhdmUgUERGXHJcbiAgICAgICAgICByZXN1bHRzRGl2LnJlbW92ZSgpOyAvLyBDbGVhbiB1cCB0ZW1wb3JhcnkgZGl2XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pXHJcbiAgICAgIC5jYXRjaCgoZXJyb3IpID0+IHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBjYXB0dXJpbmcgSFRNTCBjb250ZW50OicsIGVycm9yKTtcclxuICAgICAgfSk7XHJcbiAgfSBlbHNlIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoJ2pzUERGIG9yIGh0bWwyY2FudmFzIG5vdCBsb2FkZWQgY29ycmVjdGx5LicpO1xyXG4gIH1cclxufSk7XHJcblxyXG4vLyBmdW5jdGlvbiBnZXRUYWJsZURhdGEoeWVhcikge1xyXG4vLyAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwieWVhcl9iXCIpLmlubmVySFRNTCA9IHllYXI7XHJcbi8vICAgLy8gR2V0IHZhbHVlcyBhbmQgY29udmVydCB0byBudW1iZXJzXHJcbi8vICAgbGV0IHByb3BlcnR5UHJpY2UgPSBwYXJzZUZsb2F0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHJvcGVydHlQcmljZVwiKS52YWx1ZS50cmltKCkpIHx8IDA7XHJcbi8vICAgbGV0IGRvd25QYXltZW50ID0gcGFyc2VGbG9hdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRvd25QYXltZW50XCIpLnZhbHVlLnRyaW0oKSkgfHwgMDtcclxuLy8gICBsZXQgbG9hblRlcm0gPSBwYXJzZUZsb2F0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9hblRlcm1cIikudmFsdWUudHJpbSgpKSB8fCAwO1xyXG4vLyAgIGxldCBpbnRlcmVzdFJhdGUgPSBwYXJzZUZsb2F0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaW50ZXJlc3RSYXRlXCIpLnZhbHVlLnRyaW0oKSkgfHwgMDtcclxuLy8gICBsZXQgbW9udGhseVJlbnQgPSBwYXJzZUZsb2F0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibW9udGhseVJlbnRcIikudmFsdWUudHJpbSgpKSB8fCAwO1xyXG4vLyAgIGxldCB2YWNhbmN5UmF0ZSA9IHBhcnNlRmxvYXQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ2YWNhbmN5UmF0ZVwiKS52YWx1ZS50cmltKCkpIHx8IDA7XHJcbi8vICAgbGV0IHByb3BlcnR5VGF4ZXMgPSBwYXJzZUZsb2F0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHJvcGVydHlUYXhlc1wiKS52YWx1ZS50cmltKCkpIHx8IDA7XHJcbi8vICAgbGV0IGluc3VyYW5jZUNvc3RzID0gcGFyc2VGbG9hdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImluc3VyYW5jZUNvc3RzXCIpLnZhbHVlLnRyaW0oKSkgfHwgMDtcclxuLy8gICBsZXQgbWFpbnRlbmFuY2VDb3N0cyA9IHBhcnNlRmxvYXQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtYWludGVuYW5jZUNvc3RzXCIpLnZhbHVlLnRyaW0oKSkgfHwgMDtcclxuLy8gICBsZXQgbWFuYWdlbWVudEZlZXMgPSBwYXJzZUZsb2F0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFuYWdlbWVudEZlZXNcIikudmFsdWUudHJpbSgpKSB8fCAwO1xyXG4vLyAgIGxldCBhcHByZWNpYXRpb25SYXRlID0gcGFyc2VGbG9hdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFwcHJlY2lhdGlvblJhdGVcIikudmFsdWUudHJpbSgpKSB8fCAzO1xyXG4vLyAgIGxldCByZW50SW5jcmVhc2VSYXRlID0gMjsgLy8gQXNzdW1pbmcgcmVudCBpbmNyZWFzZXMgMiUgYW5udWFsbHlcclxuXHJcbi8vICAgLy8gVmFsaWRhdGUgeWVhciBwYXJhbWV0ZXJcclxuLy8gICBpZiAoIXllYXIgfHwgeWVhciA8IDEgfHwgeWVhciA+IGxvYW5UZXJtKSB7XHJcbi8vICAgICByZXR1cm47XHJcbi8vICAgfVxyXG5cclxuLy8gICAvLyDinIUgTG9hbiBDYWxjdWxhdGlvblxyXG4vLyAgIGxldCBsb2FuQW1vdW50ID0gcHJvcGVydHlQcmljZSAtIGRvd25QYXltZW50O1xyXG4vLyAgIGxldCBtb250aGx5UmF0ZSA9IGludGVyZXN0UmF0ZSAvIDEwMCAvIDEyO1xyXG4vLyAgIGxldCBudW1QYXltZW50cyA9IGxvYW5UZXJtICogMTI7XHJcblxyXG4vLyAgIGxldCBtb3J0Z2FnZVBheW1lbnQgPSBtb250aGx5UmF0ZSA+IDBcclxuLy8gICAgID8gKGxvYW5BbW91bnQgKiAobW9udGhseVJhdGUgKiBNYXRoLnBvdygxICsgbW9udGhseVJhdGUsIG51bVBheW1lbnRzKSkpIC8gKE1hdGgucG93KDEgKyBtb250aGx5UmF0ZSwgbnVtUGF5bWVudHMpIC0gMSlcclxuLy8gICAgIDogbG9hbkFtb3VudCAvIG51bVBheW1lbnRzO1xyXG5cclxuLy8gICAvLyDinIUgQXBwcmVjaWF0aW9uICYgUmVudCBHcm93dGggQ2FsY3VsYXRpb25zXHJcbi8vICAgbGV0IGFwcHJlY2lhdGlvbkZhY3RvciA9IE1hdGgucG93KDEgKyBhcHByZWNpYXRpb25SYXRlIC8gMTAwLCB5ZWFyKTtcclxuLy8gICBsZXQgcmVudEZhY3RvciA9IE1hdGgucG93KDEgKyByZW50SW5jcmVhc2VSYXRlIC8gMTAwLCB5ZWFyKTtcclxuXHJcbi8vICAgbGV0IHByb3BlcnR5VmFsdWUgPSBwcm9wZXJ0eVByaWNlICogYXBwcmVjaWF0aW9uRmFjdG9yO1xyXG4vLyAgIC8vIGxldCBncm9zc1JlbnRJbmNvbWUgPSAobW9udGhseVJlbnQgKiAxMikgKiByZW50RmFjdG9yOyAvLyBSZW50IGdyb3dzIHNlcGFyYXRlbHlcclxuLy8gICBsZXQgZ3Jvc3NSZW50SW5jb21lID0gbW9udGhseVJlbnQgKiAxMjtcclxuLy8gICBsZXQgdmFjYW5jeUxvc3MgPSBncm9zc1JlbnRJbmNvbWUgKiAodmFjYW5jeVJhdGUgLyAxMDApO1xyXG4vLyAgIGxldCBtYW5hZ2VtZW50Q29zdCA9IGdyb3NzUmVudEluY29tZSAqIChtYW5hZ2VtZW50RmVlcyAvIDEwMCk7XHJcbi8vICAgLy8gbGV0IHZhY2FuY3lMb3NzID0gZ3Jvc3NSZW50SW5jb21lICogKHZhY2FuY3lSYXRlIC8gMTAwKTtcclxuLy8gICBsZXQgYWRqdXN0ZWRSZW50SW5jb21lID0gZ3Jvc3NSZW50SW5jb21lIC0gdmFjYW5jeUxvc3M7XHJcblxyXG4vLyAgIC8vIOKchSBPcGVyYXRpbmcgRXhwZW5zZXMgR3Jvd3RoXHJcbi8vICAgbGV0IHRvdGFsRml4ZWRFeHBlbnNlcyA9IHByb3BlcnR5VGF4ZXMgKyBpbnN1cmFuY2VDb3N0cyArIG1haW50ZW5hbmNlQ29zdHM7XHJcbi8vICAgLy8gbGV0IG9wZXJhdGluZ0V4cGVuc2VzID0gKHRvdGFsRml4ZWRFeHBlbnNlcyAqIGFwcHJlY2lhdGlvbkZhY3RvcikgKyAoYWRqdXN0ZWRSZW50SW5jb21lICogKG1hbmFnZW1lbnRGZWVzIC8gMTAwKSk7XHJcbi8vICAgbGV0IG9wZXJhdGluZ0V4cGVuc2VzID1cclxuLy8gICAgIHZhY2FuY3lMb3NzICtcclxuLy8gICAgIHByb3BlcnR5VGF4ZXMgK1xyXG4vLyAgICAgaW5zdXJhbmNlQ29zdHMgK1xyXG4vLyAgICAgbWFpbnRlbmFuY2VDb3N0cyArXHJcbi8vICAgICBtYW5hZ2VtZW50Q29zdCArXHJcbi8vICAgICB1dGlsaXRpZXMgK1xyXG4vLyAgICAgcmVub3ZhdGlvbnM7XHJcbi8vICAgLy8g4pyFIE5ldCBPcGVyYXRpbmcgSW5jb21lIChOT0kpXHJcbi8vICAgLy8gbGV0IG5vaSA9IGFkanVzdGVkUmVudEluY29tZSAtIG9wZXJhdGluZ0V4cGVuc2VzO1xyXG4vLyAgIGxldCBub2kgPSBncm9zc1JlbnRJbmNvbWUgLSBvcGVyYXRpbmdFeHBlbnNlcztcclxuXHJcbi8vICAgLy8g4pyFIEFubnVhbCBNb3J0Z2FnZSBQYXltZW50IChyZW1haW5zIGZpeGVkKVxyXG4vLyAgIGxldCBhbm51YWxNb3J0Z2FnZVBheW1lbnQgPSBtb3J0Z2FnZVBheW1lbnQgKiAxMjtcclxuXHJcbi8vICAgLy8g4pyFIENhc2ggRmxvdyBDYWxjdWxhdGlvblxyXG4vLyAgIGxldCBjYXNoRmxvd0FubnVhbCA9IG5vaSAtIGFubnVhbE1vcnRnYWdlUGF5bWVudDtcclxuLy8gICBsZXQgY2FzaEZsb3dNb250aGx5ID0gY2FzaEZsb3dBbm51YWwgLyAxMjtcclxuXHJcbi8vICAgLy8g4pyFIERpc3BsYXkgUmVzdWx0cyBpbiBUYWJsZVxyXG4vLyAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ3Jvc3NfcmVudFwiKS5pbm5lclRleHQgPSBgJCR7Z3Jvc3NSZW50SW5jb21lLnRvRml4ZWQoMil9YDtcclxuLy8gICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInZhY2FuY3lfcmF0ZVwiKS5pbm5lclRleHQgPSBg4oCTICQke3ZhY2FuY3lMb3NzLnRvRml4ZWQoMil9YDtcclxuLy8gICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9wZXJhdGluZ19pbmNvbWVcIikuaW5uZXJUZXh0ID0gYCQke2FkanVzdGVkUmVudEluY29tZS50b0ZpeGVkKDIpfWA7XHJcbi8vICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcGVyYXRpbmdfZXhwZW5zZXNcIikuaW5uZXJUZXh0ID0gYOKAkyAkJHtvcGVyYXRpbmdFeHBlbnNlcy50b0ZpeGVkKDIpfWA7XHJcbi8vICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuZXRfb3BlcmF0aW5nX2luY29tZVwiKS5pbm5lclRleHQgPSBgJCR7bm9pLnRvRml4ZWQoMil9YDtcclxuLy8gICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvYW5fcGF5bWVudHNcIikuaW5uZXJUZXh0ID0gYOKAkyAkJHthbm51YWxNb3J0Z2FnZVBheW1lbnQudG9GaXhlZCgyKX1gO1xyXG4vLyAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2FzaF9mbG93XCIpLmlubmVyVGV4dCA9IGAkJHtjYXNoRmxvd0FubnVhbC50b0ZpeGVkKDIpfWA7XHJcblxyXG4vLyAgIGNvbnNvbGUubG9nKGBEYXRhIGRpc3BsYXllZCBmb3IgeWVhcjogJHt5ZWFyfWApO1xyXG4vLyB9XHJcblxyXG4vLyBGdW5jdGlvbiB0byBwb3B1bGF0ZSB0aGUgeWVhcnMgZHJvcGRvd25cclxuZnVuY3Rpb24gcG9wdWxhdGVZZWFyc0Ryb3Bkb3duKCkge1xyXG4gIGNvbnN0IHNlbGVjdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd5ZWFyc190YmwnKTtcclxuICBzZWxlY3QuaW5uZXJIVE1MID0gJyc7IC8vIENsZWFyIGV4aXN0aW5nIG9wdGlvbnNcclxuXHJcbiAgZm9yIChsZXQgaSA9IDE7IGkgPD0gMzA7IGkrKykge1xyXG4gICAgY29uc3Qgb3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XHJcbiAgICBvcHRpb24udmFsdWUgPSBpO1xyXG4gICAgb3B0aW9uLnRleHRDb250ZW50ID0gYCR7aX0gJHtpID09PSAxID8gJ1llYXInIDogJ1llYXJzJ31gO1xyXG5cclxuICAgIC8vIFNldCAxMCB5ZWFycyBhcyB0aGUgZGVmYXVsdCBzZWxlY3RlZCB2YWx1ZVxyXG4gICAgaWYgKGkgPT09IDEpIHtcclxuICAgICAgb3B0aW9uLnNlbGVjdGVkID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBzZWxlY3QuYXBwZW5kQ2hpbGQob3B0aW9uKTtcclxuICB9XHJcbn1cclxuXHJcbmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd5ZWFyc190YmwnKS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbiAoKSB7XHJcbiAgbGV0IHNlbGVjdGVkVmFsdWUgPSB0aGlzLnZhbHVlO1xyXG4gIGdldFRhYmxlRGF0YShzZWxlY3RlZFZhbHVlKTtcclxufSk7XHJcblxyXG4vLyBDYWxsIHRoZSBmdW5jdGlvbiB0byBwb3B1bGF0ZSB0aGUgZHJvcGRvd24gb24gcGFnZSBsb2FkXHJcbndpbmRvdy5vbmxvYWQgPSBwb3B1bGF0ZVllYXJzRHJvcGRvd247XHJcblxyXG5mdW5jdGlvbiBwcmludFNwZWNpZmljU2VjdGlvbihjbGFzc05hbWVzKSB7XHJcbiAgaWYgKCFBcnJheS5pc0FycmF5KGNsYXNzTmFtZXMpIHx8IGNsYXNzTmFtZXMubGVuZ3RoID09PSAwKSByZXR1cm47XHJcblxyXG4gIGNvbnN0IGNoYXJ0Q29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihjbGFzc05hbWVzWzBdKTtcclxuICBjb25zdCBjb250ZW50Q29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihjbGFzc05hbWVzWzFdKTtcclxuXHJcbiAgaWYgKCFjaGFydENvbnRhaW5lciB8fCAhY29udGVudENvbnRhaW5lcikgcmV0dXJuO1xyXG5cclxuICBjb25zdCBjYW52YXNlcyA9IGNoYXJ0Q29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJ2NhbnZhcycpO1xyXG5cclxuICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgIGNvbnN0IHRlbXBEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIGNvbnN0IGNsb25lZENvbnRlbnQgPSBjb250ZW50Q29udGFpbmVyLmNsb25lTm9kZSh0cnVlKTtcclxuICAgIHRlbXBEaXYuYXBwZW5kQ2hpbGQoY2xvbmVkQ29udGVudCk7XHJcbiAgICAvLyAxLiBSZW5kZXIgY2FudmFzIGNoYXJ0cyB0byBpbWFnZXNcclxuICAgIGNhbnZhc2VzLmZvckVhY2goKGNhbnZhcykgPT4ge1xyXG4gICAgICBjb25zdCBpbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcclxuICAgICAgaW1nLnNyYyA9IGNhbnZhcy50b0RhdGFVUkwoJ2ltYWdlL3BuZycpO1xyXG4gICAgICBpbWcuc3R5bGUud2lkdGggPSAnMTAwJSc7XHJcbiAgICAgIGltZy5zdHlsZS5tYXJnaW5Cb3R0b20gPSAnMjBweCc7XHJcbiAgICAgIHRlbXBEaXYuYXBwZW5kQ2hpbGQoaW1nKTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIDMuIE9wZW4gYSBwcmludCB3aW5kb3dcclxuICAgIGNvbnN0IHByaW50V2luZG93ID0gd2luZG93Lm9wZW4oJycsICcnLCAnd2lkdGg9MTAwMCxoZWlnaHQ9ODAwJyk7XHJcbiAgICBwcmludFdpbmRvdy5kb2N1bWVudC53cml0ZShgXHJcbiAgICAgIDxodG1sPlxyXG4gICAgICAgIDxoZWFkPlxyXG4gICAgICAgICAgPHRpdGxlPlByaW50IFNlY3Rpb248L3RpdGxlPlxyXG4gICAgICAgICAgPHN0eWxlPlxyXG4gICAgICAgICAgICBib2R5IHsgZm9udC1mYW1pbHk6IEFyaWFsLCBzYW5zLXNlcmlmOyBwYWRkaW5nOiAyMHB4OyB9XHJcbiAgICAgICAgICAgIGltZyB7IG1heC13aWR0aDogMTAwJTsgbWFyZ2luLWJvdHRvbTogMjBweDsgfVxyXG4gICAgICAgICAgICAuY2FyZCB7XHJcbiAgICAgICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgI2NjYztcclxuICAgICAgICAgICAgICBwYWRkaW5nOiAxNXB4O1xyXG4gICAgICAgICAgICAgIG1hcmdpbjogMTBweDtcclxuICAgICAgICAgICAgICBib3JkZXItcmFkaXVzOiAxMHB4O1xyXG4gICAgICAgICAgICAgIGJveC1zaGFkb3c6IDAgMnB4IDRweCByZ2JhKDAsMCwwLDAuMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLnJlc3VsdCB7XHJcbiAgICAgICAgICAgICAgZm9udC13ZWlnaHQ6IGJvbGQ7XHJcbiAgICAgICAgICAgICAgY29sb3I6ICMzMzM7XHJcbiAgICAgICAgICAgICAgbWFyZ2luLXRvcDogNXB4O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGgxLCBoNCB7XHJcbiAgICAgICAgICAgICAgY29sb3I6ICNiZmEwNDY7XHJcbiAgICAgICAgICAgICAgbWFyZ2luOiAxMHB4IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLmRzc3Ige1xyXG4gICAgICAgICAgICAgIGJhY2tncm91bmQ6ICNkOGMwN2M7XHJcbiAgICAgICAgICAgICAgcGFkZGluZzogMTBweDtcclxuICAgICAgICAgICAgICBib3JkZXItcmFkaXVzOiA2cHg7XHJcbiAgICAgICAgICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC50ZXh0LWRhcmsgeyBjb2xvcjogIzMzMzsgfVxyXG4gICAgICAgICAgICAudGV4dC1jZW50ZXIgeyB0ZXh0LWFsaWduOiBjZW50ZXI7IH1cclxuICAgICAgICAgICAgLyogQWRkIGFueSBleHRyYSBzdHlsZXMgdXNlZCBpbiB5b3VyICcucmV0aXJlJyBjb250ZW50ICovXHJcbiAgICAgICAgICA8L3N0eWxlPlxyXG4gICAgICAgIDwvaGVhZD5cclxuICAgICAgICA8Ym9keT5cclxuICAgICAgICAgICR7dGVtcERpdi5pbm5lckhUTUx9XHJcbiAgICAgICAgPC9ib2R5PlxyXG4gICAgICA8L2h0bWw+XHJcbiAgICBgKTtcclxuXHJcbiAgICBwcmludFdpbmRvdy5kb2N1bWVudC5jbG9zZSgpO1xyXG4gICAgcHJpbnRXaW5kb3cuZm9jdXMoKTtcclxuXHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgcHJpbnRXaW5kb3cucHJpbnQoKTtcclxuICAgICAgcHJpbnRXaW5kb3cuY2xvc2UoKTtcclxuICAgIH0sIDUwMCk7XHJcbiAgfSwgMzAwKTtcclxufVxyXG5cclxuZnVuY3Rpb24gcHJpbnRDaGFydHNBbmRUYWJsZShjaGFydENsYXNzLCB0YWJsZUNsYXNzLCBzdW1tYXJ5RGl2SWQpIHtcclxuICBjb25zdCBjaGFydENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoY2hhcnRDbGFzcyk7XHJcbiAgY29uc3QgdGFibGVDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhYmxlQ2xhc3MpO1xyXG4gIGNvbnN0IHN1bW1hcnlEaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHN1bW1hcnlEaXZJZCk7XHJcbiAgaWYgKCFjaGFydENvbnRhaW5lciB8fCAhdGFibGVDb250YWluZXIgfHwgIXN1bW1hcnlEaXYpIHJldHVybjtcclxuXHJcbiAgY29uc3QgY2FudmFzZXMgPSBjaGFydENvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCdjYW52YXMnKTtcclxuXHJcbiAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICBjb25zdCB0ZW1wRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcblxyXG4gICAgLy8gQ2xvbmUgdGhlIHN1bW1hcnkgc2VjdGlvblxyXG4gICAgY29uc3Qgc3VtbWFyeUNsb25lID0gc3VtbWFyeURpdi5jbG9uZU5vZGUodHJ1ZSk7XHJcbiAgICBzdW1tYXJ5Q2xvbmUuc3R5bGUubWFyZ2luQm90dG9tID0gJzQwcHgnO1xyXG4gICAgdGVtcERpdi5hcHBlbmRDaGlsZChzdW1tYXJ5Q2xvbmUpO1xyXG5cclxuICAgIC8vIEFkZCBjaGFydHMgYXMgaW1hZ2VzXHJcbiAgICBjYW52YXNlcy5mb3JFYWNoKChjYW52YXMpID0+IHtcclxuICAgICAgY29uc3QgaW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XHJcbiAgICAgIGltZy5zcmMgPSBjYW52YXMudG9EYXRhVVJMKCdpbWFnZS9wbmcnKTtcclxuICAgICAgaW1nLnN0eWxlLndpZHRoID0gJzEwMCUnO1xyXG4gICAgICBpbWcuc3R5bGUubWFyZ2luQm90dG9tID0gJzIwcHgnO1xyXG4gICAgICB0ZW1wRGl2LmFwcGVuZENoaWxkKGltZyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBDbG9uZSB0aGUgdGFibGUgSFRNTFxyXG4gICAgY29uc3QgdGFibGVDbG9uZSA9IHRhYmxlQ29udGFpbmVyLmNsb25lTm9kZSh0cnVlKTtcclxuICAgIHRhYmxlQ2xvbmUuc3R5bGUubWFyZ2luVG9wID0gJzQwcHgnO1xyXG4gICAgdGFibGVDbG9uZS5zdHlsZS5ib3JkZXIgPSAnMXB4IHNvbGlkICNjY2MnO1xyXG4gICAgdGVtcERpdi5hcHBlbmRDaGlsZCh0YWJsZUNsb25lKTtcclxuXHJcbiAgICBjb25zdCBwcmludFdpbmRvdyA9IHdpbmRvdy5vcGVuKCcnLCAnJywgJ3dpZHRoPTEwMDAsaGVpZ2h0PTgwMCcpO1xyXG4gICAgcHJpbnRXaW5kb3cuZG9jdW1lbnQud3JpdGUoYFxyXG4gICAgICA8aHRtbD5cclxuICAgICAgICA8aGVhZD5cclxuICAgICAgICAgIDx0aXRsZT5QcmludCBSZXBvcnQ8L3RpdGxlPlxyXG4gICAgICAgICAgPHN0eWxlPlxyXG4gICAgICAgICAgICBib2R5IHtcclxuICAgICAgICAgICAgICBmb250LWZhbWlseTogQXJpYWwsIHNhbnMtc2VyaWY7XHJcbiAgICAgICAgICAgICAgcGFkZGluZzogMjBweDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBoMSwgaDQge1xyXG4gICAgICAgICAgICAgIGNvbG9yOiAjYmZhMDQ2O1xyXG4gICAgICAgICAgICAgIG1hcmdpbjogMTBweCAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGltZyB7XHJcbiAgICAgICAgICAgICAgbWF4LXdpZHRoOiAxMDAlO1xyXG4gICAgICAgICAgICAgIG1hcmdpbi1ib3R0b206IDIwcHg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLmNhcmQge1xyXG4gICAgICAgICAgICAgIGJvcmRlcjogMXB4IHNvbGlkICNjY2M7XHJcbiAgICAgICAgICAgICAgcGFkZGluZzogMTVweDtcclxuICAgICAgICAgICAgICBtYXJnaW46IDEwcHg7XHJcbiAgICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogMTBweDtcclxuICAgICAgICAgICAgICBib3gtc2hhZG93OiAwIDJweCA0cHggcmdiYSgwLDAsMCwwLjEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRhYmxlIHtcclxuICAgICAgICAgICAgICB3aWR0aDogMTAwJTtcclxuICAgICAgICAgICAgICBib3JkZXItY29sbGFwc2U6IGNvbGxhcHNlO1xyXG4gICAgICAgICAgICAgIG1hcmdpbi10b3A6IDIwcHg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGgsIHRkIHtcclxuICAgICAgICAgICAgICBwYWRkaW5nOiAxMHB4O1xyXG4gICAgICAgICAgICAgIGJvcmRlcjogMXB4IHNvbGlkICNjY2M7XHJcbiAgICAgICAgICAgICAgdGV4dC1hbGlnbjogbGVmdDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0cjpudGgtY2hpbGQoZXZlbikge1xyXG4gICAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6ICNmOWY5Zjk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLnJlc3VsdCB7XHJcbiAgICAgICAgICAgICAgZm9udC13ZWlnaHQ6IGJvbGQ7XHJcbiAgICAgICAgICAgICAgY29sb3I6ICMzMzM7XHJcbiAgICAgICAgICAgICAgbWFyZ2luLXRvcDogNXB4O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC5kc3NyIHtcclxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiAjZDhjMDdjO1xyXG4gICAgICAgICAgICAgIHBhZGRpbmc6IDEwcHg7XHJcbiAgICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogNnB4O1xyXG4gICAgICAgICAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAudGV4dC1kYXJrIHtcclxuICAgICAgICAgICAgICBjb2xvcjogIzMzMztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAudGV4dC1jZW50ZXIge1xyXG4gICAgICAgICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgPC9zdHlsZT5cclxuICAgICAgICA8L2hlYWQ+XHJcbiAgICAgICAgPGJvZHk+XHJcbiAgICAgICAgICAke3RlbXBEaXYuaW5uZXJIVE1MfVxyXG4gICAgICAgIDwvYm9keT5cclxuICAgICAgPC9odG1sPlxyXG4gICAgYCk7XHJcblxyXG4gICAgcHJpbnRXaW5kb3cuZG9jdW1lbnQuY2xvc2UoKTtcclxuICAgIHByaW50V2luZG93LmZvY3VzKCk7XHJcblxyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgIHByaW50V2luZG93LnByaW50KCk7XHJcbiAgICAgIHByaW50V2luZG93LmNsb3NlKCk7XHJcbiAgICB9LCA1MDApO1xyXG4gIH0sIDMwMCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZVRhYmxlUmFuZ2UoKSB7XHJcbiAgY29uc3Qgc2VsZWN0ZWRZZWFyID0gcGFyc2VJbnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3llYXJzX3RibCcpLnZhbHVlKTtcclxuICBjb25zdCB0YWJsZUNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd5ZWFybHlUYWJsZXMnKTtcclxuICB0YWJsZUNvbnRhaW5lci5pbm5lckhUTUwgPSAnJztcclxuXHJcbiAgbGV0IHllYXJzID0gW107XHJcbiAgaWYgKHNlbGVjdGVkWWVhciA8PSAxKSB7XHJcbiAgICB5ZWFycyA9IFswLCAxLCAyXTtcclxuICB9IGVsc2UgaWYgKHNlbGVjdGVkWWVhciA+PSAzMCkge1xyXG4gICAgeWVhcnMgPSBbMjgsIDI5LCAzMF07XHJcbiAgfSBlbHNlIHtcclxuICAgIHllYXJzID0gW3NlbGVjdGVkWWVhciAtIDEsIHNlbGVjdGVkWWVhciwgc2VsZWN0ZWRZZWFyICsgMV07XHJcbiAgfVxyXG5cclxuICBjb25zdCB0YWJsZURhdGEgPSB5ZWFyc1xyXG4gICAgLm1hcCgoeWVhcikgPT4gZ2V0VGFibGVEYXRhKHllYXIsIHRydWUpKVxyXG4gICAgLmZpbHRlcihCb29sZWFuKTtcclxuICBpZiAodGFibGVEYXRhLmxlbmd0aCA+IDApIHtcclxuICAgIGNvbnN0IGNvbWJpbmVkVGFibGUgPSBnZW5lcmF0ZUNvbWJpbmVkWWVhclRhYmxlKHRhYmxlRGF0YSk7XHJcbiAgICB0YWJsZUNvbnRhaW5lci5hcHBlbmRDaGlsZChjb21iaW5lZFRhYmxlKTtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFRhYmxlRGF0YSh5ZWFyLCByZXR1cm5EYXRhID0gZmFsc2UpIHtcclxuICAvLyBHZXQgdmFsdWVzIGFuZCBjb252ZXJ0IHRvIG51bWJlcnNcclxuICBsZXQgcHJvcGVydHlQcmljZSA9XHJcbiAgICBwYXJzZUZsb2F0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwcm9wZXJ0eVByaWNlJykudmFsdWUudHJpbSgpKSB8fCAwO1xyXG4gIGxldCBkb3duUGF5bWVudCA9XHJcbiAgICBwYXJzZUZsb2F0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkb3duUGF5bWVudCcpLnZhbHVlLnRyaW0oKSkgfHwgMDtcclxuICBsZXQgbG9hblRlcm0gPVxyXG4gICAgcGFyc2VGbG9hdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbG9hblRlcm0nKS52YWx1ZS50cmltKCkpIHx8IDA7XHJcbiAgbGV0IGludGVyZXN0UmF0ZSA9XHJcbiAgICBwYXJzZUZsb2F0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbnRlcmVzdFJhdGUnKS52YWx1ZS50cmltKCkpIHx8IDA7XHJcbiAgbGV0IG1vbnRobHlSZW50ID1cclxuICAgIHBhcnNlRmxvYXQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vbnRobHlSZW50JykudmFsdWUudHJpbSgpKSB8fCAwO1xyXG4gIGxldCB2YWNhbmN5UmF0ZSA9XHJcbiAgICBwYXJzZUZsb2F0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2YWNhbmN5UmF0ZScpLnZhbHVlLnRyaW0oKSkgfHwgMDtcclxuICBsZXQgcHJvcGVydHlUYXhlcyA9XHJcbiAgICBwYXJzZUZsb2F0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwcm9wZXJ0eVRheGVzJykudmFsdWUudHJpbSgpKSB8fCAwO1xyXG4gIGxldCBpbnN1cmFuY2VDb3N0cyA9XHJcbiAgICBwYXJzZUZsb2F0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbnN1cmFuY2VDb3N0cycpLnZhbHVlLnRyaW0oKSkgfHwgMDtcclxuICBsZXQgbWFpbnRlbmFuY2VDb3N0cyA9XHJcbiAgICBwYXJzZUZsb2F0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYWludGVuYW5jZUNvc3RzJykudmFsdWUudHJpbSgpKSB8fCAwO1xyXG4gIGxldCBtYW5hZ2VtZW50RmVlcyA9XHJcbiAgICBwYXJzZUZsb2F0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYW5hZ2VtZW50RmVlcycpLnZhbHVlLnRyaW0oKSkgfHwgMDtcclxuICBsZXQgYXBwcmVjaWF0aW9uUmF0ZSA9XHJcbiAgICBwYXJzZUZsb2F0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcHByZWNpYXRpb25SYXRlJykudmFsdWUudHJpbSgpKSB8fCAzO1xyXG4gIGxldCByZW50SW5jcmVhc2VSYXRlID0gMjtcclxuICBsZXQgdXRpbGl0aWVzID1cclxuICAgIHBhcnNlRmxvYXQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3V0aWxpdGllcycpLnZhbHVlLnRyaW0oKSkgfHwgMDtcclxuICBsZXQgcmVub3ZhdGlvbnMgPVxyXG4gICAgcGFyc2VGbG9hdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVub3ZhdGlvbnMnKS52YWx1ZS50cmltKCkpIHx8IDA7XHJcblxyXG4gIGlmICgheWVhciB8fCB5ZWFyIDwgMCkgcmV0dXJuO1xyXG5cclxuICAvLyBMb2FuIGNhbGN1bGF0aW9uXHJcbiAgbGV0IGxvYW5BbW91bnQgPSBwcm9wZXJ0eVByaWNlIC0gZG93blBheW1lbnQ7XHJcbiAgbGV0IG1vbnRobHlSYXRlID0gaW50ZXJlc3RSYXRlIC8gMTAwIC8gMTI7XHJcbiAgbGV0IG51bVBheW1lbnRzID0gbG9hblRlcm0gKiAxMjtcclxuICBsZXQgbW9ydGdhZ2VQYXltZW50ID1cclxuICAgIG1vbnRobHlSYXRlID4gMFxyXG4gICAgICA/IChsb2FuQW1vdW50ICogKG1vbnRobHlSYXRlICogTWF0aC5wb3coMSArIG1vbnRobHlSYXRlLCBudW1QYXltZW50cykpKSAvXHJcbiAgICAgICAgKE1hdGgucG93KDEgKyBtb250aGx5UmF0ZSwgbnVtUGF5bWVudHMpIC0gMSlcclxuICAgICAgOiBsb2FuQW1vdW50IC8gbnVtUGF5bWVudHM7XHJcblxyXG4gIC8vIEFwcHJlY2lhdGlvbiBhbmQgUmVudCBncm93dGhcclxuICBsZXQgYXBwcmVjaWF0aW9uRmFjdG9yID0gTWF0aC5wb3coMSArIGFwcHJlY2lhdGlvblJhdGUgLyAxMDAsIHllYXIpO1xyXG4gIGxldCByZW50RmFjdG9yID0gTWF0aC5wb3coMSArIHJlbnRJbmNyZWFzZVJhdGUgLyAxMDAsIHllYXIpO1xyXG5cclxuICBsZXQgZ3Jvc3NSZW50SW5jb21lID0gbW9udGhseVJlbnQgKiAxMiAqIHJlbnRGYWN0b3I7XHJcbiAgbGV0IHZhY2FuY3lMb3NzID0gZ3Jvc3NSZW50SW5jb21lICogKHZhY2FuY3lSYXRlIC8gMTAwKTtcclxuICBsZXQgYWRqdXN0ZWRSZW50SW5jb21lID0gZ3Jvc3NSZW50SW5jb21lIC0gdmFjYW5jeUxvc3M7XHJcbiAgbGV0IG1hbmFnZW1lbnRDb3N0ID0gZ3Jvc3NSZW50SW5jb21lICogKG1hbmFnZW1lbnRGZWVzIC8gMTAwKTtcclxuXHJcbiAgLy8gT3BlcmF0aW5nIEV4cGVuc2VzXHJcbiAgbGV0IG9wZXJhdGluZ0V4cGVuc2VzID1cclxuICAgIHZhY2FuY3lMb3NzICtcclxuICAgIHByb3BlcnR5VGF4ZXMgK1xyXG4gICAgaW5zdXJhbmNlQ29zdHMgK1xyXG4gICAgbWFpbnRlbmFuY2VDb3N0cyArXHJcbiAgICBtYW5hZ2VtZW50Q29zdCArXHJcbiAgICB1dGlsaXRpZXMgK1xyXG4gICAgcmVub3ZhdGlvbnM7XHJcblxyXG4gIGxldCBuZXRPcGVyYXRpbmdJbmNvbWUgPSBncm9zc1JlbnRJbmNvbWUgLSBvcGVyYXRpbmdFeHBlbnNlcztcclxuICBsZXQgYW5udWFsTW9ydGdhZ2VQYXltZW50ID0gbW9ydGdhZ2VQYXltZW50ICogMTI7XHJcbiAgbGV0IGNhc2hGbG93QW5udWFsID0gbmV0T3BlcmF0aW5nSW5jb21lIC0gYW5udWFsTW9ydGdhZ2VQYXltZW50O1xyXG5cclxuICAvLyBJZiByZXR1cm5EYXRhIGlzIHRydWUsIHNlbmQgdmFsdWVzIGJhY2sgaW5zdGVhZCBvZiB1cGRhdGluZyBVSVxyXG4gIGlmIChyZXR1cm5EYXRhKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB5ZWFyLFxyXG4gICAgICBncm9zc1JlbnRJbmNvbWUsXHJcbiAgICAgIHZhY2FuY3lMb3NzLFxyXG4gICAgICBhZGp1c3RlZFJlbnRJbmNvbWUsXHJcbiAgICAgIG9wZXJhdGluZ0V4cGVuc2VzLFxyXG4gICAgICBuZXRPcGVyYXRpbmdJbmNvbWUsXHJcbiAgICAgIGFubnVhbE1vcnRnYWdlUGF5bWVudCxcclxuICAgICAgY2FwaXRhbEV4cGVuZGl0dXJlczogMTQyNSwgLy8gb3IgZHluYW1pYyBsYXRlclxyXG4gICAgICBjYXNoRmxvdzogY2FzaEZsb3dBbm51YWwsXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgLy8gVXBkYXRlIFVJXHJcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3llYXJfYicpLmlubmVySFRNTCA9IHllYXI7XHJcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dyb3NzX3JlbnQnKS5pbm5lclRleHQgPSBgJCR7Z3Jvc3NSZW50SW5jb21lLnRvRml4ZWQoXHJcbiAgICAyXHJcbiAgKX1gO1xyXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2YWNhbmN5X3JhdGUnKS5pbm5lclRleHQgPSBg4oCTICQke3ZhY2FuY3lMb3NzLnRvRml4ZWQoXHJcbiAgICAyXHJcbiAgKX1gO1xyXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgJ29wZXJhdGluZ19pbmNvbWUnXHJcbiAgKS5pbm5lclRleHQgPSBgJCR7YWRqdXN0ZWRSZW50SW5jb21lLnRvRml4ZWQoMil9YDtcclxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgICdvcGVyYXRpbmdfZXhwZW5zZXMnXHJcbiAgKS5pbm5lclRleHQgPSBg4oCTICQke29wZXJhdGluZ0V4cGVuc2VzLnRvRml4ZWQoMil9YDtcclxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgICduZXRfb3BlcmF0aW5nX2luY29tZSdcclxuICApLmlubmVyVGV4dCA9IGAkJHtuZXRPcGVyYXRpbmdJbmNvbWUudG9GaXhlZCgyKX1gO1xyXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgJ2xvYW5fcGF5bWVudHMnXHJcbiAgKS5pbm5lclRleHQgPSBg4oCTICQke2FubnVhbE1vcnRnYWdlUGF5bWVudC50b0ZpeGVkKDIpfWA7XHJcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Nhc2hfZmxvdycpLmlubmVyVGV4dCA9IGAkJHtjYXNoRmxvd0FubnVhbC50b0ZpeGVkKFxyXG4gICAgMlxyXG4gICl9YDtcclxuXHJcbiAgY29uc29sZS5sb2coYERhdGEgZGlzcGxheWVkIGZvciB5ZWFyOiAke3llYXJ9YCk7XHJcbn1cclxuXHJcbi8vIGZ1bmN0aW9uIGdlbmVyYXRlWWVhclRhYmxlKGRhdGEsIHllYXIpIHtcclxuLy8gICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4vLyAgIGRpdi5jbGFzc0xpc3QuYWRkKFwibWItNVwiKTtcclxuLy8gICBkaXYuaW5uZXJIVE1MID0gYFxyXG4vLyAgICAgPGg1PlllYXIgJHt5ZWFyfTwvaDU+XHJcbi8vICAgICA8dGFibGUgY2xhc3M9XCJ0YWJsZSB0YWJsZS1ib3JkZXJlZFwiPlxyXG4vLyAgICAgICA8dGhlYWQ+XHJcbi8vICAgICAgICAgPHRyPjx0aD5DYXRlZ29yeTwvdGg+PHRoPkFtb3VudDwvdGg+PC90cj5cclxuLy8gICAgICAgPC90aGVhZD5cclxuLy8gICAgICAgPHRib2R5PlxyXG4vLyAgICAgICAgIDx0cj48dGQ+R3Jvc3MgUmVudDwvdGQ+PHRkPiQke2RhdGEuZ3Jvc3NSZW50SW5jb21lLnRvRml4ZWQoMil9PC90ZD48L3RyPlxyXG4vLyAgICAgICAgIDx0cj48dGQ+VmFjYW5jeTwvdGQ+PHRkPuKAkyAkJHtkYXRhLnZhY2FuY3lMb3NzLnRvRml4ZWQoMil9PC90ZD48L3RyPlxyXG4vLyAgICAgICAgIDx0cj48dGQ+T3BlcmF0aW5nIEluY29tZTwvdGQ+PHRkPiQke2RhdGEuYWRqdXN0ZWRSZW50SW5jb21lLnRvRml4ZWQoMil9PC90ZD48L3RyPlxyXG4vLyAgICAgICAgIDx0cj48dGQ+T3BlcmF0aW5nIEV4cGVuc2VzPC90ZD48dGQ+4oCTICQke2RhdGEub3BlcmF0aW5nRXhwZW5zZXMudG9GaXhlZCgyKX08L3RkPjwvdHI+XHJcbi8vICAgICAgICAgPHRyPjx0ZCBjbGFzcz1cInBzLTRcIj5Qcm9wZXJ0eSBUYXhlczwvdGQ+PHRkPiQke3BhcnNlRmxvYXQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwcm9wZXJ0eVRheGVzXCIpLnZhbHVlIHx8IDApLnRvRml4ZWQoMil9PC90ZD48L3RyPlxyXG4vLyAgICAgICAgIDx0cj48dGQgY2xhc3M9XCJwcy00XCI+SW5zdXJhbmNlPC90ZD48dGQ+JCR7cGFyc2VGbG9hdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImluc3VyYW5jZUNvc3RzXCIpLnZhbHVlIHx8IDApLnRvRml4ZWQoMil9PC90ZD48L3RyPlxyXG4vLyAgICAgICAgIDx0cj48dGQgY2xhc3M9XCJwcy00XCI+TWFpbnRlbmFuY2U8L3RkPjx0ZD4kJHtwYXJzZUZsb2F0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFpbnRlbmFuY2VDb3N0c1wiKS52YWx1ZSB8fCAwKS50b0ZpeGVkKDIpfTwvdGQ+PC90cj5cclxuLy8gICAgICAgICA8dHI+PHRkIGNsYXNzPVwicHMtNFwiPk1hbmFnZW1lbnQgRmVlczwvdGQ+PHRkPiQkeyhkYXRhLmFkanVzdGVkUmVudEluY29tZSAqIChwYXJzZUZsb2F0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFuYWdlbWVudEZlZXNcIikudmFsdWUgfHwgMCkgLyAxMDApKS50b0ZpeGVkKDIpfTwvdGQ+PC90cj5cclxuLy8gICAgICAgICA8dHI+PHRkIGNsYXNzPVwicHMtNFwiPlZhY2FuY3kgTG9zczwvdGQ+PHRkPiQke2RhdGEudmFjYW5jeUxvc3MudG9GaXhlZCgyKX08L3RkPjwvdHI+XHJcbi8vICAgICAgICAgPHRyPjx0ZCBjbGFzcz1cInBzLTRcIj5VdGlsaXRpZXM8L3RkPjx0ZD4kJHtwYXJzZUZsb2F0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidXRpbGl0aWVzXCIpLnZhbHVlIHx8IDApLnRvRml4ZWQoMil9PC90ZD48L3RyPlxyXG4vLyAgICAgICAgIDx0cj48dGQgY2xhc3M9XCJwcy00XCI+UmVub3ZhdGlvbnM8L3RkPjx0ZD4kJHtwYXJzZUZsb2F0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVub3ZhdGlvbnNcIikudmFsdWUgfHwgMCkudG9GaXhlZCgyKX08L3RkPjwvdHI+XHJcbi8vICAgICAgICAgPHRyIGNsYXNzPVwiZnctYm9sZFwiPjx0ZD5OZXQgT3BlcmF0aW5nIEluY29tZSAoTk9JKTwvdGQ+PHRkPiQke2RhdGEubmV0T3BlcmF0aW5nSW5jb21lLnRvRml4ZWQoMil9PC90ZD48L3RyPlxyXG4vLyAgICAgICAgIDx0cj48dGQ+TG9hbiBQYXltZW50czwvdGQ+PHRkPuKAkyAkJHtkYXRhLmFubnVhbE1vcnRnYWdlUGF5bWVudC50b0ZpeGVkKDIpfTwvdGQ+PC90cj5cclxuLy8gICAgICAgICA8dHI+PHRkPkNhcGl0YWwgRXhwZW5kaXR1cmVzPC90ZD48dGQ+4oCTICQke2RhdGEuY2FwaXRhbEV4cGVuZGl0dXJlcy50b0ZpeGVkKDIpfTwvdGQ+PC90cj5cclxuLy8gICAgICAgICA8dHIgY2xhc3M9XCJmdy1ib2xkXCI+PHRkPkNhc2ggRmxvdzwvdGQ+PHRkPiQke2RhdGEuY2FzaEZsb3cudG9GaXhlZCgyKX08L3RkPjwvdHI+XHJcbi8vICAgICAgIDwvdGJvZHk+XHJcbi8vICAgICA8L3RhYmxlPlxyXG4vLyAgIGA7XHJcbi8vICAgcmV0dXJuIGRpdjtcclxuLy8gfVxyXG5mdW5jdGlvbiBnZW5lcmF0ZUNvbWJpbmVkWWVhclRhYmxlKGRhdGFBcnJheSkge1xyXG4gIGNvbnN0IGR5bmFtaWNDYXRlZ29yaWVzID0gW1xyXG4gICAgJ0dyb3NzIFJlbnQnLFxyXG4gICAgJ1ZhY2FuY3knLFxyXG4gICAgJ09wZXJhdGluZyBJbmNvbWUnLFxyXG4gICAgJ09wZXJhdGluZyBFeHBlbnNlcycsXHJcbiAgICAnTWFuYWdlbWVudCBGZWVzJyxcclxuICAgICdWYWNhbmN5IExvc3MnLFxyXG4gICAgJ05ldCBPcGVyYXRpbmcgSW5jb21lIChOT0kpJyxcclxuICAgICdMb2FuIFBheW1lbnRzJyxcclxuICAgICdDYXBpdGFsIEV4cGVuZGl0dXJlcycsXHJcbiAgICAnQ2FzaCBGbG93JyxcclxuICBdO1xyXG5cclxuICBjb25zdCBzdGF0aWNFeHBlbnNlcyA9IHtcclxuICAgICdQcm9wZXJ0eSBUYXhlcyc6XHJcbiAgICAgIHBhcnNlRmxvYXQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Byb3BlcnR5VGF4ZXMnKS52YWx1ZSkgfHwgMCxcclxuICAgIEluc3VyYW5jZTogcGFyc2VGbG9hdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaW5zdXJhbmNlQ29zdHMnKS52YWx1ZSkgfHwgMCxcclxuICAgIE1haW50ZW5hbmNlOlxyXG4gICAgICBwYXJzZUZsb2F0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYWludGVuYW5jZUNvc3RzJykudmFsdWUpIHx8IDAsXHJcbiAgICBVdGlsaXRpZXM6IHBhcnNlRmxvYXQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3V0aWxpdGllcycpLnZhbHVlKSB8fCAwLFxyXG4gICAgUmVub3ZhdGlvbnM6IHBhcnNlRmxvYXQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlbm92YXRpb25zJykudmFsdWUpIHx8IDAsXHJcbiAgfTtcclxuXHJcbiAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgZGl2LmNsYXNzTGlzdC5hZGQoJ21iLTUnLCAndGFibGUtZGVzaWduJyk7XHJcblxyXG4gIC8vIPCfjJ8gU3RhdGljIEV4cGVuc2VzIFRhYmxlXHJcbiAgbGV0IHN0YXRpY1RhYmxlID0gYFxyXG4gICAgPGg1PkZpeGVkIEFubnVhbCBFeHBlbnNlczwvaDU+XHJcbiAgICA8dGFibGUgY2xhc3M9XCJ0YWJsZSB0YWJsZS1ib3JkZXJlZFwiPlxyXG4gICAgICA8dGhlYWQgY2xhc3M9XCJjbHItYmdcIiBzdHlsZT1cImJhY2tncm91bmQtY29sb3I6ICMzMzMzMzM7IGNvbG9yOiB3aGl0ZTtcIj5cclxuICAgICAgICA8dHI+PHRoPkNhdGVnb3J5PC90aD48dGg+QW1vdW50PC90aD48L3RyPlxyXG4gICAgICA8L3RoZWFkPlxyXG4gICAgICA8dGJvZHk+XHJcbiAgICAgICAgJHtPYmplY3QuZW50cmllcyhzdGF0aWNFeHBlbnNlcylcclxuICAgICAgICAgIC5tYXAoXHJcbiAgICAgICAgICAgIChba2V5LCB2YWxdKSA9PiBgXHJcbiAgICAgICAgICA8dHI+PHRkPiR7a2V5fTwvdGQ+PHRkPiQke3ZhbC50b0ZpeGVkKDIpfTwvdGQ+PC90cj5cclxuICAgICAgICBgXHJcbiAgICAgICAgICApXHJcbiAgICAgICAgICAuam9pbignJyl9XHJcbiAgICAgIDwvdGJvZHk+XHJcbiAgICA8L3RhYmxlPlxyXG4gIGA7XHJcblxyXG4gIC8vIPCfk4UgWWVhcmx5IERhdGEgVGFibGUgKER5bmFtaWMgVmFsdWVzKVxyXG4gIGxldCBkeW5hbWljVGFibGUgPSBgXHJcbiAgICA8aDU+WWVhcmx5IEZpbmFuY2lhbHM6IFllYXJzICR7ZGF0YUFycmF5Lm1hcCgoZCkgPT4gZC55ZWFyKS5qb2luKCcsICcpfTwvaDU+XHJcbiAgICA8dGFibGUgY2xhc3M9XCJ0YWJsZSB0YWJsZS1ib3JkZXJlZFwiPlxyXG4gICAgICA8dGhlYWQgY2xhc3M9XCJjbHItYmdcIiBzdHlsZT1cImJhY2tncm91bmQtY29sb3I6ICMzMzMzMzM7IGNvbG9yOiB3aGl0ZTtcIj5cclxuICAgICAgICA8dHI+XHJcbiAgICAgICAgICA8dGg+Q2F0ZWdvcnk8L3RoPlxyXG4gICAgICAgICAgJHtkYXRhQXJyYXkubWFwKChkKSA9PiBgPHRoPlllYXIgJHtkLnllYXJ9PC90aD5gKS5qb2luKCcnKX1cclxuICAgICAgICA8L3RyPlxyXG4gICAgICA8L3RoZWFkPlxyXG4gICAgICA8dGJvZHk+XHJcbiAgYDtcclxuXHJcbiAgZHluYW1pY0NhdGVnb3JpZXMuZm9yRWFjaCgoY2F0KSA9PiB7XHJcbiAgICBkeW5hbWljVGFibGUgKz0gYDx0cj48dGQ+JHtjYXR9PC90ZD5gO1xyXG4gICAgZGF0YUFycmF5LmZvckVhY2goKGRhdGEpID0+IHtcclxuICAgICAgbGV0IHZhbHVlID0gMDtcclxuICAgICAgc3dpdGNoIChjYXQpIHtcclxuICAgICAgICBjYXNlICdHcm9zcyBSZW50JzpcclxuICAgICAgICAgIHZhbHVlID0gZGF0YS5ncm9zc1JlbnRJbmNvbWU7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlICdWYWNhbmN5JzpcclxuICAgICAgICAgIHZhbHVlID0gZGF0YS52YWNhbmN5TG9zcztcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ09wZXJhdGluZyBJbmNvbWUnOlxyXG4gICAgICAgICAgdmFsdWUgPSBkYXRhLmFkanVzdGVkUmVudEluY29tZTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ09wZXJhdGluZyBFeHBlbnNlcyc6XHJcbiAgICAgICAgICB2YWx1ZSA9IGRhdGEub3BlcmF0aW5nRXhwZW5zZXM7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlICdNYW5hZ2VtZW50IEZlZXMnOlxyXG4gICAgICAgICAgdmFsdWUgPVxyXG4gICAgICAgICAgICAoZGF0YS5hZGp1c3RlZFJlbnRJbmNvbWUgKlxyXG4gICAgICAgICAgICAgIChwYXJzZUZsb2F0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYW5hZ2VtZW50RmVlcycpLnZhbHVlKSB8fFxyXG4gICAgICAgICAgICAgICAgMCkpIC9cclxuICAgICAgICAgICAgMTAwO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnVmFjYW5jeSBMb3NzJzpcclxuICAgICAgICAgIHZhbHVlID0gZGF0YS52YWNhbmN5TG9zcztcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ05ldCBPcGVyYXRpbmcgSW5jb21lIChOT0kpJzpcclxuICAgICAgICAgIHZhbHVlID0gZGF0YS5uZXRPcGVyYXRpbmdJbmNvbWU7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlICdMb2FuIFBheW1lbnRzJzpcclxuICAgICAgICAgIHZhbHVlID0gLWRhdGEuYW5udWFsTW9ydGdhZ2VQYXltZW50O1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnQ2FwaXRhbCBFeHBlbmRpdHVyZXMnOlxyXG4gICAgICAgICAgdmFsdWUgPSAtZGF0YS5jYXBpdGFsRXhwZW5kaXR1cmVzO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnQ2FzaCBGbG93JzpcclxuICAgICAgICAgIHZhbHVlID0gZGF0YS5jYXNoRmxvdztcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICAgIGR5bmFtaWNUYWJsZSArPSBgPHRkPiQke3ZhbHVlLnRvRml4ZWQoMil9PC90ZD5gO1xyXG4gICAgfSk7XHJcbiAgICBkeW5hbWljVGFibGUgKz0gYDwvdHI+YDtcclxuICB9KTtcclxuXHJcbiAgZHluYW1pY1RhYmxlICs9IGA8L3Rib2R5PjwvdGFibGU+YDtcclxuXHJcbiAgLy8g8J+nqSBDb21iaW5lIGFuZCBSZXR1cm5cclxuICBkaXYuaW5uZXJIVE1MID0gZHluYW1pY1RhYmxlICsgc3RhdGljVGFibGU7XHJcbiAgcmV0dXJuIGRpdjtcclxufVxyXG4iXSwibmFtZXMiOlsiZG9jdW1lbnQiLCJhZGRFdmVudExpc3RlbmVyIiwiaW5wdXRzIiwicXVlcnlTZWxlY3RvckFsbCIsImlucHV0MiIsImlucHV0MyIsImZvckVhY2giLCJpbnB1dCIsImNhbGN1bGF0ZUhvdXNlRmxpcCIsImNhbGN1bGF0ZVJldGlyZW1lbnQiLCJjYWxjdWxhdGVSZW50YWxQcm9wZXJ0eSIsImZvcm1hdE51bWJlciIsInZhbHVlIiwiZm9ybWF0dGVkVmFsdWUiLCJNYXRoIiwiYWJzIiwidG9Mb2NhbGVTdHJpbmciLCJ1bmRlZmluZWQiLCJtaW5pbXVtRnJhY3Rpb25EaWdpdHMiLCJtYXhpbXVtRnJhY3Rpb25EaWdpdHMiLCJmb3JtYXROdW1iZXJQZXJjZW50IiwicHVyY2hhc2UiLCJwYXJzZUZsb2F0IiwiZ2V0RWxlbWVudEJ5SWQiLCJyZW5vIiwiaG9sZGluZyIsImFydiIsImRlc2lyZWRQcm9maXRNYXJnaW4iLCJpbnRlcmVzdFJhdGUiLCJsb2FuUG9pbnRzIiwidGVybVllYXJzIiwidG90YWxQYXltZW50cyIsImdhcEZ1bmRpbmdSYXRlIiwiZG93blBheW1lbnRQZXJjZW50IiwicmVzYWxlQ29zdFBlcmNlbnQiLCJyZXNhbGVDb3N0cyIsImFkZHJlc3MiLCJtb250aHMiLCJtb250aGx5UmVudCIsImFubnVhbFByb3BlcnR5VGF4ZXMiLCJhbm51YWxJbnN1cmFuY2UiLCJhbm51YWxNYWludGVuYW5jZSIsImFubnVhbFV0aWxpdGllcyIsInF1ZXJ5U2VsZWN0b3IiLCJzdHlsZSIsImRpc3BsYXkiLCJkb3duUGF5bWVudFR5cGUiLCJkb3duUGF5bWVudEJhc2UiLCJjbG9zaW5nUGVyY2VudCIsImNsb3NpbmciLCJkb3duUGF5bWVudCIsIm1vbnRobHlSYXRlIiwibG9hbkFtb3VudCIsInByb3JhdGVkTWFpbnRlbmFuY2UiLCJwcm9yYXRlZFV0aWxpdGllcyIsImxvYW5GZWVzIiwicHJvcmF0ZWRUYXhlcyIsInByb3JhdGVkSW5zdXJhbmNlIiwibW9udGhseU1vcnRnYWdlUGF5bWVudCIsInBvdyIsInRvdGFsTW9ydGdhZ2VQYWlkIiwicHJpbmNpcGFsUGFpZCIsImludGVyZXN0UGFpZCIsImxvYW5JbnRlcmVzdCIsInRvdGFsUHJvamVjdENvc3QiLCJnYXBDb3N0cyIsImdhcEZ1bmRpbmdGZWVzIiwidG90YWxJbnZlc3RtZW50IiwidG90YWxDYXNoSW52ZXN0ZWQiLCJncm9zc1Byb2ZpdCIsIm5ldFByb2ZpdCIsInByb2ZpdE1hcmdpbiIsImNhc2hPbkNhc2hSZXR1cm4iLCJtb250aGx5UmVudGFsUHJvZml0IiwidG9GaXhlZCIsImJyZWFrRXZlblllYXJzIiwidG90YWxIb2xkaW5nRXhwZW5zZXMiLCJtb250aGx5SG9sZGluZ0Nvc3QiLCJyZW50YWxWc0ZsaXAiLCJwcm9maXRNaW5QZXJjZW50IiwicHJvZml0TWluRG9sbGFyIiwicHJvamVjdGlvbiIsImRlYWwiLCJyZXF1aXJlZEFSViIsInRvdGFsSW52ZXN0bWVudEV4Y2x1ZGluZ1B1cmNoYXNlIiwidGFyZ2V0TmV0UHJvZml0IiwiYWxsT3RoZXJDb3N0cyIsIm1heFB1cmNoYXNlUHJpY2UiLCJpbm5lclRleHQiLCJuZXRQcm9maXRFbCIsIm5ldHByb2NhcmQiLCJuZXRwcm9jYXJkaGVhZCIsImNvbG9yIiwiYmFja2dyb3VuZCIsInByb2ZpdE1hcmdpbkVsIiwicHJvbWFyY2FyZCIsInByb21hcmNhcmRoZWFkIiwicmVudGFsVnNGbGlwRWwiLCJydmZjYXJkIiwicnZmY2FyZGhlYWQiLCJkZWFsQ2FyZGQiLCJkZWFsQ2FyZGRoZWFkIiwicmVzZXRDYW52YXMiLCJjcmVhdGVQcm9qZWN0Q29zdEJyZWFrZG93bkNoYXJ0IiwiY3JlYXRlQVJWRGlzdHJpYnV0aW9uQ2hhcnQiLCJpbnZlc3RtZW50IiwiaWQiLCJjYW52YXNXcmFwcGVyIiwicGFyZW50Tm9kZSIsImlubmVySFRNTCIsIkNoYXJ0IiwicmVnaXN0ZXIiLCJDaGFydERhdGFMYWJlbHMiLCJkYXRhIiwiY3R4IiwiZ2V0Q29udGV4dCIsImNvbWJpbmVkSG9sZGluZyIsImxhYmVscyIsInZhbHVlcyIsInRvdGFsIiwicmVkdWNlIiwiYSIsImIiLCJ0eXBlIiwiZGF0YXNldHMiLCJiYWNrZ3JvdW5kQ29sb3IiLCJib3JkZXJDb2xvciIsImJvcmRlcldpZHRoIiwiaG92ZXJPZmZzZXQiLCJvcHRpb25zIiwicmVzcG9uc2l2ZSIsImN1dG91dCIsInBsdWdpbnMiLCJkYXRhbGFiZWxzIiwiZm9udCIsIndlaWdodCIsInNpemUiLCJmb3JtYXR0ZXIiLCJjb250ZXh0IiwicGVyY2VudGFnZSIsImRhdGFzZXQiLCJkYXRhSW5kZXgiLCJ0aXRsZSIsInRleHQiLCJsZWdlbmQiLCJwb3NpdGlvbiIsImJveFdpZHRoIiwicGFkZGluZyIsInRvb2x0aXAiLCJjYWxsYmFja3MiLCJsYWJlbCIsInBhcnNlZCIsImN1cnJlbnRBZ2UiLCJyZXRpcmVtZW50QWdlIiwiY3VycmVudFNhdmluZ3MiLCJtb250aGx5Q29udHJpYnV0aW9ucyIsImFubnVhbFJldHVybiIsImluZmxhdGlvblJhdGUiLCJkZXNpcmVkSW5jb21lIiwicmVhbEVzdGF0ZUFwcHJlY2lhdGlvbiIsIm1vcnRnYWdlQmFsYW5jZSIsIndob2xlTGlmZUluc3VyYW5jZSIsImxpZmVJbnN1cmFuY2VNb250aGx5Q29udHJpYnV0aW9ucyIsIm1vcnRnYWdlVGVybSIsIm1vcnRnYWdlSW50ZXJlc3RSYXRlIiwiY3VycmVudFN0b2NrVmFsdWUiLCJjdXJyZW50UmVhbEVzdGF0ZUVxdWl0eSIsImVycm9ycyIsIk9iamVjdCIsImVycm9yIiwiaXNWYWxpZCIsInZhbGlkYXRlSW5wdXQiLCJlcnJvckZpZWxkIiwiZmllbGROYW1lIiwibWluIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwibWF4IiwiSW5maW5pdHkiLCJwYXJzZUludCIsInllYXJzVG9SZXRpcmVtZW50IiwibiIsInIiLCJ0IiwiZnZDdXJyZW50U2F2aW5ncyIsImZ2Q29udHJpYnV0aW9ucyIsImZ2U3RvY2siLCJyZWFsRXN0YXRlUmF0ZSIsImFkanVzdGVkTW9ydGdhZ2UiLCJmdlJlYWxFc3RhdGUiLCJpc05hTiIsImxpZmVJbnN1cmFuY2VNb250aGx5IiwiZnZMaWZlSW5zdXJhbmNlQ29udHJpYnV0aW9ucyIsImZ2V2hvbGVMaWZlSW5zdXJhbmNlIiwidG90YWxTYXZpbmdzIiwibW9ydGdhZ2VFbmRZZWFycyIsInJlbWFpbmluZ1llYXJzIiwiZnV0dXJlRXh0cmFTYXZpbmdzIiwibW9udGhseVBheW1lbnQiLCJhZGp1c3RlZEluY29tZSIsInByb2plY3Rpb25zIiwic3RvY2tHcm93dGhSYXRlIiwiaSIsInJlYWxFc3RhdGVWYWx1ZSIsInByaW5jaXBhbCIsInRlcm1Nb250aHMiLCJtb250aHNQYWlkIiwicmVtYWluaW5nTW9ydGdhZ2UiLCJuZXRSZWFsRXN0YXRlIiwiZXh0cmFJbnZlc3RtZW50VmFsdWUiLCJleHRyYU1vbnRocyIsImV4dHJhTW9udGhseSIsImV4dHJhWWVhcnMiLCJpbnN1cmFuY2VDb250cmlidXRpb25GViIsInRvdGFsSW5zdXJhbmNlVmFsdWUiLCJwdXNoIiwieWVhciIsInN0b2NrVmFsdWUiLCJpbnN1cmFuY2VWYWx1ZSIsIndpdGhkcmF3YWxZZWFycyIsInJlbWFpbmluZ0JhbGFuY2UiLCJ5ZWFybHlXaXRoZHJhd2FsIiwieWVhcnNBcnJheSIsImJhbGFuY2VBcnJheSIsImV4cGVjdGVkTGlmZXNwYW4iLCJyZXRpcmVtZW50WWVhcnMiLCJzaG9ydGZhbGxTdXJwbHVzRGl2Iiwic2hvcnRmYWxsU3VycGx1cyIsInRvdGFsU2F2aW5nc0VsIiwidG90YWxTYXZpbmdzQ2FyZCIsInRvdGFsU2F2aW5nc2hlYWQiLCJwcm9qZWN0aW9uc0RpdiIsInByb2oiLCJyZW5kZXJBc3NldEJyZWFrZG93bkNoYXJ0IiwicmVuZGVySW5jb21lU291cmNlUGllIiwiZnZTYXZpbmdzIiwiY2hhcnREYXRhIiwid2luZG93IiwiYXNzZXRCcmVha2Rvd25DaGFydCIsImRlc3Ryb3kiLCJpbmNvbWVTb3VyY2VDaGFydEluc3RhbmNlIiwiY29udHJpYnV0aW9ucyIsInN0b2NrIiwicmVhbEVzdGF0ZSIsImluc3VyYW5jZSIsImRhdGFWYWx1ZXMiLCJhbmltYXRpb24iLCJhbmltYXRlUm90YXRlIiwiYW5pbWF0ZVNjYWxlIiwiZHVyYXRpb24iLCJlYXNpbmciLCJwcm9wZXJ0eVByaWNlIiwidHJpbSIsImxvYW5UZXJtIiwidmFjYW5jeVJhdGUiLCJwcm9wZXJ0eVRheGVzIiwiaW5zdXJhbmNlQ29zdHMiLCJtYWludGVuYW5jZUNvc3RzIiwibWFuYWdlbWVudEZlZXMiLCJ1dGlsaXRpZXMiLCJyZW5vdmF0aW9ucyIsInJlbnRHcm93dGgiLCJjbG9zaW5nQ29zdHNQZXJjZW50IiwiY2xvc2luZ0Nvc3RzIiwidGltZUR1cmF0aW9uIiwiYXBwcmVjaWF0aW9uUmF0ZSIsIm51bVBheW1lbnRzIiwibW9ydGdhZ2VQYXltZW50IiwiZ3Jvc3NSZW50SW5jb21lIiwidmFjYW5jeUxvc3MiLCJhZGp1c3RlZFJlbnRJbmNvbWUiLCJvcGVyYXRpbmdFeHBlbnNlcyIsIm5vaSIsImFubnVhbE1vcnRnYWdlUGF5bWVudCIsImNhc2hGbG93QW5udWFsIiwiY2FzaEZsb3dNb250aGx5IiwiY2FwUmF0ZSIsImNvY1JldHVybiIsImRlYnRTZXJ2aWNlUmF0aW8iLCJyZW50UHJvamVjdGlvbnMiLCJhZGp1c3RlZFJlbnRQcm9qZWN0aW9ucyIsIm1vbnRobHlQcm9wZXJ0eVRheGVzIiwibW9udGhseUluc3VyYW5jZSIsIm1vbnRobHlNYWludGVuYW5jZSIsIm1vbnRobHlNYW5hZ2VtZW50RmVlcyIsIm1vbnRobHlVdGlsaXRpZXMiLCJtb250aGx5UmVub3ZhdGlvbnMiLCJ0b3RhbE1vbnRobHlDb3N0cyIsInllYXJSZW50IiwieWVhclZhY2FuY3lMb3NzIiwieWVhckFkanVzdGVkUmVudCIsImRzckVsZW1lbnQiLCJyZW5kZXJQb3J0Zm9saW9QaWVDaGFydCIsInJlbmRlckNhc2hGbG93UGllQ2hhcnQiLCJnZXRUYWJsZURhdGEiLCJ1cGRhdGVUYWJsZVJhbmdlIiwicG9ydGZvbGlvUGllQ2hhcnQiLCJzY2FsZWRJbmNvbWUiLCJzY2FsZWRFeHBlbnNlcyIsInNjYWxlZENhc2hGbG93IiwiY29sb3JzIiwicHJvZml0TGFiZWwiLCJwcm9maXRWYWx1ZSIsInByb2ZpdENvbG9yIiwiZmFtaWx5IiwidG9wIiwiYm90dG9tIiwicmF3IiwiYWZ0ZXJCb2R5Iiwic3VtIiwiY2hhcnQiLCJtb3J0Z2FnZVBheW1lbnRBbm51YWwiLCJjYXNoRmxvd1BpZUNoYXJ0Iiwic2NhbGVkTW9ydGdhZ2UiLCJuZXRMYWJlbCIsIm5ldENvbG9yIiwidG90YWxGbG93IiwiYWNjIiwidmFsIiwibWFwIiwiaW50ZXJhY3Rpb24iLCJtb2RlIiwiaW50ZXJzZWN0IiwiZW5hYmxlZCIsInRpdGxlRm9udCIsImJvZHlGb250IiwiYm94UGFkZGluZyIsInVzZVBvaW50U3R5bGUiLCJqc3BkZiIsImh0bWwyY2FudmFzIiwianNQREYiLCJkb2MiLCJnZXRWYWx1ZSIsImVsZW1lbnQiLCJjb21iaW5lZERpdiIsImNyZWF0ZUVsZW1lbnQiLCJ3aWR0aCIsIm1hcmdpbiIsImNvbnRlbnREaXYiLCJhcHBlbmRDaGlsZCIsImNsb25lTm9kZSIsInJlc3VsdHNEaXYiLCJib2R5Iiwic2NhbGUiLCJ1c2VDT1JTIiwidGhlbiIsImNhbnZhcyIsImltZ1dpZHRoIiwicGFnZUhlaWdodCIsImludGVybmFsIiwicGFnZVNpemUiLCJoZWlnaHQiLCJpbWdIZWlnaHQiLCJoZWlnaHRMZWZ0IiwiaW1nRGF0YSIsInRvRGF0YVVSTCIsImFkZEltYWdlIiwiYWRkUGFnZSIsInNhdmUiLCJyZW1vdmUiLCJjYXRjaCIsImNvbnNvbGUiLCJjYW52YXMyIiwiaW1nRGF0YTIiLCJpbWdXaWR0aDIiLCJpbWdIZWlnaHQyIiwiaGVpZ2h0TGVmdDIiLCJwb3NpdGlvbjIiLCJwb3B1bGF0ZVllYXJzRHJvcGRvd24iLCJzZWxlY3QiLCJvcHRpb24iLCJ0ZXh0Q29udGVudCIsInNlbGVjdGVkIiwic2VsZWN0ZWRWYWx1ZSIsIm9ubG9hZCIsInByaW50U3BlY2lmaWNTZWN0aW9uIiwiY2xhc3NOYW1lcyIsIkFycmF5IiwiaXNBcnJheSIsImNoYXJ0Q29udGFpbmVyIiwiY29udGVudENvbnRhaW5lciIsImNhbnZhc2VzIiwic2V0VGltZW91dCIsInRlbXBEaXYiLCJjbG9uZWRDb250ZW50IiwiaW1nIiwic3JjIiwibWFyZ2luQm90dG9tIiwicHJpbnRXaW5kb3ciLCJvcGVuIiwid3JpdGUiLCJjbG9zZSIsImZvY3VzIiwicHJpbnQiLCJwcmludENoYXJ0c0FuZFRhYmxlIiwiY2hhcnRDbGFzcyIsInRhYmxlQ2xhc3MiLCJzdW1tYXJ5RGl2SWQiLCJ0YWJsZUNvbnRhaW5lciIsInN1bW1hcnlEaXYiLCJzdW1tYXJ5Q2xvbmUiLCJ0YWJsZUNsb25lIiwibWFyZ2luVG9wIiwiYm9yZGVyIiwic2VsZWN0ZWRZZWFyIiwieWVhcnMiLCJ0YWJsZURhdGEiLCJmaWx0ZXIiLCJCb29sZWFuIiwiY29tYmluZWRUYWJsZSIsImdlbmVyYXRlQ29tYmluZWRZZWFyVGFibGUiLCJyZXR1cm5EYXRhIiwicmVudEluY3JlYXNlUmF0ZSIsImFwcHJlY2lhdGlvbkZhY3RvciIsInJlbnRGYWN0b3IiLCJtYW5hZ2VtZW50Q29zdCIsIm5ldE9wZXJhdGluZ0luY29tZSIsImNhcGl0YWxFeHBlbmRpdHVyZXMiLCJjYXNoRmxvdyIsImxvZyIsImRhdGFBcnJheSIsImR5bmFtaWNDYXRlZ29yaWVzIiwic3RhdGljRXhwZW5zZXMiLCJJbnN1cmFuY2UiLCJNYWludGVuYW5jZSIsIlV0aWxpdGllcyIsIlJlbm92YXRpb25zIiwiZGl2IiwiY2xhc3NMaXN0IiwiYWRkIiwic3RhdGljVGFibGUiLCJlbnRyaWVzIiwiX3JlZiIsImtleSIsImpvaW4iLCJkeW5hbWljVGFibGUiLCJkIiwiY2F0Il0sInNvdXJjZVJvb3QiOiIifQ==