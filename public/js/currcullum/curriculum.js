$(document).ready(function() {
    accreditationStatusTable();
    fetchAccreditationStatusData();

    govRecognitionTable();
    fetchGovRecognitionData();

    licensureExamTable();
    fetchLicensureExamData();

    facultyTvetTable();
    fetchfacultyTvetData();

    studentTvetTable();
    fetchStudentTvetData();
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
const accreditationStatusTable = () => {
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
                    <div style="line-height: 1.2;" >
                        <strong style="background: linear-gradient(45deg,rgb(254, 160, 37),rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                            ADDED BY
                        </strong><br>
                        <span style="font-size: 0.75em; color: #888;">Updated on</span>
                    </div>
                `;
            },
            headerSort: false,
            headerHozAlign: "center",
            field: "name",
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
        }},
        {  title: "PROGRAMS",
            titleFormatter: function () {
                return `
                    <div style="line-height: 2.5;">
                        <strong style="background: linear-gradient(45deg,rgb(254, 160, 37),rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                            PROGRAM
                        </strong>
                    </div>
                `;
            }, field: "program", headerSort: false, headerHozAlign: "center", hozAlign: "left", vertAlign: "middle" 
        },
        { title: "STATUS",
            titleFormatter: function () {
            return `
                <div style="line-height: 2.5;">
                    <strong style="background: linear-gradient(45deg,rgb(254, 160, 37),rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                        STATUS
                    </strong>
                </div>
            `;
        }, field: "status", headerSort: false, headerHozAlign: "center", hozAlign: "left", vertAlign: "middle" },
        { title: "VISIT DATE",
            titleFormatter: function () {
            return `
                <div style="line-height: 2.5;">
                    <strong style="background: linear-gradient(45deg,rgb(254, 160, 37),rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                        VISIT DATE
                    </strong>
                </div>
            `;
        }, field: "date", headerSort: false, headerHozAlign: "center", hozAlign: "center", vertAlign: "middle" },
    ];

    if (window.userPosition != 5) {
        columns.push({
            titleFormatter: function () {
                return `
                    <div style="line-height: 2.5;">
                        <strong style="background: linear-gradient(45deg,rgb(254, 160, 37),rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                            ACTION
                        </strong>
                    </div>
                `;
            },
            field: "action",
            headerSort: false,
            headerHozAlign: "center",
            hozAlign: "center",
            formatter: "html",
            vertAlign: "middle",
            download: false 
        });
    }

    accreditationStatus = new Tabulator("#accreditation-status-table", {
        dataTree: true,
        dataTreeSelectPropagate: true,
        layout: "fitDataFill",
        maxHeight: "800px",
        scrollToColumnPosition: "center",
        pagination: "local",
        paginationSize: 10,
        paginationSizeSelector: [10, 50, 100],
        placeholder: "No Data Available",
        selectable: 1,
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
            if (index % 2 === 0) {
                element.style.backgroundColor = "#FFF1D1";
            } else {
                element.style.backgroundColor = "#ffffff";
            }
        },
        columns: columns,
    });    
};

document.getElementById("accreditation-filter-type").addEventListener("change", function() {
    const type = this.value;
    const filterValue = document.getElementById("accreditation-filter-value");
    const filterYear = document.getElementById("accreditation-filter-year");

    filterValue.innerHTML = "";
    filterYear.innerHTML = "";

    if (type === "all") {
        accreditationStatus.clearFilter();
        filterValue.style.display = "none";
        filterYear.style.display = "none";
        return;
    }

    filterValue.style.display = (type === "yearly") ? "none" : "inline-block";
    filterYear.style.display = "inline-block";

    const data = accreditationStatus.getData();
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

document.getElementById("accreditation-filter-value").addEventListener("change", applyAccreditationFilter);
document.getElementById("accreditation-filter-year").addEventListener("change", applyAccreditationFilter);

function applyAccreditationFilter() {
    const type = document.getElementById("accreditation-filter-type").value;
    const value = document.getElementById("accreditation-filter-value").value;
    const year = document.getElementById("accreditation-filter-year").value;

    accreditationStatus.clearFilter();

    accreditationStatus.setFilter(data => {
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

document.getElementById("accreditation-download-csv").addEventListener("click", () => {
    accreditationStatus.download("csv", "Accreditation Status.csv", { filter: true });
});

$('#accreditation-status-modal').click(function() {
   $('#AddAccreditationStatus').modal('show');
});

function searchAcademicProgram(value) {
    let searchTerms = value.trim().toLowerCase().split(/\s+/);

    if (searchTerms.length === 0 || searchTerms[0] === "") {
        accreditationStatus.clearFilter();
        return;
    }

    accreditationStatus.setFilter(function(data) {
        let matches = true;

        searchTerms.forEach(term => {
            if (
                //!data.no.toString().toLowerCase().includes(term) &&
                !data.name.toLowerCase().includes(term) &&
                !data.program.toLowerCase().includes(term) &&
                !data.status.toLowerCase().includes(term) &&
                !data.date.toLowerCase().includes(term)
            ) {
                matches = false;
            }
        });

        return matches;
    });
}


$('#submit-accreditation-status-btn').on('click', function(event) {
    var form = $('#accreditation-status-form')[0];
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
        form.classList.add('was-validated');
        return;
    }

    $.ajax({
        url: '/store-accreditation-status',
        type: 'POST',
        data: $('#accreditation-status-form').serialize(),
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
            $('#accreditation-status-form')[0].reset();
            $('#AddAccreditationStatus').modal('hide');
            fetchAccreditationStatusData();
        },
        error: function(xhr) {
            if (xhr.status === 409) {
                Swal.fire({
                    title: "Duplicate Entry",
                    text: xhr.responseJSON.error,
                    icon: "warning"
                });
            } else {
                throwError(xhr, xhr.status);
            }
        }
    });
});


function fetchAccreditationStatusData(){
    $.ajax({
        url: '/fetch-accreditation-status',
        type: 'GET',
        success: function(response) {
            accreditationStatus.setData(response);
            
        },
        error: function (xhr, status) {
            console.log("Error:", xhr.responseText);
        }
    });
}

$(document).on('click', '#edit-accreditation-status-btn', function (e) {
    var id = $(this).attr('data-id');
    $('#EditAccreditationStatus').modal('show');
    $('#EditAccreditationStatus').attr('data-id', id);
    $.ajax({
        url: '/view-accreditation-status/' + id,
        type: 'GET',
        success: function(response) {
            $('#view_program_id').val(response.program_id);
            $('#view_status_id').val(response.status_id);
            $('#view_visit_date').val(response.visit_date);
        },
        error: function (xhr, status) {
            console.log("Error:", xhr.responseText);
        }
    });
});

$('#update-accreditation-status-btn').on('click', function(event) {
    var id = $('#EditAccreditationStatus').attr('data-id');
    var form = $('#accreditation-status-form')[0];
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    }
    form.classList.add('was-validated');
    
    $.ajax({
        url: '/update-accreditation-status/' + id,
        type: 'POST',
        data: $('#view-accreditation-status-form').serialize(),
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
            $('#view-accreditation-status-form')[0].reset();
            $('#EditAccreditationStatus').modal('hide');
            fetchAccreditationStatusData();
        },
        error: function (xhr, status) {
            throwError(xhr, status);
        }
    });
})

$(document).on('click', '#remove-accreditation-status-btn', function(){
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
                url: "/remove-accreditation-status/"+id,
                type: 'POST',
                success: function (response) {
                    console.log('Success:', response);
                    Swal.fire({
                        title: "Success!",
                        text: response.message,
                        icon: "success"
                    });
                    fetchAccreditationStatusData();
                },
                error: function (xhr, status) {
                    console.log('Error:', xhr);
                }
            });
        }
    });
}); 

//Academic programs with Government Recognition (CoPC) 
let govRecognitions;

const govRecognitionTable = () => {
    const defaultDateFilter = {
        column: 'date',
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
                const quarter = Math.floor(currentDate.getMonth() / 3);
                const startMonth = quarter * 3;
                startDate = new Date(currentDate.getFullYear(), startMonth, 1);
                endDate = new Date(currentDate.getFullYear(), startMonth + 3, 0);
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
                        <strong style="background: linear-gradient(45deg,rgb(254, 160, 37),rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                            ADDED BY
                        </strong><br>
                        <span style="font-size: 0.75em; color: #888;">Updated on</span>
                    </div>
                `;
            },
            headerSort: false,
            headerHozAlign: "center",
            field: "name",
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
        { title:'PROGRAM',
            titleFormatter: function () {
                return `
                    <div style="line-height: 2.5;">
                        <strong style="background: linear-gradient(45deg,rgb(254, 160, 37),rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                            PROGRAM
                        </strong>
                    </div>
                `;
            }, 
            field: "program", 
            headerSort: false, 
            headerHozAlign: "center", 
            hozAlign: "left", 
            vertAlign: "middle" 
        },
        { title:'STATUS',
            titleFormatter: function () {
                return `
                    <div style="line-height: 2.5;">
                        <strong style="background: linear-gradient(45deg,rgb(254, 160, 37),rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                            STATUS
                        </strong>
                    </div>
                `;
            }, 
            field: "status", 
            headerSort: false, 
            headerHozAlign: "center", 
            hozAlign: "center", 
            vertAlign: "middle" 
        },
        { title:'CoPC NUMBER',
            titleFormatter: function () {
                return `
                    <div style="line-height: 2.5;">
                        <strong style="background: linear-gradient(45deg,rgb(254, 160, 37),rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                            CoPC NUMBER
                        </strong>
                    </div>
                `;
            }, 
            field: "copc", 
            headerSort: false, 
            headerHozAlign: "center", 
            hozAlign: "center", 
            vertAlign: "middle" 
        },
        { title:'DATE',
            titleFormatter: function () {
                return `
                    <div style="line-height: 2.5;">
                        <strong style="background: linear-gradient(45deg,rgb(254, 160, 37),rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                            DATE
                        </strong>
                    </div>
                `;
            }, 
            field: "date", 
            headerSort: false, 
            headerHozAlign: "center", 
            hozAlign: "center", 
            vertAlign: "middle" 
        },
    ];
    
    if (window.userPosition != 5) {
        columns.push({
            titleFormatter: function () {
                return `
                    <div style="line-height: 2.5;">
                        <strong style="background: linear-gradient(45deg,rgb(254, 160, 37),rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                            ACTION
                        </strong>
                    </div>
                `;
            },
            field: "action",
            headerSort: false,
            headerHozAlign: "center",
            hozAlign: "center",
            formatter: "html",
            vertAlign: "middle",
            download: false 
        });
    }
    
    govRecognitions = new Tabulator("#gov-recognition-table", {
        layout: "fitDataFill",
        maxHeight: "800px",
        pagination: "local",
        paginationSize: 10,
        paginationSizeSelector: [10, 50, 100],
        placeholder: "No Data Available",
        columns: columns,
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
            if (index % 2 === 0) {
                element.style.backgroundColor = "#FFF1D1";
            } else {
                element.style.backgroundColor = "#ffffff";
            }
        }
    });
};

