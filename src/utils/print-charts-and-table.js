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
