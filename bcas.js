
document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.bcastab');
    const submenuLinks = document.querySelectorAll('.bcassubmenu a');
    const subLinks = document.querySelectorAll('.bcassubmenus a');
    const contents = document.querySelectorAll('.subRcontent');  
    const currentDate = new Date();
    const month = currentDate.getMonth() + 1; // Months are 0-based, so we add 1
    const day = currentDate.getDate();
    const year = currentDate.getFullYear();
    const standarddate = `${month < 10 ? '0' + month : month}/${day < 10 ? '0' + day : day}/${year}`;

    submenuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetTab = e.target.getAttribute('data-tab');
  
            // Remove active class from all tabs and content
            tabs.forEach(tab => tab.classList.remove('active'));
            contents.forEach(content => content.classList.remove('active'));
  
            // Add active class to the corresponding tab and content
            document.getElementById(targetTab).classList.add('active');
            document.getElementById('subcon' +  targetTab.slice(3)).classList.add('active');     

            // set current date in ft tranx
            document.getElementById("ft-sub-tab100-tab6-con1-1").innerText = standarddate
            document.getElementById("ft-sub-tab100-tab6-con1-2").innerText = standarddate
            document.getElementById("ft-sub-tab100-tab6-con1-3").innerText = standarddate
            document.getElementById("ft-sub-tab100-tab6-con1-4").innerText = standarddate

            if (document.getElementById('sub-tab100-tab1')) {
              filtertransactionbydate()
            }

            if (document.getElementById('sub-tab100-tab6')) {
              filterftbydate()
            }

          if (document.getElementById('sub-tab100-tab15')) {
              filterBCASsettlementTable()
            }

        });
    });

    subLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetTab = e.target.getAttribute('data-tab');
  
            // Remove active class from all tabs and content
            tabs.forEach(tab => tab.classList.remove('active'));
            contents.forEach(content => content.classList.remove('active'));
  
            // Add active class to the corresponding tab and content
            document.getElementById(targetTab).classList.add('active');
            document.getElementById('subcon' +  targetTab.slice(3)).classList.add('active');
            
     
            // set current date in ft tranx
            document.getElementById("ft-sub-tab100-tab6-con1-1").innerText = standarddate
            document.getElementById("ft-sub-tab100-tab6-con1-2").innerText = standarddate
            document.getElementById("ft-sub-tab100-tab6-con1-3").innerText = standarddate
            document.getElementById("ft-sub-tab100-tab6-con1-4").innerText = standarddate

            if (document.getElementById('sub-tab100-tab1')) {
              filtertransactionbydate()
            }
            if (document.getElementById('sub-tab100-tab6')) {
              filterftbydate()
            }

           if (document.getElementById('sub-tab100-tab15')) {
              filterBCASsettlementTable()
            }




            for (let i = 1; i < bcasftrow.length; i++) {
              let cellupdte = bcasftrow[i].getElementsByTagName("td");
            
              // Check if the value in the 10th column is 'Pending'
              const firstCell = bcasftrow[i].cells[0]; // Get the first cell (first column)
              const button = firstCell.querySelector('button'); // Get the button inside the first cell
              
              if (cellupdte[10].innerText === 'Pending') {
                if (button) {
                  button.disabled = false; // Keep the button active if the 10th column is 'Pending'
                }
              } else {
                if (button) {
                  button.disabled = true; // Disable the button if the 10th column is not 'Pending'
                  button.style.backgroundColor = 'gray'
                  button.style.cursor = 'not-allowed'
                }
              }
            }
      
        });
    });
 

  });   


  function recordft(subtabId) {
    const tabs = document.querySelectorAll('.bcastab');
    tabs.forEach(tab => tab.classList.remove('active'));
  

    // Add active class to the corresponding tab and content
    document.getElementById(subtabId).classList.add('active');
    document.getElementById('subcon-tab100-tab12').classList.add('active');
    document.getElementById('subcon-tab100-tab6').classList.remove('active');
    const savebtn = document.getElementById('saveft')
    ft0.value = ""
    ft1.value = ""        
    ft2.value = ""
    ft3.value = ""        
    ft4.value = ""
    ft5.value = ""
    ft6.value = ""
    ft7.value = ""     
    ftselectedtype.selectedIndex = 0;  
    savebtn.disabled = true 


    
  }

  function updatecasft(subtabId) {
    const tabs = document.querySelectorAll('.bcastab');
    tabs.forEach(tab => tab.classList.remove('active'));
  

    // Add active class to the corresponding tab and content
    document.getElementById(subtabId).classList.add('active');
    document.getElementById('subcon-tab100-tab13').classList.add('active');
    document.getElementById('subcon-tab100-tab6').classList.remove('active');  
    ft8.value = ""
    ft9.value = ""        
    ft10.value = ""
    ft11.value = ""
     ft12.value = ""
     ft13.value = ""
    ft14.value = ""
    ft15.value = ""
    ft16.value = ""
    ft17.value = ""

  }

  function backft(subtabId) {
    const tabs = document.querySelectorAll('.bcastab');
    tabs.forEach(tab => tab.classList.remove('active'));
  

    // Add active class to the corresponding tab and content
    document.getElementById(subtabId).classList.add('active');
    document.getElementById('subcon-tab100-tab6').classList.add('active');
    document.getElementById('subcon-tab100-tab12').classList.remove('active');
    document.getElementById('subcon-tab100-tab13').classList.remove('active');

  }




    const tableBody = document.getElementById("bcasentries").getElementsByTagName('tbody')[0];
    const tagsBody = document.getElementById("bcastags").getElementsByTagName('tbody')[0];
    const trev =  document.getElementById('trev');
    const tsave =  document.getElementById('tsave');
    const tsavenew =  document.getElementById('tsavenew');
    const taccount =  document.getElementById('dropdownList-Anewtrax');
    const viewbcasamount =  document.getElementById('viewbcasamount');
    const trnxDate =  document.getElementById('trnxDate');
    const viewbcasdate =  document.getElementById('viewbcasdate');
    const viewbcastn = document.getElementById('viewbcastn');
    const viewbcasdesc  = document.getElementById('viewbcasdesc');
    const viewbcasacode  = document.getElementById('viewbcasacode');

