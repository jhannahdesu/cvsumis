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
    let columns = [
        {
            titleFormatter: function () {
                return `
                    <div style="line-height: 1.2;">
                        <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                            ADDED BY
                        </strong><br>
                        <span style="font-size: 0.75em; color: #888;">Updated on</span>
                    </div>
                `;
            },
            field: "name",
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
        { titleFormatter: () =>
            `<div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                    FACULTY
                </strong>
            </div>`,
            field: "faculty",
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle"
        },
        { titleFormatter: () =>
            `<div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                    PROGRAM
                </strong>
            </div>`,
            field: "program_id", 
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle",
            formatter: "html"
        },
        { titleFormatter: () =>
            `<div style="line-height: 2.5;">
                <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                    SUC / DATE
                </strong>
            </div>`,
             field: "university",
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle",
            formatter: "html"
        },
    ];

    if (window.userPosition != 5) {
        columns.push({
            titleFormatter: () =>
                `<div style="line-height: 2.5;">
                    <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                        ACTION
                    </strong>
                </div>`,
            field: "action",
            headerHozAlign: "center",
            headerSort: false,
            hozAlign: "center",
            vertAlign: "middle",
            formatter: "html"
        });
    }

    accomplishments = new Tabulator("#accomplishment-table", {
        dataTree: true,
        dataTreeSelectPropagate: true,
        layout: "fitDataFill",
        maxHeight: "1000px",
        scrollToColumnPosition: "center",
        pagination: "local",
        placeholder: "No Data Available",
        paginationSize: 10,
        paginationSizeSelector: [10, 50, 100],
        selectable: 1,
        initialSort: [
            { column: "updated_at", dir: "asc" }
        ],
        rowFormatter: function (row) {
            const element = row.getElement();
            const index = row.getPosition(true);
            element.style.color = "#000000";
            element.style.backgroundColor = index % 2 === 0 ? "#FFF1D1" : "#ffffff";
        },
        columns: columns
    });
}

// function searchaccomplishments(value){
//     accomplishments.setFilter([
//         [
//             //{title:'NO', field: 'no'},
//             {field:"name", type:"like", value:value.trim()},
//             {field:"program_id", type:"like", value:value.trim()},
//             {field:"university", type:"like", value:value.trim()},
//             {field:"faculty", type:"like", value:value.trim()},
//         ]
//     ]);
// }
function searchaccomplishments(value) {
    let searchTerms = value.trim().toLowerCase().split(/\s+/);

    if (searchTerms.length === 0 || searchTerms[0] === "") {
        accomplishments.clearFilter();
        return;
    }

    accomplishments.setFilter(function(data) {
        let matches = true;

        searchTerms.forEach(term => {
            if (
                !data.name.toLowerCase().includes(term) &&
                !data.program_id.toLowerCase().includes(term) &&
                !data.university.toLowerCase().includes(term) &&
                !data.faculty.toLowerCase().includes(term)
            ) {
                matches = false;
            }
        });

        return matches;
    });
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