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
