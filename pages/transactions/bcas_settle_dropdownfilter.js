//dropdown with input-----------------------------------------------------------------

const settlereporttype = document.getElementById("settlereporttype");
const settledropdownList = document.getElementById("settledropdownList");

function settletoggleDropdownReport() {
  settledropdownList.style.display = settledropdownList.style.display === "block" ? "none" : "block";
}

document.getElementById('settlereporttype').addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault(); 
  }
});

function settlefilterDropdownReport() {
  
  const filter = settlereporttype.value.toUpperCase();
  const items = settledropdownList.getElementsByTagName("div");

  // Show dropdown if there's input, otherwise hide it
  settledropdownList.style.display = filter ? "block" : "none";

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
  settledropdownList.addEventListener("click", function(event) {

  if (event.target.tagName === "DIV") {
      settlereporttype.value = event.target.textContent;
      settledropdownList.style.display = "none"; // Hide the dropdown after selection
  }
});

// Close dropdown if clicked outside
window.addEventListener("click", function(event) {

  if (!event.target.closest('.dropdown')) {
      settledropdownList.style.display = "none";
  }
});

const selectElementset1 = document.getElementById('ft-Area-drop');

selectElementset1.addEventListener('change', function () {
// Check if the placeholder option is selected (value is empty string)
if (selectElementset1.value === '') {
  selectElementset1.value = '';  // This will ensure the value is set to blank
}
});




//dropdown with input-----------------------------------------------------------------

const settleEmp = document.getElementById("settleEmp");
const settledropdownListEmp = document.getElementById("settledropdownListEmp");

function settletoggleDropdownEmp() {
  settledropdownListEmp.style.display = settledropdownListEmp.style.display === "block" ? "none" : "block";
}

document.getElementById('settleEmp').addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault(); 
  }
});

function settlefilterDropdownEmp() {
  
  const filter = settleEmp.value.toUpperCase();
  const items = settledropdownListEmp.getElementsByTagName("div");

  // Show dropdown if there's input, otherwise hide it
  settledropdownListEmp.style.display = filter ? "block" : "none";

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
  settledropdownListEmp.addEventListener("click", function(event) {

  if (event.target.tagName === "DIV") {
      settleEmp.value = event.target.textContent;
      settledropdownListEmp.style.display = "none"; // Hide the dropdown after selection
  }
});

// Close dropdown if clicked outside
window.addEventListener("click", function(event) {

  if (!event.target.closest('.dropdown')) {
      settledropdownListEmp.style.display = "none";
  }
});

const selectElementset2 = document.getElementById('settleEmp');

selectElementset2.addEventListener('change', function () {
// Check if the placeholder option is selected (value is empty string)
if (selectElementset2.value === '') {
  selectElementset2.value = '';  // This will ensure the value is set to blank
}
});







function filterBCASsettlementTable() {
  const settlereport = document.getElementById('settlereporttype').value.trim().toLowerCase();
  const settlestatus = document.getElementById('settledstatus').value.trim().toLowerCase();
  const settleemployee = document.getElementById('settleEmp').value.trim().toLowerCase();
  const startDate = document.getElementById('bcasSETDatefr').value;
  const endDate = document.getElementById('bcasSETDateto').value;

  const rows = document.querySelectorAll('#BCASsettletable tbody tr');



  rows.forEach(row => {
    const colTemplate = row.cells[2].innerText.toLowerCase();
    const colStatus = row.cells[3].innerText.toLowerCase();
    const colEmp = row.cells[4].innerText.toLowerCase() + ': ' + row.cells[5].innerText.toLowerCase();
    const dateText = row.cells[1].innerText;

    // --- DATE FILTER ---
    let dateMatch = true;
    if (startDate || endDate) {
      const [month, day, year] = dateText.split('/');
      const rowDate = new Date(`${year}-${month}-${day}`);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      dateMatch = (!start || rowDate >= start) && (!end || rowDate <= end);
    }

    // --- REPORT, EMPLOYEE, AND STATUS FILTERS ---
    const reportMatch = !settlereport || colTemplate.includes(settlereport);
    const empMatch = !settleemployee || colEmp.includes(settleemployee);

    let statusMatch = true;
    if (settlestatus && settlestatus !== "all") {
      statusMatch = colStatus === settlestatus; // exact match only
    }

    // --- FINAL DECISION ---
    if (reportMatch && statusMatch && empMatch && dateMatch) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
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




// Add event listener for toggling the form
toggleButton.addEventListener('click', function() {

  if (modalwidth.style.width !== '915px') {
    modalwidth.style.width = '915px'
     fieldsetcontainer.style.gap = '5px'
    toggleButton.innerHTML = '<i class="fas fa-circle-arrow-left"></i>';

  } else {
    modalwidth.style.width = '470px'
     fieldsetcontainer.style.gap = '20px'
    toggleButton.innerHTML = '<i class="fas fa-circle-arrow-right"></i>';

  }
});



function viewsettle(event){

    const tableBody = document.getElementById('BCASsettletable-individual').getElementsByTagName('tbody')[0];
 

        document.getElementById('subcon-tab100-tab16').classList.add('active');
        document.getElementById('subcon-tab100-tab15').classList.remove('active');

      const viewbtnrow = event.target.closest('tr');
      const row = viewbtnrow;
      const ref = row.cells[10].innerText;
     setdate.value =  row.cells[1].innerText;
     setemp.value = row.cells[4].innerText + ': ' + row.cells[5].innerText;  
     setamount.value = row.cells[6].innerText;        
     setremarks.value = row.cells[9].innerText;   
     setref.value = row.cells[10].innerText; 
     amttoset.value = row.cells[8].innerText; 

     if (amttoset.value === '0.00'){
      settle.style.backgroundColor = 'gray';
      settle.style.cursor = "not-allowed";


     }else{

      settle.style.backgroundColor = '';
      settle.style.cursor = "pointer";
     }

for (let i = 0; i < tableBody.rows.length; i++) {
  const refdest = tableBody.rows[i].cells[5].textContent.trim();
  if (ref === refdest) {
    tableBody.rows[i].style.display = '';

  }else {
    tableBody.rows[i].style.display = 'none';
  }
}



}


function settleclosed(event){

        document.getElementById('subcon-tab100-tab15').classList.add('active');
        document.getElementById('subcon-tab100-tab16').classList.remove('active');

}