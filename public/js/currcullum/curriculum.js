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

//CSV !!!!!
//CURRICULUM
//Accreditation 
document.addEventListener('DOMContentLoaded', () => {
    fetch('/get-accreditation-years')
        .then(response => response.json())
        .then(years => {
            const yearDropdown = document.getElementById('accreditation-status-years');
            years.forEach(year => {
                const option = document.createElement('option');
                option.value = year;
                option.textContent = year;
                yearDropdown.appendChild(option);
            });
        });
});
document.getElementById('accreditation-status-years').addEventListener('change', function () {
    const selectedYear = this.value;

    document.getElementById('csvYearInput').value = selectedYear;

});

document.getElementById('accreditation-status-years').addEventListener('change', function () {
    const selectedYear = this.value;

    document.getElementById('csvYearInput').value = selectedYear;

    if (selectedYear === "") {
        accreditationStatus.clearFilter(); 
    } else {
        accreditationStatus.setFilter("date", "like", selectedYear); 
    }
});

document.addEventListener('DOMContentLoaded', () => {
    accreditationStatusTable();
});


//Recognition
document.addEventListener('DOMContentLoaded', () => {
    fetch('/get-gov-recognition-years')
        .then(response => response.json())
        .then(years => {
            const yearDropdown = document.getElementById('gov-recognition-years');
            years.forEach(year => {
                const option = document.createElement('option');
                option.value = year;
                option.textContent = year;
                yearDropdown.appendChild(option);
            });
        });
    govRecognitionTable();
});

document.getElementById('gov-recognition-years').addEventListener('change', function () {
    const selectedYear = this.value;

    document.getElementById('govRecognitionCsvYearInput').value = selectedYear;

    if (selectedYear === "") {
        govRecognitions.clearFilter();
    } else {
        govRecognitions.setFilter("date", "like", selectedYear); // Filter by year
    }
});


//Licensure Exam
document.addEventListener('DOMContentLoaded', () => {
    fetch('/get-licensure-exam-years')
        .then(response => response.json())
        .then(years => {
            const yearDropdown = document.getElementById('licensure-exam-years');
            years.forEach(year => {
                const option = document.createElement('option');
                option.value = year;
                option.textContent = year;
                yearDropdown.appendChild(option);
            });
        });

    licensureExamTable();
});

document.getElementById('licensure-exam-years').addEventListener('change', function () {
    const selectedYear = this.value;
    document.getElementById('licensureExamCsvYearInput').value = selectedYear;

    if (selectedYear === "") {
        licensureExamTable().clearFilter();
    } else {
        licensureExamTable().setFilter("exam_date", "like", selectedYear); // Filter by year
    }
});


//Faculty TVET
document.addEventListener('DOMContentLoaded', () => {
    fetch('/get-faculty-tvet-years')
        .then(response => response.json())
        .then(years => {
            const yearDropdown = document.getElementById('faculty-tvet-years');
            years.forEach(year => {
                const option = document.createElement('option');
                option.value = year;
                option.textContent = year;
                yearDropdown.appendChild(option);
            });
        });
        facultyTvetTable();
});

document.getElementById('faculty-tvet-years').addEventListener('change', function () {
    const selectedYear = this.value;
    document.getElementById('facultyTvetYearInput').value = selectedYear;

    if (selectedYear === "") {
        facultyTvets.clearFilter(); 
    } else {
        facultyTvets.setFilter("date", "like", selectedYear); // Filter by year
    }
});

//STudent TVET
document.addEventListener('DOMContentLoaded', () => {
    fetch('/get-student-tvet-years')
        .then(response => response.json())
        .then(years => {
            const yearDropdown = document.getElementById('student-tvet-years');
            years.forEach(year => {
                const option = document.createElement('option');
                option.value = year;
                option.textContent = year;
                yearDropdown.appendChild(option);
            });
        });

    studentTvetTable();
    fetchStudentTvetData();
});

document.getElementById('student-tvet-years').addEventListener('change', function () {
    const selectedYear = this.value;
    document.getElementById('studentTvetCsvYearInput').value = selectedYear;

    if (selectedYear === "") {
        studentTvets.clearFilter();
    } else {
        studentTvets.setFilter("student_tvet_date", "like", selectedYear); // Filter by year
    }
});


