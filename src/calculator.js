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
});

document.addEventListener('DOMContentLoaded', function () {
  calculateHouseFlip();
  calculateRetirement();
  calculateRentalProperty();
});

function formatNumber(value) {
  let formattedValue =
    value % 1 === 0
      ? Math.abs(value).toLocaleString()
      : Math.abs(value).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });

  return value < 0 ? `- $${formattedValue}` : `$${formattedValue}`;
}
function formatNumberPercent(value) {
  return value % 1 === 0
    ? value.toLocaleString()
    : value.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
}

function calculateHouseFlip() {
  let purchase =
    parseFloat(document.getElementById('purchasePrice').value) || 0;
  let reno = parseFloat(document.getElementById('renoCosts').value) || 0;
  let holding = parseFloat(document.getElementById('holdingCosts').value) || 0;
  let arv = parseFloat(document.getElementById('afterRepairValue').value) || 0;
  let desiredProfitMargin =
    parseFloat(document.getElementById('desiredProfitMargin').value) || 0;
  // Loan & Gap Fields
  let interestRate =
    parseFloat(document.getElementById('houseinterestRate').value) || 0;
  let loanPoints = parseFloat(document.getElementById('loanPoints').value) || 0;
  let termYears =
    parseFloat(document.getElementById('houseLoanYear').value) || 0;
  let totalPayments = termYears * 12;
  let gapFundingRate =
    parseFloat(document.getElementById('gapCosts').value) || 0;
  // Additional Fields
  let downPaymentPercent =
    parseFloat(document.getElementById('downPaymentPercent').value) || 0;
  // let commissionPercent = parseFloat(document.getElementById("commissionPercent").value) || 0;
  let resaleCostPercent =
    parseFloat(document.getElementById('resaleCosts').value) || 0;
  let resaleCosts = (arv * resaleCostPercent) / 100;
  let address = document.getElementById('propertyAddress').value;
  let months = parseFloat(document.getElementById('projectMonths').value) || 0;
  let monthlyRent =
    parseFloat(document.getElementById('houseMonthlyRent').value) || 0;
  let annualPropertyTaxes =
    parseFloat(document.getElementById('propertyTaxesHF').value) || 0;
  let annualInsurance =
    parseFloat(document.getElementById('insurance').value) || 0;
  let annualMaintenance =
    parseFloat(document.getElementById('houseAnnualMaintenance').value) || 0;
  let annualUtilities =
    parseFloat(document.getElementById('houseAnnualUtilities').value) || 0;
  document.querySelector('.housecharts').style.display = 'block';

  let downPaymentType = document.getElementById('downPaymentType').value;

  let downPaymentBase =
    downPaymentType === 'purchaseAndReno' ? purchase + reno : purchase;
  let closingPercent =
    parseFloat(document.getElementById('closingCosts').value) || 0;
  let closing = (downPaymentBase * closingPercent) / 100;
  let downPayment = (downPaymentBase * downPaymentPercent) / 100;
  let monthlyRate = interestRate / 100 / 12;
  let loanAmount =
    downPaymentType === 'purchaseAndReno'
      ? purchase + reno - downPayment
      : purchase - downPayment;
  let proratedMaintenance = (annualMaintenance / 12) * months;
  let proratedUtilities = (annualUtilities / 12) * months;

  // let loanInterest = (loanAmount * (interestRate / 100)) * (months / 12);
  let loanFees = (loanAmount * loanPoints) / 100;
  let proratedTaxes = (annualPropertyTaxes / 12) * months;
  let proratedInsurance = (annualInsurance / 12) * months;
  let monthlyMortgagePayment =
    termYears > 0
      ? (loanAmount * monthlyRate) /
        (1 - Math.pow(1 + monthlyRate, -totalPayments))
      : 0;
  let totalMortgagePaid = monthlyMortgagePayment * months;
  let principalPaid = 0;
  let interestPaid = totalMortgagePaid;
  loanInterest = interestPaid;
  let totalProjectCost =
    purchase +
    reno +
    holding +
    closing +
    resaleCosts +
    loanInterest +
    loanFees +
    proratedTaxes +
    proratedInsurance;
  // **Corrected Investment Calculation**
  let gapCosts = totalProjectCost - (loanAmount + downPayment);
  let gapFundingFees = gapCosts > 0 ? (gapCosts * gapFundingRate) / 100 : 0;

  let totalInvestment =
    purchase +
    reno +
    holding +
    closing +
    loanInterest +
    loanFees +
    gapFundingFees +
    proratedTaxes +
    proratedInsurance;

  let totalCashInvested =
    downPaymentBase +
    holding +
    closing +
    resaleCosts +
    proratedTaxes +
    proratedInsurance;
  // ✅ Profit Calculation
  let grossProfit = arv - purchase;
  let netProfit = arv - totalInvestment;

  // ✅ Profit Margin & Cash-on-Cash Return
  let profitMargin = arv > 0 ? (netProfit / arv) * 100 : 0;
  let cashOnCashReturn =
    totalCashInvested > 0 ? (netProfit / totalCashInvested) * 100 : 0;

  // ✅ Break-even Years Calculation
  let monthlyRentalProfit = (arv * 0.01 - holding / months).toFixed(2);
  let breakEvenYears =
    monthlyRentalProfit > 0
      ? (netProfit / (monthlyRentalProfit * 12)).toFixed(2)
      : 'N/A';

  let totalHoldingExpenses =
    holding +
    proratedTaxes +
    proratedInsurance +
    proratedMaintenance +
    proratedUtilities +
    loanInterest +
    loanFees +
    gapFundingFees;

  let monthlyHoldingCost =
    months > 0 ? (totalHoldingExpenses / months).toFixed(2) : 0;

  // ✅ Flipping vs. Rental Analysis
  let rentalVsFlip =
    netProfit > 0 && monthlyRent > 0
      ? (netProfit / (monthlyRent * 12)).toFixed(2)
      : 'N/A';
  // ✅ Profit Min % and $ Calculation
  let profitMinPercent = (profitMargin * 0.8).toFixed(2); // Assuming 80% of profit margin as min
  let profitMinDollar = (netProfit * 0.8).toFixed(2); // 80% of the net profit as min
  let projection = (netProfit * 0.9).toFixed(2); // Projection at 90% of the net profit

  // ✅ Deal? Logic
  let deal = profitMargin >= 10 && netProfit > 0 ? 'YES' : 'NO';
  let requiredARV =
    desiredProfitMargin > 0
      ? totalInvestment / (1 - desiredProfitMargin / 100)
      : 0;
  let totalInvestmentExcludingPurchase =
    reno +
    holding +
    loanInterest +
    loanFees +
    gapFundingFees +
    proratedTaxes +
    proratedInsurance;

  let targetNetProfit =
    (totalInvestmentExcludingPurchase + purchase) * (desiredProfitMargin / 100);

  // But since we want to solve for purchase (maxPurchasePrice), we need to restructure:
  let allOtherCosts =
    reno +
    holding +
    closing +
    resaleCosts +
    loanInterest +
    loanFees +
    gapFundingFees +
    proratedTaxes +
    proratedInsurance;

  let maxPurchasePrice =
    (arv - allOtherCosts) / (1 + desiredProfitMargin / 100);

  // ✅ Display Results
  // document.getElementById("grossProfit").innerText = formatNumber(grossProfit);
  document.getElementById('totalInvestment').innerText =
    formatNumber(totalInvestment);
  document.getElementById('netProfit').innerText = formatNumber(netProfit);
  document.getElementById('totalCashInvested').innerText =
    formatNumber(totalCashInvested);
  document.getElementById('profitMargin').innerText =
    formatNumberPercent(profitMargin) + '%';
  document.getElementById('cashOnCashReturn').innerText =
    formatNumberPercent(cashOnCashReturn) + '%';
  document.getElementById('breakEvenYears').innerText = breakEvenYears;
  document.getElementById('rentalVsFlip').innerText =
    rentalVsFlip !== 'N/A'
      ? `${rentalVsFlip} years to match flip profit with rental income.`
      : 'N/A';
  // document.getElementById("profitMinPercent").innerText = `${profitMinPercent}%`;
  // document.getElementById("profitMinDollar").innerText = `${formatNumber(profitMinDollar)}`;
  // document.getElementById("projection").innerText = `${formatNumber(projection)}`;
  document.getElementById('dealStatus').innerText = deal;
  document.getElementById('monthlyHoldingCost').innerText = `${formatNumber(
    monthlyHoldingCost
  )}`;
  // document.getElementById("proratedTaxes").innerText = formatNumber(proratedTaxes);
  // document.getElementById("proratedInsurance").innerText = formatNumber(proratedInsurance);
  document.getElementById('displayedAddress').innerText = address
    ? `📍 ${address}`
    : '';
  if (gapFundingRate > 0) {
    document.getElementById('calculatedGapCost').innerText =
      formatNumber(gapFundingFees);
  }
  // document.getElementById("requiredARV").innerText = formatNumber(requiredARV);
  document.getElementById('maxPurchasePrice').innerText =
    formatNumber(maxPurchasePrice);

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
  profitMarginEl.style.color =
    profitMargin >= desiredProfitMargin ? 'black' : 'black';
  promarcardhead.style.color =
    profitMargin >= desiredProfitMargin ? 'black' : '#d0b870'; // gold if profit, red if loss
  promarcard.style.background =
    profitMargin >= desiredProfitMargin ? '#d0b870' : '#f86d6d';

  let rentalVsFlipEl = document.getElementById('rentalVsFlip');
  let rvfcard = document.querySelector('.rvfcard');
  let rvfcardhead = document.querySelector('.rvfcardhead');
  rentalVsFlipEl.style.color =
    rentalVsFlip !== 'N/A' && rentalVsFlip < 5 ? 'black' : 'black';
  rvfcardhead.style.color =
    rentalVsFlip !== 'N/A' && rentalVsFlip < 5 ? 'black' : '#d0b870'; // gold if profit, red if loss
  rvfcard.style.background =
    rentalVsFlip !== 'N/A' && rentalVsFlip < 5 ? '#d0b870' : '#f86d6d';

  let dealCardd = document.querySelector('.dealCardd');
  let dealCarddhead = document.querySelector('.dealCarddhead');
  document.getElementById('dealStatus').style.color =
    deal === 'YES' ? 'black' : 'black';
  dealCarddhead.style.color =
    rentalVsFlip !== 'N/A' && rentalVsFlip < 5 ? 'black' : '#d0b870'; // gold if profit, red if loss
  dealCardd.style.background =
    rentalVsFlip !== 'N/A' && rentalVsFlip < 5 ? '#d0b870' : '#f86d6d';
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
    proratedInsurance,
  });
  createARVDistributionChart({
    investment: totalInvestment,
    resaleCosts,
    netProfit,
  });
}

