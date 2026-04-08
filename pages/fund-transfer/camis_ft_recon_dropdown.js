const searchInputarearecon = document.getElementById("Area");
const dropdownListarearecon = document.getElementById("dropdownList-arearecon");

document.getElementById('Area').addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault(); 
  }
});

function toggleDropdownarearecon() {
    dropdownListarearecon.style.display = dropdownListarearecon.style.display === "block" ? "none" : "block";
}

function filterDropdownarearecon() {

 
  const filterarearecon = searchInputarearecon.value.toUpperCase();
  const itemsarearecon = dropdownListarearecon.getElementsByTagName("div");

  // Show dropdown if there's input, otherwise hide it
  dropdownListarearecon.style.display = filterarearecon ? "block" : "none";

  for (let i = 0; i < itemsarearecon.length; i++) {
      const itemarearecon = itemsarearecon[i];
      const txtValuearearecon = itemarearecon.textContent || itemarearecon.innerText;

      if (txtValuearearecon.toUpperCase().indexOf(filterarearecon) > -1) {
          itemarearecon.style.display = "";
      } else {
          itemarearecon.style.display = "none";
      }
  }
}

// Handle item selection
dropdownListarearecon.addEventListener("click", function(event) {

  if (event.target.tagName === "DIV") {
      searchInputarearecon.value = event.target.textContent;
      dropdownListarearecon.style.display = "none"; // Hide the dropdown after selection
  }
});

// Close dropdown if clicked outside
window.addEventListener("click", function(event) {

  if (!event.target.closest('.dropdown')) {
    dropdownListarearecon.style.display = "none";
  }
});

const selectElementarearecon = document.getElementById('Area');

selectElementarearecon.addEventListener('change', function () {
// Check if the placeholder option is selected (value is empty string)
if (selectElementarearecon.value === '') {
  selectElementarearecon.value = '';  // This will ensure the value is set to blank
}
});











const searchInputbranchrecon = document.getElementById("recnBranch");
const dropdownListbranchrecon = document.getElementById("dropdownList-branchrecon");

document.getElementById('recnBranch').addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault(); 
  }
});

function toggleDropdownbranchrecon () {
    dropdownListbranchrecon.style.display = dropdownListbranchrecon.style.display === "block" ? "none" : "block";
}

function filterDropdownbranchrecon () {


  const filterbranchrecon  = searchInputbranchrecon.value.toUpperCase();
  const itemsbranchrecon  = dropdownListbranchrecon.getElementsByTagName("div");

  // Show dropdown if there's input, otherwise hide it
  dropdownListbranchrecon.style.display = filterbranchrecon  ? "block" : "none";

  for (let i = 0; i < itemsbranchrecon.length; i++) {
      const itembranchrecon  = itemsbranchrecon [i];
      const txtValuebranchrecon = itembranchrecon.textContent || itembranchrecon.innerText;

      if (txtValuebranchrecon.toUpperCase().indexOf(filterbranchrecon ) > -1) {
          itembranchrecon.style.display = "";
      } else {
          itembranchrecon.style.display = "none";
      }
  }
}

// Handle item selection
dropdownListbranchrecon .addEventListener("click", function(event) {

  if (event.target.tagName === "DIV") {
      searchInputbranchrecon.value = event.target.textContent;
      dropdownListbranchrecon.style.display = "none"; // Hide the dropdown after selection
  }
});

// Close dropdown if clicked outside
window.addEventListener("click", function(event) {

  if (!event.target.closest('.dropdown')) {
    dropdownListbranchrecon.style.display = "none";
  }
});

const selectElementbranchrecon  = document.getElementById('recnBranch');

selectElementbranchrecon.addEventListener('change', function () {
// Check if the placeholder option is selected (value is empty string)
if (selectElementbranchrecon.value === '') {
  selectElementbranchrecon.value = '';  // This will ensure the value is set to blank
}
});



const searchInputtyperecon = document.getElementById("recntype");
const dropdownListtyperecon = document.getElementById("dropdownList-typerecon");

document.getElementById('recntype').addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault(); 
  }
});

function toggleDropdowntyperecon () {
    dropdownListtyperecon.style.display = dropdownListtyperecon.style.display === "block" ? "none" : "block";
}

function filterDropdowntyperecon () {


  const filtertyperecon  = searchInputtyperecon.value.toUpperCase();
  const itemstyperecon = dropdownListtyperecon.getElementsByTagName("div");

  // Show dropdown if there's input, otherwise hide it
  dropdownListtyperecon.style.display = filtertyperecon  ? "block" : "none";

  for (let i = 0; i < itemstyperecon.length; i++) {
      const itemtyperecon = itemstyperecon [i];
      const txtValuetyperecon = itemtyperecon.textContent || itemtyperecon.innerText;

      if (txtValuetyperecon.toUpperCase().indexOf(filtertyperecon ) > -1) {
          itemtyperecon.style.display = "";
      } else {
          itemtyperecon.style.display = "none";
      }
  }
}

// Handle item selection
dropdownListtyperecon.addEventListener("click", function(event) {

  if (event.target.tagName === "DIV") {
      searchInputtyperecon.value = event.target.textContent;
      dropdownListtyperecon.style.display = "none"; // Hide the dropdown after selection
  }
});

// Close dropdown if clicked outside
window.addEventListener("click", function(event) {

  if (!event.target.closest('.dropdown')) {
    dropdownListtyperecon.style.display = "none";
  }
});

const selectElementtyperecon  = document.getElementById('recntype');

selectElementtyperecon.addEventListener('change', function () {
// Check if the placeholder option is selected (value is empty string)
if (selectElementtyperecon.value === '') {
  selectElementtyperecon.value = '';  // This will ensure the value is set to blank
}
});









const searchInputcluster = document.getElementById("cluster");
const dropdownListcluster = document.getElementById("dropdownList-cluster");

document.getElementById('cluster').addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault(); 
  }
});

function toggleDropdowncluster () {
    dropdownListcluster.style.display = dropdownListcluster.style.display === "block" ? "none" : "block";
}

function filterDropdowncluster () {

    const filtercluster  = searchInputcluster.value.toUpperCase();
    const itemscluster = dropdownListcluster.getElementsByTagName("div");
  
    // Show dropdown if there's input, otherwise hide it
    dropdownListcluster.style.display = filtercluster  ? "block" : "none";
  
    for (let i = 0; i < itemscluster.length; i++) {
        const itemcluster  = itemscluster [i];
        const txtValuecluster = itemcluster.textContent || itemcluster.innerText;
  
        if (txtValuecluster.toUpperCase().indexOf(filtercluster ) > -1) {
            itemcluster.style.display = "";
        } else {
            itemcluster.style.display = "none";
        }
    }
 
}

// Handle item selection
dropdownListcluster.addEventListener("click", function(event) {

  if (event.target.tagName === "DIV") {
      searchInputcluster.value = event.target.textContent;
      dropdownListcluster.style.display = "none"; // Hide the dropdown after selection
  }
});

// Close dropdown if clicked outside
window.addEventListener("click", function(event) {

  if (!event.target.closest('.dropdown')) {
    dropdownListcluster.style.display = "none";
  }
});

const selectElementcluster  = document.getElementById('cluster');

selectElementcluster.addEventListener('change', function () {
// Check if the placeholder option is selected (value is empty string)
if (selectElementcluster.value === '') {
  selectElementcluster.value = '';  // This will ensure the value is set to blank
}
});