//SEARCH FUNCTION
function searchRecognition(keyword) {
    govRecognitions.setFilter([
        { field: "program", type: "like", value: keyword }
    ]);
}

//DATE FILTER DROPDOWNS
document.getElementById("gov-filter-type").addEventListener("change", function () {
    const type = this.value;
    const filterValueSelect = document.getElementById("gov-filter-value");
    const filterYearSelect = document.getElementById("gov-filter-year");

    filterValueSelect.innerHTML = "";
    filterYearSelect.innerHTML = "";

    if (type === "all") {
        govRecognitions.clearFilter();
        filterValueSelect.style.display = "none";
        filterYearSelect.style.display = "none";
        return;
    }

    filterValueSelect.style.display = (type === "yearly") ? "none" : "inline-block";
    filterYearSelect.style.display = "inline-block";

    const data = govRecognitions.getData();
    const monthsSet = new Set();
    const quartersSet = new Set();
    const yearsSet = new Set();

    data.forEach(row => {
        const date = new Date(row.date);
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

    [...yearsSet].sort((a, b) => b - a).forEach(year => {
        const opt = document.createElement("option");
        opt.value = year;
        opt.textContent = year;
        filterYearSelect.appendChild(opt);
    });
});

document.getElementById("gov-filter-value").addEventListener("change", applyGovFilter);
document.getElementById("gov-filter-year").addEventListener("change", applyGovFilter);

//APPLY FILTER
function applyGovFilter() {
    const type = document.getElementById("gov-filter-type").value;
    const selectedValue = document.getElementById("gov-filter-value").value;
    const selectedYear = document.getElementById("gov-filter-year").value;

    govRecognitions.clearFilter();

    govRecognitions.setFilter(function (data) {
        const date = new Date(data.date);
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

//CSV DOWNLOAD
document.getElementById("gov-recognition-csv").addEventListener("click", () => {
    govRecognitions.download("csv", "Gov Recognition(CoPC).csv");
});

function searchRecognition(value) {
    let searchTerms = value.trim().toLowerCase().split(/\s+/);

    if (searchTerms.length === 0 || searchTerms[0] === "") {
        govRecognitions.clearFilter();
        return;
    }

    govRecognitions.setFilter(function(data) {
        let matches = true;

        searchTerms.forEach(term => {
            if (
                //!data.no.toString().toLowerCase().includes(term) &&
                !data.name.toLowerCase().includes(term) &&
                !data.program.toLowerCase().includes(term) &&
                !data.status.toLowerCase().includes(term) &&
                !data.copc.toLowerCase().includes(term) &&
                !data.date.toLowerCase().includes(term)
            ) {
                matches = false;
            }
        });

        return matches;
    });
}



$('#gov-recognition-modal').click(function() {
   $('#AddGovRecognition').modal('show');
});

$('#submit-gov-recognition-btn').on('click', function(event) {
    var form = $('#gov-recognition-form')[0];
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
        form.classList.add('was-validated');
        return;
    }

    $.ajax({
        url: '/store-gov-recognition',
        type: 'POST',
        data: $('#gov-recognition-form').serialize(),
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
            $('#gov-recognition-form')[0].reset();
            $('#AddGovRecognition').modal('hide');
            fetchGovRecognitionData();
        },
        error: function(xhr) {
            if (xhr.status === 409) {
                Swal.fire({
                    title: "Duplicate Entry",
                    text: xhr.responseJSON.error,
                    icon: "warning"
                });
            } else {
                throwError(xhr, xhr.status);
            }
        }
    });
});

//
function fetchGovRecognitionData(){
    $.ajax({
        url: '/fetch-gov-recognition',
        type: 'GET',
        success: function(response) {
            // console.log(response);
            govRecognitions.setData(response);
            
        },
        error: function (xhr, status) {
            console.log("Error:", xhr.responseText);
        }
    });
}

$(document).on('click', '#edit-gov-recognition-btn', function (e) {
    var id = $(this).attr('data-id');
    $('#EditGovRecognition').modal('show');
    $('#EditGovRecognition').attr('data-id', id);
    $.ajax({
        url: '/view-gov-recognition/' + id,
        type: 'GET',
        success: function(response) {
            $('#view_gov_program_id').val(response.program_id);
            $('#view_gov_status_id').val(response.status_id);
            $('#view_gov_copc_number').val(response.copc_number);
            $('#view_gov_date').val(response.date);
        },
        error: function (xhr, status) {
            console.log("Error:", xhr.responseText);
        }
    });
});

$('#update-gov-recognition-btn').on('click', function(event) {
    var id = $('#EditGovRecognition').attr('data-id');
    var form = $('#view-gov-recognition-form')[0];
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    }
    form.classList.add('was-validated');
    
    $.ajax({
        url: '/update-gov-recognition/' + id,
        type: 'POST',
        data: $('#view-gov-recognition-form').serialize(),
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
            $('#view-gov-recognition-form')[0].reset();
            $('#EditGovRecognition').modal('hide');
            fetchGovRecognitionData();
        },
        error: function (xhr, status) {
            throwError(xhr, status);
        }
    });
});

$(document).on('click', '#remove-gov-recognition-btn', function(){
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
                url: "/remove-gov-recognition/"+id,
                type: 'POST',
                success: function (response) {
                    console.log('Success:', response);
                    Swal.fire({
                        title: "Success!",
                        text: response.message,
                        icon: "success"
                    });
                    fetchGovRecognitionData();
                },
                error: function (xhr, status) {
                    console.log('Error:', xhr);
                }
            });
        }
    });
}); 

