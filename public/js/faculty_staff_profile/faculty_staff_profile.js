// Declare global variables
let default_sem, default_sy;

// Function to update global variables
function updateDefaults() {
    default_sem = $('#default_semester').val();
    default_sy = $('#default_school_year').val();
}


$(document).ready(function() {
    educationalAttainmentTable();
    fetchEducationalAttainment();

    natureAppointmentTable();
    fetchNatureAppointment();

    academicRankTable();
    fetchAcademicRank();

    facultyScholarTable();
    fetchfacultyScholar();

    facultyGraduateStudiesTable();
    fetchfacultyGraduateStudies();

    facultySeminarTrainingTable();
    fetchseminarTraining();

    recognitionTable();
    fetchrecognition();

    presentationTable();
    fetchpresentation();

    updateDefaults();

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
    const datalist = document.getElementById('participant-suggestions');
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

let educationalAttainmentTable = () => {
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
        { title:'EDUCATIONAL ATTAINMENT',
            titleFormatter: () =>
            `<div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                    EDUCATIONAL ATTAINMENT
                </strong>
            </div>`,
            field: "education",
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle"
        },
        { title:'SEMESTER',
            titleFormatter: () =>
            `<div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                    SEMESTER
                </strong>
            </div>`,
            field: "semester",
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle"
        },
        { title:'ACADEMIC YEAR',
            titleFormatter: () =>
            `<div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                    ACADEMIC YEAR
                </strong>
            </div>`,
            field: "school_year",
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle"
        },
        { title:'NO. OF FACULTY',
            titleFormatter: () =>
            `<div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                    NO. OF FACULTY
                </strong>
            </div>`,
            field: "number_of_faculty",
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

    educationalAttainments = new Tabulator("#educational-attainment-table", {
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
        rowFormatter: function (row) {
            const element = row.getElement();
            const index = row.getPosition(true);
            element.style.color = "#000000";
            element.style.backgroundColor = index % 2 === 0 ? "#FFF1D1" : "#ffffff";
        },
        columns: columns
    });
}

document.getElementById("educational-filter-type").addEventListener("change", function() {
    const type = this.value;
    const filterValueSelect = document.getElementById("educational-filter-value");
    const filterYearSelect = document.getElementById("educational-filter-year");

    filterValueSelect.innerHTML = "";
    filterYearSelect.innerHTML = "";

    if (type === "all") {
        educationalAttainments.clearFilter();
        filterValueSelect.style.display = "none";
        filterYearSelect.style.display = "none";
        return;
    }

    filterValueSelect.style.display = (type === "yearly") ? "none" : "inline-block";
    filterYearSelect.style.display = "inline-block";

    const data = educationalAttainments.getData();
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

document.getElementById("educational-filter-value").addEventListener("change", applyEducFilter);
document.getElementById("educational-filter-year").addEventListener("change", applyEducFilter);

function applyEducFilter() {
    const type = document.getElementById("educational-filter-type").value;
    const selectedValue = document.getElementById("educational-filter-value").value;
    const selectedYear = document.getElementById("educational-filter-year").value;

    educationalAttainments.clearFilter();

    educationalAttainments.setFilter(function(data) {
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

$('#educational-download-csv').click(function() {
   educationalAttainments.download("csv", "Educational Attainments.csv", { filter: true });
});

// function searcheducationalAttainments(value){
//     educationalAttainments.setFilter([
//         [
//             //{title:'NO', field: 'no'},
//             {field:"name", type:"like", value:value.trim()},
//             {field:"semester", type:"like", value:value.trim()},
//             {field:"school_year", type:"like", value:value.trim()},
//         ]
//     ]);
// }
function searcheducationalAttainments(value) {
    let searchTerms = value.trim().toLowerCase().split(/\s+/);

    if (searchTerms.length === 0 || searchTerms[0] === "") {
        educationalAttainments.clearFilter();
        return;
    }

    educationalAttainments.setFilter(function(data) {
        let matches = true;

        searchTerms.forEach(term => {
            if (
                !data.name.toLowerCase().includes(term) &&
                !data.education.toLowerCase().includes(term) &&
                !data.semester.toLowerCase().includes(term) &&
                !data.school_year.toLowerCase().includes(term) &&
                !data.number_of_faculty.toString().toLowerCase().includes(term)
            ) {
                matches = false;
            }
        });

        return matches;
    });
}

$('#education-attainment-modal').click( function(e) {
    $('#AddEducationalAttainmentModal').modal('show');
});

$('#submit-educational-attainment-btn').on('click', function(event) {
    var form = $('#educational-attainment-form')[0];
    
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    }
    form.classList.add('was-validated');

    var formData = $('#educational-attainment-form').serialize();

    $.ajax({
        url: '/store-educational-attainment',
        type: 'POST',
        data: formData,
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
            $('#educational-attainment-form')[0].reset();
            $('#AddEducationalAttainmentModal').modal('hide');
            fetchEducationalAttainment();
        },
        error: function(xhr, status) {
            throwError(xhr, status);
        }
    });
});


function fetchEducationalAttainment(){
    $.ajax({
        url: '/fetch-educational-attainment',
        type: 'GET',
        success: function(response) {
            // console.log(response);
            educationalAttainments.setData(response);
            
        },
        error: function (xhr, status) {
            console.log("Error:", xhr.responseText);
        }
    });
}

$(document).on('click', '#edit-education-attainment-btn', function(e) {
    var id = $(this).attr('data-id');
    $('#EditEducationalAttainmentModal').attr('data-id', id);
    $('#EditEducationalAttainmentModal').modal('show');
    $.ajax({
        url: '/view-educational-attainment/' + id,
        type: 'GET',
        success: function(response) {
            $('#view_education').val(response.education); 
            $('#view_number_of_faculty').val(response.number_of_faculty);
            $('#view_semester').val(response.semester);
            $('#view_school_year').val(response.school_year);
        },
        error: function (xhr, status) {
            console.log("Error:", xhr.responseText);
        }
    });
});

$('#update-educational-attainment-btn').on('click', function(event) {
    var form = $('#view-educational-attainment-form')[0];
    var id = $('#EditEducationalAttainmentModal').attr('data-id');
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    }
    form.classList.add('was-validated');
    
    $.ajax({
        url: '/update-educational-attainment/' + id,
        type: 'POST',
        data: $('#view-educational-attainment-form').serialize(),
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
            $('#view-educational-attainment-form')[0].reset();
            $('#EditEducationalAttainmentModal').modal('hide');
            fetchEducationalAttainment();
        },
        error: function (xhr, status) {
            throwError(xhr, status);
        }
    });
});

$(document).on('click', '#remove-educational-attainment-btn', function(){
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
                url: "/remove-educational-attainment/"+id,
                type: 'POST',
                success: function (response) {
                    console.log('Success:', response);
                    Swal.fire({
                        title: "Success!",
                        text: response.message,
                        icon: "success"
                    });
                    fetchEducationalAttainment();
                },
                error: function (xhr, status) {
                    console.log('Error:', xhr);
                }
            });
        }
    });
}); 


