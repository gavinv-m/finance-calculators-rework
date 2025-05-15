// Function to print a single content section without charts
function printContentOnly(contentSelector) {
  const contentContainer = document.querySelector(contentSelector);
  if (!contentContainer) return;

  setTimeout(() => {
    const tempDiv = document.createElement('div');
    const clonedContent = contentContainer.cloneNode(true);
    tempDiv.appendChild(clonedContent);

    // Copy all current stylesheets
    const styleSheets = Array.from(document.styleSheets);
    let stylesheetContent = '';

    // Try to extract and include all current CSS
    styleSheets.forEach((sheet) => {
      try {
        if (sheet.cssRules) {
          const cssRules = Array.from(sheet.cssRules);
          cssRules.forEach((rule) => {
            stylesheetContent += rule.cssText + '\n';
          });
        }
      } catch (e) {
        // Skip external stylesheets that can't be accessed due to CORS
        console.log('Could not access stylesheet', e);
      }
    });

    // Open a print window
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
            @media print {
              tfoot {
                display: none !important;
              }
            }
            /* Include all current stylesheets */
            ${stylesheetContent}
          </style>
          <!-- Add Bootstrap CSS if you're using it -->
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
        </head>
        <body>
          ${tempDiv.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    // Give time for styles to apply
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 1000); // Longer timeout to ensure styles are applied
  }, 300);
}

export default function printSpecificSection(classNames) {
  if (!Array.isArray(classNames) || classNames.length === 0) return;

  // Handle case where only one class is provided (like for budget)
  if (classNames.length === 1) {
    printContentOnly(classNames[0]);
    return;
  }

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