//Performance in the licensure examination
let licensureExamTable = () => {
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
            headerHozAlign: "center",
            field: "name",
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
        { title:"EXAM TYPE",
            titleFormatter: () => 
            `<div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">EXAM TYPE</strong>
            </div>`,
            field: "exam",
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle"
        },
        { 
            title:"EXAM DATE (Start - End)",
            titleFormatter: () => 
            `<div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                EXAM DATE (Start - End)</strong>
            </div>`,
            field: "exam_date_range",
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle",
            formatter: function(cell) {
                const value = cell.getValue();
                return value ? value : '';
            }
        },
        { title:"CVSU FIRST TIME TAKER",
            titleFormatter: () => 
            `<div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">CVSU FIRST TIME TAKER</strong>
            </div>`,
            field: "cvsu_rate",
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            formatter: "html",
            vertAlign: "middle"
        },
        { title:"NATIONAL FIRST TIME TAKER",
            titleFormatter: () => 
            `<div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">NATIONAL FIRST TIME TAKER</strong>
            </div>`,
            field: "national_rate",
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            formatter: "html",
            vertAlign: "middle"
        },
        { title:"CVSU OVERALL TOTAL",
            titleFormatter: () => 
            `<div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">CVSU OVERALL TOTAL</strong>
            </div>`,
            field: "cvsu_overall_passing_rate",
            headerHozAlign: "center",
            headerSort: false,
            formatter: "html",
            hozAlign: "center",
            vertAlign: "middle"
        },
        { title:"NATIONAL OVERALL TOTAL",
            titleFormatter: () =>
            `<div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">NATIONAL OVERALL TOTAL</strong>
            </div>`,
            field: "national_overall_passing_rate",
            headerHozAlign: "center",
            headerSort: false,
            formatter: "html",
            hozAlign: "center",
            vertAlign: "middle"
        }
    ];
    
    if (window.userPosition != 5) {
        columns.push({
            titleFormatter: () => 
            `<div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">ACTION</strong>
            </div>`,
            field: "action",
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            formatter: "html",
            vertAlign: "middle",
            download: false
        });
    }
    
    licensureExams = new Tabulator("#licensure-axam-table", {
        dataTree: true,
        dataTreeSelectPropagate: true,
        headerSort: false,
        layout: "fitDataFill",
        maxHeight: "800px",
        scrollToColumnPosition: "center",
        pagination: "local",
        placeholder: "No Data Available",
        paginationSize: 10,
        paginationSizeSelector: [10, 50, 100],
        selectable: 1,
        columns: columns,
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
            if (index % 2 === 0) {
                element.style.backgroundColor = "#FFF1D1";
            } else {
                element.style.backgroundColor = "#ffffff";
            }
        }
    });    
};