//Faculty profile by nature of appointment
let natureAppointmentTable = () => {
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
        { title:'NATURE OF APPOINTMENT',
            titleFormatter: () =>
            `<div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                    NATURE OF APPOINTMENT
                </strong>
            </div>`,
            field: "apointment_nature",
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle"
        },
        { title:'SEMSTER',
            titleFormatter: () =>
            `<div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                    SEMESTER
                </strong>
            </div>`,
            field: "semester",
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle"
        },
        { title:'ACADEMIC YEAR',
            titleFormatter: () =>
            `<div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                    ACADEMIC YEAR
                </strong>
            </div>`,
            field: "school_year",
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle"
        },
        { title:'NO. OF FACULTY',
            titleFormatter: () =>
            `<div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                    NO. OF FACULTY
                </strong>
            </div>`,
            field: "number_of_faculty",
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

    natureAppointments = new Tabulator("#nature-appointment-table", {
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
        rowFormatter: function (row) {
            const element = row.getElement();
            const index = row.getPosition(true);
            element.style.color = "#000000";
            element.style.backgroundColor = index % 2 === 0 ? "#FFF1D1" : "#ffffff";
        },
        columns: columns
    });
}

document.getElementById("appointment-filter-type").addEventListener("change", function() {
    const type = this.value;
    const filterValueSelect = document.getElementById("appointment-filter-value");
    const filterYearSelect = document.getElementById("appointment-filter-year");

    filterValueSelect.innerHTML = "";
    filterYearSelect.innerHTML = "";

    if (type === "all") {
        natureAppointments.clearFilter();
        filterValueSelect.style.display = "none";
        filterYearSelect.style.display = "none";
        return;
    }

    filterValueSelect.style.display = (type === "yearly") ? "none" : "inline-block";
    filterYearSelect.style.display = "inline-block";

    const data = natureAppointments.getData();
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

document.getElementById("appointment-filter-value").addEventListener("change", applyAppointmentFilter);
document.getElementById("appointment-filter-year").addEventListener("change", applyAppointmentFilter);

function applyAppointmentFilter() {
    const type = document.getElementById("appointment-filter-type").value;
    const selectedValue = document.getElementById("appointment-filter-value").value;
    const selectedYear = document.getElementById("appointment-filter-year").value;

    natureAppointments.clearFilter();

    natureAppointments.setFilter(function(data) {
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

$('#appointment-download-csv').click(function() {
   natureAppointments.download("csv", "Nature of Appointment.csv", { filter: true });
});


// function searchnatureAppointments(value){
//     natureAppointments.setFilter([
//         [
//             //{title:'NO', field: 'no'},
//             {field:"name", type:"like", value:value.trim()},
//             {field:"semester", type:"like", value:value.trim()},
//             {field:"school_year", type:"like", value:value.trim()},
//             {field:"apointment_nature", type:"like", value:value.trim()},
//         ]
//     ]);
// }
function searchnatureAppointments(value) {
    let searchTerms = value.trim().toLowerCase().split(/\s+/);

    if (searchTerms.length === 0 || searchTerms[0] === "") {
        natureAppointments.clearFilter();
        return;
    }

    natureAppointments.setFilter(function(data) {
        let matches = true;

        searchTerms.forEach(term => {
            if (
                !data.name.toLowerCase().includes(term) &&
                !data.apointment_nature.toLowerCase().includes(term) &&
                !data.semester.toLowerCase().includes(term) &&
                !data.school_year.toLowerCase().includes(term) &&
                !data.number_of_faculty.toString().toLowerCase().includes(term)
            ) {
                matches = false;
            }
        });

        return matches;
    });
}

$('#nature-appointment-modal').click(function () {
    $('#AddNatureAppointmentModal').modal('show'); 
});
$('#submit-nature-appointment-btn').on('click', function(event) {
    var form = $('#nature-appointment-form')[0];
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    }
    form.classList.add('was-validated');

    var formData = $('#nature-appointment-form').serialize();
    
    $.ajax({
        url: '/store-nature-appointment',
        type: 'POST',
        data: formData,
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
            $('#nature-appointment-form')[0].reset();
            $('#AddNatureAppointmentModal').modal('hide');
            fetchNatureAppointment();
        },
        error: function (xhr, status) {
            throwError(xhr, status);
        }
    });
});

function fetchNatureAppointment(){
    $.ajax({
        url: '/fetch-nature-appointment',
        type: 'GET',
        success: function(response) {
            // console.log(response);
            natureAppointments.setData(response);
            
        },
        error: function (xhr, status) {
            console.log("Error:", xhr.responseText);
        }
    });
}

$(document).on('click','#edit-nature-appointment-btn', function(event){
    $('#EditNatureAppointmentModal').modal('show');
    var id = $(this).attr('data-id');
    $('#EditNatureAppointmentModal').attr('data-id', id);

    $.ajax({
        url: '/view-nature-appointment/' + id,
        type: 'GET',
        success: function(response) {
            $('#view_nop_apointment_nature').val(response.apointment_nature);
            $('#view_nop_semester').val(response.semester);
            $('#view_nop_school_year').val(response.school_year);
            $('#view_nop_number_of_faculty').val(response.number_of_faculty);
            
        },
        error: function (xhr, status) {
            console.log("Error:", xhr.responseText);
        }
    });
});

$('#update-nature-appointment-btn').on('click', function(event) {
    var id = $('#EditNatureAppointmentModal').attr('data-id');
    var form = $('#view-nature-appointment-form')[0];
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    }
    form.classList.add('was-validated');
    
    $.ajax({
        url: '/update-nature-appointment/' + id,
        type: 'POST',
        data: $('#view-nature-appointment-form').serialize(),
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            })
            $('#EditNatureAppointmentModal').modal('hide');
            fetchNatureAppointment();
        },
        error: function (xhr, status) {
            throwError(xhr, status);
        }
    });
});

$(document).on('click', '#remove-nature-appointment-btn', function(){
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
                url: "/remove-nature-appointment/"+id,
                type: 'POST',
                success: function (response) {
                    console.log('Success:', response);
                    Swal.fire({
                        title: "Success!",
                        text: response.message,
                        icon: "success"
                    });
                    fetchNatureAppointment();
                },
                error: function (xhr, status) {
                    console.log('Error:', xhr);
                }
            });
        }
    });
}); 

//storeAcademicRank

