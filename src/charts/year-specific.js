// Exports to rental calculator
export default function getYearSpecificData(
  year,
  monthlyRent,
  rentGrowth,
  vacancyRate,
  propertyTaxes,
  insuranceCosts,
  maintenanceCosts,
  managementFees,
  utilities,
  renovations,
  annualMortgagePayment
) {
  // Calculate rent for the specific year with growth
  let yearRent = monthlyRent * 12 * Math.pow(1 + rentGrowth / 100, year - 1);
  let yearVacancyLoss = yearRent * (vacancyRate / 100);
  let yearAdjustedRent = yearRent - yearVacancyLoss;

  // Calculate year-specific operating expenses (assuming they stay constant or add growth if needed)
  let yearOperatingExpenses =
    propertyTaxes +
    insuranceCosts +
    maintenanceCosts +
    yearAdjustedRent * (managementFees / 100) + // Management fees based on current year rent
    utilities +
    renovations;

  // Calculate year-specific cash flow
  let yearCashFlow =
    yearAdjustedRent - yearOperatingExpenses - annualMortgagePayment;

  return {
    adjustedRent: yearAdjustedRent,
    operatingExpenses: yearOperatingExpenses,
    cashFlow: yearCashFlow,
  };
}
