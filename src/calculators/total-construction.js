import formatNumber from '../utils/format-number';

export default function calculateConstructionCost() {
  const budgetingFields = [
    'plansPermitsAmount',
    'demolitionAmount',
    'foundationAmount',
    'roofGuttersAmount',
    'exteriorSlidingAmount',
    'windowsAmount',
    'garageDrivewayAmount',
    'framingAmount',
    'finishCarpentryAmount',
    'sheetrockInsulationAmount',
    'interiorPaintAmount',
    'flooringAmount',
    'kitchenAmount',
    'bathroomAmount',
    'plumbingWorkAmount',
    'electricalWorkAmount',
    'hvacWorkAmount',
    'appliancesAmount',
    'yardLandscapingAmount',
    'basementFinishesAmount',
    'miscAmount',
  ];

  let baseTotal = 0;

  budgetingFields.forEach((id) => {
    const el = document.getElementById(id);
    const rawValue = Number(el.value || 0);
    baseTotal += rawValue;
  });

  const overageInput = document.getElementById('overagePercent');
  const overagePercent = Number(overageInput?.value || 0);
  const overageAmount = baseTotal * (overagePercent / 100);
  const total = baseTotal + overageAmount;

  document.getElementById('budget-total-amt').innerText = formatNumber(total);
}
