export default function setupBudgetPdfDownload() {
  document
    .getElementById('download-pdf4')
    .addEventListener('click', function () {
      if (window.jspdf && typeof html2canvas !== 'undefined') {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        const contentToCapture = document.getElementById('contentPDF4');

        html2canvas(contentToCapture, { scale: 2, useCORS: true })
          .then((canvas) => {
            const imgWidth = 190;
            const pageHeight = doc.internal.pageSize.height;
            let imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 10;

            const imgData = canvas.toDataURL('image/png');
            doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
            heightLeft -= pageHeight - 20;

            while (heightLeft > 0) {
              position = heightLeft - imgHeight;
              doc.addPage();
              doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
              heightLeft -= pageHeight - 20;
            }

            doc.save('construction-budget.pdf');
          })
          .catch((error) => {
            console.error('Error capturing HTML content:', error);
          });
      } else {
        console.error('jsPDF or html2canvas not loaded correctly.');
      }
    });
}
