export default function setupRetirementPdfDownload() {
  document
    .getElementById('download-pdf2')
    .addEventListener('click', function () {
      if (window.jspdf && typeof html2canvas !== 'undefined') {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Function to get values from input fields
        function getValue(id) {
          const element = document.getElementById(id);
          return element && element.value ? element.value : 'N/A';
        }

        // Combine the existing content and retirement planning analysis into a single div
        const combinedDiv = document.createElement('div');
        combinedDiv.id = 'combinedContent';
        combinedDiv.style.padding = '20px';
        combinedDiv.style.backgroundColor = '#fff';
        combinedDiv.style.color = '#000';
        combinedDiv.style.width = '800px';
        combinedDiv.style.margin = 'auto';

        // Clone the original content
        const contentDiv = document.getElementById('contentPDF2');
        combinedDiv.appendChild(contentDiv.cloneNode(true));

        // Create results section
        const resultsDiv = document.createElement('div');
        resultsDiv.innerHTML = `
            <h2 style="text-align:center; margin-top: 20px;">Retirement Planning Inputs</h2>
            <table border="1" cellspacing="0" cellpadding="5" style="width:100%; text-align:left;">
              <tr><td><strong>Current Age:</strong></td><td>${getValue(
                'currentAge'
              )}</td></tr>
              <tr><td><strong>Retirement Age:</strong></td><td>${getValue(
                'retirementAge'
              )}</td></tr>
              <tr><td><strong>Current Savings:</strong></td><td>$${getValue(
                'currentSavings'
              )}</td></tr>
              <tr><td><strong>Monthly Contributions:</strong></td><td>$${getValue(
                'monthlyContributions'
              )}</td></tr>
              <tr><td><strong>Annual Return:</strong></td><td>${getValue(
                'annualReturn'
              )}%</td></tr>
              <tr><td><strong>Inflation Rate:</strong></td><td>${getValue(
                'inflationRate'
              )}%</td></tr>
              <tr><td><strong>Desired Income:</strong></td><td>$${getValue(
                'desiredIncome'
              )}</td></tr>
              <tr><td><strong>Whole Life Insurance Value:</strong></td><td>$${getValue(
                'wholeLifeInsurance'
              )}</td></tr>
              <tr><td><strong>Monthly Contributions to Whole Life Insurance:</strong></td><td>$${getValue(
                'lifeInsuranceMonthlyContributions'
              )}</td></tr>
              <tr><td><strong>Current Stock Value:</strong></td><td>$${getValue(
                'currentStockValue'
              )}</td></tr>
              <tr><td><strong>Current Real Estate Equity:</strong></td><td>$${getValue(
                'currentRealEstateEquity'
              )}</td></tr>
              <tr><td><strong>Current Mortgage Balance:</strong></td><td>$${getValue(
                'mortgageBalance'
              )}</td></tr>
              <tr><td><strong>Mortgage Term (Years):</strong></td><td>$${getValue(
                'mortgageTerm'
              )}</td></tr>
              <tr><td><strong>Mortgage Interest Rate (%):</strong></td><td>$${getValue(
                'mortgageInterestRate'
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

            doc.save('retirement_planning_calculator.pdf');
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
