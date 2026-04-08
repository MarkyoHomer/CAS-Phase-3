
const sday = new Date(datefromFTrecon.value);
const syear = sday.getFullYear();
const smonth = (sday.getMonth() + 1).toString().padStart(2, '0');
const ssday = sday.getDate().toString().padStart(2, '0');
const sformattedDate = `${smonth}/${ssday}/${syear}`;

const enday = new Date(datetoFTrecon.value);
const eyear = enday.getFullYear();
const emonth = (enday.getMonth() + 1).toString().padStart(2, '0');
const eday = enday.getDate().toString().padStart(2, '0');
const eformattedDate = `${emonth}/${eday}/${eyear}`; 


function requestrecon(){


const recontable = document.getElementById('recontable').getElementsByTagName('tbody')[0];
const reconrow = recontable.insertRow(0);

const actionCell = reconrow.insertCell(0);
const detailsCell = reconrow.insertCell(1);
const statusCell = reconrow.insertCell(2);
const reqdateCell = reconrow.insertCell(3);
const expiryCell = reconrow.insertCell(4);
const refetchCell = reconrow.insertCell(5);
const timerCell = reconrow.insertCell(6);
timerCell.style.display = 'none'

detailsCell.innerHTML = 'Start Date: ' + sformattedDate + '<br>' +
                          'End Date: ' + eformattedDate + '<br>' +
                          'Report: ' + report.value + '<br>' +
                          'Area: ' + Area.value + '<br>' +
                          'Branch: ' + recnBranch.value + '<br>' +
                          'Type: ' + recntype.value; 

statusCell.textContent = 'Requesting'
expiryCell.textContent = '--'
reqdateCell.textContent = formattedDateTime

const dLBtn = document.createElement('button');  
dLBtn.type = "button";
dLBtn.style.border = 'none';
dLBtn.style.width = '40px'; 
dLBtn.style.marginRight = '10px';
dLBtn.style.backgroundColor = 'white';
dLBtn.disabled = true;
dLBtn.style.cursor = 'not-allowed';
dLBtn.innerHTML = '<i style= "color: gray; background-color: white; border: none;" class="fas fa-cloud-arrow-down"></i>';
dLBtn.onclick = function (event) { 




downloadreconcsv()

}

const refetcBtn = document.createElement('button');  
refetcBtn.type = "button";
refetcBtn.style.border = 'none';
refetcBtn.style.marginRight = '10px';
refetcBtn.style.backgroundColor = 'white';
refetcBtn.disabled = true;
refetcBtn.style.cursor = 'pointer';
refetcBtn.innerHTML = '<i style= "color: gray;" class="fas fa-rotate-right"></i>';
refetcBtn.onclick = function (event) { 

}


actionCell.appendChild(dLBtn);
refetchCell.appendChild(refetcBtn);



const timerInterval = setInterval(() => {
    if (countdownTime > 0) {
       
     statusCell.textContent = 'Requesting' 
     expiryCell.textContent = '--' 
     timerCell.textContent = 'Available in ' + countdownTime; 
     countdownTime--; 
     timerCell.style.display = 'none';
    } else { 
        clearInterval(timerInterval); 
        const dateplus1 = new Date(formattedDateTime);
        dateplus1.setDate(dateplus1.getDate() + 1);

        const nnday = new Date(dateplus1);
        const nyear = nnday.getFullYear();
        const nmonth = (nnday.getMonth() + 1).toString().padStart(2, '0');
        const nday = nnday.getDate().toString().padStart(2, '0');
        const nhours = nnday.getHours().toString().padStart(2, '0');
        const nminutes = nnday.getMinutes().toString().padStart(2, '0');
        const nseconds = nnday.getSeconds().toString().padStart(2, '0');
        const nformattedDate = `${nmonth}/${nday}/${nyear} ${nhours}:${nminutes}:${nseconds}`; //  mm/dd/yyyy hh:mm:ss



         statusCell.textContent = 'Completed'
         expiryCell.textContent = nformattedDate
         dLBtn.disabled = false;
         dLBtn.style.cursor = 'pointer';
         dLBtn.innerHTML = '<i style= "color: black; background-color: white; border: none;" class="fas fa-cloud-arrow-down"></i>';
       
    }
}, 500); 




}



