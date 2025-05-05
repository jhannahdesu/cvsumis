$(document).ready(function() {
    organizationTable();
    fetchStudentOrgranization();
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

let organizationTable = () => {
    const defaultDateFilter = {
        column: 'updated_at',
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
            titleFormatter: function () {
                return `
                    <div style="line-height: 1.2;">
                        <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                            ADDED BY
                        </strong><br>
                        <span style="font-size: 0.75em; color: #888;">Updated on</span>
                    </div>
                `;
            },
            field: "name",
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
        { title: 'ORGANIZATION ABBREVIATION',
            titleFormatter: () =>
            `<div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                    ORGANIZATION ABBREVIATION
                </strong>
            </div>`,
            field: "org_abbrev",
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle"
        },
        { title: 'ORGANIZATION NAME',
            titleFormatter: () =>
            `<div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                    ORGANNIZATION NAME
                </strong>
            </div>`,
            field: "org_name",
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle"
        },
        { title: 'PROGRAM',
            titleFormatter: () =>
            `<div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                    PROGRAM
                </strong>
            </div>`,
            field: "program_abbrev", 
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle"
        },
    ];

    if (window.userPosition != 5) {
        columns.push({
            titleFormatter: () =>
                `<div style="line-height: 2.5;">
                    <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                        ACTION
                    </strong>
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

    organizations = new Tabulator("#organization-table", {
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

document.getElementById("organizations-filter-type").addEventListener("change", function() {
    const type = this.value;
    const filterValueSelect = document.getElementById("organizations-filter-value");
    const filterYearSelect = document.getElementById("organizations-filter-year");

    filterValueSelect.innerHTML = "";
    filterYearSelect.innerHTML = "";

    if (type === "all") {
        organizations.clearFilter();
        filterValueSelect.style.display = "none";
        filterYearSelect.style.display = "none";
        return;
    }

    filterValueSelect.style.display = (type === "yearly") ? "none" : "inline-block";
    filterYearSelect.style.display = "inline-block";

    const data = organizations.getData();
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

document.getElementById("organizations-filter-value").addEventListener("change", applyorganizationsFilter);
document.getElementById("organizations-filter-year").addEventListener("change", applyorganizationsFilter);

function applyorganizationsFilter() {
    const type = document.getElementById("organizations-filter-type").value;
    const selectedValue = document.getElementById("organizations-filter-value").value;
    const selectedYear = document.getElementById("organizations-filter-year").value;

    organizations.clearFilter();

    organizations.setFilter(function(data) {
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

$('#organizations-download-csv').click(function() {
    organizations.download("csv", "Organizations.csv", { filter: true });
});


// function searchorganizations(value){
//     organizations.setFilter([
//         [
//             //{title:'NO', field: 'no'},
//             {field:"name", type:"like", value:value.trim()},
//             {field:"org_abbrev", type:"like", value:value.trim()},
//         ]
//     ]);
// }
function searchorganizations(value) {
    let searchTerms = value.trim().toLowerCase().split(/\s+/);

    if (searchTerms.length === 0 || searchTerms[0] === "") {
        organizations.clearFilter();
        return;
    }

    organizations.setFilter(function(data) {
        let matches = true;

        searchTerms.forEach(term => {
            if (
                !data.name.toLowerCase().includes(term) &&
                !data.org_abbrev.toLowerCase().includes(term) &&
                !data.org_name.toLowerCase().includes(term) &&
                !data.program_abbrev.toLowerCase().includes(term)
            ) {
                matches = false;
            }
        });

        return matches;
    });
}


$('#submit-organization-btn').on('click', function(event) {
    var form = $('#organization-form')[0];
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    }
    form.classList.add('was-validated');
    
    $.ajax({
        url: '/store-student-development',
        type: 'POST',
        data: $('#organization-form').serialize(),
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
            $('#organization-form')[0].reset();
            fetchStudentOrgranization();
        },
        error: function (xhr, status) {
            throwError(xhr, status);
        }
    });
});

function fetchStudentOrgranization(){
    $.ajax({
        url: '/fetch-student-development',
        type: 'GET',
        success: function(response) {
            // console.log(response);
            organizations.setData(response);
            
        },
        error: function (xhr, status) {
            console.log("Error:", xhr.responseText);
        }
    });
}

$(document).on('click','#edit-organization-btn', function(event){
    $('#EditOrganizationModal').modal('show');
    var id = $(this).attr('data-id');
    $('#EditOrganizationModal').attr('data-id', id);
    $.ajax({
        url: '/view-student-development/' + id,
        type: 'GET',
        success: function(response) {
            $('#view_org_abbrev').val(response.org_abbrev);
            $('#view_program_abbrev').val(response.program_abbrev);
            $('#view_org_name').val(response.org_name);

        },
    });
});

$('#update-organization-btn').on('click', function(event) {
    var id = $('#EditOrganizationModal').attr('data-id');
    var form = $('#view-organization-form')[0];
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    }
    form.classList.add('was-validated');
    
    $.ajax({
        url: '/update-student-development/' + id,
        type: 'POST',
        data: $('#view-organization-form').serialize(),
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
            $('#EditOrganizationModal').modal('hide');
            fetchStudentOrgranization();
        },
        error: function (xhr, status) {
            throwError(xhr, status);
        }
    });
});


$(document).on('click', '#remove-organization-btn', function(){
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
                url: "/remove-student-development/"+id,
                type: 'POST',
                success: function (response) {
                    console.log('Success:', response);
                    Swal.fire({
                        title: "Success!",
                        text: response.message,
                        icon: "success"
                    });
                    fetchStudentOrgranization();
                },
                error: function (xhr, status) {
                    console.log('Error:', xhr);
                }
            });
        }
    });
});

$('#studentDevelopmentCsvSemesterInput').change(function() {
    var semesterValue = $(this).val();
    document.getElementById('studentDevelopmentCsvSemesterInput').value = semesterValue;
});

$('#default_school_year').change(function() {
    var yearValue = $(this).val();
    document.getElementById('studentDevelopmentCsvYearInput').value = yearValue;
});