window.onload = function() {



 // for (var i = 1; i < loadftrows.length; i++) {
   // loadftrows[i].style.display = 'none'; // Hide row
  //}


  ftdatechange ()

};

//dropdown with input-----------------------------------------------------------------

const searchInput = document.getElementById("ft-Area-drop");
const dropdownList = document.getElementById("dropdownList");

function toggleDropdown() {
  dropdownList.style.display = dropdownList.style.display === "block" ? "none" : "block";
}

document.getElementById('ft-Area-drop').addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault(); 
  }
});

function filterDropdown() {

  
  const filter = searchInput.value.toUpperCase();
  const items = dropdownList.getElementsByTagName("div");

  // Show dropdown if there's input, otherwise hide it
  dropdownList.style.display = filter ? "block" : "none";

  for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const txtValue = item.textContent || item.innerText;

      if (txtValue.toUpperCase().indexOf(filter) > -1) {
          item.style.display = "";
      } else {
          item.style.display = "none";
      }
  }
}

// Handle item selection
dropdownList.addEventListener("click", function(event) {

  if (event.target.tagName === "DIV") {
      searchInput.value = event.target.textContent;
      dropdownList.style.display = "none"; // Hide the dropdown after selection
  }
});

// Close dropdown if clicked outside
window.addEventListener("click", function(event) {

  if (!event.target.closest('.dropdown')) {
      dropdownList.style.display = "none";
  }
});

const selectElement1 = document.getElementById('ft-Area-drop');

selectElement1.addEventListener('change', function () {
// Check if the placeholder option is selected (value is empty string)
if (selectElement1.value === '') {
  selectElement1.value = '';  // This will ensure the value is set to blank
}
});


//dropdown with input-----------------------------------------------------------------

const searchInput1 = document.getElementById("ft-branch-drop");
const dropdownList1 = document.getElementById("dropdownList-branch");



function toggleDropdownbranch() {

// Toggle the visibility of the dropdown list
dropdownList1.style.display = dropdownList1.style.display === "block" ? "none" : "block";
}


document.getElementById('ft-branch-drop').addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault(); 
  }
});

function filterDropdownbranch() {
 
const filter1 = searchInput1.value.toUpperCase();
const items1 = dropdownList1.getElementsByTagName("div");

// Show dropdown if there's input, otherwise hide it
dropdownList1.style.display = filter1 ? "block" : "none";

for (let i = 0; i < items1.length; i++) {
    const item1 = items1[i];
    const txtValue1 = item1.textContent || item1.innerText;

    if (txtValue1.toUpperCase().indexOf(filter1) > -1) {
        item1.style.display = "";
    } else {
        item1.style.display = "none";
    }
}
}

// Handle item selection
dropdownList1.addEventListener("click", function(event) {

if (event.target.tagName === "DIV") {
    searchInput1.value = event.target.textContent;
    dropdownList1.style.display = "none"; // Hide the dropdown after selection
}
});

// Close dropdown if clicked outside
window.addEventListener("click", function(event) {

if (!event.target.closest('.dropdown')) {
    dropdownList1.style.display = "none";
}
});


const selectElement2 = document.getElementById('ft-branch-drop');
selectElement2.addEventListener('change', function () {
// Check if the placeholder option is selected (value is empty string)
if (selectElement2.value === '') {
  selectElement2.value = '';  // This will ensure the value is set to blank
}
});



const searchInput2 = document.getElementById("ft-status-drop");
const dropdownList2 = document.getElementById("dropdownList-stat");

function toggleDropdownstat() {
// Toggle the visibility of the dropdown list
dropdownList2.style.display = dropdownList2.style.display === "block" ? "none" : "block";
}

document.getElementById('ft-status-drop').addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault(); 
  }
});