let academicRankTable = () => {
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
        { title:'ACADEMIC RANK',
            titleFormatter: () =>
            `<div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                    ACADEMIC RANK
                </strong>
            </div>`,
            field: "academic_rank",
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle"
        },
        { title:'SEMESTER',
            titleFormatter: () =>
            `<div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                    SEMESTER
                </strong>
            </div>`,
            field: "semester",
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle"
        },
        { title:'ACADEMIC YEAR',
            titleFormatter: () =>
            `<div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                    ACADEMIC YEAR
                </strong>
            </div>`,
            field: "school_year",
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle"
        },
        { title:'NO. OF FACULTY',
            titleFormatter: () =>
            `<div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                    NO. OF FACULTY
                </strong>
            </div>`,
            field: "number_of_faculty",
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
                        SEMESTER
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

    academicRanks = new Tabulator("#academic-rank-table", {
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
        rowFormatter: function (row) {
            const element = row.getElement();
            const index = row.getPosition(true);
            element.style.color = "#000000";
            element.style.backgroundColor = index % 2 === 0 ? "#FFF1D1" : "#ffffff";
        },
        columns: columns
    });
}

document.getElementById("academic-filter-type").addEventListener("change", function() {
    const type = this.value;
    const filterValueSelect = document.getElementById("academic-filter-value");
    const filterYearSelect = document.getElementById("academic-filter-year");

    filterValueSelect.innerHTML = "";
    filterYearSelect.innerHTML = "";

    if (type === "all") {
        academicRanks.clearFilter();
        filterValueSelect.style.display = "none";
        filterYearSelect.style.display = "none";
        return;
    }

    filterValueSelect.style.display = (type === "yearly") ? "none" : "inline-block";
    filterYearSelect.style.display = "inline-block";

    const data = academicRanks.getData();
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

document.getElementById("academic-filter-value").addEventListener("change", applyAcademicRankFilter);
document.getElementById("academic-filter-year").addEventListener("change", applyAcademicRankFilter);

function applyAcademicRankFilter() {
    const type = document.getElementById("academic-filter-type").value;
    const selectedValue = document.getElementById("academic-filter-value").value;
    const selectedYear = document.getElementById("academic-filter-year").value;

    academicRanks.clearFilter();

    academicRanks.setFilter(function(data) {
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

$('#academic-download-csv').click(function() {
   academicRanks.download("csv", "Academic Rank.csv", { filter: true });
});


// function searchacademicRanks(value){
//     academicRanks.setFilter([
//         [
//             //{title:'NO', field: 'no'},
//             {field:"name", type:"like", value:value.trim()},
//             {field:"semester", type:"like", value:value.trim()},
//             {field:"school_year", type:"like", value:value.trim()},
//             {field:"academic_rank", type:"like", value:value.trim()},
//         ]
//     ]);
// }
function searchacademicRanks(value) {
    let searchTerms = value.trim().toLowerCase().split(/\s+/);

    if (searchTerms.length === 0 || searchTerms[0] === "") {
        academicRanks.clearFilter();
        return;
    }

    academicRanks.setFilter(function(data) {
        let matches = true;

        searchTerms.forEach(term => {
            if (
                !data.name.toLowerCase().includes(term) &&
                !data.academic_rank.toLowerCase().includes(term) &&
                !data.semester.toLowerCase().includes(term) &&
                !data.school_year.toLowerCase().includes(term) &&
                !data.number_of_faculty.toString().toLowerCase().includes(term)
            ) {
                matches = false;
            }
        });

        return matches;
    });
}


$('#academic-rank-modal').click(function () {
    $('#AddAcademicRankModal').modal('show');

});

$('#submit-academic-rank-btn').on('click', function(event) {
    var form = $('#academic-rank-form')[0];
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    }
    form.classList.add('was-validated');
    var formData = $('#academic-rank-form').serialize();

    $.ajax({
        url: '/store-academic-rank',
        type: 'POST',
        data: formData,
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
            $('#academic-rank-form')[0].reset();
            $('#AddAcademicRankModal').modal('hide');
            fetchAcademicRank();
        },
        error: function (xhr, status) {
            throwError(xhr, status);
        }
    });
});

function fetchAcademicRank(){
    $.ajax({
        url: '/fetch-academic-rank',
        type: 'GET',
        success: function(response) {
            // console.log(response);
            academicRanks.setData(response);
            
        },
        error: function (xhr, status) {
            console.log("Error:", xhr.responseText);
        }
    });
}

$(document).on('click','#edit-academic-rank-btn', function(event){
    $('#EditAcademicRankModal').modal('show');
    var id = $(this).attr('data-id');
    $('#EditAcademicRankModal').attr('data-id', id);
    $.ajax({
        url: '/view-academic-rank/' + id,
        type: 'GET',
        success: function(response) {
            $('#view_ar_academic_rank').val(response.academic_rank);
            $('#view_ar_semester').val(response.semester);
            $('#view_ar_school_year').val(response.school_year);
            $('#view_ar_number_of_faculty').val(response.number_of_faculty);
            
        },
        error: function (xhr, status) {
            console.log("Error:", xhr.responseText);
        }
    });
});

$('#update-academic-rank-btn').on('click', function(event) {
    var id = $('#EditAcademicRankModal').attr('data-id');
    var form = $('#view-academic-rank-form')[0];
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    }
    form.classList.add('was-validated');
    
    $.ajax({
        url: '/update-academic-rank/' + id,
        type: 'POST',
        data: $('#view-academic-rank-form').serialize(),
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
            $('#EditAcademicRankModal').modal('hide');
            fetchAcademicRank();
        },
        error: function (xhr, status) {
            throwError(xhr, status);
        }
    });
});

$(document).on('click', '#remove-academic-rank-btn', function(){
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
                url: "/remove-academic-rank/"+id,
                type: 'POST',
                success: function (response) {
                    console.log('Success:', response);
                    Swal.fire({
                        title: "Success!",
                        text: response.message,
                        icon: "success"
                    });
                    fetchAcademicRank();
                },
                error: function (xhr, status) {
                    console.log('Error:', xhr);
                }
            });
        }
    });
});

// List of faculty scholars

let facultyScholarTable = () => {
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
        { title:'FACULTY NAME',
            titleFormatter: () =>
            `<div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                    FACULTY NAME
                </strong>
            </div>`,
            field: "faculty_name",
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle"
        },
        { title:'SCHOLARSHIP',
            titleFormatter: () =>
            `<div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                    SCHOLARSHIP
                </strong>
            </div>`,
            field: "scholarship",
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle"
        },
        { title:'INSTITUTION',
            titleFormatter: () =>
            `<div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                    INSTITUTION
                </strong>
            </div>`,
             field: "institution",
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
            field: "program",
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

    facultyScholars = new Tabulator("#faculty-scholar-table", {
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
        rowFormatter: function (row) {
            const element = row.getElement();
            const index = row.getPosition(true);
            element.style.color = "#000000";
            element.style.backgroundColor = index % 2 === 0 ? "#FFF1D1" : "#ffffff";
        },
        columns: columns
    });
}

document.getElementById("scholar-filter-type").addEventListener("change", function() {
    const type = this.value;
    const filterValueSelect = document.getElementById("scholar-filter-value");
    const filterYearSelect = document.getElementById("scholar-filter-year");

    filterValueSelect.innerHTML = "";
    filterYearSelect.innerHTML = "";

    if (type === "all") {
        facultyScholars.clearFilter();
        filterValueSelect.style.display = "none";
        filterYearSelect.style.display = "none";
        return;
    }

    filterValueSelect.style.display = (type === "yearly") ? "none" : "inline-block";
    filterYearSelect.style.display = "inline-block";

    const data = facultyScholars.getData();
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

document.getElementById("scholar-filter-value").addEventListener("change", applyScholarFilter);
document.getElementById("scholar-filter-year").addEventListener("change", applyScholarFilter);

function applyScholarFilter() {
    const type = document.getElementById("scholar-filter-type").value;
    const selectedValue = document.getElementById("scholar-filter-value").value;
    const selectedYear = document.getElementById("scholar-filter-year").value;

    facultyScholars.clearFilter();

    facultyScholars.setFilter(function(data) {
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
   facultyScholars.download("csv", "Faculty Scholar.csv", { filter: true });
});


// function searchfacultyScholars(value){
//     facultyScholars.setFilter([
//         [
//             //{title:'NO', field: 'no'},
//             {field:"name", type:"like", value:value.trim()},
//             {field:"faculty_name", type:"like", value:value.trim()},
//             {field:"scholarship", type:"like", value:value.trim()},
//             {field:"institution", type:"like", value:value.trim()},
//         ]
//     ]);
// }
function searchfacultyScholars(value) {
    let searchTerms = value.trim().toLowerCase().split(/\s+/);

    if (searchTerms.length === 0 || searchTerms[0] === "") {
        facultyScholars.clearFilter();
        return;
    }

    facultyScholars.setFilter(function(data) {
        let matches = true;

        searchTerms.forEach(term => {
            if (
                !data.name.toLowerCase().includes(term) &&
                !data.faculty_name.toLowerCase().includes(term) &&
                !data.scholarship.toLowerCase().includes(term) &&
                !data.institution.toLowerCase().includes(term) &&
                !data.program.toLowerCase().includes(term)
            ) {
                matches = false;
            }
        });

        return matches;
    });
}

$('#faculty-scholar-modal').click(function(){
    $('#AddFacultyScholarModal').modal('show');
});

$('#submit-faculty-scholar-btn').on('click', function(event) {
    var form = $('#faculty-scholar-form')[0];
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    }
    form.classList.add('was-validated');
    
    $.ajax({
        url: '/store-faculty-scholar',
        type: 'POST',
        data: $('#faculty-scholar-form').serialize(),
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
            $('#faculty-scholar-form')[0].reset();
            $('#AddFacultyScholarModal').modal('hide');
            fetchfacultyScholar();
        },
        error: function (xhr, status) {
            throwError(xhr, status);
        }
    });
});

function fetchfacultyScholar(){
    $.ajax({
        url: '/fetch-faculty-scholar',
        type: 'GET',

        success: function(response) {
            // console.log(response);
            facultyScholars.setData(response);
            
        },
        error: function (xhr, status) {
            console.log("Error:", xhr.responseText);
        }
    });
}

$(document).on('click','#edit-faculty-scholar-btn', function(event){
    $('#EditFacultyScholarModal').modal('show');
    var id = $(this).attr('data-id');
    $('#EditFacultyScholarModal').attr('data-id', id);
    $.ajax({
        url: '/view-faculty-scholar/' + id,
        type: 'GET',
        success: function(response) {
            $('#view_fs_faculty_name').val(response.faculty_name);
            $('#view_fs_scholarship').val(response.scholarship);
            $('#view_fs_institution').val(response.institution);
            $('#view_fs_program').val(response.program);
            
        },
    });
});

$('#update-faculty-scholar-btn').on('click', function(event) {
    var form = $('#view-faculty-scholar-form')[0];
    var id = $('#EditFacultyScholarModal').attr('data-id');
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    }
    form.classList.add('was-validated');
    
    $.ajax({
        url: '/update-faculty-scholar/' + id,
        type: 'POST',
        data: $('#view-faculty-scholar-form').serialize(),
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
            $('#EditFacultyScholarModal').modal('hide');
            fetchfacultyScholar();

        },
        error: function (xhr, status) {
            throwError(xhr, status);
        }
    });
});

