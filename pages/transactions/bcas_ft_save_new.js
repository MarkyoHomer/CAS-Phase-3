const BCASfttable = document.getElementById("BCASfttable");
const bcasftrow = BCASfttable.getElementsByTagName("tr");
const savebcasft = document.getElementById('saveft');

  
  function resetfield (){

                        ft1.value = '';  // transfer type
                        ft2.value = ''; //amount
                        ft3.value = ''; //courier
                        ft4.value = ''; // bank
                        ft5.value = ''; //memo
                        ft6.value = '';// transaction id
                        ft7.value = ''; // destination
                        ft0.value = ''; // origin
                        savebcasft.disabled = true;
                        savebcasft.style.backgroundColor ='gray';
  }


function pastebcasft(BCASoverlayId) { 
    if (ftselectedtype.value === 'Select Transfer Type' ) {
        showError(BCASoverlayId, "You have selected invalid Transaction Type.");
        return;
    }
    navigator.clipboard.readText().then(function (text) {
      

        if (!text) {
            errorMessage.textContent = "Clipboard is empty. Please copy some encrypted data.";
            return;
        }

        encryptedInputField.value = text;
        
        try {
           

            const decryptedData = decodeBase64(text);
            console.log("Decrypted data:", decryptedData); // Log decrypted data
            const fields = decryptedData.split("|");
            console.log("Fields:", fields); // Log split fields
          
            if (fields.length < 15) {
                showError(BCASoverlayId, "You have copied invalid transaction format.");
                return;
            }           

            // Handle different transaction types
            if (ftselectedtype.value === 'Send' || ftselectedtype.value === 'Deposit' ) {               
              
                    if (ftselectedtype.value !== fields[1] || ftselectedtype.value === 'Select Transfer Type'  ) {
                        showError(BCASoverlayId, "You have selected invalid Transaction Type. The transaction type of the record is " + fields[1]);
                        return;
                    } else if (Bcasbranch.value !== fields[4]) {
                        showError(BCASoverlayId, "The record is " + fields[1] + " Transaction for " + fields[4]);
                        return;
                  
                         
                    } else {
                        ft1.value = ftselectedtype.value;  // transfer type
                        ft2.value = fields[3]; //amount
                        ft3.value = fields[6]; //courier
                        ft4.value = fields[1] === 'Send' ? "" : fields[7]; //bank
                        ft5.value = fields[7]; //memo
                        ft6.value = fields[2]; // transaction id
                        ft7.value = fields[5]; // destination
                        ft0.value = fields[4]; // origin
                       
                        // Check if the transaction already exists in the table
                        for (let i = 1; i < bcasftrow.length; i++) {
                            let cellupdte = bcasftrow[i].getElementsByTagName("td");
                            if (cellupdte[4].innerText === ft6.value) {
                                showError(BCASoverlayId, "This transaction has already been recorded. If you want to update the status, please use the update function");
                                savebcasft.disabled = true;
                                savebcasft.style.backgroundColor ='gray';
                                return;
                            }else {
                                savebcasft.disabled = false;
                                savebcasft.style.backgroundColor ='#3f61b8';
                                savebcasft.addEventListener('mouseenter', () => {
                                savebcasft.style.backgroundColor = 'rgb(37, 32, 194)';
                                });

                                savebcasft.addEventListener('mouseleave', () => {
                                savebcasft.style.backgroundColor = ''; // or reset to original
                                });
                                
                            }                          }                      
                    }
                   
            } else if ( ftselectedtype.value === 'Withdraw'){

                    if (fields[1] === "Withdraw") {
                        handleWithdraw(fields, bcasftrow, savebcasft, BCASoverlayId);
                    }else {
                        showError(BCASoverlayId, "You have selected invalid Transaction Type. The transaction type of the record is " + fields[1]);
                        return;
                    }
            } else if (ftselectedtype.value === 'Receive'){


                 if (fields[1] === "Send") {
                  handleReceive(fields, bcasftrow, savebcasft, BCASoverlayId);
                 }else {
                    showError(BCASoverlayId, "You have selected invalid Transaction Type. The transaction type of the record is " + fields[1]);
                    return;
                 }

                 
            }else {
                alert(fields[1])
            }

        } catch (error) {
            console.error("Error while decrypting:", error);            
            showError(BCASoverlayId, "You have copied invalid transaction format.");
            return;
        }

    }).catch(function (err) {
        console.error("Failed to read clipboard contents: ", err);
        alert("Failed to read clipboard contents.");
    });
}