function NewtrW(event, tableid) {
    event.preventDefault(); 
   
    


    const tabs = document.querySelectorAll('.bcastab');
    tabs.forEach(tab => tab.classList.remove('active'));  
    
    // Add active class to the corresponding tab and content
    document.getElementById('sub-tab100-tab14').classList.add('active');
    document.getElementById('subcon-tab100-tab14').classList.add('active');
    document.getElementById('subcon-tab100-tab1').classList.remove('active');  
    
    document.getElementById('sub-tab100-tab14-1').classList.add('active');
    document.getElementById('subcon-tab100-tab14-1').classList.add('active');
    document.getElementById('sub-tab100-tab14-2').classList.remove('active');
    document.getElementById('subcon-tab100-tab14-2').classList.remove('active');
   

const tableBodyt = document.getElementById("BCAStransactions").getElementsByTagName('tbody')[0];
const tdate =   formatDate(trnxDate.value);
const allRows = Array.from(tableBodyt.rows);

// filter rows na visible lang
const visibleRows = allRows.filter(r => r.style.display !== "none");
const refdates  =  refformatDate(trnxDate.value);
// gamitin length ng visible rows
if (visibleRows.length > 0) {
    const lastRow = visibleRows[visibleRows.length - 1]; // last visible row
    const tnsnum = parseInt(lastRow.cells[1].innerText) || 0;
    const paddedNumber1 = padNumber(tnsnum + 1, 6);
    viewbcasref.value = "AAA" + paddedNumber1 + refdates;
} else {
    // default if no visible rows
    const paddedNumber1 = padNumber(1, 6);
    viewbcasref.value = "AAA" + paddedNumber1 + refdates;
}

    
     viewbcastn.value = ''
     viewbcasacode.value = ''
     viewbcastemp.value = ''
     viewbcasamount.value = '0.00';
    viewbcasamount.style.pointerEvents = 'none';
     tnsdebit.value = '0.00';
     tnscredit.value = '0.00';
     viewbcasdesc.value = ''
     viewbcasremarks.value = ''
     viewbcasremarks.style.pointerEvents = 'none';  
    viewbcasacode.style.pointerEvents = 'auto';
    viewbcasamount.readOnly = false;
     viewbcasremarks.readOnly = false;
     viewbcasdesc.readOnly = true;
      tagsBody.innerHTML = '';
      tableBody.innerHTML = '';

      trev.style.display = 'none'
      tsave.style.display = 'block'
      tsavenew.style.display = 'block'
      
      viewbcasdate.value = formatDate(trnxDate.value)
      


    if (visibleRows.length > 0) {
    const lastRow = visibleRows[visibleRows.length - 1]; // last visible row
    const tnsnum = parseInt(lastRow.cells[1].innerText) || 0;
   
    viewbcastn.value = tnsnum + 1
} else {
    // default if no visible rows
    
    viewbcastn.value = 1
}


}


  function viewentries(event, tableid) {
    event.preventDefault(); 
    const viewbtnrow = event.target.closest('tr');
    const row = viewbtnrow;

    const tabs = document.querySelectorAll('.bcastab');
    tabs.forEach(tab => tab.classList.remove('active'));  
    
    // Add active class to the corresponding tab and content
    document.getElementById('sub-tab100-tab14').classList.add('active');
    document.getElementById('subcon-tab100-tab14').classList.add('active');
    document.getElementById('subcon-tab100-tab1').classList.remove('active');  

    document.getElementById('sub-tab100-tab14-1').classList.add('active');
    document.getElementById('subcon-tab100-tab14-1').classList.add('active');
    document.getElementById('sub-tab100-tab14-2').classList.remove('active');
    document.getElementById('subcon-tab100-tab14-2').classList.remove('active');


   
    
    
     const tdate =   formatDate(trnxDate.value);
     const tnsnum = row.cells[1].innerText 
     
     const paddedNumber = padNumber(tnsnum, 6);
     const AcctName = row.cells[3].innerText  
     const AcctCode = AcctName.replace(/[^A-Z-]/g, '');
     const Debit = row.cells[4].innerText  
     const Credit = row.cells[5].innerText  
     const memo = row.cells[7].innerText  
     const desc = "To record " + AcctName 
     const trId = row.cells[9].innerText  
     const refId = row.cells[10].innerText

     viewbcasdate.value = tdate
     viewbcastn.value = tnsnum
     viewbcasacode.value = AcctCode
     viewbcastemp.value = AcctName


if(AcctName=== 'PEPP Remittance'){
    viewbcasamount.value = '0.00';
    const acctable = [
        { name: "Cash on hand", norm: "Debit", Amount: Debit },
        { name: "PPS-PEPP Suki card discount", category: "Debit", Amount: '934.40'},
        { name: "Due to Customer - PEPP  REmittance", category: "Credit", Amount: '1,030,000.00'},
        { name: "Commission", category: "Credit", Amount: '10,000.00'},
        { name: "Service charge", category: "Credit", Amount: '1,000.00'},
       
      ];

      tableBody.innerHTML = '';

      acctable.forEach(accounts => {
        const urow = document.createElement('tr');    
    
        Object.values(accounts).forEach(value => {
          const cell = document.createElement('td');
          cell.textContent = value;
          urow.appendChild(cell);
        });    
   
        tableBody.appendChild(urow);
      });

      tnsdebit.value = '1,041,000.00'
      tnscredit.value = '1,041,000.00'

}else if(AcctName === 'PEPP Release'){
    viewbcasamount.value = '0.00';
    const acctable = [
   
        { name: "Due to Customer - PEPP  REmittance", category: "Debit", Amount: Credit}, 
        { name: "PPS-PEPP Suki rebate", category: "Debit", Amount: '934.40'},   
        { name: "Cash on hand", norm: "Credit", Amount: '1,000,934.40' },       
      ];


      tableBody.innerHTML = '';

      acctable.forEach(accounts => {
        const urow = document.createElement('tr');    
    
        Object.values(accounts).forEach(value => {
          const cell = document.createElement('td');
          cell.textContent = value;
          urow.appendChild(cell);
        });    
   
        tableBody.appendChild(urow);
      });
      tnsdebit.value =  '1,000,934.40' 
      tnscredit.value =  '1,000,934.40' 

}else{
    if(Debit!== "0.00"){
        viewbcasamount.value = Debit;

        const acctable = [
            { name: "Cash on hand", norm: "Debit", Amount: Debit },
            { name: "Fund Transfer from", category: "Credit", Amount: Debit},
           
          ];


          tableBody.innerHTML = '';

          acctable.forEach(accounts => {
            const urow = document.createElement('tr');    
        
            Object.values(accounts).forEach(value => {
              const cell = document.createElement('td');
              cell.textContent = value;
              urow.appendChild(cell);
            });    
       
            tableBody.appendChild(urow);
          });

          tnsdebit.value =Debit
          tnscredit.value =Debit

    }else if (Credit!==  "0.00"){
            viewbcasamount.value = Credit
          
            const acctable = [
                { name: "Fund Transfer to", category: "Debit", Amount: Credit},
                { name: "Cash on hand", norm: "Credit", Amount: Credit },             
               
              ];


              tableBody.innerHTML = '';

              acctable.forEach(accounts => {
                const urow = document.createElement('tr');    
            
                Object.values(accounts).forEach(value => {
                  const cell = document.createElement('td');
                  cell.textContent = value;
                  urow.appendChild(cell);
                });    
           
                tableBody.appendChild(urow);
              });

            tnsdebit.value = Credit
             tnscredit.value = Credit
    }



}    

     
     viewbcasdesc.value = desc
     viewbcasremarks.value = memo
     const refdates  =  refformatDate(trnxDate.value);
     viewbcasref.value = "AAA"+paddedNumber+refdates;
     
   

     const tagstable = [
      { name: "Transaction ID", Id: trId },
      { name: "FT Reference ID", Id: refId },  
              
      ];

      tagsBody.innerHTML = '';

      // Loop through the array and create a table row for each item
      tagstable.forEach(tag => {
        const tagrow = document.createElement('tr');

        // Create a cell for each property and append it to the row
        Object.values(tag).forEach(value => {
          const tagcell = document.createElement('td');
          tagcell.textContent = value;
          tagrow.appendChild(tagcell);
        });

        // Append the row to the table body
        tagsBody.appendChild(tagrow);
      });


      if (viewbcasacode.value === 'MNL-FTOB' || viewbcasacode.value === 'MNL-FTHO' || viewbcasacode.value === 'MNL-FTAREA' ||viewbcasacode.value ===  'MNL-5015' ){
          trev.style.display = 'block'
      }else{
          trev.style.display = 'none'
      }

      tsave.style.display = 'none'
      tsavenew.style.display = 'none'
   
  }


  function backtransactions() {
    const tabs = document.querySelectorAll('.bcastab');
   

    tabs.forEach(tab => tab.classList.remove('active')); 

    document.getElementById('sub-tab100-tab1').classList.add('active');
    document.getElementById('subcon-tab100-tab1').classList.add('active');
    document.getElementById('subcon-tab100-tab14').classList.remove('active');
    document.getElementById('sub-tab100-tab14-2').classList.remove('active');
    document.getElementById('subcon-tab100-tab14-2').classList.remove('active');

   
    

  }

