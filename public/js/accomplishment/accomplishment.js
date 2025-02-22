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
    accomplishments = new Tabulator("#accomplishment-table", {
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
            {title:"FACULTY", field:"faculty", hozAlign:"left", vertAlign:"middle"},
            {title:"PROGRAM", field:"program_id", hozAlign:"left", formatter:"html", vertAlign:"middle"},
            {title:"SUC / DATE", field:"university", hozAlign:"left", formatter:"html", vertAlign:"middle"},
            {title:"ACTION", field:"action", hozAlign:"left", formatter:"html", vertAlign:"middle"},
        ]
    }); 
}
function searchaccomplishments(value){
    accomplishments.setFilter([
        [
            {title:'NO', field: 'no'},
            {field:"name", type:"like", value:value.trim()},
            {field:"program_id", type:"like", value:value.trim()},
            {field:"university", type:"like", value:value.trim()},
            {field:"faculty", type:"like", value:value.trim()},
        ]
    ]);
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