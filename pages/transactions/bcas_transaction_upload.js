function actnbtn() {
  const actionbtn = document.getElementById("actionbtn");
  var dropdown = document.getElementById("actionbtndrop");

  // Toggle the dropdown's visibility by adding/removing the 'show' class
  dropdown.classList.toggle("show");


  document.addEventListener("click", (event) => {
    // Check if the click was outside the button and dropdown
    if (!actionbtn.contains(event.target) && !actionbtdrop.contains(event.target)) {
      dropdown.classList.remove("show");
    }
  });

}


window.onclick = function(event) {
  var dropdown = document.getElementById("actionbtndrop");
  var button = document.getElementById("actionbtn");
  
  // If the click is not on the button or the dropdown, close the dropdown
  if (!button.contains(event.target) && !dropdown.contains(event.target)) {
    dropdown.classList.remove("show");
  }
}



function actnbtnx(){
   
    const actionbtn = document.getElementById("actionbtn");
    const actionbtdrop = document.getElementById("actionbtndrop");

    // Function to close the dropdown
    function closeDropdown() {
        actionbtdrop.style.opacity = "0";  // Fade out
        actionbtdrop.style.maxHeight = "0";  // Collapse the dropdown
       setTimeout(() => {
        actionbtdrop.style.display = "none";  // Hide the dropdown after animation
      }, 500);  // Wait for the animation to complete

    }


 //   actionbtn.addEventListener("click", (event) => {
  //    event.stopPropagation();  // Prevent the click event from propagating to the document

      // Get the position of the button relative to the document
      const buttonRect = actionbtn.getBoundingClientRect();
      
      // Check if dropdown is currently hidden or shown
      if (actionbtdrop.style.display === "none" || actionbtdrop.style.display === "") {
        actionbtdrop.style.display = "block";  // Show the dropdown
        actionbtdrop.style.maxHeight = "200px";  // Expand to the max height (adjust if needed)
        actionbtdrop.style.opacity = "1";  // Fade in

        // Dynamically position the dropdown below the button
        actionbtdrop.style.top = `${buttonRect.bottom + window.scrollY + 5}px`; // 5px margin from button


      } else {
        closeDropdown();
      }
   // });

    // Close the dropdown when clicking outside
    document.addEventListener("click", (event) => {
      // Check if the click was outside the button and dropdown
      if (!actionbtn.contains(event.target) && !actionbtdrop.contains(event.target)) {
        closeDropdown();
      }
    });

}




function uploadingtransaction(){

    const todate = new Date(trnxDate.value);
    const year = todate.getFullYear();
    const month = (todate.getMonth() + 1).toString().padStart(2, '0');
    const day = todate.getDate().toString().padStart(2, '0');
    const selecteddate  = `${month}/${day}/${year}`;  // yyyy/mm/dd



    const BCASTransactionstable = document.getElementById('BCAStransactions');
    const trRow = BCASTransactionstable.getElementsByTagName("tr");

    const frombcasfttable = document.getElementById('frombcasfttable');
    const ftRow = frombcasfttable.getElementsByTagName("tr");

    for (let i = 1; i < ftRow.length; i++) {
        let cellrecord = ftRow[i].getElementsByTagName("td");         
   
        for (let j = 1; j < trRow.length; j++) {
            let cellupload = trRow[j].getElementsByTagName("td"); 
                
              if (cellrecord[8].textContent === cellupload[10].innerText && selecteddate === cellupload[11].innerText ){                
             
                  cellrecord[10].textContent = cellupload[11].innerText;
                  cellrecord[11].textContent = cellupload[1].innerText;
                  cellrecord[12].textContent = cellupload[2].innerText;
                  cellrecord[13].textContent = Bcasbranch.value;
                  cellrecord[14].textContent = cellupload[3].innerText;                 
                  cellrecord[15].textContent = cellupload[4].innerText;
                  cellrecord[15].style.textAlign = 'right';
                  cellrecord[16].textContent = cellupload[5].innerText;
                  cellrecord[16].style.textAlign = 'right';
                  cellrecord[17].textContent = cellupload[7].innerText;
                  cellrecord[18].textContent = cellupload[12].innerText;
                 if (!cellrecord[19]) {
                  const newCell = ftRow[i].insertCell(18);
                  newCell.textContent = formattedDateTime; // or '' if you prefer
                   } else {
                  cellrecord[19].textContent = formattedDateTime;
                  }


              } 

          
        }
        
      
      }

      const waiting = document.getElementById('bcasftuploadwaiting');
    const xwaiting = document.getElementById('xwaiting'); 
    document.getElementById('bcasftretryconfirmation').classList.remove('show');
    waiting.classList.add('show');
    xwaiting.innerHTML = '<i class="fa-solid fa-circle-info" style="margin-right:10px; font-size:30px; color:white"></i>' +
            " Reuploading Fund Transfer Transaction in  10"
   
    const timerInterval = setInterval(() => {
        if (countdownTime > 0) {
           
            xwaiting.innerHTML = '<i class="fa-solid fa-circle-info" style="margin-right:10px; font-size:30px; color:white"></i>' +
            " Reuploading Fund Transfer Transaction in " + countdownTime; 
            countdownTime--; 
        } else { 
            clearInterval(timerInterval); 
            waiting.classList.remove('show'); 
            
            


            showNotification(); 

            // Adjust notification styles
            xnotification.style.bottom = '75px';
            xnotification.style.right = '75px';
            xnotification.style.width = '400px';  
            xnotification.style.backgroundColor = 'green';

            // Set notification text
            xnotify.innerHTML = '<i class="fa-solid fa-circle-info" style="margin-right:10px; font-size:20px; color:white"></i>' + 
            "Transaction has been successfully uploaded to the server.";



            for (let i = 1; i < ftRow.length; i++) {
              let cellrecord = ftRow[i].getElementsByTagName("td");               
            
              for (let j = 1; j < trRow.length; j++) {
                  let cellupload = trRow[j].getElementsByTagName("td"); 
                     
                    if (cellrecord[8].textContent === cellupload[10].innerText && selecteddate === cellupload[11].innerText ){           
                       
          
      
                        cellupload[8].textContent = 'Uploaded'
      
                    } 
      
                
              }
              
            
            }







        }
    }, 1000); 

    document.getElementById("actionbtndrop").classList.remove("show");

}