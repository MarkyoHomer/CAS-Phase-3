function decodeBase64(data) {
    return atob(data); // `atob` decodes the Base64 string
}

// const decryptButton = document.getElementById('paste-ft');

const encryptedField = document.getElementById('offline-update');
const bbranch = document.getElementById('Bcasbranch');
const errMessage = document.getElementById('alertmessage');
const saveupdateft = document.getElementById('FT-btn-update-overlay0');
saveupdateft.disabled =  true;


function camisftpaste(){
   
   
    navigator.clipboard.readText().then(function(text) {
        // Paste the text into the encrypted input field
        encryptedField.value = text;

        // Check if the clipboard data is empty
        if (!text) {
            errMessage.textContent = "Clipboard is empty. Please copy some encrypted data.";
            return;
        }

        try {
            // Decrypt the Base64 encoded data
            const decryptedData = decodeBase64(text);
            // Split the decrypted data into multiple fields based on the separator (e.g., ":")
            const fields = decryptedData.split("|");
            const ftid = fields[13]
            const statsvoided = fields[9]
            console.log(fields)
            sessionStorage.setItem("ftid", ftid );
            sessionStorage.setItem("statsvoided", statsvoided );
            if (fields.length < 12  ) {
                alert("Copied data is not in the standard format.");
            }        

            pastedate.value = fields[1];
            pasteid.value = fields[3];
            pastetype.value = fields[2];
            pasteamt.value = fields[6];  
            reason.value =  fields[9] + " " + fields[2] +" Branch Fund Transfer"             
            pastebranch.value = bbranch.value;

            
            const tableid = document.getElementById("ft-data-table");
            const rowssearchid = tableid.getElementsByTagName("tr"); 
            
            for (var i = 1; i < rowssearchid.length; i++) {
                var cellssearchid = rowssearchid[i].getElementsByTagName("td");

                   if (cellssearchid[3].innerText === fields[3]){
                 
                    statusfrom.value = cellssearchid[10].innerText              

                        if (fields[2] === "Send" ){
                            pastebank.value = ""
                            if (fields[9] === "Pending" &&  fields[10] === "Not Updated" 
                                && cellssearchid[10].innerText === "Pending"){

                            updateto.value = "In-Transit"
                            saveupdateft.disabled = false;

                            }else if ( (fields[9] !== 'Pending' || 'Active' ) && fields[10] === "Not Updated" 
                                && (cellssearchid[10].innerText === "Pending" || cellssearchid[10].innerText === "In-Transit")) {

                            updateto.value = "Voided" // | Voided from " + fields[5]
                            saveupdateft.disabled = false;

                            sessionStorage.setItem("NewStatus", "Voided");
                            sessionStorage.setItem("OldStatus", statusfrom.value);

                            }else  {

                            updateto.value = "This record is already updated"                    
                            saveupdateft.disabled = true;
                            updateto.style.color = "red"
                            }
                        }else if ( fields[2] === "Receive") {
                            pastebank.value = ""
                            if (fields[9] === "Pending" &&  fields[10] === "Not Updated" 
                                && cellssearchid[10].innerText === "In-Transit"){

                                updateto.value = "Received"
                                saveupdateft.disabled = false;
                         

                            }else if ( (fields[9] !== 'Pending' || 'Active' )  && fields[10] === "Not Updated" 
                                && (cellssearchid[10].innerText === "Received" || cellssearchid[10].innerText === "In-Transit")) {

                                updateto.value = "In-Transit" 
                                saveupdateft.disabled = false;
                                sessionStorage.setItem("NewStatus", "In-Transit" );
                                sessionStorage.setItem("OldStatus", statusfrom.value);

                            }else  {

                                updateto.value = "This record is already updated"
                                updateto.style.color = "red"                    
                                saveupdateft.disabled = true;
                            }
                        }else if ( fields[2] === "Deposit" || fields[2] === "Withdraw") {

                            pastebank.value = fields[8]

                            if (fields[9] === "Pending" &&  fields[10] === "Not Updated" 
                                && cellssearchid[10].innerText === "Pending"){

                            updateto.value = "In-Transit"
                            saveupdateft.disabled = false;

                            }else if ( (fields[9] !== 'Pending' || 'Active' )  && fields[10] === "Not Updated" 
                                && (cellssearchid[10].innerText === "Pending" || "In-Transit")) {

                            updateto.value = "Voided"
                            saveupdateft.disabled = false;
                            sessionStorage.setItem("NewStatus", "Voided" );
                            sessionStorage.setItem("OldStatus", statusfrom.value);
                            
                            }else if ( (fields[9] !== 'Pending' || 'Active' )  && fields[10] === "Not Updated" 
                                && (cellssearchid[10].innerText !== "Pending" || "In-Transit")) {

                            updateto.value = "Voided"
                            saveupdateft.disabled = false;
                            sessionStorage.setItem("NewStatus", "Voided" );
                            sessionStorage.setItem("OldStatus", statusfrom.value);

                            }else  {

                            updateto.value = "This record is already updated"   
                            updateto.style.color = "red"                      
                            saveupdateft.disabled = true;

                            }
                        
                        }    
                        
                        sessionStorage.setItem("Newrow", i);
                       
                      break;
                    }

           }     
                      
        } catch (error) {
            console.error("Error while decrypting:", error);
            alert("Invalid data format "  );
        }
     

    }).catch(function(err) {
        console.error("Failed to read clipboard contents: "  , err);
        alert("Failed to read clipboard contents."  );
    });


}


function closeupdateOverlay(overlayId) {
    document.getElementById(overlayId).classList.remove('show');
    pastedate.value = "";
    pasteid.value = "";
    pastetype.value = "";
    pasteamt.value = "";  
    reason.value =  "";            
    pastebranch.value = "";
    statusfrom.value="";
    pastebank.value = "";
    updateto.value = "";
    encryptedField.value = "";
  
  }


  function camisftofflineupdate(tableId, overlayId) { 
    const updatemessage = document.getElementById('updatemessage');

     var xofflineupdate = "offlineUp";  
     sessionStorage.setItem("offlineupdate", xofflineupdate);

     if ( updateto.value === "Voided" ){

        openSubOverlay()
     }else{
        document.getElementById('ftupdateconfirmation').classList.add('show');
        updatemessage.textContent = "Are you sure you want to update the status from " + statusfrom.value + " to "
         + updateto.value +  "?" 
     }

     }

  
  function confirmupdate(update,overlayid){

    const updatetble = document.getElementById('ft-data-table')
    const updaterow = updatetble.getElementsByTagName("tr"); 
    
    for (var i = 1; i < updaterow.length; i++) {
        var cellssearchid = updaterow[i].getElementsByTagName("td");

        if (cellssearchid[3].innerText === pasteid.value){

            cellssearchid[10].innerText = updateto.value
            cellssearchid[16].innerText = "Offline status update to " + updateto.value + "; Approved by "  + userRole + " " + formattedDateTime + "; " 

            document.getElementById(update).classList.remove('show');
            document.getElementById(overlayid).classList.remove('show');
            showNotification();
            xnotify.innerHTML = '<i class="fa-solid fa-circle-info" style="margin-right:10px; font-size:20px; color:white"></i>' + 
            "The Status has been updated."

        }
    }
  }
  
  function closeftupdate(update) {
    document.getElementById(update).classList.remove('show');
  }