document.getElementById("licensure-filter-type").addEventListener("change", function() {
    const type = this.value;
    const filterValueSelect = document.getElementById("licensure-filter-value");
    const filterYearSelect = document.getElementById("licensure-filter-year");

    filterValueSelect.innerHTML = "";
    filterYearSelect.innerHTML = "";

    if (type === "all") {
        licensureExams.clearFilter();
        filterValueSelect.style.display = "none";
        filterYearSelect.style.display = "none";
        return;
    }

    filterValueSelect.style.display = (type === "yearly") ? "none" : "inline-block";
    filterYearSelect.style.display = "inline-block";

    const data = licensureExams.getData();
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

document.getElementById("licensure-filter-value").addEventListener("change", applyLicensureExamFilter);
document.getElementById("licensure-filter-year").addEventListener("change", applyLicensureExamFilter);

function applyLicensureExamFilter() {
    const type = document.getElementById("licensure-filter-type").value;
    const selectedValue = document.getElementById("licensure-filter-value").value;
    const selectedYear = document.getElementById("licensure-filter-year").value;

    licensureExams.clearFilter();

    licensureExams.setFilter(function(data) {
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

$('#licensure-exam-csv').click(function() {
    licensureExams.download("csv", "Licensure Exams.csv", { filter: true });
});

document.getElementById("licensure-search").addEventListener("input", function () {
    const searchTerms = this.value.toLowerCase().split(" ");

    licensureExams.setFilter(function(data) {
        let matches = true;

        searchTerms.forEach(term => {
            if (
                !data.name.toLowerCase().includes(term) &&
                !data.exam.toLowerCase().includes(term) &&
                !data.start_date.toLowerCase().includes(term) &&
                !data.end_date.toLowerCase().includes(term) &&
                !data.cvsu_rate.toString().includes(term) &&
                !data.national_rate.toString().includes(term) &&
                !data.cvsu_overall_passing_rate.toString().includes(term) &&
                !data.national_overall_passing_rate.toString().includes(term)
            ) {
                matches = false;
            }
        });

        return matches;
    });
});

$('#licensure-exam-modal').click(function() {
   $('#AddLicensureExam').modal('show');
});
//updateLicensureExam
$('#submit-licensure-exam-btn').click(function(event) {
    event.preventDefault(); // Always prevent default form submission
    var form = $('#licensure-exam-form')[0];

    // Get values
    var cvsuPassers = parseInt($('#cvsu_total_passer').val()) || 0;
    var cvsuTakers = parseInt($('#cvsu_total_takers').val()) || 0;
    var natPassers = parseInt($('#national_total_passer').val()) || 0;
    var natTakers = parseInt($('#national_total_takers').val()) || 0;
    var cvsuOverallPassers = parseInt($('#cvsu_overall_passer').val()) || 0;
    var cvsuOverallTakers = parseInt($('#cvsu_overall_taker').val()) || 0;
    var natOverallPassers = parseInt($('#national_overall_passer').val()) || 0;
    var natOverallTakers = parseInt($('#national_overall_taker').val()) || 0;

    // Validation: Passers should not exceed takers
    if (
        cvsuPassers > cvsuTakers ||
        natPassers > natTakers ||
        cvsuOverallPassers > cvsuOverallTakers ||
        natOverallPassers > natOverallTakers
    ) {
        Swal.fire({
            title: "Invalid Entry",
            text: "Number of passers cannot be greater than the number of takers.",
            icon: "warning"
        });
        return;
    }

    // Date validation
    var today = new Date();
    today.setHours(0,0,0,0);
    var start = new Date($('#start_date').val());
    var end = new Date($('#end_date').val());
    if (start > today || end > today) {
        Swal.fire({
            title: "Invalid Date",
            text: "Future dates are not accommodated.",
            icon: "warning"
        });
        return;
    }

    if (form.checkValidity() === false) {
        event.stopPropagation();
        form.classList.add('was-validated');
        return;
    }

    form.classList.add('was-validated');

    $.ajax({
        url: '/store-licensure-exam',
        type: 'POST',
        data: $('#licensure-exam-form').serialize(),
        success: function(response) {
            console.log("Success response:", response);
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
            $('#licensure-exam-form')[0].reset();
            $('#AddLicensureExam').modal('hide');
            fetchLicensureExamData();
        },
        error: function(xhr, status) {
            console.log("Error response:", xhr.responseText);
            throwError(xhr, status);
        }
    });
});


function fetchLicensureExamData(){
    $.ajax({
        url: '/fetch-licensure-exam',
        type: 'GET',
        success: function(response) {
            // console.log(response);
            licensureExams.setData(response);
            
        },
        error: function (xhr, status) {
            console.log("Error:", xhr.responseText);
        }
    });
}

$(document).on('click', '#edit-licensure-exam-btn', function (e) {
    var id = $(this).attr('data-id');
    $('#EditLicensureExam').modal('show');
    $('#EditLicensureExam').attr('data-id', id);
    $.ajax({
        url: '/view-licensure-exam/' + id,
        type: 'GET',
        success: function(response) {
            $('#view_examination_type').val(response.examination_type);
            $('#view_cvsu_passing_rate').val(response.cvsu_passing_rate);
            $('#view_national_passing_rate').val(response.national_passing_rate);
            $('#view_start_date').val(response.start_date);
            $('#view_end_date').val(response.end_date);
            $('#view_cvsu_total_passer').val(response.cvsu_total_passer);
            $('#view_cvsu_total_takers').val(response.cvsu_total_takers);
            $('#view_national_total_passer').val(response.national_total_passer);
            $('#view_national_total_takers').val(response.national_total_takers);

            $('#view_cvsu_overall_passer').val(response.cvsu_overall_passer);
            $('#view_national_overall_passer').val(response.national_overall_passer);
            $('#view_cvsu_overall_taker').val(response.cvsu_overall_taker);
            $('#view_national_overall_taker').val(response.national_overall_taker);
            $('#view_cvsu_overall_passing_rate').val(response.cvsu_overall_passing_rate);
            $('#view_national_overall_passing_rate').val(response.national_overall_passing_rate);
           
        },
        error: function (xhr, status) {
            console.log("Error:", xhr.responseText);
        }
    });
});

$('#update-licensure-exam-btn').click(function (event) {
    var id = $('#EditLicensureExam').attr('data-id');
    var form = $('#view-licensure-exam-form')[0];
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    }
    form.classList.add('was-validated');
    
    $.ajax({
        url: '/update-licensure-exam/' + id,
        type: 'POST',
        data: $('#view-licensure-exam-form').serialize(),
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
            $('#view-licensure-exam-form')[0].reset();
            $('#EditLicensureExam').modal('hide');
            fetchLicensureExamData();
        },
        error: function (xhr, status) {
            throwError(xhr, status);
        }
    });
});

$(document).on('click', '#remove-licensure-exam-btn', function(){
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
                url: "/remove-licensure-exam/"+id,
                type: 'POST',
                success: function (response) {
                    console.log('Success:', response);
                    Swal.fire({
                        title: "Success!",
                        text: response.message,
                        icon: "success"
                    });
                    fetchLicensureExamData();
                },
                error: function (xhr, status) {
                    console.log('Error:', xhr);
                }
            });
        }
    });
});

