const decryptButton = document.getElementById('paste-ft');
const ftselectedtype = document.getElementById('selectedtype');
const encryptedInput = document.getElementById('encryptedInput');
const errorMessage = document.getElementById('alertmessage');
const upateftbcas = document.getElementById('upbcasft');


function updatebcasft(BCASoverlayId){   
    navigator.clipboard.readText().then(function(text) {  
        encryptedInput.value = text;
        var xtable = document.getElementById("BCASfttable");
        var updaterow = xtable.getElementsByTagName("tr");
 
        if (!text) {
            errorMessage.textContent = "Clipboard is empty. Please copy some encrypted data.";
            return;
        }

        try {        
            const decryptedData2 = decodeBase64(text);     // Decrypt the Base64 encoded data       
            const fields = decryptedData2.split("|");      // Split the decrypted data into multiple fields based on the separator (e.g., ":")       
           
            const ftid = fields[14]
            sessionStorage.setItem("ftidup", ftid );

            // Check if the number of split parts is sufficient for the fields 
            if (fields.length < 8) { 
            alert("Copied data is not in the standard format."); 
            }   
      
             for (var i = 1; i < updaterow.length; i++) {
                   var cellupdte = updaterow[i].getElementsByTagName("td");

                if (cellupdte[4].innerText === fields[2]  ){ 

                    ft8.value = cellupdte[2].innerText
                    ft9.value = cellupdte[3].innerText
                    ft10.value = cellupdte[7].innerText
                    ft11.value = cellupdte[8].innerText
                    
                    ft13.value = cellupdte[9].innerText
                    ft14.value = cellupdte[4].innerText
                    ft15.value = cellupdte[6].innerText
                    ft16.value = cellupdte[10].innerText             


                    if ( cellupdte[3].innerText === 'Receive'  && fields[1] === 'Send'){
                       
                        if (fields[9] ==='Received' && cellupdte[10].innerText === 'Pending' )
                            {
                            
                            ft17.value = "Active"

                        } else  if (fields[9] ==='Received' && cellupdte[10].innerText === 'Active' )
                            {       
                      
                            ft17.value =  "Not Allowed" 
                               document.getElementById(BCASoverlayId).classList.add('show');
                            errorMessage.textContent =  "This record is Already Updated to " + fields[9] + " | " + cellupdte[10].innerText   
                            upateftbcas.disabled = true;                                                          

                        } else  if (fields[9] ==='Pending' && cellupdte[10].innerText === 'Pending' 
                            && cellupdte[11].innerText === 'Not Updated'){ 
                            
                            ft17.value =  "Not Allowed" 
                               document.getElementById(BCASoverlayId).classList.add('show');
                            errorMessage.textContent =  "This record is still having " + fields[9] + 
                            " Status in the server, the Sending branch must update first the transaction"
                            upateftbcas.disabled = true;   

                        } else  if (fields[9] ==='Voided-' + cellupdte[3].innerText ){    //to avoid update using selfcode
                            
                            ft17.value =  "Not Allowed" 
                               document.getElementById(BCASoverlayId).classList.add('show');
                            errorMessage.textContent =  "This record is still having " + fields[9] + 
                            " Status in the server, Area officer must approved the voiding of transaction"
                            upateftbcas.disabled = true;   

                        } else  if (fields[9] ==='Received' && cellupdte[10].innerText === 'Voided'){ 
                         
                            ft17.value = "Not Allowed" 
                            document.getElementById(BCASoverlayId).classList.add('show');
                            errorMessage.textContent =  "This record is not yet updated to Voided Status in the server, Updating is not allowed"
                            upateftbcas.disabled = true; 
                            
                            

                        }else if ((fields[9] === 'Pending-Void' || fields[9] === 'Voided') && cellupdte[10].innerText !== 'Voided'){                 
                                             
                            ft17.value = "Voided"
                            
                        } else if ((fields[9] === 'Pending-Void' || fields[9] === 'Voided')  && cellupdte[10].innerText === 'Voided' ){
                         
                            ft17.value = "Not Allowed"
                           
                            upateftbcas.disabled = true;   

                            document.getElementById(BCASoverlayId).classList.add('show');
                            errorMessage.textContent =  "Record is having " + fields[9] + " Status, you are not allowed to update this record" 

                        }  else {

                          //document.getElementById(BCASoverlayId).classList.add('active');
                           // errorMessage.textContent =  "Record is having " + fields[9] + " Status, you are not allowed to update this record" 

                        } //end of if 1/2/1                            
                    
                    } else if ( cellupdte[3].innerText === 'Send'  && fields[1] === 'Send'){
                   
                        if (fields[9] ==='In-Transit' && cellupdte[10].innerText === 'Pending' 
                            && cellupdte[11].innerText === 'Not Updated' ){

                            ft17.value = "Active"

                        } else  if (fields[9] ==='In-Transit' && cellupdte[10].innerText === 'Active' 
                            && cellupdte[11].innerText === 'Updated' ){ 
                     
                           ft17.value = "Not Allowed"

                             document.getElementById(BCASoverlayId).classList.add('show');
                            errorMessage.textContent =  "The record you've enter is Already Updated to " + fields[9] + " | " + cellupdte[10].innerText

                           upateftbcas.disabled = true;   
                                                          
                        } else if ((fields[9] === 'Pending-Void' || fields[9] === 'Voided')  && cellupdte[10].innerText  !== 'Voided' ){
                                                            
                            ft17.value = "Voided"

                         } else if ((fields[9] === 'Pending-Void' || fields[9] === 'Voided')  && cellupdte[10].innerText === 'Voided' 
                            && cellupdte[11].innerText === 'Updated' ){                               
                      
                            ft17.value = "Not Allowed"

                            document.getElementById(BCASoverlayId).classList.add('show');
                            errorMessage.textContent =  "This record is Already Updated to " + fields[9] + " | " + cellupdte[10].innerText
                            upateftbcas.disabled = true; 
                            
                        } else  if (fields[9] ==='Voided-' + cellupdte[3].innerText ){    //to avoid update using selfcode
                            
                            ft17.value =  "Not Allowed" 
                               document.getElementById(BCASoverlayId).classList.add('show');
                            errorMessage.textContent =  "This record is still having " + fields[9] + 
                            " Status in the server, Area officer must approved the voiding of transaction"
                            upateftbcas.disabled = true;  

                         }  else {                        

                            ft17.value = "Not Allowed"

                            document.getElementById(BCASoverlayId).classList.add('show');
                            errorMessage.textContent = "This record is having " + fields[9] + " Status."
                            upateftbcas.disabled = true;   
                         }  //end of if 1/2/2 

                      } else if (cellupdte[3].innerText === fields[1] && ( fields[1] === 'Deposit' ||fields[1] === 'Withdraw')){               
               

                            if (fields[9] ==='In-Transit' && cellupdte[10].innerText === 'Pending' 
                                && cellupdte[11].innerText === 'Not Updated' ){                           
                                            
                                ft12.value = cellupdte[9].innerText                       
                                ft17.value = "Active"

                            } else  if (fields[9] ==='In-Transit' && cellupdte[10].innerText === 'Active' 
                                    && cellupdte[11].innerText === 'Updated' ){ 
                            
                                ft17.value = "Not Allowed"

                               document.getElementById(BCASoverlayId).classList.add('show');
                               errorMessage.textContent ="This record is Already Updated to " + fields[9] + " | " + cellupdte[10].innerText
                                upateftbcas.disabled = true;   
                                                                
                            }else if ((fields[9] === 'Pending-Void' || fields[9] === 'Voided')  && cellupdte[10].innerText !== 'Voided'){
                                                                    
                                    ft17.value = "Voided"
                            } else if ((fields[9] === 'Pending-Void' || fields[9] === 'Voided')  && cellupdte[10].innerText === 'Voided' ){                     
                            
                                    ft17.value = "Not Allowed"

                                document.getElementById(BCASoverlayId).classList.add('show');
                                errorMessage.textContent = "This record is Already Updated to " + fields[9] + " | " + cellupdte[10].innerText 
                                    upateftbcas.disabled = true;  

                            } else  if (fields[9] ==='Voided-' + cellupdte[3].innerText ){    //to avoid update using selfcode
                            
                                    ft17.value =  "Not Allowed" 
                                       document.getElementById(BCASoverlayId).classList.add('show');
                                    errorMessage.textContent =  "This record is still having " + fields[9] + 
                                    " Status in the server, Area officer must approved the voiding of transaction"
                                    upateftbcas.disabled = true;  
        
                            } else {
                                document.getElementById(BCASoverlayId).classList.add('show');
                                errorMessage.textContent =   "This record is having " + fields[9] + " Status."
                                    upateftbcas.disabled = true;  
                                    
                            } //end of if 1/2/3                            
                    
                        }   //end of if 1/2
                  } else {
                    //alert(cellupdte[4].innerText + " "  + fields[3] );
                  }       // end of if 1
                }  //end of for

        } catch (error) {   //catch try
            console.error("Error while decrypting:", error);
            alert("Invalid data format");
        }   //try
     

    }).catch(function(err) {  // catch navigator
        console.error("Failed to read clipboard contents: ", err);
        alert("Failed to read clipboard contents.");
    }); // navigator


} // end of function




