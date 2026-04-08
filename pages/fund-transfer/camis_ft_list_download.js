function downftallcsv() {
    const table = document.getElementById("ft-data-table");
    const rows = table.querySelectorAll('tr');

    let csvData = [];

    // Iterate through each row in the table (skip the first row)
    rows.forEach((row, index) => {
      // Skip the first row (header) by checking the row index
      const rowStyle = window.getComputedStyle(row);
      if (rowStyle.display === "none" || rowStyle.visibility === "hidden" || rowStyle.opacity === "0") {
        return; // Skip hidden rows
      }

      const rowData = [];
      // Skip the first column (index 0) and extract data from the rest of the columns
      row.querySelectorAll('td, th').forEach((cell, cellIndex) => {
        // Skip the first column (cellIndex === 0)
        if (cellIndex === 0) return;
        if (cellIndex === 18) return;
        
        // Get cell data and escape commas by wrapping it in quotes
        let cellData = cell.innerText.trim();
        if (cellData.includes(',')) {
          cellData = `"${cellData}"`; // Enclose in quotes if there is a comma
        }
        rowData.push(cellData); // Add the sanitized cell data
      });

      // Push the row data into csvData if it has data
      if (rowData.length > 0) {
        csvData.push(rowData.join(',')); // Join cells with commas
      }
    });

    // Convert the csvData array to a CSV string
    const csvString = csvData.join('\n');
   
    // Create a temporary download link
    const blob = new Blob([csvString], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    const currentDate = new Date();
    const dateString = currentDate.toISOString().replace(/[-T:.Z]/g, "-");
    link.download = `Fund-Transfer-List_${dateString}.csv`; // Default file name

    // Programmatically click the download link
    link.click();
}