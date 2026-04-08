function savebcastransaction(){

    if (
            viewbcasamount.value === '0.00' || 
            viewbcasacode.value.trim() === '' || 
            viewbcasremarks.value.trim() === ''
          ) {

            showNotification();
            xnotification.style.bottom = '75px';
            xnotification.style.right = '75px';
            xnotification.style.width =  '300px';      
            xnotification.style.height =  '55px';  
            xnotification.style.backgroundColor =  'orange';

            xnotify.innerHTML = `
              <div class="icon" style="font-size:20px; margin-right:10px;">⚠️</div>
              <div class="message">
               Please fill in all required fields before proceeding! 
              </div>
            `;

            xnotify.style.display = 'flex';
            return; // stops the function from continuing
        }


 document.getElementById('bcastransactionconfirmation').classList.add('show');

bcasrev.style.display = 'none'
bcassave.style.display = 'block'
bcassavenew.style.display = 'none'

 document.getElementById('bcastransactionmessage').textContent =   "Are you sure you want to save this transaction?" 
}


function savenewbcastransaction(){



      if (
            viewbcasamount.value === '0.00' || 
            viewbcasacode.value.trim() === '' || 
            viewbcasremarks.value.trim() === ''
          ) {

            showNotification();
            xnotification.style.bottom = '75px';
            xnotification.style.right = '75px';
            xnotification.style.width =  '300px';      
            xnotification.style.height =  '55px';  
            xnotification.style.backgroundColor =  'orange';

            xnotify.innerHTML = `
              <div class="icon" style="font-size:20px; margin-right:10px;">⚠️</div>
              <div class="message">
               Please fill in all required fields before proceeding! 
              </div>
            `;

            xnotify.style.display = 'flex';
            return; // stops the function from continuing
        }
 document.getElementById('bcastransactionconfirmation').classList.add('show');
bcasrev.style.display = 'none'
bcassave.style.display = 'none'  
bcassavenew.style.display = 'block'
 document.getElementById('bcastransactionmessage').textContent =  "Are you sure you want to save this transaction and create a new one?"  

}


function savebcastrconfirm(){
      
save()

        const tabs = document.querySelectorAll('.bcastab');
        tabs.forEach(tab => tab.classList.remove('active'));  
        
        // Add active class to the corresponding tab and content
        document.getElementById('sub-tab100-tab14').classList.remove('active');
        document.getElementById('subcon-tab100-tab14').classList.remove('active');

        document.getElementById('subcon-tab100-tab1').classList.add('active');  
        document.getElementById('sub-tab100-tab14-1').classList.remove('active');

        document.getElementById('subcon-tab100-tab14-1').classList.remove('active');
        document.getElementById('sub-tab100-tab14-2').classList.add('active');
        document.getElementById('subcon-tab100-tab14-2').classList.add('active');

}





