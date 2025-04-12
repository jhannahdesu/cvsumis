$(document).ready(function () {
    enrollmentTable();
    fetchEnrollmentData();
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


const enrollmentTable = () => {
    const defaultDateFilter = {
        column: 'created_at',
        filterType: 'thisYear',
    };

    const getDateFilter = (filterType) => {
        const currentDate = new Date();
        let startDate = '';
        let endDate = '';

        switch (filterType) {
            case 'thisMonth':
                startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
                break;
            case 'thisQuarter':
                const quarter = Math.floor(currentDate.getMonth() / 3) + 1;
                const quarterStartMonth = (quarter - 1) * 3;
                startDate = new Date(currentDate.getFullYear(), quarterStartMonth, 1);
                endDate = new Date(currentDate.getFullYear(), quarterStartMonth + 3, 0);
                break;
            case 'thisYear':
                startDate = new Date(currentDate.getFullYear(), 0, 1);
                endDate = new Date(currentDate.getFullYear(), 11, 31);
                break;
            default:
                break;
        }

        return { startDate, endDate };
    };

    const { startDate, endDate } = getDateFilter(defaultDateFilter.filterType);

    let columns = [
        { title: "ADDED BY", field: "name", hozAlign: "left", vertAlign: "middle", download: false },
        { title: "PROGRAM", field: "program", hozAlign: "left", vertAlign: "middle" },
        { title: "SEMESTER", field: "semester", hozAlign: "left", vertAlign: "middle" },
        { title: "ACADEMIC YEAR", field: "school_year", hozAlign: "left", vertAlign: "middle" },
        { title: "NO. OF STUDENT", field: "student_count", hozAlign: "left", vertAlign: "middle" },
    ];

    if (window.userPosition != 5) {
        columns.push({
            title: "ACTION",
            field: "action",
            hozAlign: "left",
            formatter: "html",
            vertAlign: "middle",
            download: false,
        });
    }

    enrollments = new Tabulator("#enrollment-table", {
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
        rowFormatter: function (dom) {
            var selectedRow = dom.getData();
            dom.getElement().classList.add("table-light");
        },
        columns: columns,
        initialSort: [
            { column: "created_at", dir: "desc" },
        ],
        initialFilter: [
            { field: defaultDateFilter.column, type: "between", value: [startDate.toISOString(), endDate.toISOString()] },
        ],
    });
};


document.getElementById("filter-type").addEventListener("change", function() {
    const type = this.value;
    const filterValueSelect = document.getElementById("filter-value");
    const filterYearSelect = document.getElementById("filter-year");

    filterValueSelect.innerHTML = "";
    filterYearSelect.innerHTML = "";

    if (type === "all") {
        enrollments.clearFilter();
        filterValueSelect.style.display = "none";
        filterYearSelect.style.display = "none";
        return;
    }

    filterValueSelect.style.display = (type === "yearly") ? "none" : "inline-block";
    filterYearSelect.style.display = "inline-block";

    const data = enrollments.getData();
    const monthsSet = new Set();
    const quartersSet = new Set();
    const yearsSet = new Set();

    data.forEach(row => {
        const date = new Date(row.created_at);
        const year = date.getFullYear();
        yearsSet.add(year);

        if (type === "monthly") {
            const month = date.toLocaleString('default', { month: 'long' });
            monthsSet.add(month);
        } else if (type === "quarterly") {
            const quarter = Math.floor(date.getMonth() / 3) + 1;
            quartersSet.add(`Q${quarter}`);
        }
    });

    // Handle Monthly Filter (December to January)
    if (type === "monthly") {
        const monthOrder = [
            "December", "November", "October", "September",
            "August", "July", "June", "May",
            "April", "March", "February", "January"
        ];
        monthOrder.forEach(month => {
            if (monthsSet.has(month)) {
                const opt = document.createElement("option");
                opt.value = month;
                opt.textContent = month;
                filterValueSelect.appendChild(opt);
            }
        });
    }

    // Handle Quarterly Filter (Q4 to Q1)
    if (type === "quarterly") {
        ["Q4", "Q3", "Q2", "Q1"].forEach(q => {
            if (quartersSet.has(q)) {
                const opt = document.createElement("option");
                opt.value = q;
                opt.textContent = q;
                filterValueSelect.appendChild(opt);
            }
        });
    }

    // Handle Year Filter
    [...yearsSet].sort((a, b) => b - a).forEach(year => {
        const opt = document.createElement("option");
        opt.value = year;
        opt.textContent = year;
        filterYearSelect.appendChild(opt);
    });
});

document.getElementById("filter-value").addEventListener("change", applyFilter);
document.getElementById("filter-year").addEventListener("change", applyFilter);

function applyFilter() {
    const type = document.getElementById("filter-type").value;
    const selectedValue = document.getElementById("filter-value").value;
    const selectedYear = document.getElementById("filter-year").value;

    enrollments.clearFilter();

    enrollments.setFilter(function(data) {
        const date = new Date(data.created_at);
        const month = date.toLocaleString('default', { month: 'long' });
        const quarter = Math.floor(date.getMonth() / 3) + 1;
        const year = date.getFullYear();

        if (type === "monthly") {
            return month === selectedValue && year == selectedYear;
        } else if (type === "quarterly") {
            return `Q${quarter}` === selectedValue && year == selectedYear;
        } else if (type === "yearly") {
            return year == selectedYear;
        }
        return true;
    });
}



function searchEnrollment(value) {
    let searchTerms = value.trim().toLowerCase().split(/\s+/);

    if (searchTerms.length === 0 || searchTerms[0] === "") {
        enrollments.clearFilter();
        return;
    }

    enrollments.setFilter(function(data) {
        let matches = true;

        searchTerms.forEach(term => {
            if (
                !data.name.toLowerCase().includes(term) &&
                !data.semester.toLowerCase().includes(term) &&
                !data.school_year.toLowerCase().includes(term) &&
                !data.program.toLowerCase().includes(term)
            ) {
                matches = false;
            }
        });
        return matches;
    });
}



$('#filter-status').change(function(){
    var value = $('#filter-status').val();
    enrollments.setFilter([
        [
            {field:"school_year", type:"like", value:value.trim()},
        ]
    ]);
});

$('#enrollment-modal').click( function(e){
    e.preventDefault();
    $('#EnrollmentModal').modal('show');
});

$('#submit-enrollment-btn').on('click', function(event) {
    var form = $('#enrollment-form')[0];
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    }
    form.classList.add('was-validated');
    
    $.ajax({
        url: '/store-enrollment',
        type: 'POST',
        data: $('#enrollment-form').serialize(),
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
            $('#enrollment-form')[0].reset();
            $('#EnrollmentModal').modal('hide');
            fetchEnrollmentData();
        },
        error: function (xhr, status) {
            throwError(xhr, status);
        }
    });
});

