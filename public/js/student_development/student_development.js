$(document).ready(function() {
    organizationTable();
    fetchStudentOrgranization();
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

let organizationTable = () => {
    let columns = [
        { title: "ADDED BY", field: "name", hozAlign: "left", vertAlign: "middle" },
        { title: "ORGANIZATION ABBREVIATION", field: "org_abbrev", hozAlign: "left", vertAlign: "middle" },
        { title: "ORGANIZATION NAME", field: "org_name", hozAlign: "left", vertAlign: "middle" },
        { title: "PROGRAM", field: "program_abbrev", hozAlign: "left", vertAlign: "middle" },
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

    organizations = new Tabulator("#organization-table", {
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
        rowFormatter: function (dom) {
            var selectedRow = dom.getData();
            dom.getElement().classList.add("table-light");
        },
        columns: columns
    });
}




// function searchorganizations(value){
//     organizations.setFilter([
//         [
//             //{title:'NO', field: 'no'},
//             {field:"name", type:"like", value:value.trim()},
//             {field:"org_abbrev", type:"like", value:value.trim()},
//         ]
//     ]);
// }
function searchorganizations(value) {
    let searchTerms = value.trim().toLowerCase().split(/\s+/);

    if (searchTerms.length === 0 || searchTerms[0] === "") {
        organizations.clearFilter();
        return;
    }

    organizations.setFilter(function(data) {
        let matches = true;

        searchTerms.forEach(term => {
            if (
                !data.name.toLowerCase().includes(term) &&
                !data.org_abbrev.toLowerCase().includes(term) &&
                !data.org_name.toLowerCase().includes(term) &&
                !data.program_abbrev.toLowerCase().includes(term)
            ) {
                matches = false;
            }
        });

        return matches;
    });
}


$('#submit-organization-btn').on('click', function(event) {
    var form = $('#organization-form')[0];
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    }
    form.classList.add('was-validated');
    
    $.ajax({
        url: '/store-student-development',
        type: 'POST',
        data: $('#organization-form').serialize(),
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
            $('#organization-form')[0].reset();
            fetchStudentOrgranization();
        },
        error: function (xhr, status) {
            throwError(xhr, status);
        }
    });
});

function fetchStudentOrgranization(){
    $.ajax({
        url: '/fetch-student-development',
        type: 'GET',
        success: function(response) {
            // console.log(response);
            organizations.setData(response);
            
        },
        error: function (xhr, status) {
            console.log("Error:", xhr.responseText);
        }
    });
}

$(document).on('click','#edit-organization-btn', function(event){
    $('#EditOrganizationModal').modal('show');
    var id = $(this).attr('data-id');
    $('#EditOrganizationModal').attr('data-id', id);
    $.ajax({
        url: '/view-student-development/' + id,
        type: 'GET',
        success: function(response) {
            $('#view_org_abbrev').val(response.org_abbrev);
            $('#view_program_abbrev').val(response.program_abbrev);
            $('#view_org_name').val(response.org_name);

        },
    });
});

$('#update-organization-btn').on('click', function(event) {
    var id = $('#EditOrganizationModal').attr('data-id');
    var form = $('#view-organization-form')[0];
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    }
    form.classList.add('was-validated');
    
    $.ajax({
        url: '/update-student-development/' + id,
        type: 'POST',
        data: $('#view-organization-form').serialize(),
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
            $('#EditOrganizationModal').modal('hide');
            fetchStudentOrgranization();
        },
        error: function (xhr, status) {
            throwError(xhr, status);
        }
    });
});


$(document).on('click', '#remove-organization-btn', function(){
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
                url: "/remove-student-development/"+id,
                type: 'POST',
                success: function (response) {
                    console.log('Success:', response);
                    Swal.fire({
                        title: "Success!",
                        text: response.message,
                        icon: "success"
                    });
                    fetchStudentOrgranization();
                },
                error: function (xhr, status) {
                    console.log('Error:', xhr);
                }
            });
        }
    });
});

$('#studentDevelopmentCsvSemesterInput').change(function() {
    var semesterValue = $(this).val();
    document.getElementById('studentDevelopmentCsvSemesterInput').value = semesterValue;
});

$('#default_school_year').change(function() {
    var yearValue = $(this).val();
    document.getElementById('studentDevelopmentCsvYearInput').value = yearValue;
});