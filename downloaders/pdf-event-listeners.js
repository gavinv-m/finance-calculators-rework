import setupHouseFlipPdfDownload from './house-flip-pdf';
import setupRentalPdfDownload from './rental-pdf';
import setupBudgetPdfDownload from './budget-pdf';

export default function initializePdfListeners() {
  setupHouseFlipPdfDownload();
  setupRentalPdfDownload();
  setupBudgetPdfDownload();
}
