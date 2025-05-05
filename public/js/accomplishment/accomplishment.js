$(document).ready(function(){
    accomplishmentTable();
    fetchaccomplishment();
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

let accomplishmentTable = () => {
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
        { title:'FACULTY',
            titleFormatter: () =>
            `<div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                    FACULTY
                </strong>
            </div>`,
            field: "faculty",
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle"
        },
        { title:'PROGRAM',
            titleFormatter: () =>
            `<div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                    PROGRAM
                </strong>
            </div>`,
            field: "program_id", 
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle",
            formatter: "html"
        },
        { title:'SUC / DATE',
            titleFormatter: () =>
            `<div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                    SUC / DATE
                </strong>
            </div>`,
             field: "university",
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle",
            downloadFormatter: function(cell){
                return cell.getValue().replace(/<[^>]*>?/gm, ''); // strip HTML tags
            },
            formatter: "html"
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

    accomplishments = new Tabulator("#accomplishment-table", {
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
        rowFormatter: function (row) {
            const element = row.getElement();
            const index = row.getPosition(true);
            element.style.color = "#000000";
            element.style.backgroundColor = index % 2 === 0 ? "#FFF1D1" : "#ffffff";
        },
        columns: columns
    });
}

document.getElementById("accomplishments-filter-type").addEventListener("change", function() {
    const type = this.value;
    const filterValueSelect = document.getElementById("accomplishments-filter-value");
    const filterYearSelect = document.getElementById("accomplishments-filter-year");

    filterValueSelect.innerHTML = "";
    filterYearSelect.innerHTML = "";

    if (type === "all") {
        accomplishments.clearFilter();
        filterValueSelect.style.display = "none";
        filterYearSelect.style.display = "none";
        return;
    }

    filterValueSelect.style.display = (type === "yearly") ? "none" : "inline-block";
    filterYearSelect.style.display = "inline-block";

    const data = accomplishments.getData();
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

document.getElementById("accomplishments-filter-value").addEventListener("change", applyaccomplishmentsFilter);
document.getElementById("accomplishments-filter-year").addEventListener("change", applyaccomplishmentsFilter);

function applyaccomplishmentsFilter() {
    const type = document.getElementById("accomplishments-filter-type").value;
    const selectedValue = document.getElementById("accomplishments-filter-value").value;
    const selectedYear = document.getElementById("accomplishments-filter-year").value;

    accomplishments.clearFilter();

    accomplishments.setFilter(function(data) {
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

$('#accomplishments-download-csv').click(function() {
    accomplishments.download("csv", "Accomplishments.csv", { filter: true });
});

// function searchaccomplishments(value){
//     accomplishments.setFilter([
//         [
//             //{title:'NO', field: 'no'},
//             {field:"name", type:"like", value:value.trim()},
//             {field:"program_id", type:"like", value:value.trim()},
//             {field:"university", type:"like", value:value.trim()},
//             {field:"faculty", type:"like", value:value.trim()},
//         ]
//     ]);
// }
function searchaccomplishments(value) {
    let searchTerms = value.trim().toLowerCase().split(/\s+/);

    if (searchTerms.length === 0 || searchTerms[0] === "") {
        accomplishments.clearFilter();
        return;
    }

    accomplishments.setFilter(function(data) {
        let matches = true;

        searchTerms.forEach(term => {
            if (
                !data.name.toLowerCase().includes(term) &&
                !data.program_id.toLowerCase().includes(term) &&
                !data.university.toLowerCase().includes(term) &&
                !data.faculty.toLowerCase().includes(term)
            ) {
                matches = false;
            }
        });

        return matches;
    });
}

//accomplishment

$('#submit-accomplishment-btn').on('click', function(event) {
    var form = $('#accomplishment-form')[0];
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    }
    form.classList.add('was-validated');
    
    $.ajax({
        url: '/store-accomplishment',
        type: 'POST',
        data: $('#accomplishment-form').serialize(),
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
            $('#accomplishment-form')[0].reset();
            fetchaccomplishment();
        },
        error: function (xhr, status) {
            throwError(xhr, status);
        }
    });
});

function fetchaccomplishment(){
    $.ajax({
        url: '/fetch-accomplishment',
        type: 'GET',
        success: function(response) {
            // console.log(response);
            accomplishments.setData(response);
            
        },
        error: function (xhr, status) {
            console.log("Error:", xhr.responseText);
        }
    });
}

$(document).on('click', '#edit-accomplishment-btn', function(e) {
    var id = $(this).attr('data-id');
    $('#EditAccomplishmentModal').attr('data-id', id);
    $('#EditAccomplishmentModal').modal('show');
    $.ajax({
        url: '/view-accomplishment/' + id,
        type: 'GET',
        success: function(response) {
            $('#view_program_id').val(response.program_id); 
            $('#view_faculty').val(response.faculty);
            $('#view_university').val(response.university);
            $('#view_start_date').val(response.start_date);
            $('#view_end_date').val(response.end_date);
            $('#view_program_dtls').val(response.program_dtls);
        },
        error: function (xhr, status) {
            console.log("Error:", xhr.responseText);
        }
    });
});

$('#update-accomplishment-btn').on('click', function(event) {
    var id = $('#EditAccomplishmentModal').data('id');
    var form = $('#view-accomplishment-form')[0];
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    }
    form.classList.add('was-validated');
    
    $.ajax({
        url: '/update-accomplishment/' + id,
        type: 'POST',
        data: $('#view-accomplishment-form').serialize(),
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
            $('#EditAccomplishmentModal').modal('hide');
            fetchaccomplishment();
        },
        error: function (xhr, status) {
            throwError(xhr, status);
        }
    });
});
$(document).on('click', '#remove-accomplishment-btn', function(){
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
                url: "/remove-accomplishment/"+id,
                type: 'POST',
                success: function (response) {
                    console.log('Success:', response);
                    Swal.fire({
                        title: "Success!",
                        text: response.message,
                        icon: "success"
                    });
                    fetchaccomplishment();
                },
                error: function (xhr, status) {
                    console.log('Error:', xhr);
                }
            });
        }
    });
}); 

$('#eventsAccomplishmentsCsvSemesterInput').change(function() {
    var semesterValue = $(this).val();
    document.getElementById('eventsAccomplishmentsCsvSemesterInput').value = semesterValue;
});

$('#default_school_year').change(function() {
    var yearValue = $(this).val();
    document.getElementById('eventsAccomplishmentsCsvYearInput').value = yearValue;
});