// Function to show an error message
function showError(BCASoverlayId, message) {
    document.getElementById(BCASoverlayId).classList.add('show');
    errorMessage.value = message;
    savebcasft.disabled = true;
    savebcasft.style.backgroundColor ='gray';
}

// Function to update fields with the decrypted data
function updateFields(fields) {

    ft1.value = ftselectedtype.value;
    ft2.value = fields[3];
    ft3.value = fields[6];
    ft0.value = fields[4]; 

        if (ft1.value === 'Send'|| 'Receive'){
            ft4.value = "";

        } else {
        ft4.value = fields[7];
        }
    
    ft5.value = fields[7];
    ft6.value = fields[2];
    ft7.value = fields[5]; 
    var area = fields[10];
    sessionStorage.setItem('area',area)
}



// Function to handle "Withdraw" transactions
function handleWithdraw(fields, bcasftrow, savebcasft, BCASoverlayId) {
    if (ftselectedtype.value === 'Withdraw'){
    if (Bcasbranch.value !== fields[5]) {
        showError(BCASoverlayId, "The record is " + fields[1] + " Transaction for " + fields[4]);
        return;
    }
    if (fields[9] !== 'Pending') {
        showError(BCASoverlayId, "The record is already having " + fields[9] + " status");
        return;
    }
}
    updateFields(fields);

    // Check if the transaction already exists in the table
    for (let i = 1; i < bcasftrow.length; i++) {
        let cellupdte = bcasftrow[i].getElementsByTagName("td");
        if (cellupdte[4].innerText === ft6.value) {
            showError(BCASoverlayId, "This transaction is already been recorded");
            savebcasft.disabled = true;
            savebcasft.style.backgroundColor ='gray';
            return;
        }else {
            savebcasft.disabled = false;  
             savebcasft.addEventListener('mouseenter', () => {          
             savebcasft.style.backgroundColor = 'rgb(37, 32, 194)';
             });

                                savebcasft.addEventListener('mouseleave', () => {
             savebcasft.style.backgroundColor = ''; // or reset to original
             });
        }
    }

    
}

// Function to handle "Receive" transactions (when the transaction is a "Send")
function handleReceive(fields, bcasftrow, savebcasft, BCASoverlayId) {
   
    if (Bcasbranch.value !== fields[5]) {
        if (ftselectedtype.value === 'Receive' && fields[1] === 'Send' ){
        showError(BCASoverlayId, "The record is Receive Transaction for " + fields[5]);
        return;
     
        }
    }
    if (fields[9] !== 'In-Transit' && fields[9] !== 'Pending') {
        showError(BCASoverlayId, "The record is already having " + fields[9] + " status");
        return;
    }
 
    updateFields(fields);

    // Check if the transaction already exists in the table
    for (let i = 1; i < bcasftrow.length; i++) {
        let cellupdte = bcasftrow[i].getElementsByTagName("td");
        if (cellupdte[4].innerText === ft6.value) {
            showError(BCASoverlayId, "This transaction is already been recorded");
            savebcasft.disabled = true;
            savebcasft.style.backgroundColor ='gray';
            return;
        }else {
            savebcasft.disabled = false;
            savebcasft.style.backgroundColor = '#3f61b8';
             savebcasft.addEventListener('mouseenter', () => {          
             savebcasft.style.backgroundColor = 'rgb(37, 32, 194)';
             });

                                savebcasft.addEventListener('mouseleave', () => {
             savebcasft.style.backgroundColor = ''; // or reset to original
             });
        }
    }

   
}



function savebft(){

    document.getElementById('bcasftconfirmation').classList.add('show');
    document.getElementById('bcasNEWmessage').textContent =   "Are you sure you want to save this Transaction?"
}

function bcascloseftnew() {

    document.getElementById('bcasftconfirmation').classList.remove('show');

}