function downloadreconcsv() {
    const table = document.getElementById("frombcasfttable");
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
       // if (cellIndex === 0) return;
        
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



function reconreportfilters() {
  const reportType = selectrecreport.value;
  const reportTitle = document.getElementById('reporttitlerecon');
  const varianceSection = variancerecon;
  const allSection = allrecon;

  if (reportType === 'Select report type') {
    // hide both if no valid selection
    varianceSection.style.display = 'none';
    allSection.style.display = 'none';
    reportTitle.value = '';
    return;
  }

  if (reportType === 'Variance Report') {
    reportTitle.textContent = 'Fund Transfer and Journal Entries Reconciliation (Variances)';
    varianceSection.style.display = 'block';
    allSection.style.display = 'none';
  } 
  else if (reportType === 'Variance and Tally') {
    reportTitle.textContent = 'Fund Transfer and Journal Entries Reconciliation (All)';
    allSection.style.display = 'block';
    varianceSection.style.display = 'none';
  }
}





function reconreportfilter(){

if (report.value === 'Fund Transfers and JE Recon'){
    const recontble = document.getElementById('frombcasfttable').querySelectorAll('tbody tr');
    const startDate = sformattedDate
    const endDate = eformattedDate
    const ftarea = document.getElementById('Area').value.toLowerCase();   
    const ftbranch = document.getElementById('recnBranch').value.toLowerCase();
    const fttype = document.getElementById('recntype').value.toLowerCase();

    filterTableRows(recontble, ftarea, ftbranch,  fttype,   startDate, endDate);  
 
    function filterTableRows(rows, ftarea, ftbranch, fttype, startDate, endDate) {

        rows.forEach(row => {
            // Get the text content of the cells
            const col1 = row.cells[9].innerText.toLowerCase();      // ftarea 
            const col2 =  row.cells[8].innerText.match(/FT-([A-Za-z]{3})/)[1].toLowerCase();  //branch
            
            const col3 = row.cells[1].innerText.toLowerCase();      // fttype
            console.log(col2 )
      
            // Date handling
            const date = row.cells[0].innerText;
            const start = new Date(startDate);
            const end = new Date(endDate);
            const dateParts = date.split('/');
            const rowDate = new Date(`${dateParts[2]}-${dateParts[0]}-${dateParts[1]}`);
            const dateFilter = (!startDate || rowDate >= start) && (!endDate || rowDate <= end);
      
            // Filter criteria checks
            const areaMatch = ftarea ? col1.includes(ftarea.toLowerCase()) : true;
            const branchMatch = ftbranch ? col2.includes(ftbranch.toLowerCase())  : true;  
   
    
            let typeMatch = false;
            if (fttype === "all bank transfers") {
                // "All Bank" filter - show rows with either "Deposit" or "Withdraw"
                typeMatch = col3.includes('deposit') || col3.includes('withdraw');
            } else {
                // Specific type filter - show rows with the exact transaction type
                typeMatch = fttype ? col3.includes(fttype.toLowerCase()) : true;
            }
      
            console.log(areaMatch && branchMatch &&  dateFilter)
            // Show or hide the row based on filter matching
            if (areaMatch && branchMatch &&  dateFilter && typeMatch) {
                row.style.display = 'table-row'; // Show row
      
            } else {
                row.style.display = 'none'; // Hide row
               
            }
        });
      }

}
}



function expand(button){

    const row = button.closest('tr');
    let next = row.nextElementSibling;

    while (next && next.classList.contains('hiddenrows')) {
      const isVisible = next.style.display === 'table-row';
      next.style.display = isVisible ? 'none' : 'table-row';
      next = next.nextElementSibling;
    }

    // Update button text based on the first hidden row's visibility
    const firstDetailRow = row.nextElementSibling;
    const isNowVisible = firstDetailRow && firstDetailRow.style.display === 'table-row';
    button.innerHTML = isNowVisible ? '<i style= "color: rgb(0, 9, 0); font-size: 16px;" class="fas fa-sort-up"></i>' : '<i style= "color: rgb(0, 9, 0); font-size: 16px;" class="fas fa-sort-down"></i>';
  }