$('#cvsu_total_passer, #cvsu_total_takers').on('keyup', function() {
    var passers = parseInt($('#cvsu_total_passer').val()) || 0;
    var takers = parseInt($('#cvsu_total_takers').val()) || 0;

    if (takers > 0) { // Avoid division by zero
        var passingRate = (passers / takers) * 100;
        $('#cvsu_passing_rate').val(passingRate.toFixed(2) + '%');
    } else {
        $('#cvsu_passing_rate').val('');
    }
});

$('#national_total_passer, #national_total_takers').on('keyup', function() {
    var passers = parseInt($('#national_total_passer').val()) || 0;
    var takers = parseInt($('#national_total_takers').val()) || 0;

    if (takers > 0) { // Avoid division by zero
        var passingRate = (passers / takers) * 100;
        $('#national_passing_rate').val(passingRate.toFixed(2) + '%');
    } else {
        $('#national_passing_rate').val('');
    }
});

$('#cvsu_overall_taker, #cvsu_overall_passer').on('keyup', function() {
    var passers = parseInt($('#cvsu_overall_passer').val()) || 0;
    var takers = parseInt($('#cvsu_overall_taker').val()) || 0;

    if (takers > 0) { // Avoid division by zero
        var passingRate = (passers / takers) * 100;
        $('#cvsu_overall_passing_rate').val(passingRate.toFixed(2) + '%');
    } else {
        $('#cvsu_overall_passing_rate').val('');
    }
});

