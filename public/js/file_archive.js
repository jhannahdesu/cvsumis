
$(document).ready(function() {
    reportTable();
    fetchReport();
});

let type;
let selectedYear = null;
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
const reportTable = () => {
    reports = new Tabulator("#reports-table", {
        dataTree:true,
        dataTreeSelectPropagate:true,
        // layout:"fitColumns",
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
            {
                title: "<input type='checkbox' id='select-all'>", 
                field: "checkbox", 
                hozAlign: "center", 
                vertAlign: "middle", 
                sortable: false,  // Disable sorting for this column
                formatter: function(cell, formatterParams, onRendered) {
                    return '<input type="checkbox" class="form-check-input" id="file-'+cell.getData().id+'" value="'+cell.getData().filename+'">';
                },
                headerSort: false  // Disable sorting header interaction (this hides the sorting arrows)
            },
            //{title:"NO", field:"no", hozAlign:"center",width:75, vertAlign:"middle"},
            {title:"ADDED BY", field:"created_by", hozAlign:"left", vertAlign:"middle"},
            {title:"REPORT TYPE ", field:"report_type", hozAlign:"left", vertAlign:"middle"},
            {title:"FILES", field:"filename", hozAlign:"left", vertAlign:"middle"},
            {title:"UPLOADED DATE", field:"uploaded_at", hozAlign:"left", vertAlign:"middle"},
            {title:"ACTION", field:"action", hozAlign:"left", formatter:"html", vertAlign:"middle"},
        ]
    }); 
}

$(document).on('click', '#select-all', function() {
    if (this.checked) {
        $('#reports-table input[type="checkbox"]').each(function() {
            this.checked = true;
        });
    } else {
        $('#reports-table input[type="checkbox"]').each(function() {
            this.checked = false;
        });
    }
});

$(document).on('click', '#delete-selected-files', function(e){
    var selectedFiles = [];
    $('#reports-table input[type="checkbox"]:checked').each(function(){
        selectedFiles.push($(this).val());
    });

    if(selectedFiles.length > 0){
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    headers:{
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    },
                    url: "/delete-selected-files",
                    type: 'POST',
                    data: {files: selectedFiles},
                    success: function (response) {
                        console.log('Success:', response);
                        Swal.fire({
                            title: "Success!",
                            text: response.message,
                            icon: "success"
                        });
                        fetchReport();
                    },
                    error: function (xhr, status) {
                        console.log('Error:', xhr);
                    }
                });
            }
        });
    } else {
        Swal.fire({
            title: "Error!",
            text: "Please select at least one file to delete.",
            icon: "error"
        });
    }
});

function searchreports(value){
    reports.setFilter([
        [
            {title:'NO', field: 'no'},
            {field:"created_by", type:"like", value:value.trim()},
            {field:"report_type", type:"like", value:value.trim()},
            {field:"filename", type:"like", value:value.trim()},
            {field:"faculty", type:"like", value:value.trim()},
        ]
    ]);
}

function fetchReport(){
    $.ajax({
        url: '/fetch-file-archive',
        type: 'GET',
        success: function(response) {
            reports.setData(response);
        },
        error: function(xhr, status, error) {
            console.log(xhr.responseText);
        }
    });
}

$('#generate-file-report-modal').click(function(e){
    $('#FileArchiveModal').modal('show');
});

$('#generate-report').click( function() {
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, generate it!"
      }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                headers:{
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                url: "/file-archive",
                type: 'POST',
                success: function (response) {
                    console.log('Success:', response);
                    Swal.fire({
                        title: "Success!",
                        text: response.message,
                        icon: "success"
                    });
                    fetchReport();
                },
                error: function (xhr, status) {
                    console.log('Error:', xhr);
                }
            });
        }
    });
});

$(document).on('click', '#view-file-btn', function (e) {
    var filename = $(this).attr('data-name');
    var url = '/view-file/' + filename;
    window.open(url, '_blank');
});

