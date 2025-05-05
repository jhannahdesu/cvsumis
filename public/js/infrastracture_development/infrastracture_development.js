$(document).ready(function(){
    infrastractureTable();
    fetchInfrastractureTable();
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

const infrastractureTable = () => {
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
        { title:'INFRASTRUCTURE',
            titleFormatter: () =>
            `<div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                    INFRASTRUCTURE
                </strong>
            </div>`,
            field: "infrastracture", 
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle"
        },
        { title:'STATUS',
             titleFormatter: () =>
            `<div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                    STATUS
                </strong>
            </div>`,
            field: "status",
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

    infrastructures = new Tabulator("#infrastracture-table", {
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
        initialSort: [
            { column: "updated_at", dir: "asc" }
        ],
        rowFormatter: function (row) {
            const element = row.getElement();
            const index = row.getPosition(true);
            element.style.color = "#000000";
            element.style.backgroundColor = index % 2 === 0 ? "#FFF1D1" : "#ffffff";
        },
        columns: columns
    });
}

document.getElementById("infrastructures-filter-type").addEventListener("change", function() {
    const type = this.value;
    const filterValueSelect = document.getElementById("infrastructures-filter-value");
    const filterYearSelect = document.getElementById("infrastructures-filter-year");

    filterValueSelect.innerHTML = "";
    filterYearSelect.innerHTML = "";

    if (type === "all") {
        infrastructures.clearFilter();
        filterValueSelect.style.display = "none";
        filterYearSelect.style.display = "none";
        return;
    }

    filterValueSelect.style.display = (type === "yearly") ? "none" : "inline-block";
    filterYearSelect.style.display = "inline-block";

    const data = infrastructures.getData();
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

document.getElementById("infrastructures-filter-value").addEventListener("change", applyinfrastructuresFilter);
document.getElementById("infrastructures-filter-year").addEventListener("change", applyinfrastructuresFilter);

function applyinfrastructuresFilter() {
    const type = document.getElementById("infrastructures-filter-type").value;
    const selectedValue = document.getElementById("infrastructures-filter-value").value;
    const selectedYear = document.getElementById("infrastructures-filter-year").value;

    infrastructures.clearFilter();

    infrastructures.setFilter(function(data) {
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

$('#infrastructures-download-csv').click(function() {
    infrastructures.download("csv", "Infrastructures.csv", { filter: true });
});


// function searchinfrastructures(value){
//     infrastructures.setFilter([
//         [
//             //{title:'NO', field: 'no'},
//             {field:"name", type:"like", value:value.trim()},
//             {field:"infrastracture", type:"like", value:value.trim()},
//             {field:"status", type:"like", value:value.trim()},
//         ]
//     ]);
// }
function searchinfrastructures(value) {
    let searchTerms = value.trim().toLowerCase().split(/\s+/);

    if (searchTerms.length === 0 || searchTerms[0] === "") {
        infrastructures.clearFilter();
        return;
    }

    infrastructures.setFilter(function(data) {
        let matches = true;

        searchTerms.forEach(term => {
            if (
                !data.name.toLowerCase().includes(term) &&
                !data.infrastracture.toLowerCase().includes(term) &&
                !data.startDate.toLowerCase().includes(term) &&
                !data.endDate.toLowerCase().includes(term) &&
                !data.status.toLowerCase().includes(term)
            ) {
                matches = false;
            }
        });

        return matches;
    });
}

$('#submit-infrastracture-btn').on('click', function(event) {
    var form = $('#infrastracture-form')[0];
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    }
    form.classList.add('was-validated');
    
    $.ajax({
        url: '/store-infrastructure-development',
        type: 'POST',
        data: $('#infrastracture-form').serialize(),
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
            $('#infrastracture-form')[0].reset();
            fetchInfrastractureTable();
      
        },
        error: function (xhr, status) {
            throwError(xhr, status);
        }
    });
});


function fetchInfrastractureTable(){
    $.ajax({
        url: '/fetch-infrastructure-development',
        type: 'GET',
        success: function(response) {
            // console.log(response);
            infrastructures.setData(response);
            
        },
        error: function (xhr, status) {
            console.log("Error:", xhr.responseText);
        }
    });
}

$(document).on('click', '#edit-infrastructure-btn', function(e) {
    var id = $(this).attr('data-id');
    $('#EditInfrastructureModal').attr('data-id', id);
    $('#EditInfrastructureModal').modal('show');
    $.ajax({
        url: '/view-infrastructure-development/' + id,
        type: 'GET',
        success: function(response) {
            $('#view_infrastracture').val(response.infrastracture); 
            $('#view_status').val(response.status);
            
        },
        error: function (xhr, status) {
            console.log("Error:", xhr.responseText);
        }
    });
});

$('#update-infrastructure-btn').click( function(e){
    var id = $('#EditInfrastructureModal').attr('data-id');
    var form = $('#view-infrastructure-form')[0];
    if (form.checkValidity() === false) {
        e.preventDefault();
        e.stopPropagation();
    }
    form.classList.add('was-validated');
    
    $.ajax({
        url: '/update-infrastructure-development/'+ id,
        type: 'POST',
        data: $('#view-infrastructure-form').serialize(),
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
            $('#EditInfrastructureModal').modal('hide');
            fetchInfrastractureTable();
        },
        error: function (xhr, status) {
            throwError(xhr, status);
        }
    });
});

$(document).on('click', '#remove-infrastructure-btn', function(){
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
                url: "/remove-infrastructure-development/"+id,
                type: 'POST',
                success: function (response) {
                    console.log('Success:', response);
                    Swal.fire({
                        title: "Success!",
                        text: response.message,
                        icon: "success"
                    });
                    fetchInfrastractureTable();
                },
                error: function (xhr, status) {
                    console.log('Error:', xhr);
                }
            });
        }
    });
});

$('#infrastructureCsvSemesterInput').change(function() {
    var semesterValue = $(this).val();
    document.getElementById('infrastructureCsvSemesterInput').value = semesterValue;
});

$('#default_school_year').change(function() {
    var yearValue = $(this).val();
    document.getElementById('infrastructureCsvYearInput').value = yearValue;
});