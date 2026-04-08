function encryptRow(tableId, enrow, event, coldte, coltype ,colo, coldes) {
    event.preventDefault(); 

    const buttonrow = event.target.closest('tr');     
    const row = buttonrow
    let rowData = "";
    const xdate = row.cells[coldte].innerText; 
    const xtype = row.cells[coltype].innerText; 
    const xorig = row.cells[colo].innerText; 
    const xdes = row.cells[coldes].innerText;  

    // Loop through each cell in the row
    for (let i = 1; i < row.cells.length; i++) { 
        rowData += row.cells[i].innerText + "|"; 
    }
  
    // Base64 encode the concatenated row data
    let encodedData = btoa(rowData); // btoa() encodes the string to Base64

    // Display the encoded Base64 data in a textarea
   // document.getElementById("base64Output").value = encodedData;
    
     let encodedText = "Reference code: " +  xtype + " | " + xorig + "-" + xdes + " | " + xdate ;
    
     let modifiedText = encodedText.replace( xdate, xdate + "\n\n" +  encodedData );

    // Check if there's any Base64 data to copy
    if (modifiedText.trim() === "") {
        alert("No data to copy!");
        return;
    }
    
    // Use the Clipboard API to copy text to clipboard
    navigator.clipboard.writeText(modifiedText).then(() => {
       
       const xnotify = document.getElementById('xnotify');
        showNotification();
        xnotify.innerHTML = '<i class="fa-solid fa-circle-info" style="margin-right:10px; font-size:20px; color:white"></i>' + 
            "Reference code is copied to the clipboard!"

        xnotification.style.width = '350px'
        xnotification.style.bottom = '5px';
        xnotification.style.right = '5px';
    
      
      //  alert("Reference Code is copied to clipboard!");
    }).catch(err => {
        console.error("Error copying text: ", err);
    }); 
   
}

function showNotification() {
    const notification = document.getElementById('xnotification');
    
    // Add the 'show' class to display the notification
    notification.classList.add('show');
    
    // Hide the notification after 3 seconds
    setTimeout(() => {
      notification.classList.remove('show');
    }, 3000);
  }






