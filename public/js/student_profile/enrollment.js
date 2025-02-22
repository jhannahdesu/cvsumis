$(document).ready(function () {
    enrollmentTable();
    fetchEnrollmentData();
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

const enrollmentTable = () => {
    enrollments = new Tabulator("#enrollment-table", {
        dataTree:true,
        dataTreeSelectPropagate:true,
        layout:"fitDataFill",
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
            {title:"SEMESTER", field:"semester", hozAlign:"left", vertAlign:"middle"},
            {title:"ACADEMIC YEAR", field:"school_year", hozAlign:"left", vertAlign:"middle"},
            {title:"NO. OF STUDENT", field:"student_count", hozAlign:"left", vertAlign:"middle"},
            {title:"ACTION", field:"action", hozAlign:"left", formatter:"html", vertAlign:"middle"},
        ]
    }); 
}

function searchEnrollment(value){
    enrollments.setFilter([
        [
            {title:'NO', field: 'no'},
            {field:"name", type:"like", value:value.trim()},
            {field:"semester", type:"like", value:value.trim()},
            {field:"school_year", type:"like", value:value.trim()},
            {field:"program", type:"like", value:value.trim()},
        ]
    ]);
}

$('#filter-status').change(function(){
    var value = $('#filter-status').val();
    enrollments.setFilter([
        [
            {field:"school_year", type:"like", value:value.trim()},
        ]
    ]);
});

$('#enrollment-modal').click( function(e){
    e.preventDefault();
    $('#EnrollmentModal').modal('show');
});

$('#submit-enrollment-btn').on('click', function(event) {
    var form = $('#enrollment-form')[0];
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    }
    form.classList.add('was-validated');
    
    $.ajax({
        url: '/store-enrollment',
        type: 'POST',
        data: $('#enrollment-form').serialize(),
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
            $('#enrollment-form')[0].reset();
            $('#EnrollmentModal').modal('hide');
            fetchEnrollmentData();
        },
        error: function (xhr, status) {
            throwError(xhr, status);
        }
    });
});

function fetchEnrollmentData(){
    $.ajax({
        url: '/fetch-enrollment',
        type: 'GET',
        success: function(response) {
            // console.log(response);
            enrollments.setData(response);
            
        },
        error: function (xhr, status) {
            console.log("Error:", xhr.responseText);
        }
    });
}

$(document).on('click', '#edit-modal-btn', function(e) {
    var id = $(this).attr('data-id');
    $('#EditEnrollmentModal').attr('data-id', id);
    $('#loading').show();
    $('#view-enrollment-form').hide();
    $('#EditEnrollmentModal').modal('show');
    $.ajax({
        url: '/view-enrollment/' + id,
        type: 'GET',
        success: function(response) {
            $('#loading').hide();
            $('#view-enrollment-form').show();
            $('#view_program_id').val(response.program_id); 
            $('#view_number_of_student').val(response.number_of_student);
            $('#view_semester').val(response.semester);
            $('#view_school_year').val(response.school_year);

            fetchEnrollmentData();
        },
        error: function (xhr, status) {
            console.log("Error:", xhr.responseText);
        }
    });
});

$('#update-enrollment-btn').click( function(e){
    var id = $('#EditEnrollmentModal').attr('data-id');
    var form = $('#enrollment-form')[0];
    if (form.checkValidity() === false) {
        e.preventDefault();
        e.stopPropagation();
    }
    form.classList.add('was-validated');
    
    $.ajax({
        url: '/update-enrollment/'+ id,
        type: 'POST',
        data: $('#view-enrollment-form').serialize(),
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
            $('#view-enrollment-form')[0].reset();
            $('#EditEnrollmentModal').modal('hide');
            fetchEnrollmentData();
        },
        error: function (xhr, status) {
            throwError(xhr, status);
        }
    });
});

$(document).on('click', '#remove-enrollment-btn', function(){
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
                url: "/remove-enrollment/"+id,
                type: 'POST',
                success: function (response) {
                    console.log('Success:', response);
                    Swal.fire({
                        title: "Success!",
                        text: response.message,
                        icon: "success"
                    });
                    fetchEnrollmentData();
                },
                error: function (xhr, status) {
                    console.log('Error:', xhr);
                }
            });
        }
    });
}); 

$('#filter-status').change(function(){
    var value = $('#filter-status').val();
    enrollments.setFilter([
        [
            {field:"school_year", type:"like", value:value.trim()},
        ]
    ]);
    // Set the value for the CSV download
    document.getElementById('enrollmentCsvYearInput').value = value;
});