//bcas encrypt------------------------------------------------------------------------------------
function decodeBase64(input) {
  try {
      return atob(input);
  } catch (error) {
      console.error("Base64 decoding failed:", error);
      throw error; // Rethrow the error to be caught in the outer try-catch
  }
}

 
function openbcasTab(event, tabName) {
    // Hide all tab content
    var tabButtons = document.getElementsByClassName("BCASentrycontent");
    for (var i = 0; i < tabButtons.length; i++) {
        tabButtons[i].classList.remove("active");
    }
    
    // Remove "active" class from all tab buttons
    var tabButtons = document.getElementsByClassName("subRtab");
    for (var i = 0; i < tabButtons.length; i++) {
        tabButtons[i].classList.remove("active");
    }
  
    // Show the clicked tab's content and add "active" class to the clicked button
    document.getElementById(tabName).classList.add("active");
    event.currentTarget.classList.add("active");


  }


function filtertransactionbydate(){

  const todate = new Date(trnxDate.value);
  const year = todate.getFullYear();
  const month = (todate.getMonth() + 1).toString().padStart(2, '0');
  const day = todate.getDate().toString().padStart(2, '0');
  const tranxselecteddate  = `${month}/${day}/${year}`;  // yyyy/mm/dd
  const BCASTransactionstable = document.getElementById('BCAStransactions');
  const sourceRow = BCASTransactionstable.getElementsByTagName("tr");

  for (let i = 1; i < sourceRow.length; i++) {
    const dateCell = sourceRow[i].getElementsByTagName("td")[11];         // Assuming date is in 2nd column
    if (dateCell) {
      const rowDate = dateCell.textContent.trim();
      sourceRow[i].style.display = (tranxselecteddate === "" || rowDate === tranxselecteddate) ? "" : "none";

    }

    if (sourceRow[i].cells[2] && sourceRow[i].cells[2].textContent.trim() === 'Finalized') {
      sourceRow[i].style.color = 'orange';  // Change color to orange if 'Finalized'
    }
  }


  const BCASbbeb = document.getElementById('BCASbbeb');
  const bbRow = BCASbbeb.getElementsByTagName("tr");
  for  (let j = 1; j < bbRow.length; j++) {      
    const bbcell = bbRow[j].getElementsByTagName("td")

    if(bbcell[0].innerText === tranxselecteddate){
 
      amtbb.value = bbcell[1].innerText
      amteb.value = bbcell[2].innerText
    }else {
      amtbb.value = '0.00'
      amteb.value = '0.00'
    }

   }

}

