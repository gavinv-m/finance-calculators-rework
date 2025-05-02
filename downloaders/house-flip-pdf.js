export default function setupHouseFlipPdfDownload() {
  document.getElementById('download-pdf').addEventListener('click', () => {
    if (window.jspdf && typeof html2canvas !== 'undefined') {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      // Function to get values from input fields
      function getValue(id) {
        const element = document.getElementById(id);
        return element && element.value ? element.value : 'N/A';
      }

      // Combine existing content and house flipping analysis into a single div
      const combinedDiv = document.createElement('div');
      combinedDiv.id = 'combinedContent';
      combinedDiv.style.padding = '20px';
      combinedDiv.style.backgroundColor = '#fff';
      combinedDiv.style.color = '#000';
      combinedDiv.style.width = '800px';
      combinedDiv.style.margin = 'auto';

      // Clone the original content
      const contentDiv = document.getElementById('contentPDF');
      combinedDiv.appendChild(contentDiv.cloneNode(true));

      // Create results section
      const resultsDiv = document.createElement('div');
      resultsDiv.innerHTML = `
            <h2 style="text-align:center; margin-top: 20px;">Inputs</h2>
            <table border="1" cellspacing="0" cellpadding="5" style="width:100%; text-align:left;">
              <tr><td><strong>Property Address:</strong></td><td>$${getValue(
                'propertyAddress'
              )}</td></tr>
              <tr><td><strong>Property Purchase Price:</strong></td><td>$${getValue(
                'purchasePrice'
              )}</td></tr>
              <tr><td><strong>Renovation Costs:</strong></td><td>$${getValue(
                'renoCosts'
              )}</td></tr>
              <tr><td><strong>Closing Costs:</strong></td><td>${getValue(
                'closingCosts'
              )}%</td></tr>
              <tr><td><strong>Holding Costs:</strong></td><td>$${getValue(
                'holdingCosts'
              )}</td></tr>
              <tr><td><strong>After Repair Value:</strong></td><td>$${getValue(
                'afterRepairValue'
              )}</td></tr>
              <tr><td><strong>Project Months:</strong></td><td>${getValue(
                'projectMonths'
              )} Months</td></tr>
              <tr><td><strong>House Monthly Rent:</strong></td><td>$${getValue(
                'houseMonthlyRent'
              )}</td></tr>
              <tr><td><strong>House Interest Rate:</strong></td><td>${getValue(
                'houseinterestRate'
              )}%</td></tr>
              <tr><td><strong>Loan Points:</strong></td><td>${getValue(
                'loanPoints'
              )}%</td></tr>
              <tr><td><strong>Loan Term:</strong></td><td>${getValue(
                'houseLoanYear'
              )} Years</td></tr>
              <tr><td><strong>Gap Costs:</strong></td><td>$${getValue(
                'gapCosts'
              )}</td></tr>
              <tr><td><strong>Down Payment Percent:</strong></td><td>${getValue(
                'downPaymentPercent'
              )}%</td></tr>
              <tr><td><strong>Resale Costs:</strong></td><td>$${getValue(
                'resaleCosts'
              )}</td></tr>
              <tr><td><strong>Desired Profit Margin:</strong></td><td>${getValue(
                'desiredProfitMargin'
              )}%</td></tr>
              <tr><td><strong>Down Payment Based On:</strong></td><td>$${getValue(
                'downPaymentType'
              )}</td></tr>
              <tr><td><strong>Annual Maintenance:</strong></td><td>$${getValue(
                'houseAnnualMaintenance'
              )}</td></tr>
              <tr><td><strong>Annual Utilities:</strong></td><td>$${getValue(
                'houseAnnualUtilities'
              )}</td></tr>
              <tr><td><strong>Annual Insurance:</strong></td><td>$${getValue(
                'insurance'
              )}</td></tr>
              <tr><td><strong>Annual Property Taxes:</strong></td><td>$${getValue(
                'propertyTaxesHF'
              )}</td></tr>
            </table>
          `;
      combinedDiv.appendChild(resultsDiv);
      document.body.appendChild(combinedDiv); // Append to document for rendering

      // Capture content as multiple images
      html2canvas(combinedDiv, { scale: 2, useCORS: true })
        .then((canvas) => {
          const imgWidth = 190;
          const pageHeight = doc.internal.pageSize.height;
          let imgHeight = (canvas.height * imgWidth) / canvas.width;
          let heightLeft = imgHeight;
          let position = 10;

          const imgData = canvas.toDataURL('image/png');

          // Add first page
          doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
          heightLeft -= pageHeight - 20;

          // Add additional pages if content overflows
          while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            doc.addPage();
            doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
            heightLeft -= pageHeight - 20;
          }

          doc.save('house_flipping_analysis.pdf');
          combinedDiv.remove(); // Clean up temporary div
        })
        .catch((error) => {
          console.error('Error capturing HTML content:', error);
        });
    } else {
      console.error('jsPDF or html2canvas not loaded correctly.');
    }
  });
}
