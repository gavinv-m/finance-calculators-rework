export default function setupBudgetPdfDownload() {
  document.getElementById('download-pdf4').addEventListener('click', () => {
    if (window.jspdf && typeof html2canvas !== 'undefined') {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      const contentToCapture = document.getElementById('contentPDF4');

      html2canvas(contentToCapture, { scale: 2, useCORS: true })
        .then((canvas) => {
          const imgWidth = 190; // width in PDF units (mm)
          const pageHeight = doc.internal.pageSize.height; // PDF page height (mm)
          const pdfPageHeightPx = (canvas.width * pageHeight) / imgWidth; // height of one PDF page in px

          let remainingHeightPx = canvas.height;
          let positionY = 0;

          while (remainingHeightPx > 0) {
            // Create a temporary canvas to hold one page's slice
            const pageCanvas = document.createElement('canvas');
            pageCanvas.width = canvas.width;
            pageCanvas.height = Math.min(pdfPageHeightPx, remainingHeightPx);

            const ctx = pageCanvas.getContext('2d');
            ctx.drawImage(
              canvas,
              0,
              positionY,
              canvas.width,
              pageCanvas.height,
              0,
              0,
              canvas.width,
              pageCanvas.height
            );

            const imgData = pageCanvas.toDataURL('image/jpeg', 0.7);

            const imgHeight = (pageCanvas.height * imgWidth) / canvas.width;

            if (positionY > 0) doc.addPage();
            doc.addImage(imgData, 'JPEG', 10, 10, imgWidth, imgHeight);

            remainingHeightPx -= pageCanvas.height;
            positionY += pageCanvas.height;
          }

          doc.save('construction-budget.pdf');
        })
        .catch(console.error);
    } else {
      console.error('jsPDF or html2canvas not loaded correctly.');
    }
  });
}