function filterftbydate(){

  const todate = new Date(bcasftDate.value);
  const year = todate.getFullYear();
  const month = (todate.getMonth() + 1).toString().padStart(2, '0');
  const day = todate.getDate().toString().padStart(2, '0');
  const tranxselecteddate  = `${month}/${day}/${year}`;  // yyyy/mm/dd
  const BCASTransactionstable = document.getElementById('BCASfttable');
  const sourceRow = BCASTransactionstable.getElementsByTagName("tr");



  for (let i = 1; i < sourceRow.length; i++) {
    const dateCell = sourceRow[i].getElementsByTagName("td")[2];         // Assuming date is in 2nd column
    if (dateCell) {
      const rowDate = dateCell.textContent.trim();
      sourceRow[i].style.display = (tranxselecteddate === "" || rowDate === tranxselecteddate) ? "" : "none";

  

  }
   
  }
}




const searchInputA = document.getElementById("viewbcasacode");
const dropdownListA = document.getElementById("dropdownList-Anewtrax");
const dropdownListT = document.getElementById("viewbcastemp");
document.getElementById('viewbcasacode').addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault(); 
  }
});

function toggleDropdownA () {
    dropdownListA.style.display = dropdownListA.style.display === "block" ? "none" : "block";
}

function filterDropdownA () {


  const filterA  = searchInputA.value.toUpperCase();
  const itemsA = dropdownListA.getElementsByTagName("div");

  // Show dropdown if there's input, otherwise hide it
  dropdownListA.style.display = filterA  ? "block" : "none";

  for (let i = 0; i < itemsA.length; i++) {
      const itemA = itemsA [i];
      const txtValueA = itemA.textContent || itemA.innerText;

      if (txtValueA.toUpperCase().indexOf(filterA) > -1) {
          itemA.style.display = "";
      } else {
          itemA.style.display = "none";
      }
  }
}