$('#national_overall_passer, #national_overall_taker').on('keyup', function() {
    var passers = parseInt($('#national_overall_passer').val()) || 0;
    var takers = parseInt($('#national_overall_taker').val()) || 0;

    if (takers > 0) { // Avoid division by zero
        var passingRate = (passers / takers) * 100;
        $('#national_overall_passing_rate').val(passingRate.toFixed(2) + '%');
    } else {
        $('#national_overall_passing_rate').val('');
    }
});

$('#view_cvsu_total_passer, #view_cvsu_total_takers').on('keyup', function() {
    var passers = parseInt($('#view_cvsu_total_passer').val()) || 0;
    var takers = parseInt($('#view_cvsu_total_takers').val()) || 0;

    if (takers > 0) { // Avoid division by zero
        var passingRate = (passers / takers) * 100;
        $('#view_cvsu_passing_rate').val(passingRate.toFixed(2) + '%');
    } else {
        $('#view_cvsu_passing_rate').val('');
    }
});

$('#view_national_total_passer, #view_national_total_takers').on('keyup', function() {
    var passers = parseInt($('#view_national_total_passer').val()) || 0;
    var takers = parseInt($('#view_national_total_takers').val()) || 0;

    if (takers > 0) { // Avoid division by zero
        var passingRate = (passers / takers) * 100;
        $('#view_national_passing_rate').val(passingRate.toFixed(2) + '%');
    } else {
        $('#view_national_passing_rate').val('');
    }
});

$('#view_cvsu_overall_taker, #view_cvsu_overall_passer').on('keyup', function() {
    var passers = parseInt($('#view_cvsu_overall_passer').val()) || 0;
    var takers = parseInt($('#view_cvsu_overall_taker').val()) || 0;

    if (takers > 0) { // Avoid division by zero
        var passingRate = (passers / takers) * 100;
        $('#view_cvsu_overall_passing_rate').val(passingRate.toFixed(2) + '%');
    } else {
        $('#view_cvsu_overall_passing_rate').val('');
    }
});

$('#view_national_overall_passer, #view_national_overall_taker').on('keyup', function() {
    var passers = parseInt($('#view_national_overall_passer').val()) || 0;
    var takers = parseInt($('#view_national_overall_taker').val()) || 0;

    if (takers > 0) { // Avoid division by zero
        var passingRate = (passers / takers) * 100;
        $('#view_national_overall_passing_rate').val(passingRate.toFixed(2) + '%');
    } else {
        $('#view_national_overall_passing_rate').val('');
    }
});

// List of faculty members with national TVET qualification and certification 

let facultyTvetTable = () => {
    const defaultDateFilter = {
        column: 'date',
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
                const quarter = Math.floor(currentDate.getMonth() / 3);
                const startMonth = quarter * 3;
                startDate = new Date(currentDate.getFullYear(), startMonth, 1);
                endDate = new Date(currentDate.getFullYear(), startMonth + 3, 0);
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
        { title:"HOLDER",
            titleFormatter: () =>
            `<div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">HOLDER</strong>
            </div>`,
            field: "holder",
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle"
        },
        { title:"CERTIFICATE DETAILS",
            titleFormatter: () =>
            `<div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                    CERTIFICATE DETAILS
                </strong>
            </div>`,
            field: "details",
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle"
        },
        { title:"DATE",
            titleFormatter: () =>
            `<div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">DATE</strong>
            </div>`,
            field: "date",
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle"
        }
    ];
    
    if (window.userPosition != 5) {
        columns.push({
            titleFormatter: () =>
            `<div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">ACTION</strong>
            </div>`,
            field: "action",
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            formatter: "html",
            vertAlign: "middle",
            download: false
        });
    }
    
    facultyTvets = new Tabulator("#faculty-tvet-table", {
        layout: "fitDataFill",
        maxHeight: "800px",
        pagination: "local",
        placeholder: "No Data Available",
        paginationSize: 10,
        paginationSizeSelector: [10, 50, 100],
        initialFilter: [
            {
                field: defaultDateFilter.column,
                type: "between",
                value: [startDate.toISOString(), endDate.toISOString()]
            }
        ],
        columns: columns,
        rowFormatter: function (row) {
            const element = row.getElement();
            const index = row.getPosition(true);
            element.style.color = "#000000";
            if (index % 2 === 0) {
                element.style.backgroundColor = "#FFF1D1";
            } else {
                element.style.backgroundColor = "#ffffff";
            }
        }
    });    
};

facultyTvetTable();

