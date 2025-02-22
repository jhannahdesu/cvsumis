$(document).ready(function() {
    scholarshipTable();
    fetchScholarshiptData();
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

const scholarshipTable = () => {
    scholarships = new Tabulator("#scholarship-table", {
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
            {title:"SCHOLAR TYPE", field:"type", hozAlign:"left", vertAlign:"middle"},
            {title:"SEMESTER", field:"semester", hozAlign:"left", vertAlign:"middle"},
            {title:"ACADEMIC YEAR", field:"school_year", hozAlign:"left", vertAlign:"middle"},
            {title:"NO. OF SCHOLARS", field:"number_of_scholars", hozAlign:"left", vertAlign:"middle"},
            {title:"ACTION", field:"action", hozAlign:"left", formatter:"html", vertAlign:"middle"},
        ]
    }); 
}

function searchScholarship(value){
    scholarships.setFilter([
        [
            {title:'NO', field: 'no'},
            {field:"name", type:"like", value:value.trim()},
            {field:"semester", type:"like", value:value.trim()},
            {field:"school_year", type:"like", value:value.trim()},
            {field:"type", type:"like", value:value.trim()},
        ]
    ]);
}

$('#filter-status').change(function(){
    var value = $('#filter-status').val();
    scholarships.setFilter([
        [
            {field:"semester", type:"like", value:value.trim()},
        ]
    ]);
});

$('#add-scholarship-modal').click( function() {
   $('#AddScholarshipModal').modal('show'); 
});

$('#submit-scholarship-btn').on('click', function(event) {
    var form = $('#scholarship-form')[0];
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    }
    form.classList.add('was-validated');
    
    $.ajax({
        url: '/store-scholarship',
        type: 'POST',
        data: $('#scholarship-form').serialize(),
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
            $('#scholarship-form')[0].reset();
            $('#AddScholarshipModal').modal('hide');
            fetchScholarshiptData();
        },
        error: function (xhr, status) {
            throwError(xhr, status);
        }
    });
});

function fetchScholarshiptData(){
    $.ajax({
        url: '/fetch-scholarship',
        type: 'GET',
        success: function(response) {
            // console.log(response);
            scholarships.setData(response);
            
        },
        error: function (xhr, status) {
            console.log("Error:", xhr.responseText);
        }
    });
}

$(document).on('click', '#edit-modal-btn', function (e) {
    var id = $(this).attr('data-id');
    $('#EditScholarshipModal').modal('show');
    $('#EditScholarshipModal').attr('data-id', id);
    $.ajax({
        url: '/view-scholarship/' + id,
        type: 'GET',
        success: function(response) {
            $('#view_scholarship_type').val(response.scholarship_type); 
            $('#view_number_of_scholars').val(response.number_of_scholars);
            $('#view_semester').val(response.semester);
            $('#view_school_year').val(response.school_year);

            fetchScholarshiptData();
        },
        error: function (xhr, status) {
            console.log("Error:", xhr.responseText);
        }
    });
});

$('#update-scholarship-btn').click(function (event) {
    var id = $('#EditScholarshipModal').attr('data-id');
    var form = $('#scholarship-form')[0];
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    }
    form.classList.add('was-validated');
    
    $.ajax({
        url: '/update-scholarship/' + id,
        type: 'POST',
        data: $('#view-scholarship-form').serialize(),
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
            $('#view-scholarship-form')[0].reset();
            $('#EditScholarshipModal').modal('hide');
            fetchScholarshiptData();
        },
        error: function (xhr, status) {
            throwError(xhr, status);
        }
    });
});

$(document).on('click', '#remove-scholarship-btn', function(){
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
                url: "/remove-scholarship/"+id,
                type: 'POST',
                success: function (response) {
                    console.log('Success:', response);
                    Swal.fire({
                        title: "Success!",
                        text: response.message,
                        icon: "success"
                    });
                    fetchScholarshiptData();
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
    scholarships.setFilter([
        [
            {field:"semester", type:"like", value:semesterValue.trim()},
        ]
    ]);
    
    // Set the value for the CSV download
    document.getElementById('scholarshipCsvSemesterInput').value = semesterValue;
});