function filterDropdownstat() {

  const filter2 = searchInput2.value.toUpperCase();
const items2 = dropdownList2.getElementsByTagName("div");

// Show dropdown if there's input, otherwise hide it
dropdownList2.style.display = filter2 ? "block" : "none";

for (let i = 0; i < items2.length; i++) {
    const item2 = items2[i];
    const txtValue2 = item2.textContent || item2.innerText;

    if (txtValue2.toUpperCase().indexOf(filter2) > -1) {
        item2.style.display = "";
    } else {
        item2.style.display = "none";
    }
}

}

// Handle item selection
dropdownList2.addEventListener("click", function(event) {

if (event.target.tagName === "DIV") {
    searchInput2.value = event.target.textContent;
    dropdownList2.style.display = "none"; // Hide the dropdown after selection
}
});

// Close dropdown if clicked outside
window.addEventListener("click", function(event) {

if (!event.target.closest('.dropdown')) {
    dropdownList2.style.display = "none";
}
});


const selectElement3 = document.getElementById('ft-status-drop');
selectElement3.addEventListener('change', function () {
// Check if the placeholder option is selected (value is empty string)
if (selectElement3.value === '') {
  selectElement3.value = '';  // This will ensure the value is set to blank
}
});

//--------------------------------------------------------------------------

const searchInput4 = document.getElementById("ft-trns-drop");
const dropdownList4 = document.getElementById("dropdownList-trans");


document.getElementById('ft-trns-drop').addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault(); 
  }
});


function toggleDropdowntrns() {
dropdownList4.style.display = dropdownList4.style.display === "block" ? "none" : "block";

}

function filterDropdowntrns() {
 
const filter4 = searchInput4.value.toUpperCase();
const items4 = dropdownList4.getElementsByTagName("div");
dropdownList4.style.display = filter4 ? "block" : "none";

for (let i = 0; i < items4.length; i++) {
    const item4 = items4[i];
    const txtValue4 = item4.textContent || item4.innerText;

    if (txtValue4.toUpperCase().indexOf(filter4) > -1) {
        item4.style.display = "";
    } else {
        item4.style.display = "none";
    }
}
}

// Handle item selection
dropdownList4.addEventListener("click", function(event) {

if (event.target.tagName === "DIV") {
    searchInput4.value = event.target.textContent;
    dropdownList4.style.display = "none"; // Hide the dropdown after selection
}
});

// Close dropdown if clicked outside
window.addEventListener("click", function(event) {

if (!event.target.closest('.dropdown')) {
    dropdownList4.style.display = "none";
}
});

const selectElement4 = document.getElementById('ft-trns-drop');
selectElement4.addEventListener('change', function () {
// Check if the placeholder option is selected (value is empty string)
if (selectElement4.value === '') {
  selectElement4.value = '';  // This will ensure the value is set to blank
}
});


//-------------------------------------------------------------------------------------------
function filterftallTable() {

    // Get filter values for each column
    const ftarea = document.getElementById('ft-Area-drop').value.toLowerCase();   
    const ftbranch = document.getElementById('ft-branch-drop').value.toLowerCase();
    const ftstatus = document.getElementById('ft-status-drop').value.toLowerCase();
    const fttype = document.getElementById('ft-trns-drop').value.toLowerCase();
    const search1 = document.getElementById('searchftall').value.toLowerCase();
    const startDate = document.getElementById('datefromFTlist').value;
    const endDate = document.getElementById('datetoFTlist').value;
    
    // Get table rows
    const table1 = document.getElementById('ft-data-table').querySelectorAll('tbody tr');
    
    // Filter rows in the first table (ft-data-table)
    filterTableRows(table1, ftarea, ftbranch, ftstatus, fttype,  search1, startDate, endDate);    
}