function confirmupdatebcasft(event){

    document.getElementById('bcasftupdateconfirmation').classList.add('show');
    document.getElementById('bcasupatemessage').textContent =   "Are you sure you want to save the status change in this Transaction?"
}

function bcascloseftupdate() {

    document.getElementById('bcasftupdateconfirmation').classList.remove('show');

}

function bcasconfirmedupdate (){

const ft16 = document.getElementById('ft16');
const ft17 = document.getElementById('ft17');
const ft14 = document.getElementById('ft14');
const Bcasbranch = document.getElementById('Bcasbranch');

    const now = new Date();
    const formattedDateTime = now.toLocaleString();
    const refformattedDate = String(now.getMonth()+1).padStart(2,'0') + String(now.getDate()).padStart(2,'0') + now.getFullYear();

    const bcasftid = sessionStorage.getItem("ftidup"); 
    const TransactionTable = document.getElementById('BCAStransactions').getElementsByTagName('tbody')[0];    
    const tableid = document.getElementById('BCASfttable')
    const row = tableid.getElementsByTagName("tr");
    const xrow = TransactionTable.rows[TransactionTable.rows.length - 1]    
     
    const newRow = TransactionTable.insertRow();    
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


const visibleRows = Array.from(TransactionTable.rows).filter(
  row => row.style.display !== "none"
);

if ((ft16.value === 'Pending' && ft17.value == 'Active' ) || (ft16.value === 'Active' && ft17.value == 'Voided' ))  {
   // xrow.cells[6].style.textAlign = 'right';  



    for (var i = 1; i < row.length; i++) {

        var cellssearchid = row[i].getElementsByTagName("td");
        const fttrtype = cellssearchid[3].textContent
        const fttrnum = cellssearchid[15].textContent   


           if( cellssearchid[14].textContent !== '' ) {


           const bcastranx =  document.getElementById('BCAStransactions').getElementsByTagName('tbody')[0];
            for (let btrow of bcastranx.rows) {

              if (cellssearchid[14].textContent === btrow.cells[10].innerText){
                 
                  btrow.cells[2].textContent = 'Reversed'  
                  btrow.style.color = 'red'   
              }

             }

   
           }



    if (ft14.value === cellssearchid[4].textContent ){
          console.log(cellssearchid[4].textContent)
                if (ft17.value === 'Active'){
                cellssearchid[10].textContent = 'Active'
                cellssearchid[11].textContent = 'Updated'
                cellssearchid[12].textContent = formatDatetime(new Date());
                } else {
                cellssearchid[10].textContent = 'Voided'
                cellssearchid[11].textContent = 'Updated'
                cellssearchid[12].textContent = formatDatetime(new Date());
                }



    NoCell.textContent = visibleRows.length;
  
       
    if (fttrtype === 'Send'){
         console.log(cellssearchid[3].textContent)
        if (cellssearchid[10].textContent === 'Active' ){
            statusCell.textContent  = 'Active'
            templateCell.textContent = 'Fund Transfer-Send'
            debitCell.textContent ='0.00'
            creditCell.textContent = cellssearchid[7].textContent
            const Amount = parseFloat(creditCell.textContent.replace(/,/g, ''));          
            const prevtbalance = parseFloat(xrow.cells[6].textContent.replace(/,/g, ''));       
            const totalBalance = prevtbalance - Amount; 
            const roundedBalance = Math.round(totalBalance * 100) / 100; // This rounds to 2 decimal places     
            const formattedBalance = roundedBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            balanceCell.textContent = formattedBalance;
            cellssearchid[14].innerText = "FT-" + Bcasbranch.value + refformattedDate + "-" + fttrnum + "-Active"

        } else if (cellssearchid[10].textContent === 'Voided'){
            statusCell.textContent  = 'Correction'            
            templateCell.textContent = 'Fund Transfer-Send' 
            debitCell.textContent = cellssearchid[7].textContent
            creditCell.textContent = '0.00'
            const Amount = parseFloat(debitCell.textContent.replace(/,/g, ''));          
            const prevtbalance = parseFloat(xrow.cells[6].textContent.replace(/,/g, ''));       
            const totalBalance = prevtbalance + Amount; 
            const roundedBalance = Math.round(totalBalance * 100) / 100; // This rounds to 2 decimal places     
            const formattedBalance = roundedBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            balanceCell.textContent = formattedBalance;
            cellssearchid[14].innerText = "FT-" + Bcasbranch.value + refformattedDate + "-" + fttrnum + "-Voided"

        }
        
    } else if (fttrtype === 'Receive'){

        if (cellssearchid[10].textContent === 'Active' ){
            statusCell.textContent  = 'Active'
            templateCell.textContent = 'Fund Transfer-Receive' 
            debitCell.textContent = cellssearchid[7].textContent
            creditCell.textContent = '0.00'
            const Amount = parseFloat(debitCell.textContent.replace(/,/g, ''));          
            const prevtbalance = parseFloat(xrow.cells[6].textContent.replace(/,/g, ''));       
            const totalBalance = prevtbalance + Amount; 
            const roundedBalance = Math.round(totalBalance * 100) / 100; // This rounds to 2 decimal places     
            const formattedBalance = roundedBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            balanceCell.textContent = formattedBalance;
            cellssearchid[14].innerText = "FT-" + Bcasbranch.value + refformattedDate + "-" + fttrnum + "-Active"


        } else  if (cellssearchid[10].textContent === 'Voided'){
             statusCell.textContent  = 'Correction'    
            templateCell.textContent = 'Fund Transfer-Receive'
            debitCell.textContent ='0.00'
            creditCell.textContent = cellssearchid[7].textContent
            const Amount = parseFloat(creditCell.textContent.replace(/,/g, ''));          
            const prevtbalance = parseFloat(xrow.cells[6].textContent.replace(/,/g, ''));       
            const totalBalance = prevtbalance - Amount; 
            const roundedBalance = Math.round(totalBalance * 100) / 100; // This rounds to 2 decimal places     
            const formattedBalance = roundedBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            balanceCell.textContent = formattedBalance;
            cellssearchid[14].innerText = "FT-" + Bcasbranch.value + refformattedDate + "-" + fttrnum + "-Voided"
            

        }

    } else if (fttrtype === 'Deposit'){

        if (cellssearchid[10].textContent === 'Active'){
            statusCell.textContent  = 'Active'

            templateCell.textContent = 'Fund Transfer-Deposit' 
            debitCell.textContent = '0.00'
            creditCell.textContent = cellssearchid[7].textContent
            const Amount = parseFloat(creditCell.textContent.replace(/,/g, ''));          
            const prevtbalance = parseFloat(xrow.cells[6].textContent.replace(/,/g, ''));       
            const totalBalance = prevtbalance - Amount; 
            const roundedBalance = Math.round(totalBalance * 100) / 100; // This rounds to 2 decimal places     
            const formattedBalance = roundedBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            balanceCell.textContent = formattedBalance;
            cellssearchid[14].innerText = "FT-" + Bcasbranch.value + refformattedDate + "-" + fttrnum + "-Active"
        
        } else  if (cellssearchid[10].textContent === 'Voided') {
             statusCell.textContent  = 'Correction'    
            templateCell.textContent = 'Fund Transfer-Deposit'
            debitCell.textContent = cellssearchid[7].textContent
            creditCell.textContent = '0.00'
            const Amount = parseFloat(debitCell.textContent.replace(/,/g, ''));          
            const prevtbalance = parseFloat(xrow.cells[6].textContent.replace(/,/g, ''));       
            const totalBalance = prevtbalance + Amount; 
            const roundedBalance = Math.round(totalBalance * 100) / 100; // This rounds to 2 decimal places     
            const formattedBalance = roundedBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            balanceCell.textContent = formattedBalance;
            cellssearchid[14].innerText = "FT-" + Bcasbranch.value + refformattedDate + "-" + fttrnum + "-Voided"
            



        }


    }else if (fttrtype === 'Withdraw') {
        
        if (cellssearchid[10].textContent === 'Active'){
            statusCell.textContent  = 'Active'

            templateCell.textContent = 'Fund Transfer-Withdraw'
            debitCell.textContent = cellssearchid[7].textContent
            creditCell.textContent = '0.00'
            const Amount = parseFloat(debitCell.textContent.replace(/,/g, ''));          
            const prevtbalance = parseFloat(xrow.cells[6].textContent.replace(/,/g, ''));       
            const totalBalance = prevtbalance + Amount; 
            const roundedBalance = Math.round(totalBalance * 100) / 100; // This rounds to 2 decimal places     
            const formattedBalance = roundedBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            balanceCell.textContent = formattedBalance;
             
            cellssearchid[14].innerText = "FT-" + Bcasbranch.value + refformattedDate + "-" + fttrnum + "-Active"
            

        } else  if (cellssearchid[10].textContent === 'Voided') {
             statusCell.textContent  = 'Correction'    
            templateCell.textContent = 'Fund Transfer-Withdraw'
            debitCell.textContent = '0.00'
            creditCell.textContent = cellssearchid[7].textContent
            const Amount = parseFloat(creditCell.textContent.replace(/,/g, ''));          
            const prevtbalance = parseFloat(xrow.cells[6].textContent.replace(/,/g, ''));       
            const totalBalance = prevtbalance - Amount; 
            const roundedBalance = Math.round(totalBalance * 100) / 100; // This rounds to 2 decimal places     
            const formattedBalance = roundedBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            balanceCell.textContent = formattedBalance;
          
           cellssearchid[14].innerText = "FT-" + Bcasbranch.value + refformattedDate + "-" + fttrnum + "-Voided"

        }
 
    }   







    
    
for (let i = 0; i < TransactionTable.rows.length; i++) {

  if (TransactionTable.rows[i].cells[2].textContent === 'Correction') {   
    TransactionTable.rows[i].style.color = 'green';
    }
  
}

   
    remarksCell.textContent = cellssearchid[9].textContent
    uploadstatCell.textContent = 'Not Uploaded'
    dateCell.textContent  = formatDate(new Date());
    dateCell.style.display = 'none' 

 


    tridCell.textContent =  cellssearchid[4].textContent
    tridCell.style.display = 'none'
    ftidCell.textContent = cellssearchid[14].textContent
    ftidCell.style.display = 'none'  



  const viewbtn = document.createElement('button');  
    viewbtn.type = "button";
    viewbtn.className = "custom-button-bcaseye";
    viewbtn.innerHTML = '<i class="fas fa-eye"></i>';     
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
    
        const bcasentries = document.getElementById("bcasentries").getElementsByTagName('tbody')[0];
        const tagsBody = document.getElementById("bcastags").getElementsByTagName('tbody')[0];
        
        
        
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
    
              bcasentries.innerHTML = '';
    
              acctable.forEach(accounts => {
                const urow = document.createElement('tr');    
            
                Object.values(accounts).forEach(value => {
                  const cell = document.createElement('td');
                  cell.textContent = value;
                  urow.appendChild(cell);
                });    
           
                bcasentries.appendChild(urow);
              });
    
              tnsdebit.value =Debit
              tnscredit.value =Debit
    
        }else if (Credit!==  "0.00"){
                viewbcasamount.value = Credit
              
                const acctable = [
                    { name: "Fund Transfer to", category: "Debit", Amount: Credit},
                    { name: "Cash on hand", norm: "Credit", Amount: Credit },             
                   
                  ];    
    
                  bcasentries.innerHTML = '';
    
                  acctable.forEach(accounts => {
                    const urow = document.createElement('tr');    
                
                    Object.values(accounts).forEach(value => {
                      const cell = document.createElement('td');
                      cell.textContent = value;
                      urow.appendChild(cell);
                    });    
               
                    bcasentries.appendChild(urow);
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







    bcascloseftupdate() 

    document.getElementById('subcon-tab100-tab13').classList.remove('active');  
    document.getElementById('sub-tab100-tab13').classList.remove('active');

    document.getElementById('subcon-tab100-tab6').classList.add('active');  
    document.getElementById('sub-tab100-tab6').classList.add('active');

          
   const button = cellssearchid[0].querySelector('button')
            button.disabled = true; // Disable the button if the 10th column is not 'Pending'
            button.style.backgroundColor = 'gray'
            button.style.borderColor = 'gray'
            button.style.cursor = 'not-allowed'

            showNotification(); 

            // Adjust notification styles
            xnotification.style.bottom = '75px';
            xnotification.style.right = '75px';
            xnotification.style.width = '400px';  
            xnotification.style.backgroundColor = 'green';

            // Set notification text
            xnotify.innerHTML = '<i class="fa-solid fa-circle-info" style="margin-right:10px; font-size:20px; color:white"></i>' + 
            "Transaction has been updated and entries has been recorded to the Transaction Journal";
  
  }
       
  }


}else if (ft16.value === 'Pending' && ft17.value === 'Voided' )  {  //2nd if

    xrow.cells[6].style.textAlign = 'right';   


    for (var i = 1; i < row.length; i++) {
        var cellssearchid = row[i].getElementsByTagName("td");
        const fttrtype = cellssearchid[3].textContent
        console.log(cellssearchid[3].textContent)
    if (ft14.value === cellssearchid[4].textContent ){
        cellssearchid[10].textContent = 'Voided'
        cellssearchid[11].textContent = 'Updated'
        cellssearchid[12].textContent = formattedDateTime

     }


    bcascloseftupdate() 

    document.getElementById('subcon-tab100-tab13').classList.remove('active');  
    document.getElementById('sub-tab100-tab13').classList.remove('active');

    document.getElementById('subcon-tab100-tab6').classList.add('active');  
    document.getElementById('sub-tab100-tab6').classList.add('active');

            


            showNotification(); 

            // Adjust notification styles
            xnotification.style.bottom = '75px';
            xnotification.style.right = '75px';
            xnotification.style.width = '400px';  
            xnotification.style.backgroundColor = 'green';

            // Set notification text
            xnotify.innerHTML = '<i class="fa-solid fa-circle-info" style="margin-right:10px; font-size:20px; color:white"></i>' + 
            "Transaction has been updated to voided";
  
   }
       
  }

}

/*

function bcasconfirmedupdate () {
  // --- Required DOM references (guarded) ---
  const ft16 = document.getElementById('ft16');
  const ft17 = document.getElementById('ft17');
  const ft14 = document.getElementById('ft14');
  const Bcasbranch = document.getElementById('Bcasbranch');

  // notification elements (may be undefined in some pages)
  const xnotification = document.getElementById('xnotification');
  const xnotify = document.getElementById('xnotify');

  // ensure required inputs exist
  if (!ft14 || !ft16 || !ft17) {
    console.warn('Required FT inputs missing (ft14/ft16/ft17). Aborting update.');
    return;
  }

  // formatted times used in the code
  const now = new Date();
  const formattedDateTime = now.toLocaleString(); // full timestamp for "Updated"
  const formattedDate = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`; // YYYY-MM-DD

  const bcasftid = sessionStorage.getItem("ftidup");
  const tableBody = document.getElementById('BCAStransactions')?.getElementsByTagName('tbody')[0];
  const tableid = document.getElementById('BCASfttable');

  if (!tableBody || !tableid) {
    console.warn('Tables not found: BCAStransactions or BCASfttable.');
    return;
  }

  const row = tableid.getElementsByTagName("tr");

  // last visible balance row in tableBody (if none, we set prev balance to 0)
  const xrow = tableBody.rows[tableBody.rows.length - 1] || null;

  // create new row for result
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

  // array of visible rows in tableBody (exclude display:none)
  const visibleRows = Array.from(tableBody.rows).filter(r => r.style.display !== "none");

  // helper for safe parseFloat from cell text like "1,234.56"
  function safeParseNumber(text) {
    if (!text) return 0;
    const cleaned = String(text).replace(/,/g, '').trim();
    const n = parseFloat(cleaned);
    return isNaN(n) ? 0 : n;
  }

  // helper to set notification (if element exists)
  function showUpdateNotification(message) {
    if (!xnotification || !xnotify) return;
    xnotification.style.bottom = '75px';
    xnotification.style.right = '75px';
    xnotification.style.width = '400px';
    xnotification.style.backgroundColor = 'green';
    xnotify.innerHTML = '<i class="fa-solid fa-circle-info" style="margin-right:10px; font-size:20px; color:white"></i>' + message;
    // you call showNotification() later in your original flow; keep both if needed
  }

  // main condition block (keeps original logic)
  if ((ft16.value === 'Pending' && ft17.value == 'Active') || (ft16.value === 'Active' && ft17.value == 'Voided')) {
    if (xrow && xrow.cells[6]) {
      xrow.cells[6].style.textAlign = 'right';
    }

    for (let i = 1; i < row.length; i++) {
      const cellssearchid = row[i].getElementsByTagName("td");
      if (!cellssearchid || cellssearchid.length === 0) continue;

      const fttrtype = (cellssearchid[3]?.textContent || '').trim();
      const searchRef = (cellssearchid[4]?.textContent || '').trim();

      // match the FT reference
      if (ft14.value === searchRef) {
        // update status on the source row
        if (cellssearchid[10]) {
          cellssearchid[10].textContent = (ft17.value === 'Active') ? 'Active' : 'Voided';
        }


        if (cellssearchid[11]) {
          // set timestamp (overwrites previous "Updated" text as original did)
          cellssearchid[11].textContent = formattedDateTime;
        }

        // put sequence number and status into the newly inserted row
        NoCell.textContent = visibleRows.length || tableBody.rows.length; // fallback
        statusCell.textContent = (ft17.value === 'Active') ? 'Active' : 'Voided';

        // previous balance (from xrow) fallback 0
        const prevtbalance = xrow && xrow.cells[6] ? safeParseNumber(xrow.cells[6].textContent) : 0;

        // unify amount variables used in branches
        const cellAmountText = (cellssearchid[7]?.textContent || '0');
        const cellAmount = safeParseNumber(cellAmountText);

        // Logic per transaction type (Send, Receive, Deposit, Withdraw)
        if (fttrtype === 'Send') {
          if ((cellssearchid[10]?.textContent || '') === 'Active') {
            templateCell.textContent = 'Fund Transfer-Send';
            debitCell.textContent = '0.00';
            creditCell.textContent = cellAmountText;
            const totalBalance = prevtbalance - cellAmount;
            balanceCell.textContent = (Math.round(totalBalance * 100) / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          } else {
            templateCell.textContent = 'Fund Transfer-Send-Voided';
            debitCell.textContent = cellAmountText;
            creditCell.textContent = '0.00';
            const totalBalance = prevtbalance + cellAmount;
            balanceCell.textContent = (Math.round(totalBalance * 100) / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          }
        } else if (fttrtype === 'Receive') {
          if ((cellssearchid[10]?.textContent || '') === 'Active') {
            templateCell.textContent = 'Fund Transfer-Receive';
            debitCell.textContent = cellAmountText;
            creditCell.textContent = '0.00';
            const totalBalance = prevtbalance + cellAmount;
            balanceCell.textContent = (Math.round(totalBalance * 100) / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          } else {
            templateCell.textContent = 'Fund Transfer-Receive-Voided';
            debitCell.textContent = '0.00';
            creditCell.textContent = cellAmountText;
            const totalBalance = prevtbalance - cellAmount;
            balanceCell.textContent = (Math.round(totalBalance * 100) / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          }
        } else if (fttrtype === 'Deposit') {
          if ((cellssearchid[10]?.textContent || '') === 'Active') {
            templateCell.textContent = 'Fund Transfer-Deposit';
            debitCell.textContent = '0.00';
            creditCell.textContent = cellAmountText;
            const totalBalance = prevtbalance - cellAmount;
            balanceCell.textContent = (Math.round(totalBalance * 100) / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          } else {
            templateCell.textContent = 'Fund Transfer-Deposit-Voided';
            debitCell.textContent = cellAmountText;
            creditCell.textContent = '0.00';
            const totalBalance = prevtbalance + cellAmount;
            balanceCell.textContent = (Math.round(totalBalance * 100) / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          }
        } else if (fttrtype === 'Withdraw') {
          if ((cellssearchid[10]?.textContent || '') === 'Active') {
            templateCell.textContent = 'Fund Transfer-Withdraw';
            debitCell.textContent = cellAmountText;
            creditCell.textContent = '0.00';
            const totalBalance = prevtbalance + cellAmount;
            balanceCell.textContent = (Math.round(totalBalance * 100) / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          } else {
            templateCell.textContent = 'Fund Transfer-Withdraw-Voided';
            debitCell.textContent = '0.00';
            creditCell.textContent = cellAmountText;
            const totalBalance = prevtbalance - cellAmount;
            balanceCell.textContent = (Math.round(totalBalance * 100) / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          }
        } // end fttrtype branches

        // set remarks, upload status, date (we keep dateCell hidden as before)
        remarksCell.textContent = (cellssearchid[9]?.textContent || '');
        uploadstatCell.textContent = 'Not Uploaded';
        dateCell.textContent = formattedDate;
        dateCell.style.display = 'none';

        // build FT reference (only if cellssearchid has indexes 14 and 15)
        const fttrnum = (cellssearchid[15]?.textContent || '').trim();
        if (cellssearchid[14]) {
          const refformattedDate = `${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}${now.getFullYear()}`;
          cellssearchid[14].innerText = "FT-" + (Bcasbranch?.value || '') + refformattedDate + "-" + fttrnum + "-Active";
        }

        tridCell.textContent = (cellssearchid[4]?.textContent || '');
        tridCell.style.display = 'none';
        ftidCell.textContent = (cellssearchid[14]?.textContent || '');
        ftidCell.style.display = 'none';

        // create view button (fixed innerHTML usage)
        const viewbtn = document.createElement('button');
        viewbtn.type = "button";
        viewbtn.className = "custom-button-bcaseye";
        viewbtn.innerHTML = '<i class="fas fa-eye"></i>';
        viewbtn.style.cursor = 'pointer';

        viewbtn.onclick = function(event) {
          event.preventDefault();
          const viewbtnrow = event.target.closest('tr');
          const row = viewbtnrow;

          // set tabs (as in original)
          const tabs = document.querySelectorAll('.bcastab');
          tabs.forEach(tab => tab.classList.remove('active'));

          document.getElementById('sub-tab100-tab14')?.classList.add('active');
          document.getElementById('subcon-tab100-tab14')?.classList.add('active');
          document.getElementById('subcon-tab100-tab1')?.classList.remove('active');
          document.getElementById('sub-tab100-tab14-1')?.classList.add('active');
          document.getElementById('subcon-tab100-tab14-1')?.classList.add('active');
          document.getElementById('sub-tab100-tab14-2')?.classList.remove('active');
          document.getElementById('subcon-tab100-tab14-2')?.classList.remove('active');

          const entriesBody = document.getElementById("bcasentries")?.getElementsByTagName('tbody')[0];
          const tagsBody = document.getElementById("bcastags")?.getElementsByTagName('tbody')[0];

          const tdate = formatDate(trnxDate.value);
          const tnsnum = row.cells[1].innerText;
          const paddedNumber = padNumber(tnsnum, 6);
          const AcctName = row.cells[3].innerText;
          const AcctCode = AcctName.replace(/[^A-Z-]/g, '');
          const Debit = row.cells[4].innerText;
          const Credit = row.cells[5].innerText;
          const memo = row.cells[7].innerText;
          const desc = "To record " + AcctName;
          const trId = row.cells[9].textContent;
          const refid = ftidCell.innerText;

          // populate view fields (guard existence)
          if (viewbcasdate) viewbcasdate.value = tdate;
          if (viewbcastn) viewbcastn.value = tnsnum;
          if (viewbcasacode) viewbcasacode.value = AcctCode;
          if (viewbcastemp) viewbcastemp.value = AcctName;
          if (viewbcasdesc) viewbcasdesc.value = desc;
          if (viewbcasremarks) viewbcasremarks.value = memo;
          if (viewbcasref) viewbcasref.value = "AAA"+paddedNumber+trnxDate.value;

          if (entriesBody) {
            entriesBody.innerHTML = '';
            if (Debit !== "0.00") {
              viewbcasamount.value = Debit;
              const acctable = [
                { name: "Cash on hand", norm: "Debit", Amount: Debit },
                { name: "Fund Transfer from", category: "Credit", Amount: Debit },
              ];
              acctable.forEach(accounts => {
                const urow = document.createElement('tr');
                Object.values(accounts).forEach(value => {
                  const cell = document.createElement('td');
                  cell.textContent = value;
                  urow.appendChild(cell);
                });
                entriesBody.appendChild(urow);
              });
              if (tnsdebit) tnsdebit.value = Debit;
              if (tnscredit) tnscredit.value = Debit;
            } else if (Credit !== "0.00") {
              viewbcasamount.value = Credit;
              const acctable = [
                { name: "Fund Transfer to", category: "Debit", Amount: Credit },
                { name: "Cash on hand", norm: "Credit", Amount: Credit },
              ];
              acctable.forEach(accounts => {
                const urow = document.createElement('tr');
                Object.values(accounts).forEach(value => {
                  const cell = document.createElement('td');
                  cell.textContent = value;
                  urow.appendChild(cell);
                });
                entriesBody.appendChild(urow);
              });
              if (tnsdebit) tnsdebit.value = Credit;
              if (tnscredit) tnscredit.value = Credit;
            }
          }

          if (tagsBody) {
            tagsBody.innerHTML = '';
            const tagstable = [
              { name: "Transaction ID", Id: trId },
              { name: "FT Reference ID", Id: refid },
            ];
            tagstable.forEach(tag => {
              const tagrow = document.createElement('tr');
              Object.values(tag).forEach(value => {
                const tagcell = document.createElement('td');
                tagcell.textContent = value;
                tagrow.appendChild(tagcell);
              });
              tagsBody.appendChild(tagrow);
            });
          }
        }; // end viewbtn onclick

        viewCell.appendChild(viewbtn);

        // close update panel and switch tabs (keep original UI flow)
       // if (typeof bcascloseftupdate === 'function') 
       bcascloseftupdate();

        document.getElementById('subcon-tab100-tab13')?.classList.remove('active');
        document.getElementById('sub-tab100-tab13')?.classList.remove('active');
        document.getElementById('subcon-tab100-tab6')?.classList.add('active');
        document.getElementById('sub-tab100-tab6')?.classList.add('active');

        // show notification (use the helper)
        if (typeof showNotification === 'function') showNotification();
        showUpdateNotification("Transaction has been updated and entries has been recorded to the Transaction Journal");

        // break after first match (if you intend to only process 1 matching row)
        break;
      } // end if ft14 === searchRef
    } // end for
  } else if (ft16.value === 'Pending' && ft17.value === 'Voided') {
    if (xrow && xrow.cells[6]) xrow.cells[6].style.textAlign = 'right';

    for (let i = 1; i < row.length; i++) {
      const cellssearchid = row[i].getElementsByTagName("td");
      if (!cellssearchid || cellssearchid.length === 0) continue;
      const fttrtype = (cellssearchid[3]?.textContent || '').trim();

      if (ft14.value === (cellssearchid[4]?.textContent || '').trim()) {
        if (cellssearchid[10]) cellssearchid[10].textContent = 'Voided';
        if (cellssearchid[11]) cellssearchid[11].textContent = formattedDateTime;

        if (typeof bcascloseftupdate === 'function') bcascloseftupdate();
        document.getElementById('subcon-tab100-tab13')?.classList.remove('active');
        document.getElementById('sub-tab100-tab13')?.classList.remove('active');
        document.getElementById('subcon-tab100-tab6')?.classList.add('active');
        document.getElementById('sub-tab100-tab6')?.classList.add('active');

        if (typeof showNotification === 'function') showNotification();
        showUpdateNotification("Transaction has been updated to voided");

        break;
      }
    }
  }
} */


