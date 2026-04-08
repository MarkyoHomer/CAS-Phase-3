    // Pagination and Search Implementation
    let currentPage = 1;
    const rowsPerPage = 5;

// Function to paginate the table
    function paginateTable() {
        const table = document.getElementById("myTable");
        const rows = table.getElementsByTagName("tr");
        const totalRows = rows.length - 1; // Excluding the header row
        const totalPages = Math.ceil(totalRows / rowsPerPage);

        // Hide all rows initially
        for (let i = 1; i < rows.length; i++) {
            rows[i].style.display = "none";
        }

        // Show only the rows that belong to the current page
        for (let i = (currentPage - 1) * rowsPerPage + 1; i < currentPage * rowsPerPage + 1; i++) {
            if (rows[i]) {
                rows[i].style.display = "";
            }
        }

        // Disable previous and next buttons if on first or last page
        document.getElementById("prevBtn").classList.toggle("disabled", currentPage === 1);
        document.getElementById("nextBtn").classList.toggle("disabled", currentPage === totalPages);
        document.getElementById("prevBtn").disabled = currentPage === 1;
        document.getElementById("nextBtn").disabled = currentPage === totalPages;
    }

    // Function to change the current page
    function changePage(direction) {
        currentPage += direction;
        paginateTable();
    }

    // Function to search and filter the table
   
    // Initialize the table and pagination
    //window.onload = function() {
       // paginateTable();
    //};

    