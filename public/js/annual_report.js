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
        initialSort: [
            { column: "uploaded_at", dir: "asc" }
        ],
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
                                ADDED BY
                            </strong><br>
                        </div>
                    `;
                },
                field: "created_by",
                headerHozAlign: "center",
                headerSort: false,
                hozAlign: "center",
                vertAlign: "middle",
                download: false
            },
            {titleFormatter: function () {
                return `
                    <div style="line-height: 1.4;">
                        <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                            YEAR
                        </strong><br>
                    </div>
                `;
            },
                field:"year",
                headerHozAlign: "center",
                headerSort: false,
                hozAlign: "center",
                vertAlign: "middle",},
            { titleFormatter: function () {
                return `
                    <div style="line-height: 1.4;">
                        <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                            FILE NAME
                        </strong><br>
                    </div>
                `;
            },
                field:"filename", 
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
                field:"uploaded_at",
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
                formatter:"html"
            }
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


$('#generate-annual-report-btn').click(function () {
    const filterType = $('#filter-type').val();
    const year = $('#year').val();
    const quarter = $('#quarter').val();
    const half = $('#half').val();

    const loadingAlert = loadingSwal();

    $.ajax({
        url: '/generate-annual-report',
        type: 'get',
        data: {
            filter_type: filterType,
            year: year,
            quarter: quarter,
            half: half
        },
        success: function (response) {
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