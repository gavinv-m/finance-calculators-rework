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

  let total = 0;

  budgetingFields.forEach((id) => {
    const el = document.getElementById(id);
    const rawValue = Number(el.value || 0);
    total += rawValue;
  });

  document.getElementById('budget-total-amt').innerText = formatNumber(total);
}
