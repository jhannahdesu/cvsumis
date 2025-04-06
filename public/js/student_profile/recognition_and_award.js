$(document).ready(function() {
    awardHeaderTable();
    fetchAwardHeaderData();
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

const awardHeaderTable = () => {
    awardsHeader = new Tabulator("#awards-header-table", {
        dataTree:true,
        dataTreeSelectPropagate:true,
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
            //{title:"NO", field:"no", hozAlign:"left",width:75, vertAlign:"middle"},
            {title:"RECOGNITION", field:"award", hozAlign:"left", vertAlign:"middle"},
            {title:"GRANTING AGENCY", field:"granting_agency", hozAlign:"left", vertAlign:"middle"},
            {title:"YEAR", field:"year", hozAlign:"left", vertAlign:"middle"},
            {title:"ACTION", field:"action", hozAlign:"left", formatter:"html", vertAlign:"middle"},
        ]
    }); 
}

function searchawardsHeader(value){
    awardsHeader.setFilter([
        [
            //{title:'NO', field: 'no'},
            {field:"award", type:"like", value:value.trim()},
            {field:"granting_agency", type:"like", value:value.trim()},
        ]
    ]);
}

let awardDetailsTable = () => {
    awardsDetails = new Tabulator("#awards-details-table", {
        dataTree:true,
        dataTreeSelectPropagate:true,
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
            //{title:"NO", field:"no", hozAlign:"left",width:75, vertAlign:"middle"},
            {title:"AWARD DETAILS", field:"award_details", hozAlign:"left", vertAlign:"middle"},
            {title:"AWARD", field:"game_placement", hozAlign:"left", vertAlign:"middle"},
            {title:"GRANTEES", field:"grantees_name", hozAlign:"left", vertAlign:"middle"},
         
            {title:"ACTION", field:"action", hozAlign:"left", formatter:"html", vertAlign:"middle"},
        ]
    }); 
}

$('#submit-award-btn').on('click', function(event) {
    var form = $('#award-header-form')[0];
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    }
    form.classList.add('was-validated');
    
    $.ajax({
        url: '/store-award',
        type: 'POST',
        data: $('#award-header-form').serialize(),
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
            fetchAwardHeaderData();
            $('#award-header-form')[0].reset();
        },
        error: function (xhr, status) {
            throwError(xhr, status);
        }
    });
});

function fetchAwardHeaderData(){
    $.ajax({
        url: '/fetch-award-header',
        type: 'GET',
        success: function(response) {
            // console.log(response);
            awardsHeader.setData(response);
        },
        error: function (xhr, status) {
            console.log("Error:", xhr.responseText);
        }
    });
}

function fetchAwardDetailsData(id){
    $.ajax({
        url: '/fetch-award-details/' + id,
        type: 'GET',
        success: function(response) {
            // console.log(response);
            awardsDetails.setData(response);
        },
        error: function (xhr, status) {
            console.log("Error:", xhr.responseText);
        }
    });
}

$(document).on("click", "#view-modal-hdr-btn", function(e) {
    var id = $(this).attr("data-id");
    $('#ViewAwardDetailstModal').modal('show');
    $('#ViewAwardDetailstModal').attr('data-id', id);
    fetchAwardDetailsData(id);
    awardDetailsTable();
});

$(document).on("click", "#edit-modal-hdr-btn", function(e) {
    var id = $(this).attr("data-id");
    $('#EditAwardHeadertModal').modal('show');
    $('#EditAwardHeadertModal').attr('data-id', id);
    $.ajax({
        url: '/view-award-header/' + id,
        type: 'GET',
        success: function(response) {
            // console.log(response);
            $('#view_award').val(response.award);
            $('#view_granting_agency').val(response.granting_agency);
            $('#view_start_year').val(response.start_year);
            $('#view_end_year').val(response.end_year);
            
        },

        error: function (xhr, status) {
            console.log("Error:", xhr.responseText);
        }
    });
});