// Handle item selection
dropdownListA.addEventListener("click", function(event) {
  if (event.target.tagName === "DIV") {
    const selectedValue = event.target.textContent.trim();
    searchInputA.value = selectedValue;
    dropdownListA.style.display = "none"; // hide dropdown

    // now handle specific value logic
    if (selectedValue === "MNL-FTOB") {
      dropdownListT.value = "Expense Due to other branch";
      viewbcasdesc.value  =  "To record expense due to other branch";

       document.getElementById('bcastransactionbranchselection').classList.add('show');
    } else if (selectedValue === "MNL-FTHO") {
      dropdownListT.value = "Expense Due to Head Office";
       viewbcasdesc.value  =  "To record expense due to head office";
    } else if (selectedValue === "MNL-FTAREA") {
      dropdownListT.value = "Expense Due to Area Office";
       viewbcasdesc.value  =  "To record expense due to area office";
    } else if (selectedValue === "MNL-5015") {
      dropdownListT.value = "Other Income-Pawnshop";
      viewbcasdesc.value  =  "To record Other Income-Pawnshop";
    } else {
      dropdownListT.value = "";
      viewbcasdesc.value  =  "";
    }
viewbcasamount.style.pointerEvents = 'auto';
viewbcasremarks.style.pointerEvents = 'auto';
viewbcasamount.value = '0.00'

if (selectedValue === "MNL-5015"){

ensureRow(tableBody, 0).cells[0].innerText = 'Cash on hand';
ensureRow(tableBody, 1).cells[0].innerText = 'Other income';
}else{
ensureRow(tableBody, 0).cells[0].innerText = 'Due to/from';
ensureRow(tableBody, 1).cells[0].innerText = 'Cash on hand';

}

ensureRow(tableBody, 0).cells[1].innerText = 'Debit';
ensureRow(tableBody, 1).cells[1].innerText = 'Credit';
ensureRow(tableBody, 0).cells[2].innerText = '0.00';
ensureRow(tableBody, 1).cells[2].innerText = '0.00';
  }
});

