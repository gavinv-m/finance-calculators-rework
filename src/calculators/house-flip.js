import formatNumber from '../utils/format-number';
import formatNumberPercent from '../utils/format-number-percent';
import resetCanvas from '../chart-utils/reset-canvas';
import createProjectCostBreakdownChart from '../charts/project-cost-breakdown-chart';
import createARVDistributionChart from '../charts/arv-distribution-chart';

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

  let downPaymentType = document.getElementById('downPaymentType').value;

  let downPaymentBase =
    downPaymentType === 'purchaseAndReno' ? purchase + reno : purchase;
  let closing = parseFloat(document.getElementById('closingCosts').value) || 0;
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
  let loanInterest = interestPaid;
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
    proratedInsurance +
    proratedMaintenance +
    proratedUtilities;

  let totalCashInvested =
    downPayment +
    (downPaymentType !== 'purchaseAndReno' ? reno : 0) +
    holding +
    closing +
    proratedTaxes +
    proratedInsurance +
    proratedMaintenance +
    proratedUtilities;

  // ✅ Profit Calculation
  let grossProfit = arv - purchase;
  let netProfit = arv - totalInvestment - resaleCosts;

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

  let maxPurchasePrice = arv * (1 - desiredProfitMargin / 100) - allOtherCosts;

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
