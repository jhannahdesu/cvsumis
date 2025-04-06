$(document).ready(function() {
    annualReportTable();
    fetchReport();
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
const annualReportTable = () => {
    reports = new Tabulator("#annual-reports-table", {
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
            //{title:"NO", field:"no", hozAlign:"center",width:75, vertAlign:"middle"},
            {title:"ADDED BY", field:"created_by", hozAlign:"left", vertAlign:"middle"},
            {title:"YEAR", field:"year", hozAlign:"left", vertAlign:"middle"},
            {title:"FILES", field:"filename", hozAlign:"left", vertAlign:"middle"},
            {title:"UPLOADED DATE", field:"uploaded_at", hozAlign:"left", vertAlign:"middle"},
            {title:"ACTION", field:"action", hozAlign:"left", formatter:"html", vertAlign:"middle"},
        ]
    }); 
}

// function searchreports(value){
//     reports.setFilter([
//         [
//             //{title:'NO', field: 'no'},
//             {field:"created_by", type:"like", value:value.trim()},
//             {field:"filename", type:"like", value:value.trim()},
//             {field:"year", type:"like", value:value.trim()},
//         ]
//     ]);
// }
function searchreports(value) {
    let searchTerms = value.trim().toLowerCase().split(/\s+/);

    if (searchTerms.length === 0 || searchTerms[0] === "") {
        reports.clearFilter();
        return;
    }

    reports.setFilter(function(data) {
        let matches = true;

        searchTerms.forEach(term => {
            if (
                !data.created_by.toLowerCase().includes(term) &&
                !data.filename.toLowerCase().includes(term) &&
                !data.year.toString().includes(term) // Ensuring 'year' is treated as a string
            ) {
                matches = false;
            }
        });

        return matches;
    });
}

function fetchReport(){
    $.ajax({
        url: '/fetch-annual-report',
        type: 'GET',
        success: function(response) {
            // console.log(response);
            reports.setData(response);
        },
        error: function(xhr, status, error) {
            console.log(xhr.responseText);
        }
    });
}

$('#generate-annual-report-modal').click( function(){
    $('#AnnualReportModal').modal('show');
});
const loadingSwal = () => {
    return Swal.fire({
        title: 'Generating Annual Report...',
        text: 'Please wait for a moment.',
        allowEscapeKey: false,
        allowOutsideClick: false,
        showConfirmButton: false, // Remove the OK button
        didOpen: () => {
            Swal.showLoading(); // Show loading spinner
        }
    });
};


$('#generate-annual-report-btn').click( function(){
    const loadingAlert = loadingSwal(); 
    $.ajax({
        url: '/generate-annual-report',
        type: 'get',
        data: {year: $('#year').val()},
        success: function(response) {
            loadingAlert.close();
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
            fetchReport();
            $('#AnnualReportModal').modal('hide');
        },
        error: function (xhr, status) {
            loadingAlert.close();
            throwError(xhr, status);
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

$('#add-year-btn').click(function () {
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, generate a year!"
      }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                headers:{
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                url: '/generate-year',
                type: 'POST',
                success: function (response) {
                    console.log('Success:', response);
                    Swal.fire({
                        title: "Success!",
                        text: response.message,
                        icon: "success"
                    });
                    $('#AnnualReportModal').modal('hide');
                    location.reload();
                },
                error: function (xhr, status) {
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
                                onClick: function(){} // Callback after click
                              }).showToast();
                            console.log("Error key:", key);
                            console.log("Error message:", response.errors[key]);
                        });
                    }
                }
            });
        }
    });
});