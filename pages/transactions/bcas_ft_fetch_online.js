

function fetchFTData() {
  const rawDate = document.getElementById("bcasftDate").value;
  const branchInput = document.getElementById("Bcasbranch").value.trim().toUpperCase();
  const sourceTable = document.getElementById("ft-data-table").getElementsByTagName("tbody")[0];
  const destTable = document.getElementById("BCASfttable").getElementsByTagName("tbody")[0];



    if (rawDate) {
    const [year, month, day] = rawDate.split("-");
    dateInput = `${month}/${day}/${year}`;
    }

  // Get all existing transaction IDs in BCASfttable to prevent duplicates
  const existingIDs = Array.from(destTable.rows).map(
    row => row.cells[4]?.innerText.trim()
  );

   const existingStats = Array.from(destTable.rows).map(
    row => row.cells[10]?.innerText.trim()
  );


  //console.log("Existing IDs in BCASfttable:", existingIDs);

  let addedCount = 0;


  for (let row of sourceTable.rows) {
    const createdDate = row.cells[1].innerText.trim();
    const transactionID = row.cells[3].innerText.trim();
    const origin = row.cells[5].innerText.trim().toUpperCase();
    const destination = row.cells[6].innerText.trim().toUpperCase();
    const trnxtype = row.cells[2].innerText.trim().toUpperCase();
    const status = row.cells[10].innerText;
    // Condition: same date AND (origin or destination match)


      
 if (!(createdDate === dateInput && (origin === branchInput || destination === branchInput))) {
    continue;
  }

  // Case 1: Source is Voided → skip if not existing
  if (status === 'Voided' && !existingIDs.includes(transactionID)) {
    continue;
  }

  // Case 2: Source is Voided and destination has same ID but still Pending → update it
  if (status === 'Voided' || status === 'Pending-Void' && existingIDs.includes(transactionID)) {
    const destIndex = existingIDs.indexOf(transactionID);
    if (existingStats[destIndex] === 'Pending' || existingStats[destIndex] === 'Active') {
      destTable.rows[destIndex].cells[10].innerText = 'Voided';
      destTable.rows[destIndex].cells[11].innerText = 'Updated';
      row.cells[10].innerText = 'Voided';

      const button = destTable.rows[destIndex].cells[0].querySelector('button')
            button.disabled = true; // Disable the button if the 10th column is not 'Pending'
            button.style.backgroundColor = 'gray'
            button.style.borderColor = 'gray'
            button.style.cursor = 'not-allowed'
        
           if( destTable.rows[destIndex].cells[14].textContent !== '' ) {


           const bcastranx =  document.getElementById('BCAStransactions').getElementsByTagName('tbody')[0];
            for (let btrow of bcastranx.rows) {

              if (destTable.rows[destIndex].cells[14].textContent === btrow.cells[10].innerText){
                 
                  btrow.cells[2].textContent = 'Reversed'  
                  btrow.style.color = 'red'   
              }

             }

            reversedvoidedft()

           }
     
    }
    continue;
  }

  // Case 3: New valid record (Pending or In-Transit)
  if (!existingIDs.includes(transactionID) && (status === 'Pending' || status === 'In-Transit')) {
    
    const newRow = destTable.insertRow();
    const retryCell = newRow.insertCell(0);
    const copyCell = newRow.insertCell(1);
    const dateCell = newRow.insertCell(2);
    const typeCell = newRow.insertCell(3);
    const tnsIdCell = newRow.insertCell(4);   
    const originCell = newRow.insertCell(5);
    const destCell = newRow.insertCell(6);
    const amountCell = newRow.insertCell(7);
    const courierCell = newRow.insertCell(8);
    const memoCell = newRow.insertCell(9);
    const statusCell = newRow.insertCell(10);
    const upstatusCell = newRow.insertCell(11);
    const timeupcell = newRow.insertCell(12);
    const voidCell = newRow.insertCell(13);
    voidCell.style.display = "none";
    const refCell = newRow.insertCell(14);
   // refCell.style.display = "none";
    const noCell = newRow.insertCell(15);
    noCell.style.display = "none";
    const areaCell = newRow.insertCell(16);
    areaCell.style.display = "none";



    dateCell.textContent = row.cells[1].textContent;

    if(row.cells[6].textContent === branchInput  &&  row.cells[2].textContent === 'Send'){
     typeCell.textContent = 'Receive';

    }else{

     typeCell.textContent  = 'Withdraw';
    }

    if(row.cells[5].textContent === branchInput ){
      typeCell.textContent  = row.cells[2].textContent;
    }

    tnsIdCell.textContent = row.cells[3].innerText;
    originCell.textContent = row.cells[5].innerText;
    destCell.textContent = row.cells[6].innerText;
    amountCell.textContent = row.cells[4].innerText;
    courierCell.textContent = row.cells[7].innerText;
    memoCell.textContent = row.cells[8].innerText;
    statusCell.textContent = 'Pending';
    upstatusCell.textContent = 'Not Updated';
    timeupcell.textContent = '--';
    voidCell.textContent = '';
    refCell.textContent = '';
    noCell.textContent = destTable.rows.length;
    areaCell.textContent = 'ZAA'
    




      existingIDs.push(transactionID); // mark as added
      addedCount++;




    const retry = document.createElement('button');  
      retry.type = "button";
      retry.className = "custom-button-bcaseye";
      retry.style.width = '40px';    
      retry.style.cursor = 'pointer';
      retry.innerHTML = '<i class="fa-solid fa-cloud-arrow-up"></i>'; 
      retry.onclick = function (event) { 
        event.preventDefault();
        document.getElementById('bcasftretryconfirmation').classList.add('show');
        const retryrow = event.target.closest('tr');   
        const tableBody = retryrow.parentNode;
        const rowIndex = Array.from(tableBody.children).indexOf(retryrow) + 1;      
        sessionStorage.setItem("retryrow", rowIndex); // to post in the sessionStorage the fttablerow where the retrybutton is located
        document.getElementById('bcasretrymessage').textContent =   "You are Uploading " + 
        xtableBody.rows[rowIndex].cells[3].innerText + " Transaction. Do you want to proceed?" 
    }

    const copy = document.createElement('button');  
        copy.type = "button";
        copy.className = "custom-button-bcaseye";
        copy.style.width = '40px';
        copy.style.cursor = 'pointer';
        copy.innerHTML = '<i  class= "fas fa-copy"></i>';
        copy.onclick = function (event) { 
             event.preventDefault();

      const buttonrow = event.target.closest('tr');     
      const row = buttonrow
  
      
      let rowData = "";
      const qdate = row.cells[2].innerText; // Get the specific cell (0-based index)
      const qtype = row.cells[3].innerText; // Get the specific cell (0-based index)
      const qid = row.cells[4].innerText; // Get the specific cell (0-based index)
      const qbranch = document.getElementById('Bcasbranch').value; // Get the specific cell (0-based index)
  
      var space = document.querySelectorAll('p');
  
      // Loop through each cell in the row
      for (let i = 1; i < row.cells.length; i++) { // Exclude the last cell with the button
          rowData += row.cells[i].innerText + "|"; // Concatenate cell data with space
      }   

      let encodedData = btoa(rowData); // btoa() encodes the string to Base64      
       let encodedText = "Offline update code of: " + qbranch + " | " +  qtype + " | " + qid + " | " + qdate ;  
       let modifiedText = encodedText.replace( qdate, qdate + "\n\n" +  encodedData );
  
 
      if (modifiedText.trim() === "") {
          alert("No data to copy!");
          return;
      }      

      navigator.clipboard.writeText(modifiedText).then(() => {
            showNotification();
            xnotification.style.bottom = '75px';
            xnotification.style.right = '75px';
            xnotification.style.width =  '300px';      
            xnotify.innerHTML = '<i class="fa-solid fa-circle-info" style="margin-right:10px; font-size:20px; color:white"></i>' + 
            "Offline update code is copied to the clipboard!."
           
      }).catch(err => {
          console.error("Error copying text: ", err);
      });

   }

    retryCell.appendChild(retry);
    copyCell.appendChild(copy);   

 }


  }


   bcasclosefetch() 

    showNotification(); 

            // Adjust notification styles
            xnotification.style.bottom = '75px';
            xnotification.style.right = '75px';
            xnotification.style.width = '300px';  
            
           if (addedCount > 0){
            xnotification.style.backgroundColor = 'green';
           } else{
            xnotification.style.backgroundColor = 'orange';
           }
           

            // Set notification text
            xnotify.innerHTML = '<i class="fa-solid fa-circle-info" style="margin-right:10px; font-size:20px; color:white"></i>' + 
            (addedCount > 0 ? `${addedCount} record(s) added successfully.`
             : `No new records found.`);

}

