$(document).ready(function () {
    graduateHeaderTable();
    fetchGraduateHdrData();
});

function throwError(xhr, status){
    var response = JSON.parse(xhr.responseText);
    if (response.errors) {
        Object.keys(response.errors).forEach(key => {
            Toastify({
                text: response.errors[key],
                duration: 3000,
                newWindow: true,
                close: true,
                gravity: "top", // `top` or `bottom`
                position: "right", // `left`, `center` or `right`
                stopOnFocus: true, // Prevents dismissing of toast on hover
                style: {
                  background: "linear-gradient(to right, #ff0000, #ff7f50)",
                },
                onClick: function(){}
              }).showToast();
            console.log("Error key:", key);
            console.log("Error message:", response.errors[key]);
        });
    }
}

const graduateHeaderTable = () => {
    const defaultDateFilter = {
        column: 'date',
        filterType: 'thisYear',
    };

    const getDateFilter = (filterType) => {
        const currentDate = new Date();
        let startDate = '', endDate = '';

        switch (filterType) {
            case 'thisMonth':
                startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
                break;
            case 'thisQuarter':
                const quarter = Math.floor(currentDate.getMonth() / 3);
                startDate = new Date(currentDate.getFullYear(), quarter * 3, 1);
                endDate = new Date(currentDate.getFullYear(), (quarter + 1) * 3, 0);
                break;
            case 'thisYear':
                startDate = new Date(currentDate.getFullYear(), 0, 1);
                endDate = new Date(currentDate.getFullYear(), 11, 31);
                break;
        }

        return { startDate, endDate };
    };

    const { startDate, endDate } = getDateFilter(defaultDateFilter.filterType);

    let columns = [
        {
            titleFormatter: () => `
                <div style="line-height: 1.2;">
                    <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                        ADDED BY
                    </strong><br>
                    <span style="font-size: 0.75em; color: #888;">Updated on</span>
                </div>`,
            field: "name",
            headerHozAlign: "center",
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle",
            formatter: function (cell) {
                const data = cell.getData();
                return `
                    <div>
                        <div>${data.name}</div>
                        <span style="font-size: 0.8em; color: #888;">${data.updated_at}</span>
                    </div>
                `;
            }
        },
        {
            titleFormatter: () => `
                <div style="line-height: 2.5;">
                    <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                        PROGRAM
                    </strong>
                </div>`,
            field: "program_id",
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle",
        },
        {
            titleFormatter: () => `
                <div style="line-height: 2.5;">
                    <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                        SEMESTER
                    </strong>
                </div>`,
            field: "semester",
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle",
        },
        {
            titleFormatter: () => `
                <div style="line-height: 2.5;">
                    <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                        ACADEMIC YEAR
                    </strong>
                </div>`,
            field: "school_year",
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle",
        },
        {
            titleFormatter: () => `
                <div style="line-height: 2.5;">
                    <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                        NO. OF STUDENTS
                    </strong>
                </div>`,
            field: "number_of_student",
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle",
        },
        {
            titleFormatter: () => `
                <div style="line-height: 2.5;">
                    <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                        DATE
                    </strong>
                </div>`,
            field: "date",
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle",
        }
    ];

    if (window.userPosition != 5) {
        columns.push({
            titleFormatter: () => `
                <div style="line-height: 2.5;">
                    <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                        ACTION
                    </strong>
                </div>`,
            field: "action",
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            formatter: "html",
            vertAlign: "middle",
            download: false,
        });
    }

    graduatesHeader = new Tabulator("#graduate-header-table", {
        dataTree: true,
        dataTreeSelectPropagate: true,
        layout: "fitDataFill",
        maxHeight: "1000px",
        scrollToColumnPosition: "center",
        pagination: "local",
        placeholder: "No Data Available",
        paginationSize: 10,
        paginationSizeSelector: [10, 50, 100],
        selectable: 1,
        initialSort: [
            { column: "updated_at", dir: "asc" }
        ],
        initialFilter: [
            {
                field: defaultDateFilter.column,
                type: "between",
                value: [startDate.toISOString(), endDate.toISOString()]
            }
        ],
        rowFormatter: function (row) {
            const element = row.getElement();
            const index = row.getPosition(true);
            element.style.color = "#000000";
            element.style.backgroundColor = index % 2 === 0 ? "#FFF1D1" : "#ffffff";
        },
        columns: columns
    });
};