function resetCanvas(id) {
  let canvasWrapper = document.getElementById(id).parentNode;
  canvasWrapper.innerHTML = `<canvas id="${id}"></canvas>`;
}

Chart.register(ChartDataLabels);

function createProjectCostBreakdownChart(data) {
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

function createARVDistributionChart(data) {
  const ctx = document.getElementById('arvDistributionChart').getContext('2d');

  const labels = ['Total Investment', 'Resale Costs', 'Net Profit'];
  const values = [data.investment, data.resaleCosts, data.netProfit];
  const total = values.reduce((a, b) => a + b, 0);

  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [
        {
          data: values,
          backgroundColor: ['#2980b9', '#f1c40f', '#2ecc71'],
          borderColor: '#ffffff',
          borderWidth: 4,
          hoverOffset: 20,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'ARV Distribution',
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
            return percentage >= 5; // Show only if the slice is 5% or more
          },
        },
      },
    },
    plugins: [ChartDataLabels],
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
  let realEstateAppreciation = document.getElementById(
    'realEstateAppreciation'
  );
  let mortgageBalance = document.getElementById('mortgageBalance');
  let wholeLifeInsurance = document.getElementById('wholeLifeInsurance');
  let lifeInsuranceMonthlyContributions = document.getElementById(
    'lifeInsuranceMonthlyContributions'
  );
  let mortgageTerm = document.getElementById('mortgageTerm');
  let mortgageInterestRate = document.getElementById('mortgageInterestRate');
  // 🆕 New inputs for Stock and Real Estate
  let currentStockValue = document.getElementById('currentStockValue');
  let currentRealEstateEquity = document.getElementById(
    'currentRealEstateEquity'
  );

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
    currentRealEstateEquity: document.getElementById(
      'errorCurrentRealEstateEquity'
    ),
    realEstateAppreciation: document.getElementById(
      'errorRealEstateAppreciation'
    ),
    mortgageBalance: document.getElementById('errormortgageBalance'),
    wholeLifeInsurance: document.getElementById('errorwholeLifeInsurance'),
    lifeInsuranceMonthlyContributions: document.getElementById(
      'errorLifeInsuranceMonthlyContributions'
    ),
    mortgageTerm: document.getElementById('errorMortgageTerm'),
    mortgageInterestRate: document.getElementById('errorMortgageInterestRate'),
  };
  // ✅ Clear previous errors
  Object.values(errors).forEach((error) => (error.innerText = ''));

  let isValid = true;

  // ✅ Validation function
  function validateInput(
    input,
    errorField,
    fieldName,
    min = 0,
    max = Infinity
  ) {
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
  validateInput(
    monthlyContributions,
    errors.monthlyContributions,
    'Monthly Contributions',
    0
  );
  validateInput(
    annualReturn,
    errors.annualReturn,
    'Expected Annual Return (%)',
    0,
    100
  );
  validateInput(
    inflationRate,
    errors.inflationRate,
    'Inflation Rate (%)',
    0,
    100
  );
  validateInput(
    desiredIncome,
    errors.desiredIncome,
    'Desired Retirement Income',
    0
  );
  validateInput(
    currentStockValue,
    errors.currentStockValue,
    'Current Stock Value',
    0
  );
  validateInput(
    currentRealEstateEquity,
    errors.currentRealEstateEquity,
    'Current Real Estate Equity',
    0
  );
  validateInput(
    realEstateAppreciation,
    errors.realEstateAppreciation,
    'Real Estate Appreciation (%)',
    0,
    100
  );
  validateInput(mortgageBalance, errors.mortgageBalance, 'Mortgage Balance', 0);
  validateInput(
    wholeLifeInsurance,
    errors.wholeLifeInsurance,
    'Whole Life Insurance',
    0
  );
  validateInput(
    lifeInsuranceMonthlyContributions,
    errors.lifeInsuranceMonthlyContributions,
    'Life Insurance Monthly Contributions',
    0
  );
  // validateInput(mortgageTerm, errors.mortgageTerm, "Mortgage Term", 1, 50);
  validateInput(
    mortgageInterestRate,
    errors.mortgageInterestRate,
    'Mortgage Interest Rate',
    0,
    100
  );

  if (parseInt(currentAge.value) >= parseInt(retirementAge.value)) {
    errors.retirementAge.innerText =
      'Retirement age must be greater than current age.';
    isValid = false;
  }

  if (!isValid) return;

  // ✅ Variables for calculation
  let yearsToRetirement =
    parseInt(retirementAge.value) - parseInt(currentAge.value);
  let n = 12; // Monthly compounding
  let r = (parseFloat(annualReturn.value) || 0) / 100 / n; // Handle empty return gracefully
  let t = yearsToRetirement * n;

  // ✅ Future Value Calculations (Avoid NaN)
  let fvCurrentSavings =
    (parseFloat(currentSavings.value) || 0) *
    Math.pow(
      1 + (parseFloat(annualReturn.value) || 0) / 100,
      yearsToRetirement
    );

  let fvContributions =
    (parseFloat(monthlyContributions.value) || 0) *
    ((Math.pow(1 + r, t) - 1) / r) *
    (1 + r);

  // ✅ Stock and Real Estate appreciation (Avoid NaN)
  let fvStock =
    (parseFloat(currentStockValue.value) || 0) *
    Math.pow(1 + 0.03, yearsToRetirement);

  let realEstateRate = (parseFloat(realEstateAppreciation.value) || 0) / 100;
  let adjustedMortgage = parseFloat(mortgageBalance.value) || 0;

  // Real estate equity: owned portion of equity minus owned mortgage
  let fvRealEstate =
    (parseFloat(currentRealEstateEquity.value) || 0) *
      Math.pow(1 + realEstateRate, yearsToRetirement) -
    adjustedMortgage;
  if (isNaN(fvRealEstate)) fvRealEstate = 0;
  // ✅ Total Savings (Check for NaN and fallback to 0)
  let lifeInsuranceMonthly =
    parseFloat(lifeInsuranceMonthlyContributions.value) || 0;
  let fvLifeInsuranceContributions =
    lifeInsuranceMonthly * ((Math.pow(1 + r, t) - 1) / r) * (1 + r);
  let fvWholeLifeInsurance =
    (parseFloat(wholeLifeInsurance.value) || 0) + fvLifeInsuranceContributions;

  let totalSavings =
    (isNaN(fvCurrentSavings) ? 0 : fvCurrentSavings) +
    (isNaN(fvContributions) ? 0 : fvContributions) +
    (isNaN(fvStock) ? 0 : fvStock) +
    (isNaN(fvRealEstate) ? 0 : fvRealEstate) +
    fvWholeLifeInsurance;
  // 🆕 Add remaining mortgage payments to savings if it ends before retirement
  const mortgageEndYears = mortgageTerm / 12;
  if (mortgageEndYears < yearsToRetirement) {
    const remainingYears = yearsToRetirement - mortgageEndYears;
    const futureExtraSavings =
      monthlyPayment *
      12 *
      ((Math.pow(1 + r, remainingYears * n) - 1) / r) *
      (1 + r);
    totalSavings += isNaN(futureExtraSavings) ? 0 : futureExtraSavings;
  }

  // ✅ Adjusted Income with Inflation (Fallback to 0)
  let adjustedIncome =
    (parseFloat(desiredIncome.value) || 0) *
    Math.pow(
      1 + (parseFloat(inflationRate.value) || 0) / 100,
      yearsToRetirement
    );

  // ✅ Time-based projections for all assets
  let projections = [];
  let stockGrowthRate = 0.03; // Still fixed unless you want to make that editable too

  for (let i = 5; i <= yearsToRetirement; i += 5) {
    const realEstateValue =
      (parseFloat(currentRealEstateEquity.value) || 0) *
      Math.pow(1 + realEstateRate, i);

    const principal = adjustedMortgage;
    const termMonths = parseFloat(mortgageTerm.value || 0) * 12;
    const monthlyRate = parseFloat(mortgageInterestRate.value || 0) / 100 / 12;

    const monthlyPayment =
      (principal * (monthlyRate * Math.pow(1 + monthlyRate, termMonths))) /
      (Math.pow(1 + monthlyRate, termMonths) - 1);
    const monthsPaid = Math.min(i * 12, termMonths);

    const remainingMortgage =
      principal * Math.pow(1 + monthlyRate, monthsPaid) -
      (monthlyPayment * (Math.pow(1 + monthlyRate, monthsPaid) - 1)) /
        monthlyRate;

    const netRealEstate = isNaN(realEstateValue - remainingMortgage)
      ? 0
      : realEstateValue - remainingMortgage;

    // 🆕 If mortgage is paid off, calculate the extra savings
    let extraInvestmentValue = 0;
    if (i * 12 > termMonths) {
      const extraMonths = i * 12 - termMonths;
      const extraMonthly = monthlyPayment;
      const extraYears = extraMonths / 12;
      extraInvestmentValue =
        extraMonthly *
        12 *
        ((Math.pow(1 + r, extraYears * n) - 1) / r) *
        (1 + r);
    }

    // 🧠 Insurance + extra investment FV
    const insuranceContributionFV =
      lifeInsuranceMonthly * ((Math.pow(1 + r, i * n) - 1) / r) * (1 + r);
    const totalInsuranceValue =
      (parseFloat(wholeLifeInsurance.value) || 0) + insuranceContributionFV;

    projections.push({
      year: i,
      stockValue:
        (parseFloat(currentStockValue.value) || 0) *
        Math.pow(1 + stockGrowthRate, i),
      realEstateValue: netRealEstate,
      insuranceValue: totalInsuranceValue,
      extraInvestmentValue: isNaN(extraInvestmentValue)
        ? 0
        : extraInvestmentValue,
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
    shortfallSurplus = `Funds wont last throughout the retirement years, short by ${
      retirementYears - withdrawalYears
    } years)`;
    shortfallSurplusDiv.style.backgroundColor = '#f86d6d';
  }

  // ✅ Display Output
  if (annualReturn.value != '') {
    document.getElementById('totalSavings').innerHTML = `${formatNumber(
      totalSavings
    )}`;
    let totalSavingsEl = document.getElementById('totalSavings');
    let totalSavingsCard = document.querySelector('.totalSavingsCard');
    let totalSavingshead = document.querySelector('.totalSavingshead');
    totalSavingsEl.style.color = 'black';
    totalSavingshead.style.color = 'black';
    totalSavingsCard.style.background = '#d0b870';
  }
  document.getElementById('annualWithdrawal').innerHTML = `${formatNumber(
    adjustedIncome
  )}`;
  document.getElementById('yearsUntilDepletion').innerHTML = `${
    isNaN(withdrawalYears) ? 'N/A' : withdrawalYears
  }`;
  document.getElementById('shortfallSurplus').innerHTML = isNaN(withdrawalYears)
    ? 'N/A'
    : shortfallSurplus;

  // ✅ Display New Projections
  let projectionsDiv = document.getElementById('projections');
  projectionsDiv.innerHTML = `<h3 class="dynamicHead">Time-based Asset Projections:</h3>`;
  projections.forEach((proj) => {
    const total = proj.stockValue + proj.realEstateValue + proj.insuranceValue;

    projectionsDiv.innerHTML += `
      <p class="dynamicPara">In <strong>${proj.year} years:</strong></p>
      <ul>
        <li class="dynamicList">Stock Value: ${formatNumber(
          proj.stockValue
        )}</li>
        <li class="dynamicList">Real Estate Value: ${formatNumber(
          proj.realEstateValue
        )}</li>
        <li class="dynamicList">Life Insurance Value: ${formatNumber(
          proj.insuranceValue
        )}</li>
        <li class="dynamicList"><strong>Total Value: ${formatNumber(
          total
        )}</strong></li>
      </ul>`;
  });

  if (
    fvStock > 0 ||
    fvRealEstate > 0 ||
    fvWholeLifeInsurance > 0 ||
    fvContributions > 0
  ) {
    renderAssetBreakdownChart(
      fvStock,
      fvRealEstate,
      fvWholeLifeInsurance,
      fvCurrentSavings + fvContributions
    );
    renderIncomeSourcePie(
      fvContributions,
      fvStock,
      fvRealEstate,
      fvWholeLifeInsurance
    );
  }
}

// charts
function renderAssetBreakdownChart(
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
      datasets: [
        {
          label: 'Income Source Contribution at Retirement',
          data: dataValues,
          backgroundColor: ['#55CBE5', '#e74c3c', '#F39655', '#B77CE9'],
          borderColor: '#ffffff',
          borderWidth: 4,
          hoverOffset: 20,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: `Income Sources at Retirement`,
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
          color: 'white',
          font: {
            weight: 'bold',
            size: 14,
          },
          formatter: (value, ctx) => {
            const percentage = (value / total) * 100;
            return percentage >= 5 ? `${percentage.toFixed(1)}%` : '';
          },
        },
      },
      animation: {
        animateRotate: true,
        animateScale: true,
        duration: 1500,
        easing: 'easeOutBounce',
      },
    },
    plugins: [ChartDataLabels],
  });
}

