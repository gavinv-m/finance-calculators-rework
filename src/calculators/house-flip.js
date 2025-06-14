import formatNumber from '../utils/format-number';
import formatNumberPercent from '../utils/format-number-percent';
import resetCanvas from '../chart-utils/reset-canvas';
import createProjectCostBreakdownChart from '../charts/project-cost-breakdown-chart';
import createARVDistributionChart from '../charts/arv-distribution-chart';
import calculateMaxPurchasePrice from '../utils/max-purchase';

export default function calculateHouseFlip() {
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
  let gapFundingAmt =
    parseFloat(document.getElementById('gapFundingAmount').value) || 0;
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

  let downPaymentType = document.getElementById('downPaymentType').value;

  let downPaymentBase =
    downPaymentType === 'purchaseAndReno' ? purchase + reno : purchase;
  let closing = parseFloat(document.getElementById('closingCosts').value) || 0;
  let downPayment = (downPaymentBase * downPaymentPercent) / 100;
  let monthlyRate = interestRate / 100 / 12;
  let loanAmount =
    downPaymentType === 'purchaseAndReno' ? purchase + reno : purchase;
  loanAmount = loanAmount - downPayment;
  let proratedMaintenance = (annualMaintenance / 12) * months;
  let proratedUtilities = (annualUtilities / 12) * months;
  let proratedTaxes = (annualPropertyTaxes / 12) * months;
  let proratedInsurance = (annualInsurance / 12) * months;

  let loanFees = (loanAmount * loanPoints) / 100;
  let loanInterest = loanAmount * monthlyRate * months;
  let gapFundingFees = gapFundingAmt * (gapFundingRate / 100 / 12) * months;

  let totalInvestment =
    purchase +
    reno +
    holding +
    closing +
    loanInterest +
    loanFees +
    gapFundingFees +
    proratedTaxes +
    proratedInsurance +
    proratedMaintenance +
    proratedUtilities;

  let totalCashInvested =
    downPayment +
    (downPaymentType !== 'purchaseAndReno' ? reno : 0) +
    holding +
    closing +
    loanInterest +
    gapFundingFees +
    proratedTaxes +
    proratedInsurance +
    proratedMaintenance +
    proratedUtilities +
    loanFees;

  // ✅ Profit Calculation
  let netProfit = arv - totalInvestment - resaleCosts;

  // ✅ Profit Margin & Cash-on-Cash Return
  let profitMargin = arv > 0 ? (netProfit / arv) * 100 : 0;
  let cashOnCashReturn =
    totalCashInvested > 0 ? (netProfit / totalCashInvested) * 100 : 0;

  let totalHoldingExpenses =
    holding +
    proratedTaxes +
    proratedInsurance +
    proratedMaintenance +
    proratedUtilities;

  // ✅ Break-even Years Calculation
  let monthlyRentalProfit = (
    arv * 0.01 -
    totalHoldingExpenses / months
  ).toFixed(2);
  let breakEvenYears =
    Number(monthlyRentalProfit) > 0 && netProfit > 0
      ? (netProfit / (Number(monthlyRentalProfit) * 12)).toFixed(2)
      : 'N/A';

  let monthlyHoldingCost =
    months > 0 ? (totalHoldingExpenses / months).toFixed(2) : 0;

  // ✅ Flipping vs. Rental Analysis
  let rentalVsFlip =
    netProfit > 0 && monthlyRent > 0
      ? (netProfit / monthlyRent).toFixed(2)
      : 'N/A';

  // ✅ Deal? Logic
  let deal =
    profitMargin >= desiredProfitMargin && netProfit > 0 ? 'YES' : 'NO';

  // Max Purchase Price Calculation
  let targetNetProfit = arv * (desiredProfitMargin / 100);

  // But since we want to solve for purchase (maxPurchasePrice), we need to restructure:
  let allOtherCosts =
    holding +
    closing +
    resaleCosts +
    gapFundingFees +
    proratedTaxes +
    proratedInsurance +
    proratedMaintenance +
    proratedUtilities;

  let purchasePriceEstimate =
    arv * (1 - desiredProfitMargin / 100) - allOtherCosts;

  let maxPurchasePrice = calculateMaxPurchasePrice(
    allOtherCosts,
    arv,
    purchasePriceEstimate,
    downPaymentPercent,
    downPaymentType,
    loanPoints,
    monthlyRate,
    months,
    resaleCosts,
    reno,
    targetNetProfit
  );

  // ✅ Display Results
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
      ? rentalVsFlip > months
        ? `Best to flip. ${rentalVsFlip} rental months to match flip profit.`
        : `Best to rent. ${rentalVsFlip} rental months to match flip profit.`
      : 'N/A';

  document.getElementById('dealStatus').innerText = deal;
  document.getElementById('monthlyHoldingCost').innerText = `${formatNumber(
    monthlyHoldingCost
  )}`;
  document.getElementById('displayedAddress').innerText = address
    ? `📍 ${address}`
    : '';
  if (Number(gapFundingRate) > 0) {
    document.getElementById('calculatedGapCost').innerText =
      formatNumber(gapFundingFees);
  } else {
    document.getElementById('calculatedGapCost').innerText = formatNumber(0);
  }

  document.getElementById('maxPurchasePrice').innerText =
    maxPurchasePrice > 0 ? formatNumber(maxPurchasePrice) : 0;

  // ✅ Color Code Cards
  let netProfitEl = document.getElementById('netProfit');
  let netprocard = document.querySelector('.netprocard');
  let netprocardhead = document.querySelector('.netprocardhead');
  netProfitEl.style.color = netProfit > 0 ? 'black' : 'black'; // gold if profit, red if loss
  netprocardhead.style.color = netProfit > 0 ? 'black' : '#d0b870'; // gold if profit, red if loss
  netprocard.style.background =
    netProfit === 0 ? '#ffffff' : netProfit > 0 ? '#d0b870' : '#f86d6d';

  let profitMarginEl = document.getElementById('profitMargin');
  let promarcard = document.querySelector('.promarcard');
  let promarcardhead = document.querySelector('.promarcardhead');
  profitMarginEl.style.color =
    profitMargin >= desiredProfitMargin ? 'black' : 'black';
  promarcardhead.style.color =
    profitMargin >= desiredProfitMargin ? 'black' : '#d0b870'; // gold if profit, red if loss
  promarcard.style.background =
    profitMargin === 0
      ? '#ffffff'
      : profitMargin >= desiredProfitMargin
      ? '#d0b870'
      : '#f86d6d';

  let rentalVsFlipEl = document.getElementById('rentalVsFlip');
  let rvfcard = document.querySelector('.rvfcard');
  let rvfcardhead = document.querySelector('.rvfcardhead');
  rentalVsFlipEl.style.color =
    rentalVsFlip !== 'N/A' && rentalVsFlip > months ? 'black' : 'black';
  rvfcardhead.style.color =
    rentalVsFlip !== 'N/A' && rentalVsFlip > months ? 'black' : '#d0b870'; // gold if profit, red if loss
  rvfcard.style.background =
    rentalVsFlip === 'N/A'
      ? '#ffffff'
      : rentalVsFlip !== 'N/A' && rentalVsFlip > months
      ? '#d0b870'
      : '#f86d6d';

  let dealCardd = document.querySelector('.dealCardd');
  let dealCarddhead = document.querySelector('.dealCarddhead');
  document.getElementById('dealStatus').style.color =
    deal === 'YES' ? 'black' : 'black';
  dealCarddhead.style.color = deal === 'YES' ? 'black' : '#d0b870'; // gold if profit, red if loss
  dealCardd.style.background = deal === 'YES' ? '#d0b870' : '#f86d6d';
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