function bcasclosefetch(){
    document.getElementById('bcasftfetchconfirmation').classList.remove('show');
}

function bcasconfirmfetch(){
  document.getElementById('bcasftfetchconfirmation').classList.add('show');
  fetchmessage.innerText = 'You are going to fetch the fund transfer transaction from the server, the process may take a few seconds. Continue anyway?'

}



function reversedvoidedft() { 



    const xtableBody = document.getElementById('BCASfttable')
    const rwindex = sessionStorage.getItem("retryrow") // to get the fttablerow where the retrybutton is located    
    const row = xtableBody.rows[rwindex]  // to find the fttable  row in ft table where the retrybutton is located 

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
    const fttrtype = row.cells[3].textContent
    //xrow.cells[6].style.textAlign = 'right';   

const visibleRows = Array.from(tableBody.rows).filter(
  row => row.style.display !== "none"
);


 const ftvisibleRowsCount = Array.from(xtableBody.rows)
  .filter(row => row.style.display !== 'none').length;
  
  
NoCell.textContent = visibleRows.length;
    //NoCell.textContent = tableBody.rows.length



statusCell.textContent  = 'Correction'
   // row.cells[14].textContent
for (let i = 0; i < tableBody.rows.length; i++) {

  if (tableBody.rows[i].cells[2].textContent === 'Correction') {   
    tableBody.rows[i].style.color = 'green';
    }
  
}



    if (fttrtype === 'Send'){
        templateCell.textContent = 'Fund Transfer-Send'
        debitCell.textContent = row.cells[7].textContent
        creditCell.textContent = '0.00'
        const Amount = parseFloat(debitCell.textContent.replace(/,/g, ''));          
        const prevtbalance = parseFloat(xrow.cells[6].textContent.replace(/,/g, ''));       
        const totalBalance = prevtbalance + Amount; 
        const roundedBalance = Math.round(totalBalance * 100) / 100; // This rounds to 2 decimal places     
        const formattedBalance = roundedBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        balanceCell.textContent = formattedBalance;
        
    } else if (fttrtype === 'Receive'){
        templateCell.textContent = 'Fund Transfer-Receive' 
        debitCell.textContent = '0.00'
        creditCell.textContent = row.cells[7].textContent
        const Amount = parseFloat(creditCell.textContent.replace(/,/g, ''));          
        const prevtbalance = parseFloat(xrow.cells[6].textContent.replace(/,/g, ''));       
        const totalBalance = prevtbalance - Amount; 
        const roundedBalance = Math.round(totalBalance * 100) / 100; // This rounds to 2 decimal places     
        const formattedBalance = roundedBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        balanceCell.textContent = formattedBalance;

    } else if (fttrtype === 'Deposit'){
        templateCell.textContent = 'Fund Transfer-Deposit' 
        debitCell.textContent = row.cells[7].textContent
        creditCell.textContent = '0.00' 
        const Amount = parseFloat(debitCell.textContent.replace(/,/g, ''));          
        const prevtbalance = parseFloat(xrow.cells[6].textContent.replace(/,/g, ''));       
        const totalBalance = prevtbalance + Amount; 
        const roundedBalance = Math.round(totalBalance * 100) / 100; // This rounds to 2 decimal places     
        const formattedBalance = roundedBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        balanceCell.textContent = formattedBalance;

    }else{
        templateCell.textContent = 'Fund Transfer-Withdraw'
        debitCell.textContent = '0.00'
        creditCell.textContent = row.cells[7].textContent
        const Amount = parseFloat(creditCell.textContent.replace(/,/g, ''));          
        const prevtbalance = parseFloat(xrow.cells[6].textContent.replace(/,/g, ''));       
        const totalBalance = prevtbalance - Amount; 
        const roundedBalance = Math.round(totalBalance * 100) / 100; // This rounds to 2 decimal places     
        const formattedBalance = roundedBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        balanceCell.textContent = formattedBalance;
 
    }   
    
    
   
    remarksCell.textContent = row.cells[9].textContent
    uploadstatCell.textContent = 'Not Uploaded'
    dateCell.textContent  = row.cells[2].textContent
    dateCell.style.display = 'none' 

    const today =   new Date(dateCell.textContent); 
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    const ftrefformattedDate = `${month}${day}${year}`;
    const ftrum =  ftvisibleRowsCount - 1 
    const fttrnum = ftrum.toString().padStart(3, '0');
    row.cells[14].innerText = "FT-" + Bcasbranch.value + ftrefformattedDate + "-" + fttrnum + "-Voided"
    row.cells[14].style.display = "none"

    tridCell.textContent =  row.cells[4].textContent
    console.log(row.cells[13].textContent)
    tridCell.style.display = 'none'
    ftidCell.textContent = row.cells[14].textContent
    ftidCell.style.display = 'none'  



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
            const trev =  document.getElementById('trev');
          const tsave =  document.getElementById('tsave');
         const tsavenew =  document.getElementById('tsavenew');
        
        
         const tdate =   formatDate(trnxDate.value);
         const tnsnum = row.cells[1].innerText          
         const paddedNumber = padNumber(tnsnum, 5);
         const AcctName = row.cells[3].innerText  
         const AcctCode = AcctName.replace(/[^A-Z-]/g, '');
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

      trev.style.display = 'none'
      tsave.style.display = 'none'
      tsavenew.style.display = 'none'

    
    
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
    

    
         const tagstable = [
            { name: "Transaction ID", Id: trId },
            { name: "FT Reference ID", Id: refid },    
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

    // const fttbleupdate = document.getElementById('ft-data-table').getElementsByTagName('tbody')[0]; 
    // const urows = fttbleupdate.rows[utableBody.rows.length - 1]
    const utableBody = document.getElementById('frombcasfttable').getElementsByTagName('tbody')[0]; 
    const urow = utableBody.rows[utableBody.rows.length - 1] 
    const unewRow = utableBody.insertRow();    
    const udateCell = unewRow.insertCell(0);
    const utypeCell = unewRow.insertCell(1);
    const utridCell = unewRow.insertCell(2);
    const uorigCell = unewRow.insertCell(3);
    const udestCell = unewRow.insertCell(4);   
    const uamountCell = unewRow.insertCell(5);
    const ucourierCell = unewRow.insertCell(6);
    const uremarksCell = unewRow.insertCell(7);
    const uftidcodeCell = unewRow.insertCell(8);
    const areaCell = unewRow.insertCell(9);  
    const TransactionDate = unewRow.insertCell(10);
    const trNo = unewRow.insertCell(11);
    const trStatus = unewRow.insertCell(12);
    const trAccountName = unewRow.insertCell(13);
    const trDebit = unewRow.insertCell(14);
    const trCredit = unewRow.insertCell(15);
    const trRemarks = unewRow.insertCell(16);
    const trUploadTime = unewRow.insertCell(17);
    urow.cells[5].style.textAlign = 'right';

    udateCell.textContent  = row.cells[2].textContent    
    utypeCell.textContent = row.cells[3].textContent  
    utridCell.textContent = row.cells[4].textContent 
    uorigCell.textContent  = row.cells[5].textContent    
    udestCell.textContent = row.cells[6].textContent  
    uamountCell.textContent = row.cells[7].textContent 
    ucourierCell.textContent = row.cells[8].textContent 
    uremarksCell.textContent = row.cells[9].textContent   
    uftidcodeCell.textContent = row.cells[14].textContent
    areaCell.textContent = row.cells[16].textContent

    





   

}
