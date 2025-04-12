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
        { title: "ADDED BY", field: "name", hozAlign: "left", vertAlign: "middle" },
        { title: "FACULTY", field: "faculty", hozAlign: "left", vertAlign: "middle" },
        { title: "PROGRAM", field: "program_id", hozAlign: "left", formatter: "html", vertAlign: "middle" },
        { title: "SUC / DATE", field: "university", hozAlign: "left", formatter: "html", vertAlign: "middle" },
    ];

    if (window.userPosition != 5) {
        columns.push({
            title: "ACTION",
            field: "action",
            hozAlign: "left",
            formatter: "html",
            vertAlign: "middle"
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
<<<<<<< HEAD
        rowFormatter: function (dom) {
            var selectedRow = dom.getData();
            dom.getElement().classList.add("table-light");
        },
        columns: columns
    });
}

=======
        rowFormatter: function(dom) {
            var selectedRow = dom.getData();
            if (true) {
                dom.getElement().classList.add("table-light");
            } else if (selectedRow.safety_stock == selectedRow.qty) {
                dom.getElement().classList.add("table-warning");
            }
        },
        columns: [
            { title: "ADDED BY", field: "name", hozAlign: "left", vertAlign: "middle" },
            { title: "CATEGORY", field: "category", hozAlign: "left", vertAlign: "middle" },
            { title: "CATEGORY NAME", field: "name_category", hozAlign: "left", vertAlign: "middle" },
            { title: "PROGRAM", field: "program_id", hozAlign: "left", formatter: "html", vertAlign: "middle" },
            { title: "PROGRAM DETAILS", field: "program_dtls", hozAlign: "left", formatter: "html", vertAlign: "middle" },
            { title: "UNIVERSITY VENUE", field: "university", hozAlign: "left", formatter: "html", vertAlign: "middle" },
            { title: "SPONSORING AGENCY", field: "sponsoring", hozAlign: "left", formatter: "html", vertAlign: "middle" },
            { title: "DATE", field: "university", hozAlign: "left", formatter: "html", vertAlign: "middle" },
            { title: "ACTION", field: "action", hozAlign: "left", formatter: "html", vertAlign: "middle" },
        ]
    });
};
>>>>>>> 454afcf (updt-13)
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
    event.preventDefault(); // Prevent the default form submission
    var form = $('#accomplishment-form')[0];
    form.classList.add('was-validated');

    // Check if the form is valid
    if (!form.checkValidity()) {
        event.stopPropagation();
        return;
    }

    // Manually add the CSRF token from the meta tag
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    // Submit the form data via AJAX
    $.ajax({
        url: '/store-accomplishment', // The route to handle the form submission
        type: 'POST',
        data: $('#accomplishment-form').serialize(), // Serialize the form data
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
            $('#accomplishment-form')[0].reset(); // Reset the form
            form.classList.remove('was-validated'); // Reset validation state
            fetchaccomplishment(); // Refresh the table
        },
        error: function(xhr, status) {
            throwError(xhr, status);
        }
    });
});
function fetchaccomplishment() {
    $.ajax({
        url: '/fetch-accomplishment', // The route to fetch the data
        type: 'GET',
        success: function(response) {
            accomplishments.setData(response); // Update the table with the new data
        },
        error: function(xhr, status) {
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


document.addEventListener('DOMContentLoaded', function() {
    const categorySelect = document.getElementById('st_seminar_category');
    const facultyLabel = document.getElementById('faculty-label');

    categorySelect.addEventListener('change', function() {
        const selectedCategory = this.value;

        // Update the label based on the selected category
        switch (selectedCategory) {
            case 'Faculty':
                facultyLabel.textContent = 'Faculty';
                break;
            case 'Department':
                facultyLabel.textContent = 'Department';
                break;
            case 'College':
                facultyLabel.textContent = 'College';
                break;
            default:
                facultyLabel.textContent = 'Faculty'; // Default to Faculty if no category is selected
                break;
        }
    });
});