import printSpecificSection from './print-specific-section';
import printChartsAndTable from './print-charts-and-table';

export default function initializePrintListeners() {
  // House Flip:
  const houseFlipBtn = document.getElementById('printHouseFlipBtn');
  houseFlipBtn.addEventListener('click', () => {
    printSpecificSection(['.housecharts', '.house']);
  });

  // Rental:
  const rentalBtn = document.getElementById('printRentalBtn');
  rentalBtn.addEventListener('click', () => {
    printChartsAndTable('.rentalcharts', '.table-responsive', '.rental');
  });
}