//----------------------------------------------------------------------------


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
let accreditationStatusTable = () => {
    accreditationStatus = new Tabulator("#accreditation-status-table", {
        dataTree:true,
        dataTreeSelectPropagate:true,
        // layout:"fitDataFill",
        layout:"fitColumns",
        maxHeight: "1000px",
        scrollToColumnPosition: "center",
        pagination:"local",
        placeholder:"No Data Available", 
        paginationSize:10,  
        paginationSizeSelector:[10,50,100],
        selectable:1,
        rowFormatter:function(dom){
            var selectedRow = dom.getData();
            if(true)
            {
                dom.getElement().classList.add("table-light");
            }else if(selectedRow.safety_stock == selectedRow.qty)
            {
                dom.getElement().classList.add("table-warning");
            }
        },
        columns:[
            {title:"NO", field:"no", hozAlign:"center",width:75, vertAlign:"middle"},
            {title:"ADDED BY", field:"name", hozAlign:"left", vertAlign:"middle"},
            {title:"PROGRAM", field:"program", hozAlign:"left", vertAlign:"middle"},
            {title:"STATUS", field:"status", hozAlign:"left", vertAlign:"middle"},
            {title:"VISIT DATE", field:"date", hozAlign:"left", vertAlign:"middle"},
            {title:"ACTION", field:"action", hozAlign:"left", formatter:"html", vertAlign:"middle"},
        ]
    }); 
}
$('#accreditation-status-modal').click(function() {
   $('#AddAccreditationStatus').modal('show');
});

//searchAcademicProgram
function searchAcademicProgram(value){
    accreditationStatus.setFilter([
        [
            {title:'NO', field: 'no'},
            {field:"name", type:"like", value:value.trim()},
            {field:"program", type:"like", value:value.trim()},
            {field:"status", type:"like", value:value.trim()},
        ]
    ]);
}

$('#submit-accreditation-status-btn').on('click', function(event) {
    var form = $('#accreditation-status-form')[0];
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    }
    form.classList.add('was-validated');
    
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
        error: function (xhr, status) {
            throwError(xhr, status);
        }
    });
})

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
let govRecognitionTable = () => {
    govRecognitions = new Tabulator("#gov-recognition-table", {
        dataTree:true,
        dataTreeSelectPropagate:true,
        layout:"fitDataFill",
        // layout:"fitColumns",
        maxHeight: "1000px",
        scrollToColumnPosition: "center",
        pagination:"local",
        placeholder:"No Data Available", 
        paginationSize:10,  
        paginationSizeSelector:[10,50,100],
        selectable:1,
        rowFormatter:function(dom){
            var selectedRow = dom.getData();
            if(true)
            {
                dom.getElement().classList.add("table-light");
            }else if(selectedRow.safety_stock == selectedRow.qty)
            {
                dom.getElement().classList.add("table-warning");
            }
        },
        columns:[
            {title:"NO", field:"no", hozAlign:"center",width:75, vertAlign:"middle"},
            {title:"ADDED BY", field:"name", hozAlign:"left", vertAlign:"middle"},
            {title:"PROGRAM", field:"program", hozAlign:"left", vertAlign:"middle"},
            {title:"STATUS", field:"status", hozAlign:"left", vertAlign:"middle"},
            {title:"COPC NUMBER", field:"copc", hozAlign:"left", vertAlign:"middle"},
            {title:"DATE", field:"date", hozAlign:"left", vertAlign:"middle"},
            {title:"ACTION", field:"action", hozAlign:"left", formatter:"html", vertAlign:"middle"},
        ]
    }); 
}

function searchRecognition(value){
    govRecognitions.setFilter([
        [
            {title:'NO', field: 'no'},
            {field:"name", type:"like", value:value.trim()},
            {field:"program", type:"like", value:value.trim()},
            {field:"status", type:"like", value:value.trim()},
            {field:"copc", type:"like", value:value.trim()},
        ]
    ]);
}
$('#gov-recognition-modal').click(function() {
   $('#AddGovRecognition').modal('show');
});