function calculateRentalProperty() {
  // Get values and convert to numbers
  let propertyPrice =
    parseFloat(document.getElementById('propertyPrice').value.trim()) || 0;
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
  document.querySelector('.rentalcharts').style.display = 'block';
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
  let totalCashInvested = downPayment + closingCosts + renovations;
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

function renderPortfolioPieChart(
  adjustedRentIncome,
  operatingExpenses,
  cashFlowAnnual,
  timeDuration = 1
) {
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
      datasets: [
        {
          data: values,
          backgroundColor: colors,
          borderColor: '#fff',
          borderWidth: 2,
          hoverOffset: 12,
        },
      ],
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
              family: 'Arial, sans-serif',
            },
            padding: 15,
          },
        },
        title: {
          display: true,
          text: `Portfolio Composition (Over ${timeDuration} Year${
            timeDuration > 1 ? 's' : ''
          })`,
          font: {
            size: 20,
            weight: 'bold',
            family: 'Arial, sans-serif',
          },
          color: '#333',
          padding: {
            top: 10,
            bottom: 20,
          },
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const value = parseFloat(context.raw);
              const percentage = ((value / total) * 100).toFixed(1);
              return `${context.label}: $${value.toFixed(2)} (${percentage}%)`;
            },
            afterBody: function () {
              return `Total: $${total.toFixed(2)}`;
            },
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
              (a, b) => a + b,
              0
            );
            const percentage = ((value / sum) * 100).toFixed(1);
            return percentage >= 5 ? `${percentage}%` : '';
          },
        },
      },
    },
    plugins: [ChartDataLabels],
  });
}

