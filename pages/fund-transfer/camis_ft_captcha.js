function openSubOverlay(suboverlayId, openbtn) {  

    document.getElementById('suboverlay2').classList.add('show');
    const NStatusoverlay2 = document.getElementById('NStatus-overlay2').innerText;
    const notif =  document.getElementById('row-suboverlay2').innerText 
    const NewRw = sessionStorage.getItem("Newrow");  
    const table = document.getElementById('ft-data-table');
    const targetRow = table.rows[NewRw]; 
    const priorstat = targetRow.cells[17].innerText;
    const custat = targetRow.cells[10].innerText;
    if (openbtn === 'ack') {
      document.getElementById('row-suboverlay2').value = "Acknowledge Transaction";
      var Nstatus = "Acknowledged"
      var Ostatus = NStatusoverlay2
      var ftacknowledgements = "FTack"
      sessionStorage.setItem("FTacknow", ftacknowledgements);
      sessionStorage.setItem("NewStatus", Nstatus);
      sessionStorage.setItem("OldStatus", Ostatus);
     } else if (openbtn === 'cancel-ack') {
     document.getElementById('row-suboverlay2').value = "Cancel Acknowledged Transaction";
      var Nstatus = "In-Transit"
      var Ostatus = NStatusoverlay2
      sessionStorage.setItem("NewStatus", Nstatus);
    sessionStorage.setItem("OldStatus", Ostatus);

    } else if (openbtn === 'flag') {
      document.getElementById('row-suboverlay2').value = "Flag as Under Review";
      var Nstatus = "Under Review"
      var Ostatus = NStatusoverlay2
      sessionStorage.setItem("NewStatus", Nstatus);
    sessionStorage.setItem("OldStatus", Ostatus);

    } else if (openbtn === 'cancel-deny') {
        document.getElementById('row-suboverlay2').value = "Recall Denied Transaction";
        var Nstatus = "In-Transit"
        var Ostatus = NStatusoverlay2
        sessionStorage.setItem("NewStatus", Nstatus);
    sessionStorage.setItem("OldStatus", Ostatus);
   
    } else if (openbtn === 'deny') {
         document.getElementById('row-suboverlay2').value = "Deny Transaction";
         var Nstatus = "Denied"
         var Ostatus = NStatusoverlay2
         sessionStorage.setItem("NewStatus", Nstatus);
    sessionStorage.setItem("OldStatus", Ostatus);

    } else if (openbtn === 'cancel-flag') {
        document.getElementById('row-suboverlay2').value = "Conclude Flagged Transaction";
        var Nstatus = priorstat
        var Ostatus  = "Under Review"
        sessionStorage.setItem("NewStatus", Nstatus);
    sessionStorage.setItem("OldStatus", Ostatus);
    } else if (openbtn === 'cancel-new') {
      document.getElementById('row-suboverlay2').value = "Void Transaction";
         if(custat ==='Pending'){
         var Nstatus = "Voided"
         var Ostatus = NStatusoverlay2
         }else{

         var Nstatus = "Pending-Void"
         var Ostatus = NStatusoverlay2
         }

       
      //var Nstatus = "Voided"
      //var Ostatus = NStatusoverlay2
      sessionStorage.setItem("NewStatus", Nstatus);
    sessionStorage.setItem("OldStatus", Ostatus);
    }

    
    //generate captcha
    const chars =  "ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789";
    let captcha = "";
    for (let i = 0; i < 4; i++) {
        captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    document.getElementById("captcha-code-suboverlay2").innerText = captcha;

  }
  

  function validateCaptcha(tableId, row, col, xtableId, xrow, xcol , suboverlayId, overlayId) {
    const userRole = sessionStorage.getItem('userRole');
    const NewStatus = sessionStorage.getItem("NewStatus"); 
    const OldStatus = sessionStorage.getItem("OldStatus");
    const bcasftid = sessionStorage.getItem("ftid"); 
    const statvoided = sessionStorage.getItem("statsvoided"); 
   
    console.log(bcasftid )
    const NewRw = sessionStorage.getItem("Newrow");     
    const remakssuboverlay2 =  document.getElementById('remaks-suboverlay2').value.toUpperCase();
    const input = document.getElementById("captcha-input-suboverlay2").value;
    const captchaCode = document.getElementById("captcha-code-suboverlay2").innerText;
    const messageElement = document.getElementById("message-suboverlay2");

    const table = document.getElementById(tableId);
    const targetRow = table.rows[NewRw]; 
    const closedby =  targetRow.cells[14];
    const ztype =  targetRow.cells[2];
    const closeddate = targetRow.cells[15];
    const statremarks = targetRow.cells[16];
    const priorstat = targetRow.cells[17];
    const targetCell = targetRow.cells[10]; 
    const xcurstat = targetRow.cells[10]; 
    const bcsftid = targetRow.cells[18];
    const cdate =  formatDatetime(new Date());

    let Remarks = document.getElementById("remaks-suboverlay2").value.trim();

    if (input === captchaCode) {
              if (Remarks === ''){
                messageElement.textContent = "Remarks is Required.";
                messageElement.style.color = "red";
              
              
              } else { 

                        priorstat.innerText = OldStatus
                        targetCell.textContent = NewStatus; 

                                             
                        document.getElementById('suboverlay2').classList.remove('show');
                        modalwidth.style.width = '470px';
                        fieldsetcontainer.style.gap = '20px';
                        toggleButton.innerHTML = '<i class="fas fa-circle-arrow-right"></i>';
                        document.getElementById(overlayId).classList.remove('show');
                        document.getElementById("message-suboverlay2").innerText = ""
                        showNotification();
                        xnotify.innerHTML = '<i class="fa-solid fa-circle-info" style="margin-right:10px; font-size:20px; color:white"></i>' + 
                         "The status of transaction is successfully updated to " + NewStatus
                        
                     //to acknowledged
                      if(xcurstat.innerText === 'Acknowledged' && (ztype.innerText === 'Deposit' ||ztype.innerText === 'Withdraw' )  
                        && priorstat.innerText !== 'Under Review'){
                        closedby.textContent = userRole  + "1234"
                        closeddate.textContent = cdate
                        statremarks.innerText =  statremarks.innerText  + " Acknowledged by: " + userRole + "1234"  + " " +
                        cdate + " " + remakssuboverlay2 + "; "

                     
                     //to denied
                      }else if((xcurstat.innerText === 'Denied') && (ztype.innerText === 'Deposit' ||ztype.innerText === 'Withdraw') 
                         && priorstat.innerText !== 'Under Review'){                     
                        statremarks.innerText =  statremarks.innerText  + " Denied by: " + userRole + "1234" + " "  + 
                        cdate + " " + remakssuboverlay2 + "; "
                        closedby.textContent = "--"
                        closeddate.textContent = "--"


                     //cancel acknowledge or recall denied
                      }else if((xcurstat.innerText === 'In-Transit') && (ztype.innerText === 'Deposit' ||ztype.innerText === 'Withdraw') 
                         && priorstat.innerText !== 'Under Review'){                     
                        statremarks.innerText =  statremarks.innerText  + " Modified by: "  + userRole + "1234" + " "  + 
                        cdate + " " + remakssuboverlay2 + "; "
                       
                        closedby.textContent = "--"
                        closeddate.textContent = "--"

                     // void receive
                    }else if((xcurstat.innerText === 'In-Transit' ) && ztype.innerText === 'Send' && priorstat.innerText !== 'Under Review'){                     
                        statremarks.innerText =  statremarks.innerText  + " Voided Receive; Confirmed by "  + userRole + "1234" + " "  + 
                        cdate + " " + remakssuboverlay2 + "; "
                   
                        closedby.textContent = "--"
                        closeddate.textContent = "--"  
                        
                        
                     //void pending or void open transaction of branch (send, deposit, withdraw)    
                      }else if((xcurstat.innerText === 'Voided' || xcurstat.innerText === 'Pending-Void')  &&  priorstat.innerText !== 'Under Review'){                         
                        statremarks.innerText =  statremarks.innerText  + " Voided by: " + userRole + "1234" + " " + 
                        cdate + " " + remakssuboverlay2 + "; "
               

                      // to flag as under review  
                      }else if(xcurstat.innerText === 'Under Review'){
                        statremarks.innerText =  statremarks.innerText  + " Under Reviewed by: "  + userRole + "1234"+ " "  + 
                        cdate + " " + remakssuboverlay2 + "; "
                     

                      // to conclude under review                                              
                        
                      } else  {
                        statremarks.innerText =  statremarks.innerText  + " Concluded by: "  + userRole + "1234"+ " "  + 
                        cdate + " " + remakssuboverlay2 + "; "
                        
                      }  


                  

                }

    document.getElementById("message-" + suboverlayId).innerText = ""; 
    document.getElementById("remaks-suboverlay2").value = "";
    document.getElementById("captcha-input-suboverlay2").value = "";
             
                
       } else {
        messageElement.textContent = "Incorrect CAPTCHA. Please try again.";
        messageElement.style.color = "red";
      }
   
    }


function regenerateCaptcha(suboverlayId) {
    document.getElementById("message-" + suboverlayId).innerText = ""
    const chars = "ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789";
    let captcha = "";
    for (let i = 0; i < 4; i++) {
        captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    document.getElementById("captcha-code-" + suboverlayId).innerText = captcha;

}

function closeSubOverlay(suboverlayId) {
  
    document.getElementById(suboverlayId).classList.remove('show');
    document.getElementById("message-" + suboverlayId).innerText = ""; 
    document.getElementById("remaks-suboverlay2").value = "";
    document.getElementById("captcha-input-suboverlay2").value = "";

  } 



  function acknowledgemessage(openbtn){ 
    document.getElementById('ackconfirmation').classList.add('show');
    const Ackmessage = document.getElementById("ackmessage");
    const xNStatusoverlay2 = document.getElementById('NStatus-overlay2').innerText;
    const xnotif =  document.getElementById('row-suboverlay2').innerText 
    const xNewRw = sessionStorage.getItem("Newrow");  
    const xtable = document.getElementById('ft-data-table');
    const xtargetRow = xtable.rows[xNewRw]; 
    const xpriorstat = xtargetRow.cells[17].innerText;  
     
      var xNstatus = "Acknowledged"
      var xOstatus = xNStatusoverlay2
      sessionStorage.setItem("NewStatus", xNstatus);
      sessionStorage.setItem("OldStatus", xOstatus);


    Ackmessage.innerHTML = "Do you want to continue with the acknowledgement of this transaction?";
  }

   function closeackftnew() {
    document.getElementById('ackconfirmation').classList.remove('show');
  }


function ackvalidateconfirm(tableId, arow, acol, atableId, brow, bcol , suboverlayId, overlayId) {
    const userRole = sessionStorage.getItem('userRole');
    const NewStatus = sessionStorage.getItem("NewStatus"); 
    const OldStatus = sessionStorage.getItem("OldStatus");
    const bcasftid = sessionStorage.getItem("ftid"); 
    const statvoided = sessionStorage.getItem("statsvoided"); 
    console.log(bcasftid )
    const NewRw = sessionStorage.getItem("Newrow");     
    const remakssuboverlay2 =  document.getElementById('remaks-suboverlay2').value.toUpperCase();
    const input = document.getElementById("captcha-input-suboverlay2").value;
    const captchaCode = document.getElementById("captcha-code-suboverlay2").innerText;
    const messageElement = document.getElementById("message-suboverlay2");

    const table = document.getElementById(tableId);
    const targetRow = table.rows[NewRw]; 
    const closedby =  targetRow.cells[14];
    const ztype =  targetRow.cells[2];
    const closeddate = targetRow.cells[15];
    const statremarks = targetRow.cells[16];
    const priorstat = targetRow.cells[17];
    const targetCell = targetRow.cells[10]; 
    const xcurstat = targetRow.cells[10]; 
    const bcsftid = targetRow.cells[18];
    const cdate =   formattedDateTime;

    let Remarks = document.getElementById("remaks-suboverlay2").value.trim();

  

                        priorstat.innerText = OldStatus
                        targetCell.textContent = NewStatus; 

                                             
                        document.getElementById('suboverlay2').classList.remove('show');
                        modalwidth.style.width = '470px';
                        fieldsetcontainer.style.gap = '20px';
                        toggleButton.innerHTML = '<i class="fas fa-circle-arrow-right"></i>';
                        document.getElementById(overlayId).classList.remove('show');
                        document.getElementById("message-suboverlay2").innerText = ""
                        showNotification();
                        xnotify.innerHTML = '<i class="fa-solid fa-circle-info" style="margin-right:10px; font-size:20px; color:white"></i>' + 
                         "The status of transaction is successfully updated to " + NewStatus
                        
                     //to acknowledged
                      if(xcurstat.innerText === 'Acknowledged' && (ztype.innerText === 'Deposit' ||ztype.innerText === 'Withdraw' )  
                        && priorstat.innerText !== 'Under Review'){
                        closedby.textContent = userRole  + "1234"
                        closeddate.textContent = cdate
                        statremarks.innerText =  statremarks.innerText  + " Acknowledged by: " + userRole + "1234"  + " " +
                        cdate + " " + remakssuboverlay2 + "; "

                     
                     //to denied
                      }else if((xcurstat.innerText === 'Denied') && (ztype.innerText === 'Deposit' ||ztype.innerText === 'Withdraw') 
                         && priorstat.innerText !== 'Under Review'){                     
                        statremarks.innerText =  statremarks.innerText  + " Denied by: " + userRole + "1234" + " "  + 
                        cdate + " " + remakssuboverlay2 + "; "
                        closedby.textContent = "--"
                        closeddate.textContent = "--"


                     //cancel acknowledge or recall denie
                      }else if((xcurstat.innerText === 'In-Transit') && (ztype.innerText === 'Deposit' ||ztype.innerText === 'Withdraw') 
                         && priorstat.innerText !== 'Under Review'){                     
                        statremarks.innerText =  statremarks.innerText  + " Modified by: "  + userRole + "1234" + " "  + 
                        cdate + " " + remakssuboverlay2 + "; "
                       
                        closedby.textContent = "--"
                        closeddate.textContent = "--"

                     // void receive
                    }else if((xcurstat.innerText === 'In-Transit') && ztype.innerText === 'Send' && priorstat.innerText !== 'Under Review'){                     
                        statremarks.innerText =  statremarks.innerText  + " Voided Receive; Confirmed by "  + userRole + "1234" + " "  + 
                        cdate + " " + remakssuboverlay2 + "; "
                   
                        closedby.textContent = "--"
                        closeddate.textContent = "--"  
                        
                        
                     //void pending or void open transaction of branch (send, deposit, withdraw)    
                      }else if(xcurstat.innerText === 'Voided'  &&  priorstat.innerText !== 'Under Review'){                         
                        statremarks.innerText =  statremarks.innerText  + " Voided by: " + userRole + "1234" + " " + 
                        cdate + " " + remakssuboverlay2 + "; "
               

                      // to flag as under review  
                      }else if(xcurstat.innerText === 'Under Review'){
                        statremarks.innerText =  statremarks.innerText  + " Under Reviewed by: "  + userRole + "1234"+ " "  + 
                        cdate + " " + remakssuboverlay2 + "; "
                     

                      // to conclude under review                                              
                        
                      } else  {
                        statremarks.innerText =  statremarks.innerText  + " Concluded by: "  + userRole + "1234"+ " "  + 
                        cdate + " " + remakssuboverlay2 + "; "
                        
                      }  


                
     closeackftnew() 
  }
  
   
  function reversedvoid(){

                    const NEWofflineUpd = sessionStorage.getItem("offlineupdate"); 
                     if (NEWofflineUpd === 'offlineUp'){

                      const ztableBody = document.getElementById('BCASfttable')
                      const rwindex = sessionStorage.getItem("retryrow") // to get the fttablerow where the retrybutton is located    
                      const row = ztableBody.rows[rwindex]  // to find the fttable  row in ft table where the retrybutton is located 
                    
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
                  
                      udateCell.textContent  = targetRow.cells[1].innerText; 
                      utypeCell.textContent = targetRow.cells[2].innerText;
                      utridCell.textContent = targetRow.cells[3].innerText;
                      uorigCell.textContent  = targetRow.cells[5].innerText;
                      udestCell.textContent = targetRow.cells[6].innerText;
                      uamountCell.textContent = targetRow.cells[4].innerText;
                      ucourierCell.textContent = targetRow.cells[7].innerText;
                      uremarksCell.textContent = targetRow.cells[8].innerText;
                      uftidcodeCell.textContent =   bcasftid ;
                      areaCell.textContent =  targetRow.cells[11].innerText;
                      }       



                       const ftacknow = sessionStorage.getItem("FTacknow")
                      if (ftacknow === 'FTack'){

                      const ztableBody = document.getElementById('BCASfttable')
                      const rwindex = sessionStorage.getItem("retryrow") // to get the fttablerow where the retrybutton is located    
                      const row = ztableBody.rows[rwindex]  // to find the fttable  row in ft table where the retrybutton is located 
                    
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
                  
                      udateCell.textContent  = targetRow.cells[1].innerText; 
                      utypeCell.textContent = targetRow.cells[2].innerText;
                      utridCell.textContent = targetRow.cells[3].innerText;
                      uorigCell.textContent  = targetRow.cells[5].innerText;
                      udestCell.textContent = targetRow.cells[6].innerText;
                      uamountCell.textContent = targetRow.cells[4].innerText;
                      ucourierCell.textContent = targetRow.cells[7].innerText;
                      uremarksCell.textContent = targetRow.cells[8].innerText;
                      uftidcodeCell.textContent =   bcasftid ;
                      areaCell.textContent =  targetRow.cells[11].innerText;    

                     }



  }