function filterTableRows(rows, ftarea, ftbranch, ftstatus, fttype, search, startDate, endDate) {
 

  rows.forEach(row => {
      // Get the text content of the cells
      const col1 = row.cells[11].innerText.toLowerCase();
      const col2 = row.cells[5].innerText.toLowerCase();
      const col3 = row.cells[6].innerText.toLowerCase();
      const col4 = row.cells[10].innerText.toLowerCase();
      const col5 = row.cells[1].innerText.toLowerCase();
      const col6 = row.cells[2].innerText.toLowerCase();
      const col7 = row.cells[3].innerText.toLowerCase();
      const col8 = row.cells[4].innerText.toLowerCase();
      const col9 = row.cells[8].innerText.toLowerCase();
      const col10 = row.cells[9].innerText.toLowerCase();

      // Date handling
      const date = row.cells[1].innerText;
      const start = new Date(startDate);
      const end = new Date(endDate);
      const dateParts = date.split('/');
      const rowDate = new Date(`${dateParts[2]}-${dateParts[0]}-${dateParts[1]}`);
      const dateFilter = (!startDate || rowDate >= start) && (!endDate || rowDate <= end);

      // Filter criteria checks
      const areaMatch = ftarea ? col1.includes(ftarea.toLowerCase()) : true;
      const branchMatch = ftbranch ? (col2.includes(ftbranch.toLowerCase()) || col3.includes(ftbranch.toLowerCase())) : true;
      const statusMatch = ftstatus ? col4.includes(ftstatus.toLowerCase()) : true;
      const searchMatch = [col5, col6, col7, col8, col9, col10].some(col => col.includes(search.toLowerCase()));

      let typeMatch = false;
      if (fttype === "all bank transfers") {
          // "All Bank" filter - show rows with either "Deposit" or "Withdraw"
          typeMatch = col6.includes('deposit') || col6.includes('withdraw');
      } else {
          // Specific type filter - show rows with the exact transaction type
          typeMatch = fttype ? col6.includes(fttype.toLowerCase()) : true;
      }

      
      // Show or hide the row based on filter matching
      if (areaMatch && branchMatch && statusMatch && searchMatch && dateFilter && typeMatch) {
          row.style.display = 'table-row'; // Show row
      } else {
          row.style.display = 'none'; // Hide row
      }
  });
}

//------------------------------handle the enter key ---------------------------------------------------

function handleEnterKey(event, inputFieldId) {
  if (event.key === 'Enter') {
      event.preventDefault(); // Prevent default action (e.g., form submission)
      triggerCustomAction(inputFieldId); // Call custom function based on the field
  }
}

function triggerCustomAction(inputFieldId) {
  console.log('Enter key pressed in:', inputFieldId);
  // You can customize this function based on your needs
  if (inputFieldId === 'searchftall') {
   
  }
  if (inputFieldId === 'neworigin') {

  }
  if (inputFieldId === 'newdest') {
  
  }
}

document.getElementById('searchftall').addEventListener('keydown', function(event) {
  handleEnterKey(event, 'searchftall');
});




//-------------------------------------------------------------------------------

