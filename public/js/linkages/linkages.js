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
    linkages = new Tabulator("#linkages-table", {
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
            {title:"AGENCY", field:"agency", hozAlign:"left", vertAlign:"middle"},
            {title:"NATURE OF LINKAGE", field:"linkage_nature", hozAlign:"left", vertAlign:"middle"},
            {title:"ACTIVITY TITLE", field:"activity_title", hozAlign:"left", vertAlign:"middle"},
            {title:"DATE AND VENUE", field:"date_venue", hozAlign:"left", vertAlign:"middle"},
            {title:"ATTENDEES", field:"attendees", hozAlign:"left", vertAlign:"middle"},
            {title:"FACILITATORS", field:"facilitators", hozAlign:"left", vertAlign:"middle"},
            {title:"ACTION", field:"action", hozAlign:"left", formatter:"html", vertAlign:"middle"},
        ]
    }); 
}

function searchlinkages(value){
    linkages.setFilter([
        [
            {title:'NO', field: 'no'},
            {field:"name", type:"like", value:value.trim()},
            {field:"agency", type:"like", value:value.trim()},
            {field:"linkage_nature", type:"like", value:value.trim()},
            {field:"activity_title", type:"like", value:value.trim()},
        ]
    ]);
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
