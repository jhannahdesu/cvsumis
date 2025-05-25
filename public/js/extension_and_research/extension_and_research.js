$(document).ready(function() {
    universityResearchTable();
    fetchuniversityResearch();

    extensionActvitieTable();
    fetchExtensionActivity();
    $('#agency-input').prop('hidden', true);

    // Fetch users for auto-suggestions
    fetchUsersForSuggestions();
});

// Function to fetch users from the backend
function fetchUsersForSuggestions() {
    $.ajax({
        url: '/get-users-for-research', // Define this route in your Laravel routes file
        type: 'GET',
        success: function(response) {
            populateSuggestions(response);
        },
        error: function (xhr, status) {
            throwError(xhr, status);
        }
    });
}

// Function to populate the datalist with suggestions
function populateSuggestions(users) {
    const datalist = document.getElementById('researcher-suggestions');
    datalist.innerHTML = ''; // Clear existing options

    users.forEach(user => {
        const option = document.createElement('option');
        option.value = user.firstname + ' ' + user.lastname;
        datalist.appendChild(option);
    });
}

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

let universityResearchTable = () => {
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
        { title:'TITLE',
            titleFormatter: () =>
            `<div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                    TITLE
                </strong>
            </div>`,
            field: "title", 
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle"
        },
        { title:'RESEARCHER',
            titleFormatter: () =>
            `<div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                    RESEARCHER
                </strong>
            </div>`,
            field: "researcher", 
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle",
            formatter: function(cell) {
                let val = cell.getValue();
                if (!val) return '';
                return val.split(',')[0]; // Show only the first researcher
            }
        },

        {
            title:'CO-RESEARCHER/S',
            titleFormatter: () =>
            `<div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                    CO-RESEARCHER/S
                </strong>
            </div>`,
            field: "co_researcher",
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle",
            formatter: function(cell) {
                let val = cell.getValue();
                if (!val) return '';
                return val.split(',')[0]; // Show only the first co-author
            }
        },

        { title:'STATUS',
            titleFormatter: () =>
            `<div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                    STATUS
                </strong>
            </div>`,
            field: "status_details", 
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle",
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

    universityResearchs = new Tabulator("#university-research-table", {
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

document.getElementById("universityResearchs-filter-type").addEventListener("change", function() {
    const type = this.value;
    const filterValueSelect = document.getElementById("universityResearchs-filter-value");
    const filterYearSelect = document.getElementById("universityResearchs-filter-year");

    filterValueSelect.innerHTML = "";
    filterYearSelect.innerHTML = "";

    if (type === "all") {
        universityResearchs.clearFilter();
        filterValueSelect.style.display = "none";
        filterYearSelect.style.display = "none";
        return;
    }

    filterValueSelect.style.display = (type === "yearly") ? "none" : "inline-block";
    filterYearSelect.style.display = "inline-block";

    const data = universityResearchs.getData();
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

document.getElementById("universityResearchs-filter-value").addEventListener("change", applyuniversityResearchsFilter);
document.getElementById("universityResearchs-filter-year").addEventListener("change", applyuniversityResearchsFilter);

function applyuniversityResearchsFilter() {
    const type = document.getElementById("universityResearchs-filter-type").value;
    const selectedValue = document.getElementById("universityResearchs-filter-value").value;
    const selectedYear = document.getElementById("universityResearchs-filter-year").value;

    universityResearchs.clearFilter();

    universityResearchs.setFilter(function(data) {
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

$('#universityResearchs-download-csv').click(function() {
    universityResearchs.download("csv", "University Researches.csv", { filter: true });
});


// function searchuniversityResearchs(value){
//     universityResearchs.setFilter([
//         [
//             //{title:'NO', field: 'no'},
//             {field:"name", type:"like", value:value.trim()},
//             {field:"agency", type:"like", value:value.trim()},
//             {field:"title", type:"like", value:value.trim()},
//             {field:"researcher", type:"like", value:value.trim()},
//         ]
//     ]);
// }
function searchuniversityResearchs(value) {
    let searchTerms = value.trim().toLowerCase().split(/\s+/);

    if (searchTerms.length === 0 || searchTerms[0] === "") {
        universityResearchs.clearFilter();
        return;
    }

    universityResearchs.setFilter(function(data) {
        let matches = true;

        searchTerms.forEach(term => {
            if (
                !data.name.toLowerCase().includes(term) &&
                !data.agency.toLowerCase().includes(term) &&
                !data.title.toLowerCase().includes(term) &&
                !data.researcher.toLowerCase().includes(term)
            ) {
                matches = false;
            }
        });

        return matches;
    });
}


$('#university-research-modal').click( function() {
   $('#UniversityResearchModal').modal('show'); 
});

$('#outside-agency').click(function() {
    if ($(this).is(':checked')) {
        $('#agency-input').prop('hidden', false);
    } else {
        $('#agency-input').prop('hidden', true);
    }
});

$('#view-outside-agency').click(function() {
    if ($(this).is(':checked')) {
        $('#view-agency-input').prop('hidden', false);
    } else {
        $('#view-agency-input').prop('hidden', true);
    }
});

$('#submit-university-research-btn').click( function(event) {
    var form = $('#university-research-form')[0];

    // Dynamically set required for agency
    if ($('#outside-agency').is(':checked')) {
        $('#agency').prop('required', true);
    } else {
        $('#agency').prop('required', false);
    }

    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
        return;
    }
    form.classList.add('was-validated');

    if (!$('#researchers-hidden').val()) {
        Toastify({
            text: "Please add at least one researcher.",
            duration: 3000,
            backgroundColor: "linear-gradient(to right, #ff0000, #ff7f50)",
        }).showToast();
        return;
    }
    
    $.ajax({
        url: '/store-university-research',
        type: 'POST',
        data: $('#university-research-form').serialize(),
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
            $('#university-research-form')[0].reset();
            $('#UniversityResearchModal').modal('hide');
            fetchuniversityResearch();
        },
        error: function (xhr, status) {
            throwError(xhr, status);
        }
    });
});

//fetch-university-research

function fetchuniversityResearch(){
    $.ajax({
        url: '/fetch-university-research',
        type: 'GET',
        success: function(response) {
            // console.log(response);
            universityResearchs.setData(response);
            
        },
        error: function (xhr, status) {
            console.log("Error:", xhr.responseText);
        }
    });
}

$(document).on('click', '#edit-university-research-btn', function(e) {
    var id = $(this).attr('data-id');
    $('#EditUniversityResearchModal').attr('data-id', id);
    $('#EditUniversityResearchModal').modal('show');
    $.ajax({
        url: '/view-university-research/' + id,
        type: 'GET',
        success: function(response) {
            if(response.agency == null){
                $('#view-agency-input').prop('hidden', true);
            }else{
                $('#view-agency-input').prop('hidden', false);
            }
            $('#view_title').val(response.title); 
            $('#view_researcher').val(response.researcher);
            $('#view_status').val(response.status);
            $('#view_year').val(response.year);
            $('#view_budget').val(response.budget);
            $('#view_agency').val(response.agency);
        },
        error: function (xhr, status) {
            console.log("Error:", xhr.responseText);
        }
    });
});

$('#update-university-research-btn').click( function() {
    var id = $('#EditUniversityResearchModal').attr('data-id');
    var form = $('#view-university-research-form')[0];
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    }
    form.classList.add('was-validated');
    
    $.ajax({
        url: '/update-university-research/' + id,
        type: 'POST',
        data: $('#view-university-research-form').serialize(),
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
            $('#EditUniversityResearchModal').modal('hide');
            fetchuniversityResearch();
        },
        error: function (xhr, status) {
            throwError(xhr, status);
        }
    });
});

$(document).on('click', '#remove-university-research-btn', function(){
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
                url: "/remove-university-research/"+id,
                type: 'POST',
                success: function (response) {
                    console.log('Success:', response);
                    Swal.fire({
                        title: "Success!",
                        text: response.message,
                        icon: "success"
                    });
                    fetchuniversityResearch();
                },
                error: function (xhr, status) {
                    console.log('Error:', xhr);
                }
            });
        }
    });
}); 