$('#submit-gov-recognition-btn').on('click', function(event) {
    var form = $('#gov-recognition-form')[0];
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    }
    form.classList.add('was-validated');
    
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
        error: function (xhr, status) {
            throwError(xhr, status);
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
    licensureExams= new Tabulator("#licensure-axam-table", {
        dataTree:true,
        dataTreeSelectPropagate:true,
        layout:"fitDataFill",
        // layout:"fitColumns",
        maxHeight: "1000px",
        scrollToColumnPosition: "center",
        pagination:"local",
        placeholder:"No Data Available", 
        paginationSize:10,  
        paginationSizeSelector:[10,50,100],
        selectable:1,
        rowFormatter:function(dom){
            var selectedRow = dom.getData();
            if(true)
            {
                dom.getElement().classList.add("table-light");
            }else if(selectedRow.safety_stock == selectedRow.qty)
            {
                dom.getElement().classList.add("table-warning");
            }
        },
        columns:[
            {title:"NO", field:"no", hozAlign:"center",width:75, vertAlign:"middle"},
            {title:"ADDED BY", field:"name", hozAlign:"left", vertAlign:"middle"},
            {title:"EXAM TYPE", field:"exam", hozAlign:"left", vertAlign:"middle"},
            {title:"EXAM DATE", field:"exam_date", hozAlign:"left", vertAlign:"middle"},
            {title:"CVSU FIRST TIME TAKER", field:"cvsu_rate", hozAlign:"left", formatter: "html", vertAlign:"middle"},
            {title:"NATIONAL FIRST TIME TAKER", field:"national_rate", hozAlign:"left", formatter: "html", vertAlign:"middle"},
            {title:"CVSU OVERALL TOTAL", field:"cvsu_overall_passing_rate", formatter: "html", hozAlign:"left", vertAlign:"middle"},
            {title:"NATIONAL OVERALL TOTAL", field:"national_overall_passing_rate", formatter: "html", hozAlign:"left", vertAlign:"middle"},
            {title:"ACTION", field:"action", hozAlign:"left", formatter:"html", vertAlign:"middle"},
        ]
    }); 
}

function searchlicensureExam(value){
    licensureExams.setFilter([
        [
            {title:'NO', field: 'no'},
            {field:"name", type:"like", value:value.trim()},
            {field:"exam", type:"like", value:value.trim()},
        ]
    ]);
}

$('#licensure-exam-modal').click(function() {
   $('#AddLicensureExam').modal('show');
});
//updateLicensureExam
$('#submit-licensure-exam-btn').click(function(event) {
    var form = $('#licensure-exam-form')[0];
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    }
    form.classList.add('was-validated');
    
    $.ajax({
        url: '/store-licensure-exam',
        type: 'POST',
        data: $('#licensure-exam-form').serialize(),
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
            $('#licensure-exam-form')[0].reset();
            $('#AddLicensureExam').modal('hide');
            fetchLicensureExamData();
        },
        error: function (xhr, status) {
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
            $('#view_exam_date').val(response.exam_date);
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
    facultyTvets = new Tabulator("#faculty-tvet-table", {
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
        columns: [
            { title: "NO", field: "no", hozAlign: "center", width: 75, vertAlign: "middle" },
            { title: "ADDED BY", field: "name", hozAlign: "left", vertAlign: "middle" },
            { title: "CERTIFICATE TYPE", field: "certificate", hozAlign: "left", vertAlign: "middle" },
            { title: "DATE", field: "date", hozAlign: "left", vertAlign: "middle" },
            { title: "HOLDER", field: "holder", hozAlign: "left", vertAlign: "middle" },
            { title: "ACTION", field: "action", hozAlign: "left", formatter: "html", vertAlign: "middle" },
        ]
    });
}


function searchfacultyTvets(value) {
    facultyTvets.setFilter([
        [
            { title: 'NO', field: 'no' },
            { field: "holder", type: "like", value: value.trim() } // Search by holder name
        ]
    ]);
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
    studentTvets = new Tabulator("#student-tvet-table", {
        dataTree:true,
        dataTreeSelectPropagate:true,
        // layout:"fitDataFill",
        layout:"fitColumns",
        maxHeight: "1000px",
        scrollToColumnPosition: "center",
        pagination:"local",
        placeholder:"No Data Available", 
        paginationSize:10,  
        paginationSizeSelector:[10,50,100],
        selectable:1,
        rowFormatter:function(dom){
            var selectedRow = dom.getData();
            if(true)
            {
                dom.getElement().classList.add("table-light");
            }else if(selectedRow.safety_stock == selectedRow.qty)
            {
                dom.getElement().classList.add("table-warning");
            }
        },
        columns:[
            {title:"NO", field:"no", hozAlign:"center",width:75, vertAlign:"middle"},
            {title:"ADDED BY", field:"name", hozAlign:"left", vertAlign:"middle"},
            {title:"CERTICATE TYPE", field:"certificate", hozAlign:"left", vertAlign:"middle"},
            {title:"NUMBER OF STUDENT", field:"number", hozAlign:"left", vertAlign:"middle"},
            {title:"ACTION", field:"action", hozAlign:"left", formatter:"html", vertAlign:"middle"},
        ]
    }); 
}

function searchstudentTvets(value){
    studentTvets.setFilter([
        [
            {title:'NO', field: 'no'},
            {field:"name", type:"like", value:value.trim()},
            {field:"certificate", type:"like", value:value.trim()},
        ]
    ]);
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