import setupHouseFlipPdfDownload from './house-flip-pdf';
import setupRetirementPdfDownload from './retirement-pdf';
import setupRentalPdfDownload from './rental-pdf';

export default function initializePdfListeners() {
  setupHouseFlipPdfDownload();
  setupRetirementPdfDownload();
  setupRentalPdfDownload();
}
