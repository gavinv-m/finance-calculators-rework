export default function calculateMaxPurchasePrice(
  allOtherCosts,
  arv,
  currentPriceEstimate,
  downPaymentPercent,
  downPaymentType,
  loanPoints,
  monthlyRate,
  months,
  resaleCosts,
  reno,
  targetNetProfit
) {
  const tolerance = 1;
  const maxIterations = 30;

  let lowerBound = 0;
  let upperBound = arv;
  let currentEstimate = currentPriceEstimate;
  let bestEstimate = currentEstimate;
  let closestProfitDiff = Number.MAX_VALUE;

  for (let i = 0; i < maxIterations; i++) {
    let loanAmount =
      downPaymentType === 'purchaseAndReno'
        ? currentEstimate + reno
        : currentEstimate;

    // Calculate loan-dependent costs
    let downPayment = (downPaymentPercent / 100) * loanAmount;
    let loanFees = (loanAmount * loanPoints) / 100;
    let loanInterest = loanAmount * monthlyRate * months;

    let totalCosts =
      currentEstimate +
      allOtherCosts +
      downPayment +
      loanFees +
      loanInterest +
      resaleCosts;
    if (downPaymentType !== 'purchaseAndReno') {
      totalCosts += reno;
    }

    // Calculate actual profit
    let actualProfit = arv - totalCosts;
    let profitDifference = actualProfit - targetNetProfit;
    // Track best estimate so far
    if (Math.abs(profitDifference) < Math.abs(closestProfitDiff)) {
      closestProfitDiff = profitDifference;
      bestEstimate = currentEstimate;
    }

    // If we're within tolerance, we've found the max purchase price
    if (Math.abs(profitDifference) < tolerance) return currentEstimate;

    // Binary search approach
    if (profitDifference > 0) {
      // Actual profit is higher than target, increase purchase price
      lowerBound = currentEstimate;
      currentEstimate = (currentEstimate + upperBound) / 2;
    } else {
      // Actual profit is lower than target - we need to decrease purchase price
      upperBound = currentEstimate;
      currentEstimate = (currentEstimate + lowerBound) / 2;
    }
  }

  //   If we couldn't get within tolerance, return best estimate
  return bestEstimate;
}
