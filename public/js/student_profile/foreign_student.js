$(document).ready(function() {
    foreignStudents();
    fetchForeignStudentData();
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

const foreignStudents = () => {
    let columns = [
        { title: "ADDED BY", field: "name", hozAlign: "left", vertAlign: "middle" },
        { title: "COUNTRY", field: "country", hozAlign: "left", vertAlign: "middle" },
        { title: "PROGRAM", field: "program", hozAlign: "left", vertAlign: "middle" },
        { title: "SEMESTER", field: "semester", hozAlign: "left", vertAlign: "middle" },
        { title: "ACADEMIC YEAR", field: "school_year", hozAlign: "left", vertAlign: "middle" },
        { title: "NO. OF STUDENT", field: "student_count", hozAlign: "left", vertAlign: "middle" },
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

    foreign_students = new Tabulator("#foreign-students-table", {
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

function searchForeignStudent(value){
    foreign_students.setFilter([
        [
            //{title:'NO', field: 'no'},
            {field:"name", type:"like", value:value.trim()},
            {field:"semester", type:"like", value:value.trim()},
            {field:"school_year", type:"like", value:value.trim()},
            {field:"program", type:"like", value:value.trim()},
        ]
    ]);
}

$('#filter-status').change(function(){
    var value = $('#filter-status').val();
    foreign_students.setFilter([
        [
            {field:"semester", type:"like", value:value.trim()},
        ]
    ]);
});

$('#add-foreign-student-modal').click(function(e) {
    $('#AddForeignStudentModal').modal('show');
});

$('#submit-foreign-student-btn').click(function(event) {
    var form = $('#foreign-student-form')[0];
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    }
    form.classList.add('was-validated');
    
    $.ajax({
        url: '/store-foreign-student',
        type: 'POST',
        data: $('#foreign-student-form').serialize(),
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
            $('#foreign-student-form')[0].reset();
            $('#AddForeignStudentModal').modal('hide');
            fetchForeignStudentData();
        },
        error: function (xhr, status) {
            throwError(xhr, status);
        }
    });
});

function fetchForeignStudentData(){
    $.ajax({
        url: '/fetch-foreign-student',
        type: 'GET',
        success: function(response) {
            // console.log(response);
            foreign_students.setData(response);
            
        },
        error: function (xhr, status) {
            console.log("Error:", xhr.responseText);
        }
    });
}

$(document).on('click', '#edit-modal-btn', function(e) {
    var id = $(this).attr('data-id');
    $('#EditForeignStudentModal').modal('show');
    $('#EditForeignStudentModal').attr('data-id', id);
    $.ajax({
        url: '/view-foreign-student/' + id,
        type: 'GET',
        success: function(response) {
            $('#view_number_of_student').val(response.number_of_student);
            $('#view_semester').val(response.semester);
            $('#view_school_year').val(response.school_year);
            $('#view_country').val(response.country);
            $('#view_program_id').val(response.program_id);
          
        },
        error: function (xhr, status) {
            console.log("Error:", xhr.responseText);
        }
    });
});

$('#update-foreign-student-btn').click(function (event) {
    var id = $('#EditForeignStudentModal').attr('data-id');
    var form = $('#view-foreign-student-form')[0];
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    }
    form.classList.add('was-validated');
    
    $.ajax({
        url: '/update-foreign-student/' + id,
        type: 'POST',
        data: $('#view-foreign-student-form').serialize(),
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
            $('#view-foreign-student-form')[0].reset();
            $('#EditForeignStudentModal').modal('hide');
            fetchForeignStudentData();
        },
        error: function (xhr, status) {
            throwError(xhr, status);
        }
    });
});

$(document).on('click', '#remove-foreign-student-btn', function(){
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
                url: "/remove-foreign-student/"+id,
                type: 'POST',
                success: function (response) {
                    console.log('Success:', response);
                    Swal.fire({
                        title: "Success!",
                        text: response.message,
                        icon: "success"
                    });
                    fetchForeignStudentData();
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
    foreign_students.setFilter([
        [
            {field:"semester", type:"like", value:semesterValue.trim()},
        ]
    ]);
    
    // Set the value for the CSV download
    document.getElementById('foreignStudentCsvSemesterInput').value = semesterValue;
});