function fetchEnrollmentData(){
    $.ajax({
        url: '/fetch-enrollment',
        type: 'GET',
        success: function(response) {
            // console.log(response);
            enrollments.setData(response);
            
        },
        error: function (xhr, status) {
            console.log("Error:", xhr.responseText);
        }
    });
}

$(document).on('click', '#edit-modal-btn', function(e) {
    var id = $(this).attr('data-id');
    $('#EditEnrollmentModal').attr('data-id', id);
    $('#loading').show();
    $('#view-enrollment-form').hide();
    $('#EditEnrollmentModal').modal('show');
    $.ajax({
        url: '/view-enrollment/' + id,
        type: 'GET',
        success: function(response) {
            $('#loading').hide();
            $('#view-enrollment-form').show();
            $('#view_program_id').val(response.program_id); 
            $('#view_number_of_student').val(response.number_of_student);
            $('#view_semester').val(response.semester);
            $('#view_school_year').val(response.school_year);

            fetchEnrollmentData();
        },
        error: function (xhr, status) {
            console.log("Error:", xhr.responseText);
        }
    });
});

$('#update-enrollment-btn').click( function(e){
    var id = $('#EditEnrollmentModal').attr('data-id');
    var form = $('#enrollment-form')[0];
    if (form.checkValidity() === false) {
        e.preventDefault();
        e.stopPropagation();
    }
    form.classList.add('was-validated');
    
    $.ajax({
        url: '/update-enrollment/'+ id,
        type: 'POST',
        data: $('#view-enrollment-form').serialize(),
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
            $('#view-enrollment-form')[0].reset();
            $('#EditEnrollmentModal').modal('hide');
            fetchEnrollmentData();
        },
        error: function (xhr, status) {
            throwError(xhr, status);
        }
    });
});

$(document).on('click', '#remove-enrollment-btn', function(){
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
                url: "/remove-enrollment/"+id,
                type: 'POST',
                success: function (response) {
                    console.log('Success:', response);
                    Swal.fire({
                        title: "Success!",
                        text: response.message,
                        icon: "success"
                    });
                    fetchEnrollmentData();
                },
                error: function (xhr, status) {
                    console.log('Error:', xhr);
                }
            });
        }
    });
}); 

$('#filter-status').change(function(){
    var value = $('#filter-status').val();
    enrollments.setFilter([
        [
            {field:"school_year", type:"like", value:value.trim()},
        ]
    ]);
    // Set the value for the CSV download
    document.getElementById('enrollmentCsvYearInput').value = value;
});


document.getElementById("download-csv").addEventListener("click", function() {
    enrollments.download("csv", "Enrollments.csv", { filter: true });
});
