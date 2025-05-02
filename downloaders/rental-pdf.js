export default function setupRentalPdfDownload() {
  document
    .getElementById('download-pdf3')
    .addEventListener('click', function () {
      if (window.jspdf && typeof html2canvas !== 'undefined') {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Function to get values from input fields
        function getValue(id) {
          const element = document.getElementById(id);
          return element && element.value ? element.value : 'N/A';
        }

        const contentDiv = document.getElementById('contentPDF3'); // First page content

        // Step 1: Capture the first section (contentPDF3)
        html2canvas(contentDiv, { scale: 2, useCORS: true })
          .then((canvas) => {
            const imgWidth = 190;
            const pageHeight = doc.internal.pageSize.height;
            let imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 10;

            const imgData = canvas.toDataURL('image/png');

            // Add first page content
            doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
            heightLeft -= pageHeight - 20;

            // Add new pages if necessary
            while (heightLeft > 0) {
              position = heightLeft - imgHeight;
              doc.addPage();
              doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
              heightLeft -= pageHeight - 20;
            }

            doc.addPage(); // Move to next page for input data

            // Step 2: Create results section
            const resultsDiv = document.createElement('div');
            resultsDiv.style.padding = '20px';
            resultsDiv.style.backgroundColor = '#fff';
            resultsDiv.style.color = '#000';
            resultsDiv.style.width = '800px';
            resultsDiv.style.margin = 'auto';
            resultsDiv.innerHTML = `
          <h2 style="text-align:center; margin-top: 20px;">Rental Property Inputs</h2>
          <table border="1" cellspacing="0" cellpadding="5" style="width:100%; text-align:left;">
            <tr><td><strong>Property Price:</strong></td><td>$${getValue(
              'propertyPrice'
            )}</td></tr>
            <tr><td><strong>Down Payment:</strong></td><td>$${getValue(
              'downPayment'
            )}</td></tr>
            <tr><td><strong>Loan Term:</strong></td><td>${getValue(
              'loanTerm'
            )} Years</td></tr>
            <tr><td><strong>Interest Rate:</strong></td><td>${getValue(
              'interestRate'
            )}%</td></tr>
            <tr><td><strong>Monthly Rent:</strong></td><td>$${getValue(
              'monthlyRent'
            )}</td></tr>
            <tr><td><strong>Vacancy Rate:</strong></td><td>${getValue(
              'vacancyRate'
            )}%</td></tr>
            <tr><td><strong>Closing Cost:</strong></td><td>${getValue(
              'closingCostsRent'
            )}%</td></tr>
            <tr><td><strong>Property Taxes:</strong></td><td>$${getValue(
              'propertyTaxes'
            )}</td></tr>
            <tr><td><strong>Annual Renovations:</strong></td><td>$${getValue(
              'renovations'
            )}</td></tr>
            <tr><td><strong>Annual Utilities:</strong></td><td>$${getValue(
              'utilities'
            )}</td></tr>
            <tr><td><strong>Insurance Costs:</strong></td><td>$${getValue(
              'insuranceCosts'
            )}</td></tr>
            <tr><td><strong>Maintenance Costs:</strong></td><td>$${getValue(
              'maintenanceCosts'
            )}</td></tr>
            <tr><td><strong>Management Fees:</strong></td><td>$${getValue(
              'managementFees'
            )}</td></tr>
            <tr><td><strong>Property Appreciation Rate:</strong></td><td>${getValue(
              'appreciationRate'
            )}%</td></tr>
            <tr><td><strong>Annual Rent Growth:</strong></td><td>${getValue(
              'rentGrowth'
            )}%</td></tr>
          </table>
        `;

            document.body.appendChild(resultsDiv); // Append to document for rendering

            // Step 3: Capture the results section
            html2canvas(resultsDiv, { scale: 2, useCORS: true }).then(
              (canvas2) => {
                const imgData2 = canvas2.toDataURL('image/png');
                const imgWidth2 = 190;
                const imgHeight2 = (canvas2.height * imgWidth2) / canvas2.width;
                let heightLeft2 = imgHeight2;
                let position2 = 10;

                // Add new pages if needed
                while (heightLeft2 > 0) {
                  doc.addImage(
                    imgData2,
                    'PNG',
                    10,
                    position2,
                    imgWidth2,
                    imgHeight2
                  );
                  heightLeft2 -= pageHeight - 20;
                  if (heightLeft2 > 0) doc.addPage();
                }

                doc.save('rental_property_evaluation.pdf'); // Save PDF
                resultsDiv.remove(); // Clean up temporary div
              }
            );
          })
          .catch((error) => {
            console.error('Error capturing HTML content:', error);
          });
      } else {
        console.error('jsPDF or html2canvas not loaded correctly.');
      }
    });
}