$(document).on('click', '#remove-faculty-scholar-btn', function(){
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
                url: "/remove-faculty-scholar/"+id,
                type: 'POST',
                success: function (response) {
                    console.log('Success:', response);
                    Swal.fire({
                        title: "Success!",
                        text: response.message,
                        icon: "success"
                    });
                    fetchfacultyScholar();
                },
                error: function (xhr, status) {
                    console.log('Error:', xhr);
                }
            });
        }
    });
});

// List of faculty Members who completed their Graduated Studies 

let facultyGraduateStudiesTable = () => {
    const defaultDateFilter = {
        column: 'date_of_graduation',
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
                        <span style="font-size: 0.8em; color: #888;">${data.date_of_graduation}</span>
                    </div>
                `;
            }
        },
        { title:'FACULTY NAME',
            titleFormatter: () =>
            `<div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                    FACULTY NAME
                </strong>
            </div>`,
            field: "faculty_name",
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle"
        },
        { title:'DEGREE',
            titleFormatter: () =>
            `<div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                    DEGREE
                </strong>
            </div>`,
            field: "degree",
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle"
        },
        { title:'UNITS',
            titleFormatter: () =>
            `<div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                    UNITS EARNED
                </strong>
            </div>`,
            field: "units",
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle"
        },
        { title:'INSTITUTION',
            titleFormatter: () =>
            `<div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                    INSTITUTION
                </strong>
            </div>`,
            field: "institution",
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle"
        },
        { title:'DATE OF GRADUATION',
            titleFormatter: () =>
            `<div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                    DATE OF GRADUATION
                </strong>
            </div>`,
            field: "date_of_graduation",
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

    facultyGraduateStudies = new Tabulator("#faculty-graduate-studies-table", {
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
        rowFormatter: function (row) {
            const element = row.getElement();
            const index = row.getPosition(true);
            element.style.color = "#000000";
            element.style.backgroundColor = index % 2 === 0 ? "#FFF1D1" : "#ffffff";
        },
        columns: columns
    });
}

document.getElementById("faculty-graduate-filter-type").addEventListener("change", function() {
    const type = this.value;
    const filterValueSelect = document.getElementById("faculty-graduate-filter-value");
    const filterYearSelect = document.getElementById("faculty-graduate-filter-year");

    filterValueSelect.innerHTML = "";
    filterYearSelect.innerHTML = "";

    if (type === "all") {
        facultyGraduateStudies.clearFilter();
        filterValueSelect.style.display = "none";
        filterYearSelect.style.display = "none";
        return;
    }

    filterValueSelect.style.display = (type === "yearly") ? "none" : "inline-block";
    filterYearSelect.style.display = "inline-block";

    const data = facultyGraduateStudies.getData();
    const monthsSet = new Set();
    const quartersSet = new Set();
    const yearsSet = new Set();

    data.forEach(row => {
        const date = new Date(row.date_of_graduation);
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

document.getElementById("faculty-graduate-filter-value").addEventListener("change", applyfacultyGraduateStudiesFilter);
document.getElementById("faculty-graduate-filter-year").addEventListener("change", applyfacultyGraduateStudiesFilter);

function applyfacultyGraduateStudiesFilter() {
    const type = document.getElementById("faculty-graduate-filter-type").value;
    const selectedValue = document.getElementById("faculty-graduate-filter-value").value;
    const selectedYear = document.getElementById("faculty-graduate-filter-year").value;

    facultyGraduateStudies.clearFilter();

    facultyGraduateStudies.setFilter(function(data) {
        const date = new Date(data.date_of_graduation);
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

$('#faculty-graduate-download-csv').click(function() {
    facultyGraduateStudies.download("csv", "Graduated Faculty.csv", { filter: true });
});

// function searchfacultyGraduateStudies(value){
//     facultyGraduateStudies.setFilter([
//         [
//             //{title:'NO', field: 'no'},
//             {field:"name", type:"like", value:value.trim()},
//             {field:"faculty_name", type:"like", value:value.trim()},
//             {field:"degree", type:"like", value:value.trim()},
//             {field:"institution", type:"like", value:value.trim()},
//         ]
//     ]);
// }
function searchfacultyGraduateStudies(value) {
    let searchTerms = value.trim().toLowerCase().split(/\s+/);

    if (searchTerms.length === 0 || searchTerms[0] === "") {
        facultyGraduateStudies.clearFilter();
        return;
    }

    facultyGraduateStudies.setFilter(function(data) {
        let matches = true;

        searchTerms.forEach(term => {
            if (
                !data.name.toLowerCase().includes(term) &&
                !data.faculty_name.toLowerCase().includes(term) &&
                !data.degree.toLowerCase().includes(term) &&
                !data.units.toLowerCase().includes(term) &&
                !data.institution.toLowerCase().includes(term) &&
                !data.date_of_graduation.toLowerCase().includes(term)
            ) {
                matches = false;
            }
        });

        return matches;
    });
}

$('#faculty-graduate-studies-modal').click(function () {
    $('#AddFacultyGraduateStudiesModal').modal('show');
});
//store-faculty-graduate-studies

$('#submit-faculty-graduate-studies-btn').on('click', function () {
    let form = $('#faculty-graduate-studies-form');

    if (form[0].checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
        form.addClass('was-validated');
        return;
    }

    $.ajax({
        url: "/storeFacultyGraduateStudies",
        method: "POST",
        data: form.serialize(),
        success: function (response) {
            console.log("Success:", response);
            toastr.success(response.message);
            $('#AddFacultyGraduateStudiesModal').modal('hide');
            form[0].reset();
            facultyGraduateStudies.setData("/fetchFacultyGraduateStudies");
        },
        error: function (xhr) {
            console.log("Error:", xhr);
            if (xhr.status === 422) {
                toastr.error("Please fill in all required fields correctly.");
            } else {
                toastr.error("An error occurred while submitting.");
            }
        }
    });
});

function fetchfacultyGraduateStudies(){
    $.ajax({
        url: '/fetch-faculty-graduate-studies',
        type: 'GET',

        success: function(response) {
            // console.log(response);
            facultyGraduateStudies.setData(response);
            
        },
        error: function (xhr, status) {
            console.log("Error:", xhr.responseText);
        }
    });
}

$(document).on('click','#edit-faculty-graduate-studies-btn', function(event){
    $('#EditFacultyGraduateStudiesModal').modal('show');
    var id = $(this).attr('data-id');
    $('#EditFacultyGraduateStudiesModal').attr('data-id', id);
    $.ajax({
        url: '/view-faculty-graduate-studies/' + id,
        type: 'GET',
        success: function(response) {
            $('#view_fgs_faculty_name').val(response.faculty_name);
            $('#view_fgs_degree').val(response.degree);
            $('#view_fgs_units').val(response.units);
            $('#view_fgs_institution').val(response.institution);
            $('#view_fgs_date_of_graduation').val(response.date_of_graduation);
            
        },
    });
});

$('#update-faculty-graduate-studies-btn').on('click', function(event) {
    var id = $('#EditFacultyGraduateStudiesModal').attr('data-id');
    var form = $('#view-faculty-graduate-studies-form')[0];
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    }
    form.classList.add('was-validated');
    
    $.ajax({
        url: '/update-faculty-graduate-studies/' + id,
        type: 'POST',
        data: $('#view-faculty-graduate-studies-form').serialize(),
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
            $('#EditFacultyGraduateStudiesModal').modal('hide');
            fetchfacultyGraduateStudies();
        },
        error: function (xhr, status) {
            throwError(xhr, status);
        }
    });
});

$(document).on('click', '#remove-faculty-graduate-studies-btn', function(){
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
                url: "/remove-faculty-graduate-studies/"+id,
                type: 'POST',
                success: function (response) {
                    console.log('Success:', response);
                    Swal.fire({
                        title: "Success!",
                        text: response.message,
                        icon: "success"
                    });
                    fetchfacultyGraduateStudies();
                },
                error: function (xhr, status) {
                    console.log('Error:', xhr);
                }
            });
        }
    });
});

//List of local seminars and trainings attended by faculty members

let facultySeminarTrainingTable = () => {
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
        { title:'CONFERENCE CATEGORY',
            titleFormatter: () =>
            `<div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                    CONFERENCE CATEGORY
                </strong>
            </div>`,
            field: "seminar_category",
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle"
        },
        { title:'TITLE OF CONFERENCE',
            titleFormatter: () =>
            `<div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                    TITLE OF CONFERENCE
                </strong>
            </div>`,
            field: "conference_title",
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle"
        },
        { title:'PARTICIPANTS',
            titleFormatter: () =>
            `<div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                    PARTICIPANTS
                </strong>
            </div>`,
            field: "participants",
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle",
            formatter: function(cell) {
                let val = cell.getValue();
                if (!val) return '';
                return val.split(',')[0]; // Show only the first participant
            }
        },
        { title:'SPONSORING AGANCY',
            titleFormatter: () =>
            `<div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                    SPONSORING AGENCY
                </strong>
            </div>`,
            field: "sponsoring_agency",
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle"
        },
        { title:'VENUE',
            titleFormatter: () =>
            `<div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                    VENUE
                </strong>
            </div>`,
            field: "venue",
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle"
        },
        { title:'DATE',
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

    seminarTrainings = new Tabulator("#seminar-training-table", {
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
        rowFormatter: function (row) {
            const element = row.getElement();
            const index = row.getPosition(true);
            element.style.color = "#000000";
            element.style.backgroundColor = index % 2 === 0 ? "#FFF1D1" : "#ffffff";
        },
        columns: columns
    });
}

document.getElementById("seminar-training-filter-type").addEventListener("change", function() {
    const type = this.value;
    const filterValueSelect = document.getElementById("seminar-training-filter-value");
    const filterYearSelect = document.getElementById("seminar-training-filter-year");

    filterValueSelect.innerHTML = "";
    filterYearSelect.innerHTML = "";

    if (type === "all") {
        seminarTrainings.clearFilter();
        filterValueSelect.style.display = "none";
        filterYearSelect.style.display = "none";
        return;
    }

    filterValueSelect.style.display = (type === "yearly") ? "none" : "inline-block";
    filterYearSelect.style.display = "inline-block";

    const data = seminarTrainings.getData();
    const monthsSet = new Set();
    const quartersSet = new Set();
    const yearsSet = new Set();

    data.forEach(row => {
        const date = new Date(row.date_of_graduation);
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

document.getElementById("seminar-training-filter-value").addEventListener("change", applySeminarFilter);
document.getElementById("seminar-training-filter-year").addEventListener("change", applySeminarFilter);

function applySeminarFilter() {
    const type = document.getElementById("seminar-training-filter-type").value;
    const selectedValue = document.getElementById("seminar-training-filter-value").value;
    const selectedYear = document.getElementById("seminar-training-filter-year").value;

    seminarTrainings.clearFilter();

    seminarTrainings.setFilter(function(data) {
        const date = new Date(data.date_of_graduation);
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

$('#seminar-training-download-csv').click(function() {
    seminarTrainings.download("csv", "Seminars and Trainings.csv", { filter: true });
});

// function searchseminarTrainings(value){
//     seminarTrainings.setFilter([
//         [
//             //{title:'NO', field: 'no'},
//             {field:"name", type:"like", value:value.trim()},
//             {field:"seminar_category", type:"like", value:value.trim()},
//             {field:"conference_title", type:"like", value:value.trim()},
//             {field:"participants", type:"like", value:value.trim()},
//             {field:"venue", type:"like", value:value.trim()},
//             {field:"date", type:"like", value:value.trim()},
//         ]
//     ]);
// }
function searchseminarTrainings(value) {
    let searchTerms = value.trim().toLowerCase().split(/\s+/);

    if (searchTerms.length === 0 || searchTerms[0] === "") {
        seminarTrainings.clearFilter();
        return;
    }

    seminarTrainings.setFilter(function(data) {
        let matches = true;

        searchTerms.forEach(term => {
            if (
                !data.name.toLowerCase().includes(term) &&
                !data.seminar_category.toLowerCase().includes(term) &&
                !data.conference_title.toLowerCase().includes(term) &&
                !data.participants.toLowerCase().includes(term) &&
                !data.venue.toLowerCase().includes(term) &&
                !data.date.toLowerCase().includes(term)
            ) {
                matches = false;
            }
        });

        return matches;
    });
}


$('#seminar-training-modal').click(function(){
    $('#AddSeminarTrainingModal').modal('show');
});

$('#submit-seminar-training-btn').on('click', function(event) {
    var form = $('#seminar-training-form')[0];
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    }
    form.classList.add('was-validated');
    
    $.ajax({
        url: '/store-seminar-training',
        type: 'POST',
        data: $('#seminar-training-form').serialize(),
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
            $('#seminar-training-form')[0].reset();
            $('#AddSeminarTrainingModal').modal('hide');
            fetchseminarTraining();
        },
        error: function (xhr, status) {
            throwError(xhr, status);
        }
    });
});

function fetchseminarTraining(){
    $.ajax({
        url: '/fetch-seminar-training',
        type: 'GET',

        success: function(response) {
            // console.log(response);
            seminarTrainings.setData(response);
            
        },
        error: function (xhr, status) {
            console.log("Error:", xhr.responseText);
        }
    });
}

$(document).on('click','#edit-seminar-training-btn', function(event){
    $('#EditSeminarTrainingModal').modal('show');
    var id = $(this).attr('data-id');
    $('#EditSeminarTrainingModal').attr('data-id', id);
    $.ajax({
        url: '/view-seminar-training/' + id,
        type: 'GET',
        success: function(response) {
            $('#view_st_seminar_category').val(response.seminar_category);
            $('#view_st_conference_title').val(response.conference_title);
            $('#view_st_participants').val(response.participants);
            $('#view_st_venue').val(response.venue);
            $('#view_st_date').val(response.date); //
            $('#view_st_sponsoring_agency').val(response.sponsoring_agency);
            
        },
    });
});

$('#update-seminar-training-btn').on('click', function(event) {
    var id = $('#EditSeminarTrainingModal').attr('data-id');
    var form = $('#view-seminar-training-form')[0];
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    }
    form.classList.add('was-validated');
    
    $.ajax({
        url: '/update-seminar-training/' + id,
        type: 'POST',
        data: $('#view-seminar-training-form').serialize(),
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
            $('#EditSeminarTrainingModal').modal('hide');
            fetchseminarTraining();
        },
        error: function (xhr, status) {
            throwError(xhr, status);
        }
    });
});

$(document).on('click', '#remove-seminar-training-btn', function(){
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
                url: "/remove-seminar-training/"+id,
                type: 'POST',
                success: function (response) {
                    console.log('Success:', response);
                    Swal.fire({
                        title: "Success!",
                        text: response.message,
                        icon: "success"
                    });
                    fetchseminarTraining();
                },
                error: function (xhr, status) {
                    console.log('Error:', xhr);
                }
            });
        }
    });
});


//List of recognition and award received by the faculty members

let recognitionTable = () => {
    const defaultDateFilter = {
        column: 'date_received',
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
        { title:'TYPE',
            titleFormatter: () =>
            `<div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                    TYPE
                </strong>
            </div>`,
            field: "award_type", 
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle"
        },
        { title:'NAME OF AWARDEE',
            titleFormatter: () =>
            `<div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                    NAME OF AWARDEE
                </strong>
            </div>`,
            field: "awardee_name", 
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle"
        },
        { title:'AWARD',
            titleFormatter: () =>
            `<div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                    AWARD
                </strong>
            </div>`,
            field: "award", 
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle"
        },
        { title:'INSTITUTION',
            titleFormatter: () =>
            `<div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                    INSTITUTION
                </strong>
            </div>`,
            field: "agency", 
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle"
        },
        { title:'EVENT',
            titleFormatter: () =>
            `<div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                    EVENT
                </strong>
            </div>`,
            field: "event",
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle"
        },
        { title:'DATE RECEIVED',
            titleFormatter: () =>
            `<div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                    DATE RECEIVED
                </strong>
            </div>`,
            field: "date_received", 
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

    recognitions = new Tabulator("#recognition-table", {
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
        rowFormatter: function (row) {
            const element = row.getElement();
            const index = row.getPosition(true);
            element.style.color = "#000000";
            element.style.backgroundColor = index % 2 === 0 ? "#FFF1D1" : "#ffffff";
        },
        columns: columns
    });
}

document.getElementById("recognitions-filter-type").addEventListener("change", function() {
    const type = this.value;
    const filterValueSelect = document.getElementById("recognitions-filter-value");
    const filterYearSelect = document.getElementById("recognitions-filter-year");

    filterValueSelect.innerHTML = "";
    filterYearSelect.innerHTML = "";

    if (type === "all") {
        recognitions.clearFilter();
        filterValueSelect.style.display = "none";
        filterYearSelect.style.display = "none";
        return;
    }

    filterValueSelect.style.display = (type === "yearly") ? "none" : "inline-block";
    filterYearSelect.style.display = "inline-block";

    const data = recognitions.getData();
    const monthsSet = new Set();
    const quartersSet = new Set();
    const yearsSet = new Set();

    data.forEach(row => {
        const date = new Date(row.date_received);
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

document.getElementById("recognitions-filter-value").addEventListener("change", applyrecognitionsFilter);
document.getElementById("recognitions-filter-year").addEventListener("change", applyrecognitionsFilter);

function applyrecognitionsFilter() {
    const type = document.getElementById("recognitions-filter-type").value;
    const selectedValue = document.getElementById("recognitions-filter-value").value;
    const selectedYear = document.getElementById("recognitions-filter-year").value;

    recognitions.clearFilter();

    recognitions.setFilter(function(data) {
        const date = new Date(data.date_received);
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

$('#recognitions-download-csv').click(function() {
    recognitions.download("csv", "Awards and Recognition.csv", { filter: true });
});

// function searchrecognitions(value){
//     recognitions.setFilter([
//         [
//             //{title:'NO', field: 'no'},
//             {field:"name", type:"like", value:value.trim()},
//             {field:"award_type", type:"like", value:value.trim()},
//             {field:"award", type:"like", value:value.trim()},
//             {field:"agency", type:"like", value:value.trim()},
//             {field:"date_received", type:"like", value:value.trim()},
//             {field:"event", type:"like", value:value.trim()},
//         ]
//     ]);
// }
function searchrecognitions(value) {
    let searchTerms = value.trim().toLowerCase().split(/\s+/);

    if (searchTerms.length === 0 || searchTerms[0] === "") {
        recognitions.clearFilter();
        return;
    }

    recognitions.setFilter(function(data) {
        let matches = true;

        searchTerms.forEach(term => {
            if (
                !data.name.toLowerCase().includes(term) &&
                !data.award_type.toLowerCase().includes(term) &&
                !data.award.toLowerCase().includes(term) &&
                !data.agency.toLowerCase().includes(term) &&
                !data.date_received.toLowerCase().includes(term) &&
                !data.event.toLowerCase().includes(term)
            ) {
                matches = false;
            }
        });

        return matches;
    });
}


$('#recognition-modal').click(function(){
    $('#AddRecognitionModal').modal('show');
});

$('#submit-recognition-btn').on('click', function(event) {
    var form = $('#recognition-form')[0];
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    }
    form.classList.add('was-validated');
    
    $.ajax({
        url: '/store-recognition',
        type: 'POST',
        data: $('#recognition-form').serialize(),
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
            $('#recognition-form')[0].reset();
            $('#AddRecognitionModal').modal('hide');
            fetchrecognition();
        },
        error: function (xhr, status) {
            throwError(xhr, status);
        }
    });
});

function fetchrecognition(){
    $.ajax({
        url: '/fetch-recognition',
        type: 'GET',

        success: function(response) {
            // console.log(response);
            recognitions.setData(response);
            
        },
        error: function (xhr, status) {
            console.log("Error:", xhr.responseText);
        }
    });
}

$(document).on('click','#edit-recognition-btn', function(event){
    $('#EditRecognitionModal').modal('show');
    var id = $(this).attr('data-id');
    $('#EditRecognitionModal').attr('data-id', id);
    $.ajax({
        url: '/view-recognition/' + id,
        type: 'GET',
        success: function(response) {
            $('#view_ra_award_type').val(response.award_type);
            $('#view_ra_awardee_name').val(response.awardee_name);
            $('#view_ra_award').val(response.award);
            $('#view_ra_agency').val(response.agency);
            $('#view_ra_date_received').val(response.date_received);
            $('#view_ra_event').val(response.event);
            
        },
    });
});

$('#update-recognition-btn').on('click', function(event) {
    var id = $('#EditRecognitionModal').attr('data-id');
    var form = $('#view-recognition-form')[0];
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    }
    form.classList.add('was-validated');
    
    $.ajax({
        url: '/update-recognition/' + id,
        type: 'POST',
        data: $('#view-recognition-form').serialize(),
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
            $('#recognition-form')[0].reset();
            $('#EditRecognitionModal').modal('hide');
            fetchrecognition();
        },
        error: function (xhr, status) {
            throwError(xhr, status);
        }
    });
});

$(document).on('click', '#remove-recognition-btn', function(){
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
                url: "/remove-recognition/"+id,
                type: 'POST',
                success: function (response) {
                    console.log('Success:', response);
                    Swal.fire({
                        title: "Success!",
                        text: response.message,
                        icon: "success"
                    });
                    fetchrecognition();
                },
                error: function (xhr, status) {
                    console.log('Error:', xhr);
                }
            });
        }
    });
});

//Paper presentation

let presentationTable = () => {
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
        { title:'TYPE',
            titleFormatter: () =>
            `<div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                    TYPE
                </strong>
            </div>`,
            field: "presentation_type", 
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle"
        },
        { title:'TITLE OF CONFERENCE',
            titleFormatter: () =>
            `<div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                    TITLE OF CONFERENCE
                </strong>
            </div>`,
            field: "conference_name",
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle"
        },
        { title:'TITLE OF PAPER',
            titleFormatter: () =>
            `<div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                    TITLE OF PAPER
                </strong>
            </div>`,
            field: "paper_name", 
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle"
        },
        { title:'PRESENTER',
            titleFormatter: () =>
            `<div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                    PRESENTER
                </strong>
            </div>`,
            field: "presenter_name", 
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle",
            formatter: function(cell) {
                let val = cell.getValue();
                if (!val) return '';
                return val.split(',')[0]; // Show only the first presenter
            }
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
        {
            title:'CO-AUTHORS',
            titleFormatter: () =>
                `<div style="line-height: 2.5;">
                    <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                        CO-AUTHORS
                    </strong>
                </div>`,
            field: "co_authors",
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

    presentations = new Tabulator("#presentation-table", {
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
        rowFormatter: function (row) {
            const element = row.getElement();
            const index = row.getPosition(true);
            element.style.color = "#000000";
            element.style.backgroundColor = index % 2 === 0 ? "#FFF1D1" : "#ffffff";
        },
        columns: columns
    });
}

document.getElementById("presentations-filter-type").addEventListener("change", function() {
    const type = this.value;
    const filterValueSelect = document.getElementById("presentations-filter-value");
    const filterYearSelect = document.getElementById("presentations-filter-year");

    filterValueSelect.innerHTML = "";
    filterYearSelect.innerHTML = "";

    if (type === "all") {
        presentations.clearFilter();
        filterValueSelect.style.display = "none";
        filterYearSelect.style.display = "none";
        return;
    }

    filterValueSelect.style.display = (type === "yearly") ? "none" : "inline-block";
    filterYearSelect.style.display = "inline-block";

    const data = presentations.getData();
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

document.getElementById("presentations-filter-value").addEventListener("change", applyScholarFilter);
document.getElementById("presentations-filter-year").addEventListener("change", applyScholarFilter);

function applyScholarFilter() {
    const type = document.getElementById("presentations-filter-type").value;
    const selectedValue = document.getElementById("presentations-filter-value").value;
    const selectedYear = document.getElementById("presentations-filter-year").value;

    presentations.clearFilter();

    presentations.setFilter(function(data) {
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

$('#presentations-download-csv').click(function() {
    presentations.download("csv", "Faculty Scholar.csv", { filter: true });
});

// function searchpresentations(value){
//     presentations.setFilter([
//         [
//             //{title:'NO', field: 'no'},
//             {field:"name", type:"like", value:value.trim()},
//             {field:"presentation_type", type:"like", value:value.trim()},
//             {field:"paper_name", type:"like", value:value.trim()},
//             {field:"conference_name", type:"like", value:value.trim()},
//             {field:"date_venue", type:"like", value:value.trim()},
//         ]
//     ]);
// }
function searchpresentations(value) {
    let searchTerms = value.trim().toLowerCase().split(/\s+/);

    if (searchTerms.length === 0 || searchTerms[0] === "") {
        presentations.clearFilter();
        return;
    }

    presentations.setFilter(function(data) {
        let matches = true;

        searchTerms.forEach(term => {
            if (
                !data.name.toLowerCase().includes(term) &&
                !data.presentation_type.toLowerCase().includes(term) &&
                !data.conference_name.toLowerCase().includes(term) &&
                !data.paper_name.toLowerCase().includes(term) &&
                !data.presenter_name.toLowerCase().includes(term) &&
                !data.date_venue.toLowerCase().includes(term)
            ) {
                matches = false;
            }
        });

        return matches;
    });
}


$('#presentation-modal').click(function(){
    $('#AddPresentation').modal('show');
});

$('#submit-presentation-btn').on('click', function(event) {
    var form = $('#presentation-form')[0];
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    }
    form.classList.add('was-validated');
    
    $.ajax({
        url: '/store-presentation',
        type: 'POST',
        data: $('#presentation-form').serialize(),
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
            $('#presentation-form')[0].reset();
            $('#AddPresentation').modal('hide');
            fetchpresentation();
        },
        error: function (xhr, status) {
            throwError(xhr, status);
        }
    });
});

function fetchpresentation(){
    $.ajax({
        url: '/fetch-presentation',
        type: 'GET',
        success: function(response) {
            // console.log(response);
            presentations.setData(response);
            
        },
        error: function (xhr, status) {
            console.log("Error:", xhr.responseText);
        }
    });
}

$(document).on('click','#edit-presentation-btn', function(event){
    $('#EditPresentation').modal('show');
    var id = $(this).attr('data-id');
    $('#EditPresentation').attr('data-id', id);
    $.ajax({
        url: '/view-presentation/' + id,
        type: 'GET',
        success: function(response) {
            $('#view_pp_presentation_type').val(response.presentation_type);
            $('#view_pp_conference_name').val(response.conference_name);
            $('#view_pp_paper_name').val(response.paper_name);
            $('#view_pp_presenter_name').val(response.presenter_name);
            $('#view_pp_date').val(response.date);
            $('#view_pp_venue').val(response.venue);
            
        },
    });
});

$('#update-presentation-btn').on('click', function(event) {
    var id = $('#EditPresentation').attr('data-id');
    var form = $('#view-presentation-form')[0];
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    }
    form.classList.add('was-validated');
    
    $.ajax({
        url: '/update-presentation/' + id,
        type: 'POST',
        data: $('#view-presentation-form').serialize(),
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
            $('#EditPresentation').modal('hide');
            fetchpresentation();
        },
        error: function (xhr, status) {
            throwError(xhr, status);
        }
    });
});

$(document).on('click', '#remove-presentation-btn', function(){
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
                url: "/remove-presentation/"+id,
                type: 'POST',
                success: function (response) {
                    console.log('Success:', response);
                    Swal.fire({
                        title: "Success!",
                        text: response.message,
                        icon: "success"
                    });
                    fetchpresentation();
                },
                error: function (xhr, status) {
                    console.log('Error:', xhr);
                }
            });
        }
    });
});

$('#default_school_year').change(function(){
    var yearValue = $('#default_school_year').val();
    educationalAttainments.setFilter([
        [
            {field:"school_year", type:"like", value:yearValue.trim()},
        ]
    ]);
    
    // Set the value for the CSV download
    document.getElementById('educationalAttainmentCsvYearInput').value = yearValue;
});

$('#default_school_year').change(function(){
    var yearValue = $('#default_school_year').val();
    educationalAttainments.setFilter([
        [
            {field:"school_year", type:"like", value:yearValue.trim()},
        ]
    ]);
    
    // Set the value for the CSV download
    document.getElementById('educationalAttainmentCsvYearInput').value = yearValue;
});

$('#default_semester').change(function() {
    var semesterValue = $(this).val();
    document.getElementById('educationalAttainmentCsvSemesterInput').value = semesterValue;
});

$('#default_school_year').change(function() {
    var yearValue = $(this).val();
    document.getElementById('educationalAttainmentCsvYearInput').value = yearValue;
});

$('#nature_default_semester').change(function() {
    var semesterValue = $(this).val();
    document.getElementById('natureAppointmentCsvSemesterInput').value = semesterValue;
});

$('#default_school_year').change(function() {
    var yearValue = $(this).val();
    document.getElementById('natureAppointmentCsvYearInput').value = yearValue;
});

$('#academic_rank_semester').change(function() {
    var semesterValue = $(this).val();
    document.getElementById('academicRankCsvSemesterInput').value = semesterValue;
});

// Set the school year value for the academic rank CSV download
$('#default_school_year').change(function() {
    var yearValue = $(this).val();
    document.getElementById('academicRankCsvYearInput').value = yearValue;
});

$('#academic_rank_semester').change(function() {
    var semesterValue = $(this).val();
    document.getElementById('facultyScholarCsvSemesterInput').value = semesterValue;
});

$('#default_school_year').change(function() {
    var yearValue = $(this).val();
    document.getElementById('facultyScholarCsvYearInput').value = yearValue;
});

$('#facultyGraduateStudiesCsvSemesterInput').change(function() {
    var semesterValue = $(this).val();
    document.getElementById('facultyGraduateStudiesCsvSemesterInput').value = semesterValue;
});

$('#default_school_year').change(function() {
    var yearValue = $(this).val();
    document.getElementById('facultyGraduateStudiesCsvYearInput').value = yearValue;
});

$('#seminarTrainingCsvSemesterInput').change(function() {
    var semesterValue = $(this).val();
    document.getElementById('seminarTrainingCsvSemesterInput').value = semesterValue;
});

$('#default_school_year').change(function() {
    var yearValue = $(this).val();
    document.getElementById('seminarTrainingCsvYearInput').value = yearValue;
});

$('#recognitionCsvSemesterInput').change(function() {
    var semesterValue = $(this).val();
    document.getElementById('recognitionCsvSemesterInput').value = semesterValue;
});

$('#default_school_year').change(function() {
    var yearValue = $(this).val();
    document.getElementById('recognitionCsvYearInput').value = yearValue;
});

$('#presentationCsvSemesterInput').change(function() {
    var semesterValue = $(this).val();
    document.getElementById('presentationCsvSemesterInput').value = semesterValue;
});

$('#default_school_year').change(function() {
    var yearValue = $(this).val();
    document.getElementById('presentationCsvYearInput').value = yearValue;
});

let participantsArr = [];

$('#add-participant-btn').on('click', function() {
    const participantName = $('#participant-input').val(); // Get value from the input field
    if (participantName && !participantsArr.includes(participantName)) {
        participantsArr.push(participantName);
        updateParticipantsList();
        $('#participant-input').val(''); // Clear the input field after adding
    }
});

function updateParticipantsList() {
    const participantsList = $('#participants-list');
    participantsList.empty(); // Clear the list

    participantsArr.forEach(participant => {
        const listItem = $('<li class="list-group-item d-flex justify-content-between align-items-center">' +
            participant +
            '<button type="button" class="btn btn-outline-danger btn-sm remove-participant-btn" data-name="' + participant + '">Remove</button>' +
            '</li>');
        participantsList.append(listItem);
    });

    $('#participants-hidden').val(participantsArr.join(',')); // Update hidden input
}

$(document).on('click', '.remove-participant-btn', function() {
    const name = $(this).data('name');
    participantsArr = participantsArr.filter(n => n !== name);
    updateParticipantsList();
});

let presentersArr = [];
let coauthorsArr = [];

// Presenters
$('#add-presenter-btn').on('click', function() {
    const presenterName = $('#presenter-input').val();
    if (presenterName && !presentersArr.includes(presenterName)) {
        presentersArr.push(presenterName);
        updatePresentersList();
        $('#presenter-input').val('');
    }
});

function updatePresentersList() {
    const presentersList = $('#presenters-list');
    presentersList.empty();

    presentersArr.forEach(presenter => {
        const listItem = $('<li class="list-group-item d-flex justify-content-between align-items-center">' +
            presenter +
            '<button type="button" class="btn btn-outline-danger btn-sm remove-presenter-btn" data-name="' + presenter + '">Remove</button>' +
            '</li>');
        presentersList.append(listItem);
    });

    $('#presenters-hidden').val(presentersArr.join(','));
}

$(document).on('click', '.remove-presenter-btn', function() {
    const name = $(this).data('name');
    presentersArr = presentersArr.filter(n => n !== name);
    updatePresentersList();
});

// Co-Authors
$('#add-coauthor-btn').on('click', function() {
    const coauthorName = $('#coauthor-input').val();
    if (coauthorName && !coauthorsArr.includes(coauthorName)) {
        coauthorsArr.push(coauthorName);
        updateCoauthorsList();
        $('#coauthor-input').val('');
    }
});

function updateCoauthorsList() {
    const coauthorsList = $('#coauthors-list');
    coauthorsList.empty();

    coauthorsArr.forEach(coauthor => {
        const listItem = $('<li class="list-group-item d-flex justify-content-between align-items-center">' +
            coauthor +
            '<button type="button" class="btn btn-outline-danger btn-sm remove-coauthor-btn" data-name="' + coauthor + '">Remove</button>' +
            '</li>');
        coauthorsList.append(listItem);
    });

    $('#coauthors-hidden').val(coauthorsArr.join(','));
}

$(document).on('click', '.remove-coauthor-btn', function() {
    const name = $(this).data('name');
    coauthorsArr = coauthorsArr.filter(n => n !== name);
    updateCoauthorsList();
});

