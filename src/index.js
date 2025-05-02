import './style.css';
import calculateHouseFlip from './calculators/house-flip';
import calculateRetirement from './calculators/calculate-retirement';
import calculateRentalProperty from './calculators/rental';
import getTableData from './utils/table-data';
import updateTableRange from './utils/update-table-range';

document.addEventListener('DOMContentLoaded', function () {
  const inputs = document.querySelectorAll(
    '#purchasePrice,#propertyAddress, #renoCosts, #holdingCosts,#closingCosts, #afterRepairValue,#projectMonths,#resaleCosts,#downPaymentPercent,#gapCosts,#loanPoints,#houseLoanYear,#houseinterestRate,#houseMonthlyRent,#insurance,#propertyTaxesHF,#downPaymentType,#houseAnnualMaintenance,#houseAnnualUtilities'
  );
  const input2 = document.querySelectorAll(
    '#currentAge, #retirementAge, #currentSavings,#lifeInsuranceMonthlyContributions,#wholeLifeInsurance, #monthlyContributions, #annualReturn,#desiredIncome,#inflationRate,#currentRealEstateEquity,#currentStockValue,#realEstateAppreciation,#mortgageBalance , #mortgageInterestRate , #mortgageTerm'
  );
  const input3 = document.querySelectorAll(
    '#managementFees, #maintenanceCosts, #insuranceCosts,#renovations,#utilities,#rentGrowth,#closingCostsRent, #propertyTaxes, #vacancyRate,#monthlyRent,#interestRate,#loanTerm,#downPayment,#propertyPrice,#timeDuration , #appreciationRate '
  );

  inputs.forEach((input) => {
    input.addEventListener('input', calculateHouseFlip);
  });
  input2.forEach((input) => {
    input.addEventListener('input', calculateRetirement);
  });
  input3.forEach((input) => {
    input.addEventListener('input', calculateRentalProperty);
  });

  // Attach event listener to dropdown for updating table range
  const yearsDropdown = document.getElementById('years_tbl');
  if (yearsDropdown) {
    yearsDropdown.addEventListener('change', updateTableRange);
  }

  // Run calculators
  calculateHouseFlip();
  calculateRetirement();
  calculateRentalProperty();
});

Chart.register(ChartDataLabels);

