
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
});

$('#nature_default_semester, #default_school_year').on('change', function() {
    applyFilters();
});

function applyFilters() {
    const semesterValue = $('#nature_default_semester').val();
    const yearValue = $('#default_school_year').val();

    // Apply filters to educational attainment table
    educationalAttainments.setFilter([
        { field: "semester", type: "like", value: semesterValue ? semesterValue.trim() : "" },
        { field: "school_year", type: "like", value: yearValue ? yearValue.trim() : "" }
    ]);

    natureAppointments.setFilter([
        { field: "semester", type: "like", value: semesterValue ? semesterValue.trim() : "" },
        { field: "school_year", type: "like", value: yearValue ? yearValue.trim() : "" }
    ]);

    academicRanks.setFilter([
        { field: "semester", type: "like", value: semesterValue ? semesterValue.trim() : "" },
        { field: "school_year", type: "like", value: yearValue ? yearValue.trim() : "" }
    ]);

    // You can apply similar filters to other tables if needed
    // For example:
    // natureAppointments.setFilter([...]);
    // academicRanks.setFilter([...]);
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
    let columns = [
        { title: "ADDED BY", field: "name", hozAlign: "left", vertAlign: "middle" },
        { title: "EDUCATION ATTAINMENT", field: "education", hozAlign: "left", vertAlign: "middle" },
        { title: "SEMESTER", field: "semester", hozAlign: "left", vertAlign: "middle" },
        { title: "ACADEMIC YEAR", field: "school_year", hozAlign: "left", vertAlign: "middle" },
        { title: "NO. OF FACULTY", field: "number_of_faculty", hozAlign: "left", vertAlign: "middle" },
    ];

    if (window.userPosition != 5) {
        columns.push({
            title: "ACTION",
            field: "action",
            hozAlign: "left",
            formatter: "html",
            vertAlign: "middle"
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
        rowFormatter: function (dom) {
            var selectedRow = dom.getData();
            dom.getElement().classList.add("table-light");
        },
        columns: columns
    });
}


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
    let columns = [
        { title: "ADDED BY", field: "name", hozAlign: "left", vertAlign: "middle" },
        { title: "NATURE OF APPOINTMENT", field: "apointment_nature", hozAlign: "left", vertAlign: "middle" },
        { title: "SEMESTER", field: "semester", hozAlign: "left", vertAlign: "middle" },
        { title: "ACADEMIC YEAR", field: "school_year", hozAlign: "left", vertAlign: "middle" },
        { title: "NO. OF FACULTY", field: "number_of_faculty", hozAlign: "left", vertAlign: "middle" },
    ];

    if (window.userPosition != 5) {
        columns.push({
            title: "ACTION",
            field: "action",
            hozAlign: "left",
            formatter: "html",
            vertAlign: "middle"
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
        rowFormatter: function (dom) {
            var selectedRow = dom.getData();
            dom.getElement().classList.add("table-light");
        },
        columns: columns
    });
}


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
    let columns = [
        { title: "ADDED BY", field: "name", hozAlign: "left", vertAlign: "middle" },
        { title: "ACADEMIC RANK", field: "academic_rank", hozAlign: "left", vertAlign: "middle" },
        { title: "SEMESTER", field: "semester", hozAlign: "left", vertAlign: "middle" },
        { title: "ACADEMIC YEAR", field: "school_year", hozAlign: "left", vertAlign: "middle" },
        { title: "NO. OF FACULTY", field: "number_of_faculty", hozAlign: "left", vertAlign: "middle" },
    ];

    if (window.userPosition != 5) {
        columns.push({
            title: "ACTION",
            field: "action",
            hozAlign: "left",
            formatter: "html",
            vertAlign: "middle"
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
        rowFormatter: function (dom) {
            var selectedRow = dom.getData();
            dom.getElement().classList.add("table-light");
        },
        columns: columns
    });
}


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
    let columns = [
        { title: "ADDED BY", field: "name", hozAlign: "left", vertAlign: "middle" },
        { title: "FACULTY NAME", field: "faculty_name", hozAlign: "left", vertAlign: "middle" },
        { title: "SCHOLARSHIP", field: "scholarship", hozAlign: "left", vertAlign: "middle" },
        { title: "INSTITUTION", field: "institution", hozAlign: "left", vertAlign: "middle" },
        { title: "PROGRAM", field: "program", hozAlign: "left", vertAlign: "middle" },
    ];

    if (window.userPosition != 5) {
        columns.push({
            title: "ACTION",
            field: "action",
            hozAlign: "left",
            formatter: "html",
            vertAlign: "middle"
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
        rowFormatter: function (dom) {
            var selectedRow = dom.getData();
            dom.getElement().classList.add("table-light");
        },
        columns: columns
    });
}


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
    let columns = [
        { title: "ADDED BY", field: "name", hozAlign: "left", vertAlign: "middle" },
        { title: "FACULTY NAME", field: "faculty_name", hozAlign: "left", vertAlign: "middle" },
        { title: "DEGREE", field: "degree", hozAlign: "left", vertAlign: "middle" },
        { title: "INSTITUTION", field: "institution", hozAlign: "left", vertAlign: "middle" },
        { title: "DATE OF GRADUATION", field: "date_of_graduation", hozAlign: "left", vertAlign: "middle" },
    ];

    if (window.userPosition != 5) {
        columns.push({
            title: "ACTION",
            field: "action",
            hozAlign: "left",
            formatter: "html",
            vertAlign: "middle"
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
        rowFormatter: function (dom) {
            var selectedRow = dom.getData();
            dom.getElement().classList.add("table-light");
        },
        columns: columns
    });
}


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

$('#submit-faculty-graduate-studies-btn').on('click', function(event) {
    var form = $('#faculty-graduate-studies-form')[0];
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    }
    form.classList.add('was-validated');
    
    $.ajax({
        url: '/store-faculty-graduate-studies',
        type: 'POST',
        data: $('#faculty-graduate-studies-form').serialize(),
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
            $('#faculty-graduate-studies-form')[0].reset();
            $('#AddFacultyGraduateStudiesModal').modal('hide');
           
        },
        error: function (xhr, status) {
            throwError(xhr, status);
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
    let columns = [
        { title: "ADDED BY", field: "name", hozAlign: "left", vertAlign: "middle" },
        { title: "CONFERENCE CATEGORY", field: "seminar_category", hozAlign: "left", vertAlign: "middle" },
        { title: "TITLE OF CONFERENCE", field: "conference_title", hozAlign: "left", vertAlign: "middle" },
        { title: "PARTICIPANTS", field: "participants", hozAlign: "left", vertAlign: "middle" },
        { title: "SPONSORING AGENCY", field: "sponsoring_agency", hozAlign: "left", vertAlign: "middle" },
        { title: "VENUE", field: "venue", hozAlign: "left", vertAlign: "middle" },
        { title: "DATE", field: "date", hozAlign: "left", vertAlign: "middle" },
    ];

    if (window.userPosition != 5) {
        columns.push({
            title: "ACTION",
            field: "action",
            hozAlign: "left",
            formatter: "html",
            vertAlign: "middle"
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
        rowFormatter: function (dom) {
            var selectedRow = dom.getData();
            dom.getElement().classList.add("table-light");
        },
        columns: columns
    });
}


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
    let columns = [
        { title: "ADDED BY", field: "name", hozAlign: "left", vertAlign: "middle" },
        { title: "TYPE", field: "award_type", hozAlign: "left", vertAlign: "middle" },
        { title: "NAME OF AWARDEE", field: "awardee_name", hozAlign: "left", vertAlign: "middle" },
        { title: "AWARD", field: "award", hozAlign: "left", vertAlign: "middle" },
        { title: "INSTITUTION", field: "agency", hozAlign: "left", vertAlign: "middle" },
        { title: "EVENT", field: "event", hozAlign: "left", vertAlign: "middle" },
        { title: "DATE RECEIVED", field: "date_received", hozAlign: "left", vertAlign: "middle" },
    ];

    if (window.userPosition != 5) {
        columns.push({
            title: "ACTION",
            field: "action",
            hozAlign: "left",
            formatter: "html",
            vertAlign: "middle"
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
        rowFormatter: function (dom) {
            var selectedRow = dom.getData();
            dom.getElement().classList.add("table-light");
        },
        columns: columns
    });
}


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

//List of recognition and award received by the faculty members

let presentationTable = () => {
    let columns = [
        { title: "ADDED BY", field: "name", hozAlign: "left", vertAlign: "middle" },
        { title: "TYPE", field: "presentation_type", hozAlign: "left", vertAlign: "middle" },
        { title: "TITLE OF CONFERENCE", field: "conference_name", hozAlign: "left", vertAlign: "middle" },
        { title: "TITLE OF PAPER", field: "paper_name", hozAlign: "left", vertAlign: "middle" },
        { title: "PRESENTER", field: "presenter_name", hozAlign: "left", vertAlign: "middle" },
        { title: "DATE AND VENUE", field: "date_venue", hozAlign: "left", vertAlign: "middle" },
    ];

    if (window.userPosition != 5) {
        columns.push({
            title: "ACTION",
            field: "action",
            hozAlign: "left",
            formatter: "html",
            vertAlign: "middle"
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
        rowFormatter: function (dom) {
            var selectedRow = dom.getData();
            dom.getElement().classList.add("table-light");
        },
        columns: columns
    });
}


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