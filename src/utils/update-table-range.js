import getTableData from './table-data';
import generateCombinedYearTable from './generate-table-markup';

export default function updateTableRange() {
  const selectedYear = parseInt(document.getElementById('years_tbl').value);
  const tableContainer = document.getElementById('yearlyTables');
  tableContainer.innerHTML = '';

  let years = [];
  if (selectedYear <= 1) {
    years = [0, 1, 2];
  } else if (selectedYear >= 30) {
    years = [28, 29, 30];
  } else {
    years = [selectedYear - 1, selectedYear, selectedYear + 1];
  }

  const tableData = years
    .map((year) => getTableData(year, true))
    .filter(Boolean);
  if (tableData.length > 0) {
    const combinedTable = generateCombinedYearTable(tableData);
    tableContainer.appendChild(combinedTable);
  }
}
