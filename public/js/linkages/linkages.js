$(document).ready(function () {
    linkagesTable();
    fetchLinkages();
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

let linkagesTable = () => {
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
        { title:'AGENCY',
            titleFormatter: () =>
            `<div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                    AGENCY
                </strong>
            </div>`,
            field: "agency", 
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle"
        },
        { title:'NATURE OF LINKAGES',
            titleFormatter: () =>
            `<div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                    NATURE OF LINAKGES
                </strong>
            </div>`,
            field: "linkage_nature",
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle"
        },
        { title:'ACTIVITY TITLE',
            titleFormatter: () =>
            `<div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                    ACTIVITY TITLE
                </strong>
            </div>`,
            field: "activity_title", 
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle"
        },
        { title:'DATE AND VENUE',
            titleFormatter: () =>
            `<div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                    DATE AND VENUE
                </strong>
            </div>`,
            field: "date_venue",
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle"
        },
        { title:'ATTENDEES',
            titleFormatter: () =>
            `<div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                    ATTENDEES
                </strong>
            </div>`,
            field: "attendees", 
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle"
        },
        { title:'FACILITATORS',
            titleFormatter: () =>
            `<div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                    FACILITATORS
                </strong>
            </div>`,
            field: "facilitators", 
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

    linkages = new Tabulator("#linkages-table", {
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

document.getElementById("linkages-filter-type").addEventListener("change", function() {
    const type = this.value;
    const filterValue = document.getElementById("linkages-filter-value");
    const filterYear = document.getElementById("linkages-filter-year");

    filterValue.innerHTML = "";
    filterYear.innerHTML = "";

    if (type === "all") {
        linkages.clearFilter();
        filterValue.style.display = "none";
        filterYear.style.display = "none";
        return;
    }

    filterValue.style.display = (type === "yearly") ? "none" : "inline-block";
    filterYear.style.display = "inline-block";

    const data = linkages.getData();
    const monthsSet = new Set();
    const quartersSet = new Set();
    const yearsSet = new Set();

    data.forEach(row => {
        const date = new Date(row.date);
        const year = date.getFullYear();
        yearsSet.add(year);

        if (type === "monthly") {
            monthsSet.add(date.toLocaleString('default', { month: 'long' }));
        } else if (type === "quarterly") {
            const q = Math.floor(date.getMonth() / 3) + 1;
            quartersSet.add(`Q${q}`);
        }
    });

    const months = ["December", "November", "October", "September", "August", "July", "June", "May", "April", "March", "February", "January"];
    if (type === "monthly") {
        months.forEach(month => {
            if (monthsSet.has(month)) {
                const opt = document.createElement("option");
                opt.value = month;
                opt.textContent = month;
                filterValue.appendChild(opt);
            }
        });
    }

    if (type === "quarterly") {
        ["Q4", "Q3", "Q2", "Q1"].forEach(q => {
            if (quartersSet.has(q)) {
                const opt = document.createElement("option");
                opt.value = q;
                opt.textContent = q;
                filterValue.appendChild(opt);
            }
        });
    }

    [...yearsSet].sort((a, b) => b - a).forEach(year => {
        const opt = document.createElement("option");
        opt.value = year;
        opt.textContent = year;
        filterYear.appendChild(opt);
    });
});

document.getElementById("linkages-filter-value").addEventListener("change", applylinkagesFilter);
document.getElementById("linkages-filter-year").addEventListener("change", applylinkagesFilter);

function applylinkagesFilter() {
    const type = document.getElementById("linkages-filter-type").value;
    const value = document.getElementById("linkages-filter-value").value;
    const year = document.getElementById("linkages-filter-year").value;

    linkages.clearFilter();

    linkages.setFilter(data => {
        const date = new Date(data.date);
        const month = date.toLocaleString('default', { month: 'long' });
        const quarter = Math.floor(date.getMonth() / 3) + 1;
        const yearVal = date.getFullYear();

        if (type === "monthly") {
            return month === value && yearVal == year;
        } else if (type === "quarterly") {
            return `Q${quarter}` === value && yearVal == year;
        } else if (type === "yearly") {
            return yearVal == year;
        }

        return true;
    });
}

document.getElementById("linkages-download-csv").addEventListener("click", () => {
    linkages.download("csv", "Linkages.csv", { filter: true });
});

// function searchlinkages(value){
//     linkages.setFilter([
//         [
//             //{title:'NO', field: 'no'},
//             {field:"name", type:"like", value:value.trim()},
//             {field:"agency", type:"like", value:value.trim()},
//             {field:"linkage_nature", type:"like", value:value.trim()},
//             {field:"activity_title", type:"like", value:value.trim()},
//         ]
//     ]);
// }
function searchlinkages(value) {
    let searchTerms = value.trim().toLowerCase().split(/\s+/);

    if (searchTerms.length === 0 || searchTerms[0] === "") {
        linkages.clearFilter();
        return;
    }

    linkages.setFilter(function(data) {
        let matches = true;

        searchTerms.forEach(term => {
            if (
                !data.name.toLowerCase().includes(term) &&
                !data.agency.toLowerCase().includes(term) &&
                !data.linkage_nature.toLowerCase().includes(term) &&
                !data.activity_title.toLowerCase().includes(term) &&
                !data.date_venue.toLowerCase().includes(term) &&
                !data.attendees.toLowerCase().includes(term) &&
                !data.facilitators.toLowerCase().includes(term)
            ) {
                matches = false;
            }
        });

        return matches;
    });
}


// function searchEnrollment(value){
//     enrollments.setFilter([
//         [
//             //{title:'NO', field: 'no'},
//             {field:"name", type:"like", value:value.trim()},
//             {field:"semester", type:"like", value:value.trim()},
//             {field:"school_year", type:"like", value:value.trim()},
//             {field:"program", type:"like", value:value.trim()},
//         ]
//     ]);
// }


$('#submit-linkages-btn').on('click', function(event) {
    var form = $('#linkages-form')[0];
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    }
    form.classList.add('was-validated');
    
    $.ajax({
        url: '/store-linkages',
        type: 'POST',
        data: $('#linkages-form').serialize(),
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
            $('#linkages-form')[0].reset();
            fetchLinkages();
        },
        error: function (xhr, status) {
            throwError(xhr, status);
        }
    });
});

function fetchLinkages(){
    $.ajax({
        url: '/fetch-linkages',
        type: 'GET',
        success: function(response) {
            // console.log(response);
            linkages.setData(response);
            
        },
        error: function (xhr, status) {
            console.log("Error:", xhr.responseText);
        }
    });
}

$(document).on('click', '#edit-linkages-btn', function(e) {
    var id = $(this).attr('data-id');
    $('#EditLinkagesModal').attr('data-id', id);
    $('#EditLinkagesModal').modal('show');
    $.ajax({
        url: '/view-linkages/' + id,
        type: 'GET',
        success: function(response) {
            $('#view_agency').val(response.agency); 
            $('#view_linkage_nature').val(response.linkage_nature);
            $('#view_activity_title').val(response.linkage_nature);
            $('#view_date').val(response.date);
            $('#view_venue').val(response.venue);
            $('#view_attendees').val(response.attendees);
            $('#view_facilitators').val(response.facilitators);

        },
        error: function (xhr, status) {
            console.log("Error:", xhr.responseText);
        }
    });
});

$('#update-linkages-btn').on('click', function(event) {
    var id = $('#EditLinkagesModal').data('id');
    var form = $('#view-linkages-form')[0];
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    }
    form.classList.add('was-validated');
    
    $.ajax({
        url: '/update-linkages/' + id,
        type: 'POST',
        data: $('#view-linkages-form').serialize(),
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
            $('#EditLinkagesModal').modal('hide');
            fetchLinkages();
        },
        error: function (xhr, status) {
            throwError(xhr, status);
        }
    });
});

$(document).on('click', '#remove-linkages-btn', function(){
    var id = $(this).attr('data-id');``
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
                url: "/remove-linkages/"+id,
                type: 'POST',
                success: function (response) {
                    console.log('Success:', response);
                    Swal.fire({
                        title: "Success!",
                        text: response.message,
                        icon: "success"
                    });
                    fetchLinkages();
                },
                error: function (xhr, status) {
                    console.log('Error:', xhr);
                }
            });
        }
    });
}); 

$('#linkagesCsvSemesterInput').change(function() {
    var semesterValue = $(this).val();
    document.getElementById('linkagesCsvSemesterInput').value = semesterValue;
});

$('#default_school_year').change(function() {
    var yearValue = $(this).val();
    document.getElementById('linkagesCsvYearInput').value = yearValue;
});