let extensionActvitieTable = () => {
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
        { title:'EXTENSION ACTIVITY',
            titleFormatter: () =>
            `<div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                    EXTENSION ACTIVITY
                </strong>
            </div>`,
            field: "extension_activity",
            formatter: "html",
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle"
        },
        { title:'EXTENSIONIST',
            titleFormatter: () =>
            `<div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                    EXTENSIONIST
                </strong>
            </div>`,
            field: "extensionist",
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle"
        },
        { title:'NO. OF BENEFICIARIES',
            titleFormatter: () =>
            `<div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                    NO. OF BENEFICIARIES
                </strong>
            </div>`,
            field: "number_of_beneficiaries", 
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle"
        },
        { title:'PARTNER AGENCY',
            titleFormatter: () =>
            `<div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                    PARTNER AGENCY
                </strong>
            </div>`,
            field: "partner_agency",
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

    extensionActvities = new Tabulator("#extension-activity-table", {
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

document.getElementById("extensionActvities-filter-type").addEventListener("change", function() {
    const type = this.value;
    const filterValueSelect = document.getElementById("extensionActvities-filter-value");
    const filterYearSelect = document.getElementById("extensionActvities-filter-year");

    filterValueSelect.innerHTML = "";
    filterYearSelect.innerHTML = "";

    if (type === "all") {
        extensionActvities.clearFilter();
        filterValueSelect.style.display = "none";
        filterYearSelect.style.display = "none";
        return;
    }

    filterValueSelect.style.display = (type === "yearly") ? "none" : "inline-block";
    filterYearSelect.style.display = "inline-block";

    const data = extensionActvities.getData();
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

document.getElementById("extensionActvities-filter-value").addEventListener("change", applyextensionActvitiesFilter);
document.getElementById("extensionActvities-filter-year").addEventListener("change", applyextensionActvitiesFilter);

function applyextensionActvitiesFilter() {
    const type = document.getElementById("extensionActvities-filter-type").value;
    const selectedValue = document.getElementById("extensionActvities-filter-value").value;
    const selectedYear = document.getElementById("extensionActvities-filter-year").value;

    extensionActvities.clearFilter();

    extensionActvities.setFilter(function(data) {
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

$('#extensionActvities-download-csv').click(function() {
    extensionActvities.download("csv", "Extension Actvities.csv", { filter: true });
});


// function searchextensionActvities(value){
//     extensionActvities.setFilter([
//         [
//             //{title:'NO', field: 'no'},
//             {field:"name", type:"like", value:value.trim()},
//             {field:"extension_activity", type:"like", value:value.trim()},
//             {field:"partner_agency", type:"like", value:value.trim()},
//             {field:"extensionist", type:"like", value:value.trim()},
//         ]
//     ]);
// }
function searchextensionActvities(value) {
    let searchTerms = value.trim().toLowerCase().split(/\s+/);

    if (searchTerms.length === 0 || searchTerms[0] === "") {
        extensionActvities.clearFilter();
        return;
    }

    extensionActvities.setFilter(function(data) {
        let matches = true;

        searchTerms.forEach(term => {
            if (
                !data.name.toLowerCase().includes(term) &&
                !data.extension_activity.toLowerCase().includes(term) &&
                !data.partner_agency.toLowerCase().includes(term) &&
                !data.extensionist.toLowerCase().includes(term)
            ) {
                matches = false;
            }
        });

        return matches;
    });
}

$('#extension-activity-modal').click(function () {
    $('#ExtensionActivityModal').modal('show');
});

$('#submit-extension-activity-btn').click(function () {
    var form = $('#extension-activity-form')[0];
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    }
    form.classList.add('was-validated');
    
    $.ajax({
        url: '/store-extension-activity',
        type: 'POST',
        data: $('#extension-activity-form').serialize(),
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
            $('#extension-activity-form')[0].reset();
            $('#ExtensionActivityModal').modal('hide');
            fetchExtensionActivity();
        },
        error: function (xhr, status) {
            throwError(xhr, status);
        }
    });
});

function fetchExtensionActivity(){
    $.ajax({
        url: '/fetch-extension-activity',
        type: 'GET',
        success: function(response) {
            // console.log(response);
            extensionActvities.setData(response);
            
        },
        error: function (xhr, status) {
            console.log("Error:", xhr.responseText);
        }
    });
}

$(document).on('click', '#edit-extension-activity-btn', function(e) {
    var id = $(this).attr('data-id');
    $('#EditExtensionActivityModal').attr('data-id', id);
    $('#EditExtensionActivityModal').modal('show');
    $.ajax({
        url: '/view-extension-activity/' + id,
        type: 'GET',
        success: function(response) {
            $('#view_extension_activity').val(response.extension_activity); 
            $('#view_extensionist').val(response.extensionist);
            $('#view_number_of_beneficiaries').val(response.number_of_beneficiaries);
            $('#view_partner_agency').val(response.partner_agency);
            $('#view_activity_date').val(response.activity_date);
            $('#view_program_id').val(response.program_id);
        },
        error: function (xhr, status) {
            console.log("Error:", xhr.responseText);
        }
    });
});

$('#update-extension-activity-btn').click(function () {
    var id = $('#EditExtensionActivityModal').attr('data-id');
    var form = $('#view-extension-activity-form')[0];
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    }
    form.classList.add('was-validated');
    
    $.ajax({
        url: '/update-extension-activity/' + id, 
        type: 'POST',
        data: $('#view-extension-activity-form').serialize(),
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
            $('#EditExtensionActivityModal').modal('hide');
            fetchExtensionActivity();
        },
        error: function (xhr, status) {
            throwError(xhr, status);
        }
    });
});

$(document).on('click', '#remove-extension-activity-btn', function(){
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
                url: "/remove-extension-activity/"+id,
                type: 'POST',
                success: function (response) {
                    console.log('Success:', response);
                    Swal.fire({
                        title: "Success!",
                        text: response.message,
                        icon: "success"
                    });
                    fetchExtensionActivity();
                },
                error: function (xhr, status) {
                    console.log('Error:', xhr);
                }
            });
        }
    });
}); 