document.getElementById('download-pdf').addEventListener('click', function () {
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

document.getElementById('download-pdf2').addEventListener('click', function () {
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

document.getElementById('download-pdf3').addEventListener('click', function () {
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
        html2canvas(resultsDiv, { scale: 2, useCORS: true }).then((canvas2) => {
          const imgData2 = canvas2.toDataURL('image/png');
          const imgWidth2 = 190;
          const imgHeight2 = (canvas2.height * imgWidth2) / canvas2.width;
          let heightLeft2 = imgHeight2;
          let position2 = 10;

          // Add new pages if needed
          while (heightLeft2 > 0) {
            doc.addImage(imgData2, 'PNG', 10, position2, imgWidth2, imgHeight2);
            heightLeft2 -= pageHeight - 20;
            if (heightLeft2 > 0) doc.addPage();
          }

          doc.save('rental_property_evaluation.pdf'); // Save PDF
          resultsDiv.remove(); // Clean up temporary div
        });
      })
      .catch((error) => {
        console.error('Error capturing HTML content:', error);
      });
  } else {
    console.error('jsPDF or html2canvas not loaded correctly.');
  }
});

// function getTableData(year) {
//   document.getElementById("year_b").innerHTML = year;
//   // Get values and convert to numbers
//   let propertyPrice = parseFloat(document.getElementById("propertyPrice").value.trim()) || 0;
//   let downPayment = parseFloat(document.getElementById("downPayment").value.trim()) || 0;
//   let loanTerm = parseFloat(document.getElementById("loanTerm").value.trim()) || 0;
//   let interestRate = parseFloat(document.getElementById("interestRate").value.trim()) || 0;
//   let monthlyRent = parseFloat(document.getElementById("monthlyRent").value.trim()) || 0;
//   let vacancyRate = parseFloat(document.getElementById("vacancyRate").value.trim()) || 0;
//   let propertyTaxes = parseFloat(document.getElementById("propertyTaxes").value.trim()) || 0;
//   let insuranceCosts = parseFloat(document.getElementById("insuranceCosts").value.trim()) || 0;
//   let maintenanceCosts = parseFloat(document.getElementById("maintenanceCosts").value.trim()) || 0;
//   let managementFees = parseFloat(document.getElementById("managementFees").value.trim()) || 0;
//   let appreciationRate = parseFloat(document.getElementById("appreciationRate").value.trim()) || 3;
//   let rentIncreaseRate = 2; // Assuming rent increases 2% annually

//   // Validate year parameter
//   if (!year || year < 1 || year > loanTerm) {
//     return;
//   }

//   // ✅ Loan Calculation
//   let loanAmount = propertyPrice - downPayment;
//   let monthlyRate = interestRate / 100 / 12;
//   let numPayments = loanTerm * 12;

//   let mortgagePayment = monthlyRate > 0
//     ? (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) / (Math.pow(1 + monthlyRate, numPayments) - 1)
//     : loanAmount / numPayments;

//   // ✅ Appreciation & Rent Growth Calculations
//   let appreciationFactor = Math.pow(1 + appreciationRate / 100, year);
//   let rentFactor = Math.pow(1 + rentIncreaseRate / 100, year);

//   let propertyValue = propertyPrice * appreciationFactor;
//   // let grossRentIncome = (monthlyRent * 12) * rentFactor; // Rent grows separately
//   let grossRentIncome = monthlyRent * 12;
//   let vacancyLoss = grossRentIncome * (vacancyRate / 100);
//   let managementCost = grossRentIncome * (managementFees / 100);
//   // let vacancyLoss = grossRentIncome * (vacancyRate / 100);
//   let adjustedRentIncome = grossRentIncome - vacancyLoss;

//   // ✅ Operating Expenses Growth
//   let totalFixedExpenses = propertyTaxes + insuranceCosts + maintenanceCosts;
//   // let operatingExpenses = (totalFixedExpenses * appreciationFactor) + (adjustedRentIncome * (managementFees / 100));
//   let operatingExpenses =
//     vacancyLoss +
//     propertyTaxes +
//     insuranceCosts +
//     maintenanceCosts +
//     managementCost +
//     utilities +
//     renovations;
//   // ✅ Net Operating Income (NOI)
//   // let noi = adjustedRentIncome - operatingExpenses;
//   let noi = grossRentIncome - operatingExpenses;

//   // ✅ Annual Mortgage Payment (remains fixed)
//   let annualMortgagePayment = mortgagePayment * 12;

//   // ✅ Cash Flow Calculation
//   let cashFlowAnnual = noi - annualMortgagePayment;
//   let cashFlowMonthly = cashFlowAnnual / 12;

//   // ✅ Display Results in Table
//   document.getElementById("gross_rent").innerText = `$${grossRentIncome.toFixed(2)}`;
//   document.getElementById("vacancy_rate").innerText = `– $${vacancyLoss.toFixed(2)}`;
//   document.getElementById("operating_income").innerText = `$${adjustedRentIncome.toFixed(2)}`;
//   document.getElementById("operating_expenses").innerText = `– $${operatingExpenses.toFixed(2)}`;
//   document.getElementById("net_operating_income").innerText = `$${noi.toFixed(2)}`;
//   document.getElementById("loan_payments").innerText = `– $${annualMortgagePayment.toFixed(2)}`;
//   document.getElementById("cash_flow").innerText = `$${cashFlowAnnual.toFixed(2)}`;

//   console.log(`Data displayed for year: ${year}`);
// }

// Function to populate the years dropdown
function populateYearsDropdown() {
  const select = document.getElementById('years_tbl');
  select.innerHTML = ''; // Clear existing options

  for (let i = 1; i <= 30; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = `${i} ${i === 1 ? 'Year' : 'Years'}`;

    // Set 10 years as the default selected value
    if (i === 1) {
      option.selected = true;
    }

    select.appendChild(option);
  }
}

document.getElementById('years_tbl').addEventListener('change', function () {
  let selectedValue = this.value;
  getTableData(selectedValue);
});

// Call the function to populate the dropdown on page load
window.onload = populateYearsDropdown;

function printSpecificSection(classNames) {
  if (!Array.isArray(classNames) || classNames.length === 0) return;

  const chartContainer = document.querySelector(classNames[0]);
  const contentContainer = document.querySelector(classNames[1]);

  if (!chartContainer || !contentContainer) return;

  const canvases = chartContainer.querySelectorAll('canvas');

  setTimeout(() => {
    const tempDiv = document.createElement('div');
    const clonedContent = contentContainer.cloneNode(true);
    tempDiv.appendChild(clonedContent);
    // 1. Render canvas charts to images
    canvases.forEach((canvas) => {
      const img = document.createElement('img');
      img.src = canvas.toDataURL('image/png');
      img.style.width = '100%';
      img.style.marginBottom = '20px';
      tempDiv.appendChild(img);
    });

    // 3. Open a print window
    const printWindow = window.open('', '', 'width=1000,height=800');
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Section</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            img { max-width: 100%; margin-bottom: 20px; }
            .card {
              border: 1px solid #ccc;
              padding: 15px;
              margin: 10px;
              border-radius: 10px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .result {
              font-weight: bold;
              color: #333;
              margin-top: 5px;
            }
            h1, h4 {
              color: #bfa046;
              margin: 10px 0;
            }
            .dssr {
              background: #d8c07c;
              padding: 10px;
              border-radius: 6px;
              display: inline-block;
            }
            .text-dark { color: #333; }
            .text-center { text-align: center; }
            /* Add any extra styles used in your '.retire' content */
          </style>
        </head>
        <body>
          ${tempDiv.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  }, 300);
}

function printChartsAndTable(chartClass, tableClass, summaryDivId) {
  const chartContainer = document.querySelector(chartClass);
  const tableContainer = document.querySelector(tableClass);
  const summaryDiv = document.querySelector(summaryDivId);
  if (!chartContainer || !tableContainer || !summaryDiv) return;

  const canvases = chartContainer.querySelectorAll('canvas');

  setTimeout(() => {
    const tempDiv = document.createElement('div');

    // Clone the summary section
    const summaryClone = summaryDiv.cloneNode(true);
    summaryClone.style.marginBottom = '40px';
    tempDiv.appendChild(summaryClone);

    // Add charts as images
    canvases.forEach((canvas) => {
      const img = document.createElement('img');
      img.src = canvas.toDataURL('image/png');
      img.style.width = '100%';
      img.style.marginBottom = '20px';
      tempDiv.appendChild(img);
    });

    // Clone the table HTML
    const tableClone = tableContainer.cloneNode(true);
    tableClone.style.marginTop = '40px';
    tableClone.style.border = '1px solid #ccc';
    tempDiv.appendChild(tableClone);

    const printWindow = window.open('', '', 'width=1000,height=800');
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Report</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
            }
            h1, h4 {
              color: #bfa046;
              margin: 10px 0;
            }
            img {
              max-width: 100%;
              margin-bottom: 20px;
            }
            .card {
              border: 1px solid #ccc;
              padding: 15px;
              margin: 10px;
              border-radius: 10px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              padding: 10px;
              border: 1px solid #ccc;
              text-align: left;
            }
            tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            .result {
              font-weight: bold;
              color: #333;
              margin-top: 5px;
            }
            .dssr {
              background: #d8c07c;
              padding: 10px;
              border-radius: 6px;
              display: inline-block;
            }
            .text-dark {
              color: #333;
            }
            .text-center {
              text-align: center;
            }
          </style>
        </head>
        <body>
          ${tempDiv.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  }, 300);
}

// function generateYearTable(data, year) {
//   const div = document.createElement("div");
//   div.classList.add("mb-5");
//   div.innerHTML = `
//     <h5>Year ${year}</h5>
//     <table class="table table-bordered">
//       <thead>
//         <tr><th>Category</th><th>Amount</th></tr>
//       </thead>
//       <tbody>
//         <tr><td>Gross Rent</td><td>$${data.grossRentIncome.toFixed(2)}</td></tr>
//         <tr><td>Vacancy</td><td>– $${data.vacancyLoss.toFixed(2)}</td></tr>
//         <tr><td>Operating Income</td><td>$${data.adjustedRentIncome.toFixed(2)}</td></tr>
//         <tr><td>Operating Expenses</td><td>– $${data.operatingExpenses.toFixed(2)}</td></tr>
//         <tr><td class="ps-4">Property Taxes</td><td>$${parseFloat(document.getElementById("propertyTaxes").value || 0).toFixed(2)}</td></tr>
//         <tr><td class="ps-4">Insurance</td><td>$${parseFloat(document.getElementById("insuranceCosts").value || 0).toFixed(2)}</td></tr>
//         <tr><td class="ps-4">Maintenance</td><td>$${parseFloat(document.getElementById("maintenanceCosts").value || 0).toFixed(2)}</td></tr>
//         <tr><td class="ps-4">Management Fees</td><td>$${(data.adjustedRentIncome * (parseFloat(document.getElementById("managementFees").value || 0) / 100)).toFixed(2)}</td></tr>
//         <tr><td class="ps-4">Vacancy Loss</td><td>$${data.vacancyLoss.toFixed(2)}</td></tr>
//         <tr><td class="ps-4">Utilities</td><td>$${parseFloat(document.getElementById("utilities").value || 0).toFixed(2)}</td></tr>
//         <tr><td class="ps-4">Renovations</td><td>$${parseFloat(document.getElementById("renovations").value || 0).toFixed(2)}</td></tr>
//         <tr class="fw-bold"><td>Net Operating Income (NOI)</td><td>$${data.netOperatingIncome.toFixed(2)}</td></tr>
//         <tr><td>Loan Payments</td><td>– $${data.annualMortgagePayment.toFixed(2)}</td></tr>
//         <tr><td>Capital Expenditures</td><td>– $${data.capitalExpenditures.toFixed(2)}</td></tr>
//         <tr class="fw-bold"><td>Cash Flow</td><td>$${data.cashFlow.toFixed(2)}</td></tr>
//       </tbody>
//     </table>
//   `;
//   return div;
// }