document.getElementById("filter-type").addEventListener("change", function() {
    const type = this.value;
    const filterValueSelect = document.getElementById("filter-value");
    const filterYearSelect = document.getElementById("filter-year");

    filterValueSelect.innerHTML = "";
    filterYearSelect.innerHTML = "";

    if (type === "all") {
        facultyTvets.clearFilter();
        filterValueSelect.style.display = "none";
        filterYearSelect.style.display = "none";
        return;
    }

    filterValueSelect.style.display = (type === "yearly") ? "none" : "inline-block";
    filterYearSelect.style.display = "inline-block";

    const data = facultyTvets.getData();
    const monthsSet = new Set();
    const quartersSet = new Set();
    const yearsSet = new Set();

    data.forEach(row => {
        const date = new Date(row.date);
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

    if (type === "monthly") {
        const monthOrder = ["December", "November", "October", "September", "August", "July", "June", "May", "April", "March", "February", "January"];
        monthOrder.forEach(month => {
            if (monthsSet.has(month)) {
                const opt = document.createElement("option");
                opt.value = month;
                opt.textContent = month;
                filterValueSelect.appendChild(opt);
            }
        });
    }

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

    [...yearsSet].sort((a, b) => b - a).forEach(year => {
        const opt = document.createElement("option");
        opt.value = year;
        opt.textContent = year;
        filterYearSelect.appendChild(opt);
    });
});

document.getElementById("filter-value").addEventListener("change", applyFacultyTvetFilter);
document.getElementById("filter-year").addEventListener("change", applyFacultyTvetFilter);

function applyFacultyTvetFilter() {
    const type = document.getElementById("filter-type").value;
    const selectedValue = document.getElementById("filter-value").value;
    const selectedYear = document.getElementById("filter-year").value;

    facultyTvets.clearFilter();

    facultyTvets.setFilter(function(data) {
        const date = new Date(data.date);
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

document.getElementById("faculty-withTVET-csv").addEventListener("click", function() {
    facultyTvets.download("csv", "Faculty with TVET.csv", { filter: true });
});

function searchfacultyTvets(keyword) {
    facultyTvets.setFilter([
        { field: "holder", type: "like", value: keyword }
    ]);
}

function searchfacultyTvets(value) {
    let searchTerms = value.trim().toLowerCase().split(/\s+/);

    if (searchTerms.length === 0 || searchTerms[0] === "") {
        facultyTvets.clearFilter();
        return;
    }

    facultyTvets.setFilter(function(data) {
        let matches = true;

        searchTerms.forEach(term => {
            if (
                !data.name.toLowerCase().includes(term) &&
                !data.certificate.toLowerCase().includes(term) &&
                !data.date.toLowerCase().includes(term) &&
                !data.holder.toLowerCase().includes(term)
            ) {
                matches = false;
            }
        });

        return matches;
    });
}

$('#faculty-tvet-modal').click(function (event) {
    $('#AddFacultyTvet').modal('show');
});

$('#submit-faculty-tvet-btn').click(function (event) {
    var form = $('#faculty-tvet-form')[0];
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    }
    form.classList.add('was-validated');
    
    $.ajax({
        url: '/store-faculty-tvet',
        type: 'POST',
        data: $('#faculty-tvet-form').serialize(),
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
            $('#faculty-tvet-form')[0].reset();
            $('#AddFacultyTvet').modal('hide');
            fetchLicensureExamData();
        },
        error: function (xhr, status) {
            throwError(xhr, status);
        }
    });
});

function fetchfacultyTvetData(){
    $.ajax({
        url: '/fetch-faculty-tvet',
        type: 'GET',
        success: function(response) {
            // console.log(response);
            facultyTvets.setData(response);
            
        },

        error: function (xhr, status) {
            console.log("Error:", xhr.responseText);
        }
    });
}

$(document).on('click', '#edit-faculty-tvet-btn', function (e) {
    var id = $(this).attr('data-id');
    $('#EditFacultyTvet').modal('show');
    $('#EditFacultyTvet').attr('data-id', id);
    $.ajax({
        url: '/view-faculty-tvet/' + id,
        type: 'GET',
        success: function(response) {
            $('#view_certification_type').val(response.certification_type);
            $('#view_faculty_tvet_date').val(response.date);
            $('#view_certifacate_holder').val(response.certificate_holder);
            $('#view_certificate_details').val(response.certificate_details);
        },
        error: function (xhr, status) {
            console.log("Error:", xhr.responseText);
        }
    });
});

$('#update-faculty-tvet-btn').click(function (event) {
    var id = $('#EditFacultyTvet').attr('data-id');
    var form = $('#view-faculty-tvet-form')[0];
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    }
    form.classList.add('was-validated');
    
    $.ajax({
        url: '/update-faculty-tvet/' + id,
        type: 'POST',
        data: $('#view-faculty-tvet-form').serialize(),
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
            $('#EditFacultyTvet').modal('hide');
            fetchfacultyTvetData();
        },
        error: function (xhr, status) {
            throwError(xhr, status);
        }
    });
});

$(document).on('click', '#remove-faculty-tvet-btn', function(){
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
                url: "/remove-faculty-tvet/"+id,
                type: 'POST',
                success: function (response) {
                    console.log('Success:', response);
                    Swal.fire({
                        title: "Success!",
                        text: response.message,
                        icon: "success"
                    });
                    fetchfacultyTvetData();
                },
                error: function (xhr, status) {
                    console.log('Error:', xhr);
                }
            });
        }
    });
}); 

//Number of students with national TVET qualification and certification