function savenewbcastrconfirm(){
          if (
            viewbcasamount.value === '0.00' || 
            viewbcasacode.value.trim() === '' || 
            viewbcasremarks.value.trim() === ''
          ) {

            showNotification();
            xnotification.style.bottom = '75px';
            xnotification.style.right = '75px';
            xnotification.style.width =  '300px';      
            xnotification.style.height =  '55px';  
            xnotification.style.backgroundColor =  'orange';

            xnotify.innerHTML = `
              <div class="icon" style="font-size:20px; margin-right:10px;">⚠️</div>
              <div class="message">
               Please fill in all required fields before proceeding! 
              </div>
            `;

            xnotify.style.display = 'flex';
            return; //  stops the function from continuing
        }
save()


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
     viewbcasacode.style.pointerEvents = 'auto';
     viewbcastemp.value = ''
     viewbcasamount.value = '0.00';
     viewbcasamount.style.pointerEvents = 'none';     
     tnsdebit.value = '0.00';
     tnscredit.value = '0.00';
     viewbcasdesc.value = ''
     viewbcasremarks.value = ''
     viewbcasremarks.style.pointerEvents = 'none';    
    viewbcasamount.readOnly = false;
     viewbcasremarks.readOnly = false;

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


function validateNumberInput(input) {
  // Remove all characters except digits and one decimal point
  input.value = input.value
    .replace(/[^0-9.]/g, '')   // keep digits and dot
    .replace(/(\..*)\./g, '$1'); // allow only one dot
}



function save(){

    const tableBody = document.getElementById('BCAStransactions').getElementsByTagName('tbody')[0];
    const xrow = tableBody.rows[tableBody.rows.length - 1] 
    const newRow = tableBody.insertRow();    
    const viewCell = newRow.insertCell(0);
    const NoCell = newRow.insertCell(1);
    const statusCell = newRow.insertCell(2);
    const templateCell = newRow.insertCell(3);
    const debitCell = newRow.insertCell(4);   
    const creditCell = newRow.insertCell(5);
    const balanceCell = newRow.insertCell(6);
    const remarksCell = newRow.insertCell(7);
    const uploadstatCell = newRow.insertCell(8);
    const tridCell = newRow.insertCell(9);
    const ftidCell = newRow.insertCell(10);
    const dateCell = newRow.insertCell(11);
    const acccodecell = newRow.insertCell(12);
    dateCell.style.display = 'none' 
    acccodecell.style.display = 'none' 
    tridCell.style.display = 'none' 
    ftidCell.style.display = 'none' 
   
   


const visibleRowCount = Array.from(tableBody.rows)
  .filter(row => row.style.display !== 'none')
  .length;

NoCell.textContent = visibleRowCount;

statusCell.textContent  = 'Active'


        if (viewbcasacode.value === 'MNL-FTOB' || viewbcasacode.value === 'MNL-FTHO' || viewbcasacode.value === 'MNL-FTAREA'){
                 if (viewbcasacode.value === 'MNL-FTOB'){
                  templateCell.textContent = 'Expense due to other branch'

                  }else if (viewbcasacode.value === 'MNL-FTHO'){
                templateCell.textContent = 'Expense due to Head Office'

                  }else {

                  templateCell.textContent = 'Expense due to Area Office'

                  }

     
        debitCell.textContent ='0.00'
        creditCell.textContent = viewbcasamount.value
        const Amount = parseFloat(creditCell.textContent.replace(/,/g, ''));          
        const prevtbalance = parseFloat(xrow.cells[6].textContent.replace(/,/g, ''));       
        const totalBalance = prevtbalance - Amount; 
        const roundedBalance = Math.round(totalBalance * 100) / 100; // This rounds to 2 decimal places     
        const formattedBalance = roundedBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        balanceCell.textContent = formattedBalance;
        
       } else if (viewbcasacode.value === 'MNL-5015'){
        templateCell.textContent = 'Other Income-Pawnshop' 
        debitCell.textContent = viewbcasamount.value
        creditCell.textContent = '0.00'
        const Amount = parseFloat(debitCell.textContent.replace(/,/g, ''));          
        const prevtbalance = parseFloat(xrow.cells[6].textContent.replace(/,/g, ''));       
        const totalBalance = prevtbalance + Amount; 
        const roundedBalance = Math.round(totalBalance * 100) / 100; // This rounds to 2 decimal places     
        const formattedBalance = roundedBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        balanceCell.textContent = formattedBalance;

       } else if (viewbcasacode.value === '9999'){
        templateCell.textContent = 'Cash Shortages' 
        debitCell.textContent = '0.00'
        creditCell.textContent = viewbcasamount.value
        const Amount = parseFloat(creditCell.textContent.replace(/,/g, ''));          
        const prevtbalance = parseFloat(xrow.cells[6].textContent.replace(/,/g, ''));       
        const totalBalance = prevtbalance + Amount; 
        const roundedBalance = Math.round(totalBalance * 100) / 100; // This rounds to 2 decimal places     
        const formattedBalance = roundedBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        balanceCell.textContent = formattedBalance;


        } else if (viewbcasacode.value === '5999'){
        templateCell.textContent = 'Cash Overages' 
        debitCell.textContent = viewbcasamount.value
        creditCell.textContent = '0.00'
        const Amount = parseFloat(debitCell.textContent.replace(/,/g, ''));          
        const prevtbalance = parseFloat(xrow.cells[6].textContent.replace(/,/g, ''));       
        const totalBalance = prevtbalance + Amount; 
        const roundedBalance = Math.round(totalBalance * 100) / 100; // This rounds to 2 decimal places     
        const formattedBalance = roundedBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        balanceCell.textContent = formattedBalance;


               } else if (viewbcasacode.value === 'MNL-9999'){
        templateCell.textContent = 'Cash Shortages-Others' 
        debitCell.textContent = '0.00'
        creditCell.textContent = viewbcasamount.value
        const Amount = parseFloat(creditCell.textContent.replace(/,/g, ''));          
        const prevtbalance = parseFloat(xrow.cells[6].textContent.replace(/,/g, ''));       
        const totalBalance = prevtbalance + Amount; 
        const roundedBalance = Math.round(totalBalance * 100) / 100; // This rounds to 2 decimal places     
        const formattedBalance = roundedBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        balanceCell.textContent = formattedBalance;


        } else if (viewbcasacode.value === 'MNL-5999'){
        templateCell.textContent = 'Cash Overages-Others' 
        debitCell.textContent = viewbcasamount.value
        creditCell.textContent = '0.00'
        const Amount = parseFloat(debitCell.textContent.replace(/,/g, ''));          
        const prevtbalance = parseFloat(xrow.cells[6].textContent.replace(/,/g, ''));       
        const totalBalance = prevtbalance + Amount; 
        const roundedBalance = Math.round(totalBalance * 100) / 100; // This rounds to 2 decimal places     
        const formattedBalance = roundedBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        balanceCell.textContent = formattedBalance;
 
      }   
    
    
   
    remarksCell.textContent = viewbcasremarks.value
    uploadstatCell.textContent = 'Not Uploaded'
    dateCell.textContent  = viewbcasdate.value   
    acccodecell.textContent = viewbcasacode.value 




  const viewbtn = document.createElement('button');  
    viewbtn.type = "button";
    viewbtn.className = "custom-button-bcaseye";
    viewbtn.innerHTML = '<i  class= "fas fa-eye">';  
    viewbtn.style.cursor = 'pointer';
    viewbtn.onclick = function(event) { 
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
    
        const tableBody = document.getElementById("bcasentries").getElementsByTagName('tbody')[0];
        const tagsBody = document.getElementById("bcastags").getElementsByTagName('tbody')[0];
        
        
        
         const tdate =   formatDate(trnxDate.value);
         
         const tnsnum = row.cells[1].innerText          
         const paddedNumber = padNumber(tnsnum, 6);
         const AcctName = row.cells[3].innerText  
         const AcctCode =  row.cells[12].innerText                             // AcctName.replace(/[^A-Z-]/g, '');
         const Debit = row.cells[4].innerText  
         const Credit = row.cells[5].innerText  
         const memo = row.cells[7].innerText  
         const desc = "To record " + AcctName 
         const trId =  row.cells[9].textContent
         const refid = ftidCell.innerText
    
         viewbcasdate.value = tdate
         viewbcastn.value = tnsnum
         viewbcasacode.value = AcctCode
         viewbcastemp.value = AcctName
         viewbcasdesc.value = desc
         viewbcasremarks.value = memo
         const refdates  =  refformatDate(trnxDate.value);
         viewbcasref.value = "AAA"+paddedNumber+refdates;

    
    

      if ((viewbcasacode.value === 'MNL-FTOB' ||
         viewbcasacode.value === 'MNL-FTHO' || 
         viewbcasacode.value === 'MNL-FTAREA' ||
         viewbcasacode.value ===  'MNL-5015') &&
         (row.cells[2].textContent === 'Active' ||
         row.cells[2].textContent === 'Finalized' )){

         trev.style.display = 'block'

        }else{
         trev.style.display = 'none'
       }
        
        tsave.style.display = 'none'
        tsavenew.style.display = 'none'



     viewbcasdate.readOnly = true;
     viewbcastn.readOnly = true;
     viewbcasacode.style.pointerEvents = 'none';
    
     viewbcastemp.readOnly = true;
     
     tnsdebit.readOnly = true;
     tnscredit.readOnly = true;
     viewbcasdesc.readOnly = true;
     viewbcasamount.readOnly = true;
     viewbcasremarks.readOnly = true;


    if(Debit!== "0.00"){
            viewbcasamount.value = Debit;

      if (viewbcasacode.value === 'MNL-5999' ||
         viewbcasacode.value === 'MNL-FTHO' || 
         viewbcasacode.value === 'MNL-FTAREA' ){        
    
            const acctable = [
                { name: "Cash on hand", norm: "Debit", Amount: Debit },
                { name: "Due to/from", category: "Credit", Amount: Debit},
               
              ];    

        } 
        
        
        
        
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
                    { name: "Due to/from", category: "Debit", Amount: Credit},
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
    

    
         const tagstable = [
            { name: "Branch", Id: trId },
            { name: "Due Reference ID", Id: refid },    
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
     
     }




    viewCell.appendChild(viewbtn);



bcascloseconfirm()

}


function bcasclosebrselect(){


  document.getElementById('bcastransactionbranchselection').classList.remove('show');

       viewbcastn.value = ''
     viewbcasacode.value = ''
     viewbcasacode.style.pointerEvents = 'auto';
     viewbcastemp.value = ''
     viewbcasamount.value = '0.00';
     viewbcasamount.style.pointerEvents = 'none';     
     tnsdebit.value = '0.00';
     tnscredit.value = '0.00';
     viewbcasdesc.value = ''
     viewbcasremarks.value = ''
     viewbcasremarks.style.pointerEvents = 'none';    
    viewbcasamount.readOnly = false;
     viewbcasremarks.readOnly = false;

      tagsBody.innerHTML = '';
      tableBody.innerHTML = '';

}