let graduateDetailsTable = () => {
    graduatesDetails = new Tabulator("#graduate-details-table", {
        dataTree:true,
        dataTreeSelectPropagate:true,
        // layout:"fitDataFill",
        layout:"fitColumns",
        maxHeight: "1000px",
        scrollToColumnPosition: "center",
        placeholder:"No Data Available", 
        pagination:"local",
        paginationSize:10,  
        paginationSizeSelector:[10,50,100],
        selectable:1,
        rowFormatter:function(dom){
            var selectedRow = dom.getData();
            if(true)
            {
                dom.getElement().classList.add("table-light");
            }else if(selectedRow.safety_stock == selectedRow.qty)
            {
                dom.getElement().classList.add("table-warning");
            }
        },
        columns:[
            //{title:"NO", field:"no", hozAlign:"left",width:75, vertAlign:"middle"},
            {title:"PROGRAM", field:"program", hozAlign:"left", vertAlign:"middle"},
            {title:"NO. OF STUDENT", field:"number_of_student", hozAlign:"left", vertAlign:"middle"},
            {title:"ACTION", field:"action", hozAlign:"left", formatter:"html", vertAlign:"middle"},
        ]
    }); 
}

function searchGraduate(value){
    graduatesHeader.setFilter([
        [
            {title:'NO', field: 'no'},
            {field:"name", type:"like", value:value.trim()},
            {field:"school_year", type:"like", value:value.trim()},
            {field:"semester", type:"like", value:value.trim()},
        ]
    ]);
}

function fetchGraduateHdrData(){
    const selectedYear = document.getElementById('graduate-years').value;
    const selectedSemester = document.getElementById('semester').value; // Use the correct ID for semester

    $.ajax({
        url: '/fetch-graduate-hdr',
        type: 'GET',
        data: {
            year: selectedYear,
            semester: selectedSemester
        },
        success: function(response) {
            console.log(response);
            graduatesHeader.setData(response);
        },
        error: function (xhr, status) {
            console.log("Error:", xhr.responseText);
        }
    });
}

function viewGraduateDtlsData(id){
    $.ajax({
        url: '/view-graduate-dtls/' + id,
        type: 'GET',
        success: function(response) {
            graduatesDetails.setData(response);
        },
        error: function (xhr, status) {
            console.log("Error:", xhr.responseText);
        }
    });
}

function editGraduateDtlsData(id){
    $.ajax({
        url: '/edit-graduate-dtls/' + id,
        type: 'GET',
        success: function(response) {
            // console.log("edit_dtls", response);
            $('#view_program_id').val(response.program);
            $('#view_number_of_student').val(response.number_of_student);
        },
        error: function (xhr, status) {
            console.log("Error:", xhr.responseText);
        }
    });
}

$('#filter-status').change(function(){
    var value = $('#filter-status').val();
    graduatesHeader.setFilter([
        [
            {field:"semester", type:"like", value:value.trim()},
        ]
    ]);
});

$('#add-graduate-dtls-modal').click( function(e){
    e.preventDefault();
    $('#AddGraduateDetailsModal').modal('show');
});

$('#submit-graduate-hdr-btn').on('click', function(event) {
    var form = $('#graduate-hdr-form')[0];
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    }
    form.classList.add('was-validated');
    
    $.ajax({
        url: '/store-graduate-hdr',
        type: 'POST',
        data: $('#graduate-hdr-form').serialize(),
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
            $('#graduate-hdr-form')[0].reset();
            $('#GraduateModal').modal('hide');
            fetchGraduateHdrData();
        },
        error: function (xhr, status) {
            throwError(xhr, status);
        }
    });
});

$(document).on('click', '#view-modal-hdr-btn', function (e) {
   var id = $(this).attr('data-id');

   $('#ViewGraduateHeaderModal').modal('show');
   $('#ViewGraduateHeaderModal').attr('data-id', id);
   graduateDetailsTable();
   viewGraduateDtlsData(id);
});

$('#submit-graduate-dtls-btn').click(function () {
    var id  = $('#ViewGraduateHeaderModal').attr('data-id');
    var form = $('#graduate-hdr-form')[0];
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    }
    form.classList.add('was-validated');
    $.ajax({
        url: '/store-graduate-dtls/' + id,
        type: 'POST',
        data: $('#graduate-dtls-form').serialize(),
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
            $('#graduate-dtls-form')[0].reset();
            $('#AddGraduateDetailsModal').modal('hide');
            viewGraduateDtlsData(id);
        },
        error: function (xhr, status) {
            throwError(xhr, status);
        }
    });
});

$(document).on('click', '#edit-hdr-modal', function (e) {
    var id = $(this).attr('data-id');
    $('#EditGraduateHeaderModal').attr('data-id', id);
    $('#loading').show();
    $('#view-graduate-hdr-form').hide();
    $('#EditGraduateHeaderModal').modal('show');
    $.ajax({
        url: '/view-graduate-hdr/' + id,
        type: 'GET',
        success: function(response) {
            $('#loading').hide();
            $('#view-graduate-hdr-form').show();
            $('#view_semester').val(response.semester);
            $('#view_school_year').val(response.school_year);
            $('#view_graduate_date').val(response.graduate_date);
            $('#view_program_id').val(response.program_id);
            $('#view_number_of_student').val(response.number_of_student);
            
            
        },
        error: function (xhr, status) {
            console.log("Error:", xhr.responseText);
        }
    });
});