$('#universityResearchCsvSemesterInput').change(function() {
    var semesterValue = $(this).val();
    document.getElementById('universityResearchCsvSemesterInput').value = semesterValue;
});

$('#default_school_year').change(function() {
    var yearValue = $(this).val();
    document.getElementById('universityResearchCsvYearInput').value = yearValue;
});

$('#extensionActivityCsvSemesterInput').change(function() {
    var semesterValue = $(this).val();
    document.getElementById('extensionActivityCsvSemesterInput').value = semesterValue;
});

$('#default_school_year').change(function() {
    var yearValue = $(this).val();
    document.getElementById('extensionActivityCsvYearInput').value = yearValue;
});

let researchersArr = [];

$('#add-researcher-btn').on('click', function() {
    const researcherName = $('#researcher-input').val(); // Get value from the input field
    if (researcherName && !researchersArr.includes(researcherName)) {
        researchersArr.push(researcherName);
        updateResearchersList();
        $('#researcher-input').val(''); // Clear the input field after adding
    }
});

function updateResearchersList() {
    const list = $('#researchers-list');
    list.empty(); // Clear the existing list
    researchersArr.forEach(name => {
        list.append(
            `<li class="list-group-item d-flex justify-content-between align-items-center">
                ${name}
                <button type="button" class="btn btn-sm btn-danger remove-researcher-btn" data-name="${name}">&times;</button>
            </li>`
        );
    });
    $('#researchers-hidden').val(researchersArr.join(','));
}

