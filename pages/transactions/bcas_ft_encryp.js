function bcasencryptRow(tableId, erow, Bcasbranch, colid, coltype ,coldte,  event,) {
    event.preventDefault(); 
    const buttonrow = event.target.closest('tr');     
    const row = buttonrow
    
    let rowData = "";
    const qdate = row.cells[coldte].innerText; // Get the specific cell (0-based index)
    const qtype = row.cells[coltype].innerText; // Get the specific cell (0-based index)
    const qid = row.cells[colid].innerText; // Get the specific cell (0-based index)
    const qbranch = document.getElementById(Bcasbranch).value; // Get the specific cell (0-based index)

    var space = document.querySelectorAll('p');

    // Loop through each cell in the row
    for (let i = 1; i < row.cells.length; i++) { // Exclude the last cell with the button
        rowData += row.cells[i].innerText + "|"; // Concatenate cell data with space
    }

  
    // Base64 encode the concatenated row data
    let encodedData = btoa(rowData); // btoa() encodes the string to Base64

    // Display the encoded Base64 data in a textarea
   // document.getElementById("base64Output").value = encodedData;
    
     let encodedText = "Offline update code of: " + qbranch + " | " +  qtype + " | " + qid + " | " + qdate ;  
     let modifiedText = encodedText.replace( qdate, qdate + "\n\n" +  encodedData );

    // Check if there's any Base64 data to copy
    if (modifiedText.trim() === "") {
        alert("No data to copy!");
        return;
    }
    
    // Use the Clipboard API to copy text to clipboard
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




function closebcasova(BCASoverlayId){
    document.getElementById(BCASoverlayId).classList.remove('show');
}