let studentTvetTable = () => {
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
                const startMonth = quarter * 3;
                startDate = new Date(currentDate.getFullYear(), startMonth, 1);
                endDate = new Date(currentDate.getFullYear(), startMonth + 3, 0);
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
        { title:"CERTIFICATE TYPE",
            titleFormatter: () =>
            `<div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">CERTIFICATE TYPE</strong>
            </div>`,
            field: "certificate",
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle"
        },
        { title:"NUMBER OF STUDENT",
            titleFormatter: () =>
            `<div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">NUMBER OF STUDENT</strong>
            </div>`,
            field: "number",
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle"
        },
        { title:"LOCATION",
            titleFormatter: () =>
            `<div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                    LOCATION
                </strong>
            </div>`,
            field: "location",
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle"
        },
        { title:"DATE",
            titleFormatter: () =>
            `<div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                    DATE
                </strong>
            </div>`,
            field: "date",
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle"
        }
    ];
    
    if (window.userPosition != 5) {
        columns.push({
            titleFormatter: () =>
            `<div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">ACTION</strong>
            </div>`,
            field: "action",
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            formatter: "html",
            vertAlign: "middle",
            download: false
        });
    }
    
    studentTvets = new Tabulator("#student-tvet-table", {
        layout: "fitDataFill",
        maxHeight: "800px",
        pagination: "local",
        paginationSize: 10,
        paginationSizeSelector: [10, 50, 100],
        placeholder: "No Data Available",
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
document.getElementById("student-filter-type").addEventListener("change", function () {
    const type = this.value;
    const valueSelect = document.getElementById("student-filter-value");
    const yearSelect = document.getElementById("student-filter-year");

    valueSelect.innerHTML = "";
    yearSelect.innerHTML = "";

    if (type === "all") {
        studentTvets.clearFilter();
        valueSelect.style.display = "none";
        yearSelect.style.display = "none";
        return;
    }

    valueSelect.style.display = (type === "yearly") ? "none" : "inline-block";
    yearSelect.style.display = "inline-block";

    const data = studentTvets.getData();
    const months = new Set();
    const quarters = new Set();
    const years = new Set();

    data.forEach(row => {
        const date = new Date(row.updated_at);
        const year = date.getFullYear();
        years.add(year);

        if (type === "monthly") {
            months.add(date.toLocaleString('default', { month: 'long' }));
        } else if (type === "quarterly") {
            quarters.add(`Q${Math.floor(date.getMonth() / 3) + 1}`);
        }
    });

    if (type === "monthly") {
        ["December","November","October","September","August","July","June","May","April","March","February","January"]
        .forEach(month => {
            if (months.has(month)) {
                let opt = document.createElement("option");
                opt.value = month;
                opt.textContent = month;
                valueSelect.appendChild(opt);
            }
        });
    }

    if (type === "quarterly") {
        ["Q4", "Q3", "Q2", "Q1"].forEach(q => {
            if (quarters.has(q)) {
                let opt = document.createElement("option");
                opt.value = q;
                opt.textContent = q;
                valueSelect.appendChild(opt);
            }
        });
    }

    [...years].sort((a, b) => b - a).forEach(year => {
        let opt = document.createElement("option");
        opt.value = year;
        opt.textContent = year;
        yearSelect.appendChild(opt);
    });
});
document.getElementById("student-filter-value").addEventListener("change", applyStudentTvetFilter);
document.getElementById("student-filter-year").addEventListener("change", applyStudentTvetFilter);

function applyStudentTvetFilter() {
    const type = document.getElementById("student-filter-type").value;
    const selectedValue = document.getElementById("student-filter-value").value;
    const selectedYear = document.getElementById("student-filter-year").value;

    studentTvets.clearFilter();

    studentTvets.setFilter(function (data) {
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
document.getElementById("student-withTVET-csv").addEventListener("click", function () {
    studentTvets.download("csv", "Student with TVET.csv", { filter: true });
});

function searchstudentTvets(value) {
    let searchTerms = value.trim().toLowerCase().split(/\s+/);

    if (searchTerms.length === 0 || searchTerms[0] === "") {
        studentTvets.clearFilter();
        return;
    }

    studentTvets.setFilter(function(data) {
        let matches = true;

        searchTerms.forEach(term => {
            if (
                !data.name.toLowerCase().includes(term) &&
                !data.certificate.toLowerCase().includes(term) &&
                !data.location.toLowerCase().includes(term) &&
                !data.date.toLowerCase().includes(term) &&
                !data.number.toString().toLowerCase().includes(term)
            ) {
                matches = false;
            }
        });

        return matches;
    });
}

$('#student-tvet-modal').click(function (event) {
    $('#AddStudentTvet').modal('show');
});

$('#submit-student-tvet-btn').click(function (event) {
    var form = $('#student-tvet-form')[0];
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    }
    form.classList.add('was-validated');
    
    $.ajax({
        url: '/store-student-tvet',
        type: 'POST',
        data: $('#student-tvet-form').serialize(),
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
            $('#student-tvet-form')[0].reset();
            $('#AddStudentTvet').modal('hide');
            fetchStudentTvetData();
        },

        error: function (xhr, status) {
            throwError(xhr, status);
        }
    });
});

function fetchStudentTvetData(){
    $.ajax({
        url: '/fetch-student-tvet',
        type: 'GET',
        success: function(response) {
            // console.log(response);
            studentTvets.setData(response);
            
        },

        error: function (xhr, status) {
            console.log("Error:", xhr.responseText);
        }
    });
}

$(document).on('click', '#edit-student-tvet-btn', function (e) {
    var id = $(this).attr('data-id');
    $('#EditStudentTvet').modal('show');
    $('#EditStudentTvet').attr('data-id', id);
    $.ajax({
        url: '/view-student-tvet/' + id,
        type: 'GET',
        success: function(response) {
            $('#view_student_tvet_certification_type').val(response.certification_type);
            $('#view_student_tvet_number_of_student').val(response.number_of_student);
            $('#view_student_tvet_location').val(response.student_tvet_location);
            $('#view_student_tvet_date').val(response.student_tvet_date);
            $('#view_student_tvet_certificate_details').val(response.certificate_details);
        },
        error: function (xhr, status) {
            console.log("Error:", xhr.responseText);
        }
    });
});

$('#update-student-tvet-btn').click(function (event) {
    var id = $('#EditStudentTvet').attr('data-id');
    var form = $('#view-student-tvet-form')[0];
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    }
    form.classList.add('was-validated');
    
    $.ajax({
        url: '/update-student-tvet/' + id,
        type: 'POST',
        data: $('#view-student-tvet-form').serialize(),
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
            $('#EditStudentTvet').modal('hide');
            fetchStudentTvetData();
        },
        error: function (xhr, status) {
            throwError(xhr, status);
        }
    });
});

$(document).on('click', '#remove-student-tvet-btn', function(){
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
                url: "/remove-student-tvet/"+id,
                type: 'POST',
                success: function (response) {
                    console.log('Success:', response);
                    Swal.fire({
                        title: "Success!",
                        text: response.message,
                        icon: "success"
                    });
                    fetchStudentTvetData();
                },
                error: function (xhr, status) {
                    console.log('Error:', xhr);
                }
            });
        }
    });
});
$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});