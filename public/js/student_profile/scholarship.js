$(document).ready(function() {
    scholarshipTable();
    fetchScholarshiptData();
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

const scholarshipTable = () => {
    const defaultDateFilter = {
        column: 'updated_at',
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
        { titleFormatter: () => `
            <div style="line-height: 1.2;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                    ADDED BY
                </strong><br>
                <span style="font-size: 0.75em; color: #888;">Updated on</span>
            </div>`,
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle",
            download: false,
            formatter: function (cell) {
                let data = cell.getData();
                return `
                    <div>
                        <div>${data.name}</div>
                        <span style="font-size: 0.8em; color: #888;">${data.updated_at}</span>
                    </div>
                `;
            }
        },
        { title:'SCHOLAR TYPE',
            titleFormatter: () => `
            <div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">SCHOLAR TYPE</strong>
            </div>`,
            field: "type",
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle"
        },
        { title:'SEMESTER',
            titleFormatter: () => `
            <div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">SEMESTER</strong>
            </div>`,
            field: "semester",
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle"},
        { title:'ACADEMIC YEAR',
            titleFormatter: () => `
            <div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">ACADEMIC YEAR</strong>
            </div>`,
            field: "school_year",
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle"},
        { title:'NO. OF SCHOLARS',
            titleFormatter: () => `
            <div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">NO. OF SCHOLARS</strong>
            </div>`,
            field: "number_of_scholars",
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle"
        },
    ];

    if (window.userPosition != 5) {
        columns.push({
            titleFormatter: () => `
            <div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">ACTION</strong>
            </div>`,
            field: "action",
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle",
            formatter: "html",
            download: false
        });
    }

    scholarships = new Tabulator("#scholarship-table", {
        dataTree: true,
        dataTreeSelectPropagate: true,
        layout: "fitColumns",
        maxHeight: "1000px",
        scrollToColumnPosition: "center",
        pagination: "local",
        placeholder: "No Data Available",
        paginationSize: 10,
        paginationSizeSelector: [10, 50, 100],
        selectable: 1,
        rowFormatter: function (row) {
            const element = row.getElement();
            const index = row.getPosition(true);
            element.style.color = "#000000";
            element.style.backgroundColor = index % 2 === 0 ? "#FFF1D1" : "#ffffff";
        },
        columns: columns
    });    
};
document.getElementById("scholar-filter-type").addEventListener("change", function() {
    const type = this.value;
    const filterValueSelect = document.getElementById("scholar-filter-value");
    const filterYearSelect = document.getElementById("scholar-filter-year");

    filterValueSelect.innerHTML = "";
    filterYearSelect.innerHTML = "";

    if (type === "all") {
        scholarships.clearFilter();
        filterValueSelect.style.display = "none";
        filterYearSelect.style.display = "none";
        return;
    }

    filterValueSelect.style.display = (type === "yearly") ? "none" : "inline-block";
    filterYearSelect.style.display = "inline-block";

    const data = scholarships.getData();
    const monthsSet = new Set();
    const quartersSet = new Set();
    const yearsSet = new Set();

    data.forEach(row => {
        const date = new Date(row.updated_at);
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

document.getElementById("scholar-filter-value").addEventListener("change", applyForeignFilter);
document.getElementById("scholar-filter-year").addEventListener("change", applyForeignFilter);

function applyForeignFilter() {
    const type = document.getElementById("scholar-filter-type").value;
    const selectedValue = document.getElementById("scholar-filter-value").value;
    const selectedYear = document.getElementById("scholar-filter-year").value;

    scholarships.clearFilter();

    scholarships.setFilter(function(data) {
        const date = new Date(data.updated_at);
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

$('#scholar-download-csv').click(function() {
   scholarships.download("csv", "Scholarships.csv", { filter: true });
});

function searchScholarship(value) {
    const searchTerms = value.toLowerCase().split(" ");

    scholarships.setFilter(function(data) {
        let matches = true;

        searchTerms.forEach(term => {
            if (
                !data.name.toLowerCase().includes(term) &&
                !data.semester.toLowerCase().includes(term) &&
                !data.school_year.toLowerCase().includes(term) &&
                !data.updated_at.toLowerCase().includes(term) &&
                !data.type.toLowerCase().includes(term) &&
                !data.number_of_scholars.toString().includes(term)
            ) {
                matches = false;
            }
        });

        return matches;
    });
}

$('#filter-status').change(function(){
    var value = $('#filter-status').val();
    scholarships.setFilter([
        [
            {field:"semester", type:"like", value:value.trim()},
        ]
    ]);
});

$('#add-scholarship-modal').click( function() {
   $('#AddScholarshipModal').modal('show'); 
});

$('#submit-scholarship-btn').on('click', function(event) {
    var form = $('#scholarship-form')[0];
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    }
    form.classList.add('was-validated');
    
    $.ajax({
        url: '/store-scholarship',
        type: 'POST',
        data: $('#scholarship-form').serialize(),
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
            $('#scholarship-form')[0].reset();
            $('#AddScholarshipModal').modal('hide');
            fetchScholarshiptData();
        },
        error: function (xhr, status) {
            throwError(xhr, status);
        }
    });
});

function fetchScholarshiptData(){
    $.ajax({
        url: '/fetch-scholarship',
        type: 'GET',
        success: function(response) {
            // console.log(response);
            scholarships.setData(response);
            
        },
        error: function (xhr, status) {
            console.log("Error:", xhr.responseText);
        }
    });
}

$(document).on('click', '#edit-modal-btn', function (e) {
    var id = $(this).attr('data-id');
    $('#EditScholarshipModal').modal('show');
    $('#EditScholarshipModal').attr('data-id', id);
    $.ajax({
        url: '/view-scholarship/' + id,
        type: 'GET',
        success: function(response) {
            $('#view_scholarship_type').val(response.scholarship_type); 
            $('#view_number_of_scholars').val(response.number_of_scholars);
            $('#view_semester').val(response.semester);
            $('#view_school_year').val(response.school_year);

            fetchScholarshiptData();
        },
        error: function (xhr, status) {
            console.log("Error:", xhr.responseText);
        }
    });
});

$('#update-scholarship-btn').click(function (event) {
    var id = $('#EditScholarshipModal').attr('data-id');
    var form = $('#scholarship-form')[0];
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    }
    form.classList.add('was-validated');
    
    $.ajax({
        url: '/update-scholarship/' + id,
        type: 'POST',
        data: $('#view-scholarship-form').serialize(),
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
            $('#view-scholarship-form')[0].reset();
            $('#EditScholarshipModal').modal('hide');
            fetchScholarshiptData();
        },
        error: function (xhr, status) {
            throwError(xhr, status);
        }
    });
});

$(document).on('click', '#remove-scholarship-btn', function(){
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
                url: "/remove-scholarship/"+id,
                type: 'POST',
                success: function (response) {
                    console.log('Success:', response);
                    Swal.fire({
                        title: "Success!",
                        text: response.message,
                        icon: "success"
                    });
                    fetchScholarshiptData();
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
    scholarships.setFilter([
        [
            {field:"semester", type:"like", value:semesterValue.trim()},
        ]
    ]);
    
    // Set the value for the CSV download
    document.getElementById('scholarshipCsvSemesterInput').value = semesterValue;
});