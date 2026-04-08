const bcasrev = document.getElementById('bcas-btn-rev-yes');
const bcassave = document.getElementById('bcas-btn-save-yes');
const bcassavenew = document.getElementById('bcas-btn-savenew-yes');


function reversebcastransaction(){
 document.getElementById('bcastransactionconfirmation').classList.add('show');
bcasrev.style.display = 'block'
bcassave.style.display = 'none'
bcassavenew.style.display = 'none'

 document.getElementById('bcastransactionmessage').textContent =   "Are you sure you want to reverse this transaction?" 
}


function bcascloseconfirm(){
 document.getElementById('bcastransactionconfirmation').classList.remove('show');
  document.getElementById('bcastransactionbranchselection').classList.remove('show');

}




function reverseconfirm(){
bcascloseconfirm()
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
   
  tableBody.rows[tableBody.rows.length - 1].style.color = 'green'


const visibleRowCount = Array.from(tableBody.rows)
  .filter(row => row.style.display !== 'none')
  .length;

NoCell.textContent = visibleRowCount;


for (let i = 0; i < tableBody.rows.length; i++) {
  const cellValue = tableBody.rows[i].cells[1].textContent.trim();
  if (cellValue === viewbcastn.value.trim()) {
    tableBody.rows[i].cells[2].textContent = 'Reversed';
    tableBody.rows[i].style.color = 'red';
  }
}

statusCell.textContent  = 'Correction'


        if (viewbcasacode.value === 'MNL-FTOB' || viewbcasacode.value === 'MNL-FTHO' || viewbcasacode.value === 'MNL-FTAREA'){
                 if (viewbcasacode.value === 'MNL-FTOB'){
                  templateCell.textContent = 'Expense due to other branch'

                  }else if (viewbcasacode.value === 'MNL-FTHO'){
                templateCell.textContent = 'Expense due to Head Office'

                  }else {

                  templateCell.textContent = 'Expense due to Area Office'

                  }

     
        creditCell.textContent ='0.00' 
        debitCell.textContent = viewbcasamount.value
        const Amount = parseFloat(debitCell.textContent.replace(/,/g, ''));          
        const prevtbalance = parseFloat(xrow.cells[6].textContent.replace(/,/g, ''));       
        const totalBalance = prevtbalance - Amount; 
        const roundedBalance = Math.round(totalBalance * 100) / 100; // This rounds to 2 decimal places     
        const formattedBalance = roundedBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        balanceCell.textContent = formattedBalance;
        
       } else if (viewbcasacode.value === 'MNL-5015'){
        templateCell.textContent = 'Other Income-Pawnshop' 
        creditCell.textContent = viewbcasamount.value
        debitCell.textContent = '0.00'
        const Amount = parseFloat(creditCell.textContent.replace(/,/g, ''));          
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
         viewbcasref.value = "AAA"+paddedNumber+refdates
    
    

      
      trev.style.display = 'none'      
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






    if(Credit!== "0.00"){
            viewbcasamount.value = Debit;
    
            const acctable = [
                { name: "Cash on hand", norm: "Debit", Amount: Credit },
                { name: "Due to/from", category: "Credit", Amount: Credit},
               
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
    
        }else if (Debit!==  "0.00"){
                viewbcasamount.value = Credit
              
                const acctable = [
                    { name: "Cash on hand", norm: "Debit", Amount: Debit },
                    { name: "Due to/from", category: "Credit", Amount: Debit},
                                 
                   
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
