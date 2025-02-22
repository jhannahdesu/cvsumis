
$(document).ready(function(){
    attachmentHeaderTable();
    fetchAttachment();
});

let attachmentHeaderTable = () => {
    attachments = new Tabulator("#attachment-header-table", {
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
            {title:"MODULE", field:"module_id", hozAlign:"left", vertAlign:"middle"},
            {title:"ATTACHMENT DETAILS", field:"attachment_detail", hozAlign:"left", vertAlign:"middle"},
            {title:"UPLOADED DATE", field:"created_at", hozAlign:"left", vertAlign:"middle"},
            {title:"ACTION", field:"action", hozAlign:"left", formatter:"html", vertAlign:"middle"},
        ]
    }); 
}

let attachmentDetailsTable = () => {
    attachmentsDetails= new Tabulator("#attachment-details-table", {
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
            {title:"ATTACHMENT", field:"image", hozAlign:"left", formatter:"html", vertAlign:"middle"},
            {title:"FILE NAME", field:"attachment", hozAlign:"left", vertAlign:"middle"},
            {title:"ACTION", field:"action", hozAlign:"left", formatter:"html", vertAlign:"middle"},
        ]
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
$('#submit-attachment-btn').click(function(event) {
    event.preventDefault(); // Prevent the default form submission
    var form = $('#report-attachment-form')[0];
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    }
    form.classList.add('was-validated');
    var formData = new FormData(form);
    
    $.ajax({
        url: '/store-report-attachment',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
            $('#report-attachment-form')[0].reset();
            form.classList.remove('was-validated');
            fetchAttachment();
        },
        error: function (xhr, status) {
            throwError(xhr, status);
        }
    });

});

let fetchAttachment = () =>{
    $.ajax({
        url: '/fetch-report-attachment',
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            attachments.setData(response);
        },
        error: function (xhr, status) {
            throwError(xhr, status);
        }
    });
}

let fetchAttachmentFiles = (id) => {
    $.ajax({
        url: '/view-report-attachment/' + id,
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            attachmentsDetails.setData(response);
        },
        error: function (xhr, status) {
            throwError(xhr, status);
        }
    });
}

$(document).on('click', '#view-attachment-btn', function(e) {
    var id = $(this).attr('data-id');
    $('#ViewAttachmentHeaderModal').modal('show');
    $('#ViewAttachmentHeaderModal').attr('data-id', id);
    attachmentDetailsTable();
    fetchAttachmentFiles(id);

});

$('#add-attachment-btn').click(function(event) {
    event.preventDefault(); 
    var id = $('#ViewAttachmentHeaderModal').attr('data-id');
    var form = $('#add-report-attachment-form')[0];
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    }
    form.classList.add('was-validated');
    var formData = new FormData(form);
    
    $.ajax({
        url: '/add-report-attachment/' + id,
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
            $('#add-report-attachment-form')[0].reset();
            form.classList.remove('was-validated');
            fetchAttachmentFiles(id);
        },
        error: function (xhr, status) {
            throwError(xhr, status);
        }
    });

});

$(document).on('click', '#edit-attachment-btn', function(event) {
    var id = $(this).attr('data-id');
    $('#EditAttachmentHeaderModal').modal('show');
    $('#EditAttachmentHeaderModal').attr('data-id', id);

    $.ajax({
        url: '/view-report-header/' + id,
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            $('#view_module_id').val(response.module_id);
            $('#view_attachment_detail').val(response.attachment_detail);
        },
        error: function (xhr, status) {
            throwError(xhr, status);
        }
    });
});

//
$('#update-attachment-header-btn').click(function(event){
    var id =  $('#EditAttachmentHeaderModal').attr('data-id');
    var form = $('#view-report-attachment-form')[0];
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    }
    form.classList.add('was-validated');
    
    $.ajax({
        url: '/update-header-report-attachment/' + id,
        type: 'POST',
        data: $('#view-report-attachment-form').serialize(),
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
            $('#view-report-attachment-form')[0].reset();
            $('#EditAttachmentHeaderModal').modal('hide');
            fetchAttachment();
        },
        error: function (xhr, status) {
            throwError(xhr, status);
        }
    });

});

$(document).on('click', '#remove-attachment-btn', function(event) {
    event.preventDefault(); 
    var id = $(this).attr('data-id');
    var header_id = $('#ViewAttachmentHeaderModal').attr('data-id');
   
    $.ajax({
        headers:{
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        url: '/remove-report-attachment/' + id,
        type: 'POST',
        dataType: 'json',
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
            fetchAttachmentFiles(header_id);
        },
        error: function (xhr, status) {
            console.log(xhr.responseText);
            throwError(xhr, status);
        }
    });

});


$(document).on('click', '#remove-header-attachment-btn', function(){
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
                url: "/remove-header-report-attachment/"+id,
                type: 'POST',
                success: function (response) {
                    console.log('Success:', response);
                    Swal.fire({
                        title: "Success!",
                        text: response.message,
                        icon: "success"
                    });
                    fetchAttachment();
                    
                },
                error: function (xhr, status) {
                    console.log('Error:', xhr);
                }
            });
        }
    });
});