function searchTable() {
var searchInput3 = document.getElementById("searchftall").value.toLowerCase();
var tablesearch = document.getElementById("ft-data-table");
var rowssearch = tablesearch.getElementsByTagName("tr");

// Filter dropdown values
const sftarea = document.getElementById('ft-Area-drop').value.toLowerCase();
const sftbranch = document.getElementById('ft-branch-drop').value.toLowerCase();
const sftstatus = document.getElementById('ft-status-drop').value.toLowerCase();
const sfttype = document.getElementById('ft-trns-drop').value.toLowerCase();
// Date range filters
const startDate = document.getElementById('datefromFTlist').value;
const endDate = document.getElementById('datetoFTlist').value;

// Convert input dates to Date objects for comparison
const start = new Date(startDate);
const end = new Date(endDate);

// Loop through all rows (except the header row)
for (var i = 1; i < rowssearch.length; i++) {
  var cellssearch = rowssearch[i].getElementsByTagName("td");

  // Extract relevant columns (adjust column indexes as needed)
  var namesearch = cellssearch[7].textContent.toLowerCase();
  var typesearch = cellssearch[2].innerText.toLowerCase();
  var idsearch = cellssearch[3].innerText.toLowerCase();
  var xamount = cellssearch[4].innerText.toLowerCase();
  var normalizedAmount = xamount.replace(/[,\.]/g, '');
  
  // Normalize the search term by removing commas and periods
  var normalizedSearch = xamount

  var memosearch = cellssearch[8].innerText.toLowerCase();
  var createsearch = cellssearch[9].innerText.toLowerCase();
  
  // Columns for filtering (area, branch, status, etc.)
  const col41 = cellssearch[11].innerText.toLowerCase(); // Area
  const col42 = cellssearch[5].innerText.toLowerCase();  // Branch (orig)
  const col43 = cellssearch[6].innerText.toLowerCase();  // Branch (dest)
  const col44 = cellssearch[10].innerText.toLowerCase(); // Status
  const col45 = cellssearch[2].innerText.toLowerCase(); // Status

  // Get date from the row and convert to Date object
  const date = cellssearch[1].innerText; // Assumed to be in mm/dd/yyyy format
  const dateParts = date.split('/');
  const rowDate = new Date(`${dateParts[2]}-${dateParts[0]}-${dateParts[1]}`);

  // Check if the row's date is within the selected range
  const dateFilter = (!startDate || rowDate >= start) && (!endDate || rowDate <= end);

  // Area, branch, and status filters
  const area1 = sftarea ? col41.includes(sftarea) : true;
  const orig1 = sftbranch ? col42.includes(sftbranch) : true;
  const dest1 = sftbranch ? col43.includes(sftbranch) : true;
  const stat1 = sftstatus ? col44.includes(sftstatus) : true;
  const type1 = sfttype ? col45.includes(sfttype) : true;
  // Search term match for relevant fields
  const matchesSearch = namesearch.includes(searchInput3) ||
                        typesearch.includes(searchInput3) ||
                        idsearch.includes(searchInput3) ||
                        normalizedAmount.includes(searchInput3) ||
                        normalizedSearch.includes(searchInput3) ||
                        memosearch.includes(searchInput3) ||
                        createsearch.includes(searchInput3);

  // Combine all filters
  if (matchesSearch){ 
    if (area1 && orig1 && type1 && stat1 && dateFilter || area1 && dest1 && type1 && stat1 && dateFilter) {
      
      rowssearch[i].style.display = 'table-row'; // Show row
    }
  } else {
      rowssearch[i].style.display = 'none'; // Hide row
  }
}
}



function ftdatechange (){
  const startDate = document.getElementById('datefromFTlist').value;
  const endDate = document.getElementById('datetoFTlist');

  endDate.setAttribute('min', startDate);   // Set the min attribute of the end date input to the start date

  // Clear the end date if it's earlier than the new start date
  if (new Date(startDate) > new Date(endDate.value) && endDate.value !== '') {
    endDate.value = startDate;
  }

  // Clear the end date if it's earlier than the new start date
  if (new Date(endDate.value) < new Date(startDate)) {
    endDate.value = ''; // Reset the end date if it's invalid
  }
}

function ftdatechangerecon (){
  const startDate = document.getElementById('datefromFTrecon').value;
  const endDate = document.getElementById('datetoFTrecon');

  endDate.setAttribute('min', startDate);   // Set the min attribute of the end date input to the start date

  // Clear the end date if it's earlier than the new start date
  if (new Date(startDate) > new Date(endDate.value) && endDate.value !== '') {
    endDate.value = startDate;
  }

  // Clear the end date if it's earlier than the new start date
  if (new Date(endDate.value) < new Date(startDate)) {
    endDate.value = ''; // Reset the end date if it's invalid
  }
}


function clearsearchbar(){

document.getElementById('searchftall').value = '';
searchTable();

}

// Add event listener for toggling the form