// Close dropdown if clicked outside
window.addEventListener("click", function(event) {

  if (!event.target.closest('.dropdown')) {
    dropdownListA.style.display = "none";
  }
});

const selectElementA  = document.getElementById('viewbcasacode');

selectElementA.addEventListener('change', function () {
// Check if the placeholder option is selected (value is empty string)
if (selectElementtyperecon.value === '') {
  selectElementtyperecon.value = '';  // This will ensure the value is set to blank
}
});

function ensureRow(tbody, index) {
  while (tbody.rows.length <= index) {
    tbody.insertRow();
  }
  const row = tbody.rows[index];
  while (row.cells.length < 3) {
    row.insertCell();
  }
  return row;
}



function formatNumber(value) {
  // Handle null, undefined, or empty values
  if (value == null || value === '') return '';

  // Convert to string safely before replacing
  const num = parseFloat(String(value).replace(/,/g, ''));

  // Handle invalid number cases
  if (isNaN(num)) return '';

  // Format to 2 decimal places with commas
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}




// Shared function to format and update
function formatAndUpdate() {
  const formatted = formatNumber(viewbcasamount.value);
  viewbcasamount.value = formatted;

  // update your table cells (column index 2)
  if (tableBody.rows.length >= 2) {
    tableBody.rows[0].cells[2].textContent = formatted;
    tableBody.rows[1].cells[2].textContent = formatted;
  }

     tnsdebit.value = formatted;
     tnscredit.value = formatted;
}

// Format on blur (leave)
viewbcasamount.addEventListener('blur', formatAndUpdate);

// Format on Enter
viewbcasamount.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault(); // prevent form submit
    formatAndUpdate();
    viewbcasamount.blur(); // optional: move focus away to trigger blur behavior
  }
});







