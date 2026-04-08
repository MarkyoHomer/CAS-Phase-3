
const voiding = document.getElementById('voidreq');


function clossvoid(){
    voiding.classList.remove('show'); 
}



function voidencryp(event) {
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


// Remove the last '|' if there's one
rowData = rowData.slice(0, -1);

// Split rowData by '|' to handle individual cell data
let dataArray = rowData.split("|");

// Check if the 10th data exists and replace it (index 9)




const today =   new Date(qdate ); 
const year = today.getFullYear();
const month = (today.getMonth() + 1).toString().padStart(2, '0');
const day = today.getDate().toString().padStart(2, '0');
const refformattedDate = `${month}${day}${year}`;
const fttrnum = row.cells[15].innerText    

if (dataArray.length >= 10) {
    dataArray[9] = "Voided-" + row.cells[10].innerText; 
    dataArray[10] = "Not Updated";  // Replace the 10th value (index 9) with "New Value"
    dataArray[13] = "FT-" + qbranch  + refformattedDate + "-" + fttrnum + "-" + row.cells[10].innerText;   + "-Voided" 
}

// Rebuild the rowData string with the updated value

 rowData = dataArray.join("|");
  
    // Base64 encode the concatenated row data
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