$(document).on('click', '.remove-researcher-btn', function() {
    const name = $(this).data('name');
    researchersArr = researchersArr.filter(n => n !== name);
    updateResearchersList();
});

// Reset researchersArr when modal is closed
$('#UniversityResearchModal').on('hidden.bs.modal', function () {
    researchersArr = [];
    $('#researchers-list').empty();
    $('#researchers-hidden').val('');
    $('#researcher-input').val('');
});

// Show/hide co-authors section
$('#add-coauthors-checkbox').on('change', function() {
    if ($(this).is(':checked')) {
        $('#coauthors-section').show();
    } else {
        $('#coauthors-section').hide();
        $('#coauthors-list').empty();
        $('#coauthors-hidden').val('');
        coAuthorsArr = [];
    }
});

// Dynamic co-authors logic
let coAuthorsArr = [];

$('#add-coauthor-btn').on('click', function() {
    const input = $('#coauthor-input');
    const name = input.val().trim();
    if (name && !coAuthorsArr.includes(name)) {
        coAuthorsArr.push(name);
        $('#coauthors-list').append(
            `<li class="list-group-item d-flex justify-content-between align-items-center">
                ${name}
                <button type="button" class="btn btn-sm btn-danger remove-coauthor-btn" data-name="${name}">&times;</button>
            </li>`
        );
        $('#coauthors-hidden').val(coAuthorsArr.join(','));
        input.val('');
    }
});

$(document).on('click', '.remove-coauthor-btn', function() {
    const name = $(this).data('name');
    coAuthorsArr = coAuthorsArr.filter(n => n !== name);
    $(this).parent().remove();
    $('#coauthors-hidden').val(coAuthorsArr.join(','));
});

// Reset coAuthorsArr when modal is closed
$('#UniversityResearchModal').on('hidden.bs.modal', function () {
    coAuthorsArr = [];
    $('#coauthors-list').empty();
    $('#coauthors-hidden').val('');
    $('#coauthor-input').val('');
    $('#add-coauthors-checkbox').prop('checked', false);
    $('#coauthors-section').hide();
});

const researcherInput = document.getElementById('researcher-input');
if (researcherInput) {
    researcherInput.addEventListener('input', function() {
        // Allow letters, spaces, commas, and periods
        this.value = this.value.replace(/[^A-Za-z\s.,]/g, '');
    });
}