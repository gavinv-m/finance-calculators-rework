import formatNumber from '../utils/format-number';
import renderAssetBreakdownChart from '../charts/asset-breakdown-chart';
import renderIncomeSourcePie from '../charts/income-source-chart';

export default function calculateRetirement() {
  let currentAge = document.getElementById('currentAge');
  let retirementAge = document.getElementById('retirementAge');
  let expectedLifespan = document.getElementById('expectedLifespan');
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

  // ✅ Error messages
  let errors = {
    currentAge: document.getElementById('errorCurrentAge'),
    retirementAge: document.getElementById('errorRetirementAge'),
    expectedLifespan: document.getElementById('errorExpectedLifespan'),
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
  validateInput(
    expectedLifespan,
    errors.expectedLifespan,
    'Expected Lifespan',
    parseInt(currentAge.value, 10) || 18,
    120
  );

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
    r !== 0
      ? (parseFloat(monthlyContributions.value) || 0) *
        (((Math.pow(1 + r, t) - 1) / r) * (1 + r))
      : 0;

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
    r !== 0
      ? lifeInsuranceMonthly * ((Math.pow(1 + r, t) - 1) / r) * (1 + r)
      : 0;
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
      r !== 0
        ? monthlyPayment *
          12 *
          ((Math.pow(1 + r, remainingYears * n) - 1) / r) *
          (1 + r)
        : 0;
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
        r !== 0
          ? extraMonthly *
            12 *
            ((Math.pow(1 + r, extraYears * n) - 1) / r) *
            (1 + r)
          : 0;
    }

    // 🧠 Insurance + extra investment FV
    const insuranceContributionFV =
      r !== 0
        ? lifeInsuranceMonthly * ((Math.pow(1 + r, i * n) - 1) / r) * (1 + r)
        : 0;
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
  console.log(`Total Savings: ${totalSavings}`);
  let yearlyWithdrawal = adjustedIncome;
  console.log(`Adjusted income: ${adjustedIncome}`);

  while (remainingBalance > 0) {
    console.log(`Remaining balance before withdrawal: ${remainingBalance}`);
    withdrawalYears++;

    // Prevent infinite loops
    if (withdrawalYears > 100) break;

    remainingBalance -= yearlyWithdrawal;
    console.log(`Remaining balance after withdrawal: ${remainingBalance}`);
    remainingBalance *= 1 + (parseFloat(annualReturn.value) || 0) / 100;
    yearlyWithdrawal *= 1 + (parseFloat(inflationRate.value) || 0) / 100;
    console.log(`Yearly withdrawal: ${yearlyWithdrawal}`);
    console.log(`Remaining balance after interest: ${remainingBalance}`);
  }

  expectedLifespan = expectedLifespan.value;
  console.log(expectedLifespan);
  let retirementYears = expectedLifespan - parseInt(retirementAge.value);
  let shortfallSurplusDiv = document.querySelector('.short');
  let shortfallSurplus;

  if (!withdrawalYears || !retirementYears) {
    shortfallSurplus = '';
    shortfallSurplusDiv.style.backgroundColor = '#FFF';
    document.querySelector('.shortcap').style.color = '';
  } else if (withdrawalYears >= retirementYears) {
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

  // Only display years until depletion if desired income filled
  if (desiredIncome.value && inflationRate.value) {
    document.getElementById('yearsUntilDepletion').innerHTML = `${
      isNaN(withdrawalYears) ? 'N/A' : withdrawalYears
    }`;
  } else {
    document.getElementById('yearsUntilDepletion').innerHTML = '';
  }
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