$(document).on('click', '#remove-sp-file-btn', function (e) {
    e.preventDefault();
    var filename = $(this).attr('data-name');
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
                headers:{
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                url: "/remove-file/"+ filename,
                type: 'POST',
                success: function (response) {
                    console.log('Success:', response);
                    Swal.fire({
                        title: "Success!",
                        text: response.message,
                        icon: "success"
                    });
                    fetchReport();
                },
                error: function (xhr, status) {
                    console.log('Error:', xhr);
                    throwError(xhr, status);
                }
            });
        }
    });
});

function curricullumReport(){
    $.ajax({
        url: '/curriculum-report',
        type: 'get',
        data: {year: selectedYear},
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
        },
        error: function(xhr, status, error) {
            console.log(xhr.responseText);
        }
    });
}

function studentProfileReport(){
    $.ajax({
        url: '/student-profile-report',
        type: 'get',
        data: {year: selectedYear},
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
        },
        error: function(xhr, status, error) {
            console.log(xhr.responseText);
        }
    });
}

function facultyStaffProfileReport(){
    $.ajax({
        url: '/faculty-staff-profile-report',
        type: 'get',
        data: {year: selectedYear},
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
        },
        error: function(xhr, status, error) {
            console.log(xhr.responseText);
        }
    });
}

function studentDevelopmentReport(){
    $.ajax({
        url: '/student-development-report',
        type: 'get',
        data: {year: selectedYear},
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
        },
        error: function(xhr, status, error) {
            console.log(xhr.responseText);
        }
    });
}

function ResearchAndExtension(){
    $.ajax({
        url: '/research-and-extension-report',
        type: 'get',
        data: {year: selectedYear},
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
        },
        error: function(xhr, status, error) {
            console.log(xhr.responseText);
        }
    });
}

function infrastractureDevelopment(){
    $.ajax({
        url: '/infrastructure-development-report',
        type: 'get',
        data: {year : selectedYear},
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
        },
        error: function(xhr, status, error) {
            console.log(xhr.responseText);
        }
    });
}

function accomplishmentEvents(){
    $.ajax({
        url: '/accomplishment-events-report',
        type: 'get',
        data: {year: selectedYear},
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
        },
        error: function(xhr, status, error) {
            console.log(xhr.responseText);
        }
    });
}

function linkages(){
    $.ajax({
        url: '/linkages-report',
        type: 'get',
        data: {year: selectedYear},
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
        },
        error: function(xhr, status, error) {
            console.log(xhr.responseText);
        }
    });
}
$('#module').change(function () {
    type = parseInt($('#module').val());
    if (type) {
        $.ajax({
            url: '/module-year',
            method: 'GET',
            data: { module: type},
            dataType: 'json',
            success: function(response) {
                $('#year').empty().append('<option value="" selected>Select Years</option>');
                $.each(response, function(index, yearData) {
                    $('#year').append(`<option value="${yearData.year}">${yearData.year}</option>`);
                });
                selectedYear = $('#year').val();
            },
            error: function() {
                alert('An error occurred while fetching the years. Please try again.');
            }
        });
    } else {
        $('#year').empty().append('<option value="">Select Year</option>');
        selectedYear = '';
    }
});

$('#year').change(function() {
    selectedYear = $(this).val(); 
  });

$('#generate-report-btn').click( function(e){
    switch(type){
        case 1: 
            curricullumReport();
            fetchReport();
            break;
        case 2:
            studentProfileReport();
            fetchReport();
            break;
        case 3:
            facultyStaffProfileReport();
            fetchReport();
            break;
        case 4:
            studentDevelopmentReport();
            fetchReport();
            break;
        case 5:
            ResearchAndExtension();
            fetchReport();
            break;
        
        case 7:
            linkages();
            fetchReport();
            break;
            
        case 8:
            infrastractureDevelopment();
            fetchReport();
            break;
        case 9:
            accomplishmentEvents();
            fetchReport();
            break;
            
    }
    
    $('#FileArchiveModal').modal('hide');
    
});
