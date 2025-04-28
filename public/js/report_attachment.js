
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
        initialSort: [
            { column: "created_at", dir: "asc" }
        ],
        rowFormatter: function (row) {
            const element = row.getElement();
            const index = row.getPosition(true);
            element.style.color = "#000000";
            element.style.backgroundColor = index % 2 === 0 ? "#FFF1D1" : "#ffffff";
        },
        columns:[
            {titleFormatter: function () {
                return `
                    <div style="line-height: 1.4;">
                        <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                            ADDED BY
                        </strong><br>
                    </div>
                `;
            },
            field: "name",
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle",
            download: false
        },
            { titleFormatter: function () {
                return `
                    <div style="line-height: 1.4;">
                        <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                            MODILE
                        </strong><br>
                    </div>
                `;
            },
                field:"module_id",
                headerHozAlign: "center",
                headerSort: false,
                hozAlign: "center",
                vertAlign: "middle",
            },
            { titleFormatter: function () {
                return `
                    <div style="line-height: 1.4;">
                        <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                            ATTACHMENT DETAILS
                        </strong><br>
                    </div>
                `;
            },
                field:"attachment_detail",
                headerHozAlign: "center",
                headerSort: false,
                hozAlign: "center",
                vertAlign: "middle",
            },
            { titleFormatter: function () {
                return `
                    <div style="line-height: 1.4;">
                        <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                            UPLOADED DATE
                        </strong><br>
                    </div>
                `;
            },
                field:"created_at",
                headerHozAlign: "center",
                headerSort: false,
                hozAlign: "center",
                vertAlign: "middle",
            },
            { titleFormatter: function () {
                return `
                    <div style="line-height: 1.4;">
                        <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                            ACTION
                        </strong><br>
                    </div>
                `;
            },
                field:"action",
                headerHozAlign: "center",
                headerSort: false,
                hozAlign: "center",
                vertAlign: "middle",
                formatter:"html",
            },
        ]
    }); 
}
function searchattachments(value) {
    let searchTerms = value.trim().toLowerCase().split(/\s+/);

    if (searchTerms.length === 0 || searchTerms[0] === "") {
        attachments.clearFilter();
        return;
    }

    attachments.setFilter(function(data) {
        let matches = true;

        searchTerms.forEach(term => {
            if (
                !data.name.toLowerCase().includes(term) &&
                !data.module_id.toLowerCase().includes(term) &&
                !data.attachment_detail.toLowerCase().includes(term) &&
                !data.created_at.toLowerCase().includes(term) // Ensuring 'created_at' is treated as a string
            ) {
                matches = false;
            }
        });

        return matches;
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
        rowFormatter: function (row) {
            const element = row.getElement();
            const index = row.getPosition(true);
            element.style.color = "#000000";
            element.style.backgroundColor = index % 2 === 0 ? "#FFF1D1" : "#ffffff";
        },
        columns:[
            { titleFormatter: function () {
                return `
                    <div style="line-height: 1.4;">
                        <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                            ATTACHMENT
                        </strong><br>
                    </div>
                `;
            },
                field:"image",
                headerHozAlign: "center",
                headerSort: false,
                hozAlign: "center",
                vertAlign: "middle",
                formatter:"html"
            },
            { titleFormatter: function () {
                return `
                    <div style="line-height: 1.4;">
                        <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                            FILE NAME
                        </strong><br>
                    </div>
                `;
            },
                field:"attachment",
                headerHozAlign: "center",
                headerSort: false,
                hozAlign: "center",
                vertAlign: "middle",
                formatter:"html",
            },
            { titleFormatter: function () {
                return `
                    <div style="line-height: 1.4;">
                        <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                            ACTION
                        </strong><br>
                    </div>
                `;
            },
                field:"action",
                headerHozAlign: "center",
                headerSort: false,
                hozAlign: "center",
                vertAlign: "middle",
                formatter:"html",
            },
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