$('#update-award-header-btn').on('click', function(event) {
    var id = $('#EditAwardHeadertModal').attr('data-id');
    var form = $('#view-award-header-form')[0];
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    }
    form.classList.add('was-validated');
    
    $.ajax({
        url: '/update-award-header/' + id,
        type: 'POST',
        data: $('#view-award-header-form').serialize(),
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
            $('#EditAwardHeadertModal').modal('hide');
            fetchAwardHeaderData();
        },
        error: function (xhr, status) {
            throwError(xhr, status);
        }
    });
});

$(document).on('click', '#remove-award-header-btn', function(){
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
                url: "/remove-award-header/"+id,
                type: 'POST',
                success: function (response) {
                    console.log('Success:', response);
                    Swal.fire({
                        title: "Success!",
                        text: response.message,
                        icon: "success"
                    });
                    fetchAwardHeaderData();
                },
                error: function (xhr, status) {
                    console.log('Error:', xhr);
                }
            });
        }
    });
});

$('#add-award-dtls-modal').click(function(e){
    var id = $('#ViewAwardDetailstModal').attr('data-id');
    $('#AddAwardDetailsModal').modal('show');
    $('#AddAwardDetailsModal').attr('data-id', id);
});

$('#submit-award-details-btn').click(function(event){
    var id = $('#AddAwardDetailsModal').attr('data-id');
    var hdr_id = $('#ViewAwardDetailstModal').attr('data-id');
    var form = $('#award-details-form')[0];
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    }
    form.classList.add('was-validated');
    
    $.ajax({
        url: '/store-award-details/' + id,
        type: 'POST',
        data: $('#award-details-form').serialize(),
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
            fetchAwardDetailsData(hdr_id);
            $('#AddAwardDetailsModal').modal('hide');
            $('#award-details-form')[0].reset();
        },
        error: function (xhr, status) {
            throwError(xhr, status);
        }
    });
});

$(document).on('click', '#edit-modal-dtls-btn', function (e) {
    var id = $(this).attr('data-id');
    $('#EditAwardDetailsModal').modal('show');
    $('#EditAwardDetailsModal').attr('data-id', id);
    $.ajax({
        url: '/view-award-details/' + id,
        type: 'GET',
        success: function(response) {
            // console.log(response);
            $('#view_award_details').val(response.award_details);
            $('#view_game_placement').val(response.game_placement);
            $('#view_grantees_name').val(response.grantees_name);
            $('#view_program_id').val(response.program_id);
            $('#view_medal_type').val(response.medal_type);
            
        },
        error: function (xhr, status) {
            console.log("Error:", xhr.responseText);
        }
    });
});

$('#update-award-details-btn').click(function(event){
    var id = $('#EditAwardDetailsModal').attr('data-id');
    var hdr_id = $('#ViewAwardDetailstModal').attr('data-id');
    var form = $('#view-award-details-form')[0];
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    }
    form.classList.add('was-validated');
    
    $.ajax({
        url: '/update-award-details/' + id,
        type: 'POST',
        data: $('#view-award-details-form').serialize(),
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
            fetchAwardDetailsData(hdr_id);
            $('#EditAwardDetailsModal').modal('hide');
        },
        error: function (xhr, status) {
            throwError(xhr, status);
        }
    });
});

$(document).on('click', '#remove-award-dtls-btn', function (e) {
    var id = $(this).attr('data-id');
    var hdr_id = $('#ViewAwardDetailstModal').attr('data-id');
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
                url: "/remove-award-details/"+id,
                type: 'POST',
                success: function (response) {
                    console.log('Success:', response);
                    Swal.fire({
                        title: "Success!",
                        text: response.message,
                        icon: "success"
                    });
                    fetchAwardDetailsData(hdr_id);
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
    awardsHeader.setFilter([
        [
            {field:"semester", type:"like", value:semesterValue.trim()},
        ]
    ]);
    
    // Set the value for the CSV download
    document.getElementById('recognitionAwardCsvSemesterInput').value = semesterValue;
});