function renderCashFlowPieChart(
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

document.getElementById('download-pdf').addEventListener('click', function () {
  if (window.jspdf && typeof html2canvas !== 'undefined') {
    const { jsPDF } = window.jspdf;
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
        <tr><td><strong>Property Address:</strong></td><td>$${getValue(
          'propertyAddress'
        )}</td></tr>
        <tr><td><strong>Property Purchase Price:</strong></td><td>$${getValue(
          'purchasePrice'
        )}</td></tr>
        <tr><td><strong>Renovation Costs:</strong></td><td>$${getValue(
          'renoCosts'
        )}</td></tr>
        <tr><td><strong>Closing Costs:</strong></td><td>${getValue(
          'closingCosts'
        )}%</td></tr>
        <tr><td><strong>Holding Costs:</strong></td><td>$${getValue(
          'holdingCosts'
        )}</td></tr>
        <tr><td><strong>After Repair Value:</strong></td><td>$${getValue(
          'afterRepairValue'
        )}</td></tr>
        <tr><td><strong>Project Months:</strong></td><td>${getValue(
          'projectMonths'
        )} Months</td></tr>
        <tr><td><strong>House Monthly Rent:</strong></td><td>$${getValue(
          'houseMonthlyRent'
        )}</td></tr>
        <tr><td><strong>House Interest Rate:</strong></td><td>${getValue(
          'houseinterestRate'
        )}%</td></tr>
        <tr><td><strong>Loan Points:</strong></td><td>${getValue(
          'loanPoints'
        )}%</td></tr>
        <tr><td><strong>Loan Term:</strong></td><td>${getValue(
          'houseLoanYear'
        )} Years</td></tr>
        <tr><td><strong>Gap Costs:</strong></td><td>$${getValue(
          'gapCosts'
        )}</td></tr>
        <tr><td><strong>Down Payment Percent:</strong></td><td>${getValue(
          'downPaymentPercent'
        )}%</td></tr>
        <tr><td><strong>Resale Costs:</strong></td><td>$${getValue(
          'resaleCosts'
        )}</td></tr>
        <tr><td><strong>Desired Profit Margin:</strong></td><td>${getValue(
          'desiredProfitMargin'
        )}%</td></tr>
        <tr><td><strong>Down Payment Based On:</strong></td><td>$${getValue(
          'downPaymentType'
        )}</td></tr>
        <tr><td><strong>Annual Maintenance:</strong></td><td>$${getValue(
          'houseAnnualMaintenance'
        )}</td></tr>
        <tr><td><strong>Annual Utilities:</strong></td><td>$${getValue(
          'houseAnnualUtilities'
        )}</td></tr>
        <tr><td><strong>Annual Insurance:</strong></td><td>$${getValue(
          'insurance'
        )}</td></tr>
        <tr><td><strong>Annual Property Taxes:</strong></td><td>$${getValue(
          'propertyTaxesHF'
        )}</td></tr>
      </table>
    `;
    combinedDiv.appendChild(resultsDiv);
    document.body.appendChild(combinedDiv); // Append to document for rendering

    // Capture content as multiple images
    html2canvas(combinedDiv, { scale: 2, useCORS: true })
      .then((canvas) => {
        const imgWidth = 190;
        const pageHeight = doc.internal.pageSize.height;
        let imgHeight = (canvas.height * imgWidth) / canvas.width;
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
      })
      .catch((error) => {
        console.error('Error capturing HTML content:', error);
      });
  } else {
    console.error('jsPDF or html2canvas not loaded correctly.');
  }
});

document.getElementById('download-pdf2').addEventListener('click', function () {
  if (window.jspdf && typeof html2canvas !== 'undefined') {
    const { jsPDF } = window.jspdf;
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
        <tr><td><strong>Current Age:</strong></td><td>${getValue(
          'currentAge'
        )}</td></tr>
        <tr><td><strong>Retirement Age:</strong></td><td>${getValue(
          'retirementAge'
        )}</td></tr>
        <tr><td><strong>Current Savings:</strong></td><td>$${getValue(
          'currentSavings'
        )}</td></tr>
        <tr><td><strong>Monthly Contributions:</strong></td><td>$${getValue(
          'monthlyContributions'
        )}</td></tr>
        <tr><td><strong>Annual Return:</strong></td><td>${getValue(
          'annualReturn'
        )}%</td></tr>
        <tr><td><strong>Inflation Rate:</strong></td><td>${getValue(
          'inflationRate'
        )}%</td></tr>
        <tr><td><strong>Desired Income:</strong></td><td>$${getValue(
          'desiredIncome'
        )}</td></tr>
        <tr><td><strong>Whole Life Insurance Value:</strong></td><td>$${getValue(
          'wholeLifeInsurance'
        )}</td></tr>
        <tr><td><strong>Monthly Contributions to Whole Life Insurance:</strong></td><td>$${getValue(
          'lifeInsuranceMonthlyContributions'
        )}</td></tr>
        <tr><td><strong>Current Stock Value:</strong></td><td>$${getValue(
          'currentStockValue'
        )}</td></tr>
        <tr><td><strong>Current Real Estate Equity:</strong></td><td>$${getValue(
          'currentRealEstateEquity'
        )}</td></tr>
        <tr><td><strong>Current Mortgage Balance:</strong></td><td>$${getValue(
          'mortgageBalance'
        )}</td></tr>
        <tr><td><strong>Mortgage Term (Years):</strong></td><td>$${getValue(
          'mortgageTerm'
        )}</td></tr>
        <tr><td><strong>Mortgage Interest Rate (%):</strong></td><td>$${getValue(
          'mortgageInterestRate'
        )}</td></tr>
      </table>
    `;
    combinedDiv.appendChild(resultsDiv);
    document.body.appendChild(combinedDiv); // Append to document for rendering

    // Capture content as multiple images
    html2canvas(combinedDiv, { scale: 2, useCORS: true })
      .then((canvas) => {
        const imgWidth = 190;
        const pageHeight = doc.internal.pageSize.height;
        let imgHeight = (canvas.height * imgWidth) / canvas.width;
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
      })
      .catch((error) => {
        console.error('Error capturing HTML content:', error);
      });
  } else {
    console.error('jsPDF or html2canvas not loaded correctly.');
  }
});

document.getElementById('download-pdf3').addEventListener('click', function () {
  if (window.jspdf && typeof html2canvas !== 'undefined') {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Function to get values from input fields
    function getValue(id) {
      const element = document.getElementById(id);
      return element && element.value ? element.value : 'N/A';
    }

    const contentDiv = document.getElementById('contentPDF3'); // First page content

    // Step 1: Capture the first section (contentPDF3)
    html2canvas(contentDiv, { scale: 2, useCORS: true })
      .then((canvas) => {
        const imgWidth = 190;
        const pageHeight = doc.internal.pageSize.height;
        let imgHeight = (canvas.height * imgWidth) / canvas.width;
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
          <tr><td><strong>Property Price:</strong></td><td>$${getValue(
            'propertyPrice'
          )}</td></tr>
          <tr><td><strong>Down Payment:</strong></td><td>$${getValue(
            'downPayment'
          )}</td></tr>
          <tr><td><strong>Loan Term:</strong></td><td>${getValue(
            'loanTerm'
          )} Years</td></tr>
          <tr><td><strong>Interest Rate:</strong></td><td>${getValue(
            'interestRate'
          )}%</td></tr>
          <tr><td><strong>Monthly Rent:</strong></td><td>$${getValue(
            'monthlyRent'
          )}</td></tr>
          <tr><td><strong>Vacancy Rate:</strong></td><td>${getValue(
            'vacancyRate'
          )}%</td></tr>
          <tr><td><strong>Closing Cost:</strong></td><td>${getValue(
            'closingCostsRent'
          )}%</td></tr>
          <tr><td><strong>Property Taxes:</strong></td><td>$${getValue(
            'propertyTaxes'
          )}</td></tr>
          <tr><td><strong>Annual Renovations:</strong></td><td>$${getValue(
            'renovations'
          )}</td></tr>
          <tr><td><strong>Annual Utilities:</strong></td><td>$${getValue(
            'utilities'
          )}</td></tr>
          <tr><td><strong>Insurance Costs:</strong></td><td>$${getValue(
            'insuranceCosts'
          )}</td></tr>
          <tr><td><strong>Maintenance Costs:</strong></td><td>$${getValue(
            'maintenanceCosts'
          )}</td></tr>
          <tr><td><strong>Management Fees:</strong></td><td>$${getValue(
            'managementFees'
          )}</td></tr>
          <tr><td><strong>Property Appreciation Rate:</strong></td><td>${getValue(
            'appreciationRate'
          )}%</td></tr>
          <tr><td><strong>Annual Rent Growth:</strong></td><td>${getValue(
            'rentGrowth'
          )}%</td></tr>
        </table>
      `;

        document.body.appendChild(resultsDiv); // Append to document for rendering

        // Step 3: Capture the results section
        html2canvas(resultsDiv, { scale: 2, useCORS: true }).then((canvas2) => {
          const imgData2 = canvas2.toDataURL('image/png');
          const imgWidth2 = 190;
          const imgHeight2 = (canvas2.height * imgWidth2) / canvas2.width;
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
      })
      .catch((error) => {
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
    canvases.forEach((canvas) => {
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
    canvases.forEach((canvas) => {
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

  const tableData = years
    .map((year) => getTableData(year, true))
    .filter(Boolean);
  if (tableData.length > 0) {
    const combinedTable = generateCombinedYearTable(tableData);
    tableContainer.appendChild(combinedTable);
  }
}

function getTableData(year, returnData = false) {
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
    <h5>Yearly Financials: Years ${dataArray.map((d) => d.year).join(', ')}</h5>
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