$('#update-graduate-hdr-btn').click(function (e) {
    var id = $('#EditGraduateHeaderModal').attr('data-id');
    var form = $('#view-graduate-hdr-form')[0];
    if (form.checkValidity() === false) {
        e.preventDefault();
        e.stopPropagation();
    }
    form.classList.add('was-validated');
    $.ajax({
        url: '/update-graduate-hdr/' + id,
        type: 'POST',
        data: $('#view-graduate-hdr-form').serialize(),
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
            $('#view-graduate-hdr-form')[0].reset();
            $('#EditGraduateHeaderModal').modal('hide');
            fetchGraduateHdrData();
        },
        error: function (xhr, status) {
            throwError(xhr, status);
        }
    });
    
});

$(document).on('click', '#edit-dlts-modal', function(){
    var id = $(this).attr('data-id');
    editGraduateDtlsData(id);
    $('#EditGraduateDetailsModal').modal('show');
    $('#EditGraduateDetailsModal').attr('data-id', id);
});

$('#update-graduate-dtls-btn').click(function(e){
    var id = $('#EditGraduateDetailsModal').attr('data-id');
    var hdr_id = $('#ViewGraduateHeaderModal').attr('data-id');
    var form = $('#view-graduate-dtls-form')[0];
    if (form.checkValidity() === false) {
        e.preventDefault();
        e.stopPropagation();
    }
    form.classList.add('was-validated');
    
    $.ajax({
        url: '/update-graduate-dtls/' + id,
        type: 'POST',
        data: $('#view-graduate-dtls-form').serialize(),
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
            $('#view-graduate-dtls-form')[0].reset();
            $('#EditGraduateDetailsModal').modal('hide');
            viewGraduateDtlsData(hdr_id);
        },
        error: function (xhr, status) {
            var response = JSON.parse(xhr.responseText);
            if (response.errors) {
                Object.keys(response.errors).forEach(key => {
                    Toastify({
                        text: response.errors[key],
                        duration: 3000,
                        newWindow: true,
                        close: true,
                        gravity: "top", 
                        position: "right",
                        stopOnFocus: true, 
                        style: {
                          background: "linear-gradient(to right, #ff0000, #ff7f50)",
                        },
                        onClick: function(){}
                      }).showToast();
                    console.log("Error key:", key);
                    console.log("Error message:", response.errors[key]);
                });
            }
        }
    });
});

$(document).on('click', '#remove-graduate-hdr-btn', function(){
    var id = $(this).attr('data-id');
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, remove it!"
      }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                url: "/remove-graduate-hdr/"+id,
                type: 'POST',
                success: function (response) {
                    console.log('Success:', response);
                    Swal.fire({
                        title: "Success!",
                        text: response.message,
                        icon: "success"
                    });
                    fetchGraduateHdrData();
                },
                error: function (xhr, status) {
                    console.log('Error:', xhr);
                }
            });
        }
    });
});  

$(document).on('click', '#remove-graduate-dtls-btn', function(){
    var id = $(this).attr('data-id');
    var hdr_id = $('#ViewGraduateHeaderModal').attr('data-id');
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, remove it!"
      }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                url: "/remove-graduate-dtls/"+id,
                type: 'POST',
                success: function (response) {
                    console.log('Success:', response);
                    Swal.fire({
                        title: "Success!",
                        text: response.message,
                        icon: "success"
                    });
                    viewGraduateDtlsData(hdr_id);
                },
                error: function (xhr, status) {
                    console.log('Error:', xhr);
                }
            });
        }
    });
});

$('#filter-status').change(function(){
    var semesterValue = $('#filter-status').val();
    graduatesHeader.setFilter([
        [
            {field:"semester", type:"like", value:semesterValue.trim()},
        ]
    ]);
    
    // Set the value for the CSV download
    document.getElementById('graduateCsvSemesterInput').value = semesterValue;
});



document.addEventListener('DOMContentLoaded', () => {
    fetch('/get-graduate-years')
        .then(response => response.json())
        .then(years => {
            const yearDropdown = document.getElementById('graduate-years');
            years.forEach(year => {
                const option = document.createElement('option');
                option.value = year;
                option.textContent = year;
                yearDropdown.appendChild(option);
            });
        });
});

document.getElementById('graduate-years').addEventListener('change', function () { 
    const selectedYear = this.value;

    // Set the hidden input value for CSV
    document.getElementById('graduateCsvYearInput').value = selectedYear;

    // Apply filter to Tabulator table
    if (selectedYear === "") {
        graduatesHeader.clearFilter(); // <-- Correct table variable
    } else {
        graduatesHeader.setFilter("school_year", "like", selectedYear); // <-- Correct field
    }
});

document.getElementById('graduate-years').addEventListener('change', function () {
    fetchGraduateHdrData(); 
});

document.getElementById('semester').addEventListener('change', function () {
    fetchGraduateHdrData(); 
});

// Initialize the table after the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    graduateStatusTable();
});