function bcasconfirm(){
    const FTtablebody = document.getElementById('BCASfttable')
    const bcasFTtablebody = document.getElementById('BCASfttable').getElementsByTagName('tbody')[0];
    const newRow = bcasFTtablebody.insertRow(0);
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
    const refCell = newRow.insertCell(14);
    const noCell = newRow.insertCell(15);
    const areaCell = newRow.insertCell(16);
    const inputString = document.getElementById('ft5').value;
    const regex = /((AREA|HO)\s+(LBP|PNB|MBTC|UB))/;    
    const match = inputString.match(regex);
    const result = match ? match[0] : "Pattern not found.";

    const visibleFTRows = Array.from(BCASfttable.rows).filter(
    row => row.style.display !== "none"
    );

    const numcell = visibleFTRows.length - 1


    dateCell.textContent = formatDate(new Date());
    typeCell.textContent = ft1.value;
    tnsIdCell.textContent = ft6.value;
    amountCell.textContent = ft2.value;
    noCell.textContent = numcell.toString().padStart(3, '0');
    noCell.style.display = 'none'
    areaCell.textContent =  sessionStorage.getItem('area');
    areaCell.style.display = 'none'
    courierCell.textContent = ft3.value;
    memoCell.textContent = ft5.value;
    statusCell.textContent ='Pending';
    upstatusCell.textContent ='Not Updated';
    timeupcell.textContent = '--'
    refCell.style.display = 'none'
 



    if(ft1.value === 'Withdraw'){
        originCell.textContent = result
        destCell.textContent = ft7.value;
        if (statusCell.textContent !== 'Active'){
            refCell.textContent = ''
               
            
        }else {
            refCell.textContent = "FT-" + ft7.value + ftrefformattedDate + "-" + noCell.textContent + "-Active" 
              
        }
   
    }else if(ft1.value === 'Deposit'){
        originCell.textContent = ft0.value;
        destCell.textContent = result
        if (statusCell.textContent !== 'Active'){
            refCell.textContent = ''
           
        }else {
            refCell.textContent = "FT-" + ft0.value + ftrefformattedDate + "-" + noCell.textContent 
            
        }
      
    }else{
        if (ft1.value === 'Send'){
            if (statusCell.textContent !== 'Active'){
                refCell.textContent = ''
              
            }else {
                refCell.textContent = "FT-" + ft0.value + ftrefformattedDate + "-" + noCell.textContent 
                
            }
        }else {
            if (statusCell.textContent !== 'Active'){
                refCell.textContent = ''
             
            }else {
                refCell.textContent = "FT-" + ft7.value + ftrefformattedDate + "-" + noCell.textContent 
               
            }
          
        }
        
        originCell.textContent = ft0.value;
        destCell.textContent = ft7.value;
    }
    
    

const retry = document.createElement('button');  
      retry.type = "button";
      retry.className = "custom-button-bcaseye";
      retry.style.width = '40px';    
      retry.style.cursor = 'pointer';
      retry.innerHTML = '<i  class= "fas fa-rotate-right">';
      retry.onclick = function (event) { 
        event.preventDefault();
        document.getElementById('bcasftretryconfirmation').classList.add('show');
        const retryrow = event.target.closest('tr');   
        const tableBody = retryrow.parentNode;
        const rowIndex = Array.from(tableBody.children).indexOf(retryrow) + 1;      
        sessionStorage.setItem("retryrow", rowIndex); // to post in the sessionStorage the fttablerow where the retrybutton is located
        document.getElementById('bcasretrymessage').textContent =   "You are uploding " + 
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

  const voided = document.createElement('button');  
        voided.type = "button";
        voided.style.width = '40px';
        voided.className = "custom-button-bcasvoid";
        voided.style.cursor = 'pointer';
        voided.innerHTML = '<i  class= "fas fa-ban"></i>';
        voided.onclick = function (event) { 
         event.preventDefault();
         const voidrow = event.target.closest('tr');   
         const tableBody = voidrow.parentNode;
         const rowIndex = Array.from(tableBody.children).indexOf(voidrow) + 1;  
         sessionStorage.setItem("voidrow", rowIndex); // to post in the sessionStorage the fttablerow where the retrybutton is located
     
     
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
          
     rowData = rowData.slice(0, -1);    

     let dataArray = rowData.split("|");    
     
     const today =   new Date(qdate ); 
     const year = today.getFullYear();
     const month = (today.getMonth() + 1).toString().padStart(2, '0');
     const day = today.getDate().toString().padStart(2, '0');
     const ftrefformattedDate = `${month}${day}${year}`;
     const fttrnum = row.cells[15].innerText    
     
     if (dataArray.length >= 10) {
         dataArray[9] = "Voided-" + row.cells[10].innerText; 
         dataArray[10] = "Not Updated";  // Replace the 10th value (index 9) with "New Value"
         dataArray[13] = "FT-" + qbranch  + ftrefformattedDate + "-" + fttrnum + "-" + row.cells[10].innerText;   + "-Voided" 
     }
     

     
      rowData = dataArray.join("|");
       
   
         let encodedData = btoa(rowData); // btoa() encodes the string to Base64
     
         // Display the encoded Base64 data in a textarea
        // document.getElementById("base64Output").value = encodedData;
         
          let encodedText = "Void Permission Request: " + qbranch + " | " +  qtype + " | " + qid + " | " + qdate ;  
          let modifiedText = encodedText.replace( qdate, qdate + "\n\n" +  encodedData );
     
         // Check if there's any Base64 data to copy
         if (modifiedText.trim() === "") {
             alert("No data to copy!");
             return;
         }
        // var voidingtext = document.getElementById('voidcode');
         // voidingtext.value = modifiedText;  // <-- This is where you assign it
         
         
         // Use the Clipboard API to copy text to clipboard
         navigator.clipboard.writeText(modifiedText).then(() => {
               showNotification();
               xnotification.style.bottom = '75px';
               xnotification.style.right = '75px';
               xnotification.style.width =  '300px';      
               xnotify.innerHTML = '<i class="fa-solid fa-circle-info" style="margin-right:10px; font-size:20px; color:white"></i>' + 
               "Void Permission Request code is copied to the clipboard!."
              
       }).catch(err => {
             console.error("Error copying text: ", err);
        });       
         
}


     retryCell.appendChild(retry);
     copyCell.appendChild(copy);
    // voidCell.appendChild(voided);
      
}
let countdownTime = 5; 

function bcasconfirmed() {  

    const waiting = document.getElementById('bcasftuploadwaiting');
    const xwaiting = document.getElementById('xwaiting'); 
    bcasconfirm();      
   // waiting.classList.add('show');
//    xwaiting.innerHTML = '<i class="fa-solid fa-circle-info" style="margin-right:10px; font-size:30px; color:white"></i>' +
   //         " Uploading Fund Transfer Transaction in  5"
    const tabs = document.querySelectorAll('.bcastab');
    tabs.forEach(tab => tab.classList.remove('active'));
    document.getElementById('sub-tab100-tab6').classList.add('active');
    document.getElementById('subcon-tab100-tab6').classList.add('active');
    document.getElementById('subcon-tab100-tab12').classList.remove('active');
    document.getElementById('subcon-tab100-tab13').classList.remove('active');
    document.getElementById('bcasftconfirmation').classList.remove('show');
 //   const timerInterval = setInterval(() => {
     //   if (countdownTime > 0) {
           
     //       xwaiting.innerHTML = '<i class="fa-solid fa-circle-info" style="margin-right:10px; font-size:30px; color:white"></i>' +
       //     " Uploading Fund Transfer Transaction in  " + countdownTime;
       //     countdownTime--; 
     //   } else { 
      //      clearInterval(timerInterval); 
       //     waiting.classList.remove('show'); 

            showNotification(); 

            // Adjust notification styles
            xnotification.style.bottom = '75px';
            xnotification.style.right = '75px';
            xnotification.style.width = '300px';  
            xnotification.style.backgroundColor = 'green';

            // Set notification text
            xnotify.innerHTML = '<i class="fa-solid fa-circle-info" style="margin-right:10px; font-size:20px; color:white"></i>' + 
            "Transaction has been saved";
     //   }
 //   }, 1000); 

}



