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
    let columns = [
        { titleFormatter: () => `
            <div style="line-height: 1.2;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                    ADDED BY
                </strong><br>
                <span style="font-size: 0.75em; color: #888;">Updated on</span>
            </div>`,
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle",
            download: false,
            formatter: function (cell) {
                let data = cell.getData();
                return `
                    <div>
                        <div>${data.name}</div>
                        <span style="font-size: 0.8em; color: #888;">${data.updated_at}</span>
                    </div>
                `;
            }
        },
        { titleFormatter: () => `
            <div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">SCHOLAR TYPE</strong>
            </div>`,
            field: "type",
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle"
        },
        { titleFormatter: () => `
            <div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">SEMESTER</strong>
            </div>`,
            field: "semester",
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle"},
        { titleFormatter: () => `
            <div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">ACADEMIC YEAR</strong>
            </div>`,
            field: "school_year",
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle"},
        { titleFormatter: () => `
            <div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">NO. OF SCHOLARS</strong>
            </div>`,
            field: "number_of_scholars",
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle"
        },
    ];

    if (window.userPosition != 5) {
        columns.push({
            titleFormatter: () => `
            <div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">ACTION</strong>
            </div>`,
            field: "action",
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle",
            formatter: "html",
        });
    }

    scholarships = new Tabulator("#scholarship-table", {
        dataTree: true,
        dataTreeSelectPropagate: true,
        layout: "fitColumns",
        maxHeight: "1000px",
        scrollToColumnPosition: "center",
        pagination: "local",
        placeholder: "No Data Available",
        paginationSize: 10,
        paginationSizeSelector: [10, 50, 100],
        selectable: 1,
        rowFormatter: function (row) {
            const element = row.getElement();
            const index = row.getPosition(true);
            element.style.color = "#000000";
            element.style.backgroundColor = index % 2 === 0 ? "#FFF1D1" : "#ffffff";
        },
        columns: columns
    });    
};

function searchScholarship(value){
    scholarships.setFilter([
        [
            //{title:'NO', field: 'no'},
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