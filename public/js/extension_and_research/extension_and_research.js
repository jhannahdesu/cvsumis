$(document).ready(function() {
    universityResearchTable();
    fetchuniversityResearch();

    extensionActvitieTable();
    fetchExtensionActivity();
    $('#agency-input').prop('hidden', true);
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

let universityResearchTable = () => {
    let columns = [
        { title: "ADDED BY", field: "name", hozAlign: "left", vertAlign: "middle" },
        { title: "AGENCY", field: "agency", hozAlign: "left", vertAlign: "middle" },
        { title: "TITLE", field: "title", hozAlign: "left", vertAlign: "middle" },
        { title: "RESEARCHER", field: "researcher", hozAlign: "left", vertAlign: "middle" },
        { title: "STATUS", field: "status_details", hozAlign: "left", formatter: "html", vertAlign: "middle" },
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

    universityResearchs = new Tabulator("#university-research-table", {
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


// function searchuniversityResearchs(value){
//     universityResearchs.setFilter([
//         [
//             //{title:'NO', field: 'no'},
//             {field:"name", type:"like", value:value.trim()},
//             {field:"agency", type:"like", value:value.trim()},
//             {field:"title", type:"like", value:value.trim()},
//             {field:"researcher", type:"like", value:value.trim()},
//         ]
//     ]);
// }
function searchuniversityResearchs(value) {
    let searchTerms = value.trim().toLowerCase().split(/\s+/);

    if (searchTerms.length === 0 || searchTerms[0] === "") {
        universityResearchs.clearFilter();
        return;
    }

    universityResearchs.setFilter(function(data) {
        let matches = true;

        searchTerms.forEach(term => {
            if (
                !data.name.toLowerCase().includes(term) &&
                !data.agency.toLowerCase().includes(term) &&
                !data.title.toLowerCase().includes(term) &&
                !data.researcher.toLowerCase().includes(term)
            ) {
                matches = false;
            }
        });

        return matches;
    });
}


$('#university-research-modal').click( function() {
   $('#UniversityResearchModal').modal('show'); 
});

$('#outside-agency').click(function() {
    if ($(this).is(':checked')) {
        $('#agency-input').prop('hidden', false);
    } else {
        $('#agency-input').prop('hidden', true);
    }
});

$('#view-outside-agency').click(function() {
    if ($(this).is(':checked')) {
        $('#view-agency-input').prop('hidden', false);
    } else {
        $('#view-agency-input').prop('hidden', true);
    }
});

$('#submit-university-research-btn').click( function() {
    var form = $('#university-research-form')[0];
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    }
    form.classList.add('was-validated');
    
    $.ajax({
        url: '/store-university-research',
        type: 'POST',
        data: $('#university-research-form').serialize(),
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
            $('#university-research-form')[0].reset();
            $('#UniversityResearchModal').modal('hide');
            fetchuniversityResearch();
        },
        error: function (xhr, status) {
            throwError(xhr, status);
        }
    });
});

//fetch-university-research

function fetchuniversityResearch(){
    $.ajax({
        url: '/fetch-university-research',
        type: 'GET',
        success: function(response) {
            // console.log(response);
            universityResearchs.setData(response);
            
        },
        error: function (xhr, status) {
            console.log("Error:", xhr.responseText);
        }
    });
}

$(document).on('click', '#edit-university-research-btn', function(e) {
    var id = $(this).attr('data-id');
    $('#EditUniversityResearchModal').attr('data-id', id);
    $('#EditUniversityResearchModal').modal('show');
    $.ajax({
        url: '/view-university-research/' + id,
        type: 'GET',
        success: function(response) {
            if(response.agency == null){
                $('#view-agency-input').prop('hidden', true);
            }else{
                $('#view-agency-input').prop('hidden', false);
            }
            $('#view_title').val(response.title); 
            $('#view_researcher').val(response.researcher);
            $('#view_status').val(response.status);
            $('#view_year').val(response.year);
            $('#view_budget').val(response.budget);
            $('#view_agency').val(response.agency);
        },
        error: function (xhr, status) {
            console.log("Error:", xhr.responseText);
        }
    });
});

$('#update-university-research-btn').click( function() {
    var id = $('#EditUniversityResearchModal').attr('data-id');
    var form = $('#view-university-research-form')[0];
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    }
    form.classList.add('was-validated');
    
    $.ajax({
        url: '/update-university-research/' + id,
        type: 'POST',
        data: $('#view-university-research-form').serialize(),
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
            $('#EditUniversityResearchModal').modal('hide');
            fetchuniversityResearch();
        },
        error: function (xhr, status) {
            throwError(xhr, status);
        }
    });
});

$(document).on('click', '#remove-university-research-btn', function(){
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
                url: "/remove-university-research/"+id,
                type: 'POST',
                success: function (response) {
                    console.log('Success:', response);
                    Swal.fire({
                        title: "Success!",
                        text: response.message,
                        icon: "success"
                    });
                    fetchuniversityResearch();
                },
                error: function (xhr, status) {
                    console.log('Error:', xhr);
                }
            });
        }
    });
}); 


let extensionActvitieTable = () => {
    let columns = [
        { title: "ADDED BY", field: "name", hozAlign: "left", vertAlign: "middle" },
        { title: "EXTENSION ACTIVITY", field: "extension_activity", formatter: "html", hozAlign: "left", vertAlign: "middle" },
        { title: "EXTENSIONIST", field: "extensionist", hozAlign: "left", vertAlign: "middle" },
        { title: "NO. OF BENEFICIARIES", field: "number_of_beneficiaries", hozAlign: "left", vertAlign: "middle" },
        { title: "PARTNER AGENCY", field: "partner_agency", hozAlign: "left", vertAlign: "middle" },
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

    extensionActvities = new Tabulator("#extension-activity-table", {
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


// function searchextensionActvities(value){
//     extensionActvities.setFilter([
//         [
//             //{title:'NO', field: 'no'},
//             {field:"name", type:"like", value:value.trim()},
//             {field:"extension_activity", type:"like", value:value.trim()},
//             {field:"partner_agency", type:"like", value:value.trim()},
//             {field:"extensionist", type:"like", value:value.trim()},
//         ]
//     ]);
// }
function searchextensionActvities(value) {
    let searchTerms = value.trim().toLowerCase().split(/\s+/);

    if (searchTerms.length === 0 || searchTerms[0] === "") {
        extensionActvities.clearFilter();
        return;
    }

    extensionActvities.setFilter(function(data) {
        let matches = true;

        searchTerms.forEach(term => {
            if (
                !data.name.toLowerCase().includes(term) &&
                !data.extension_activity.toLowerCase().includes(term) &&
                !data.partner_agency.toLowerCase().includes(term) &&
                !data.extensionist.toLowerCase().includes(term)
            ) {
                matches = false;
            }
        });

        return matches;
    });
}

$('#extension-activity-modal').click(function () {
    $('#ExtensionActivityModal').modal('show');
});

$('#submit-extension-activity-btn').click(function () {
    var form = $('#extension-activity-form')[0];
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    }
    form.classList.add('was-validated');
    
    $.ajax({
        url: '/store-extension-activity',
        type: 'POST',
        data: $('#extension-activity-form').serialize(),
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
            $('#extension-activity-form')[0].reset();
            $('#ExtensionActivityModal').modal('hide');
            fetchExtensionActivity();
        },
        error: function (xhr, status) {
            throwError(xhr, status);
        }
    });
});

function fetchExtensionActivity(){
    $.ajax({
        url: '/fetch-extension-activity',
        type: 'GET',
        success: function(response) {
            // console.log(response);
            extensionActvities.setData(response);
            
        },
        error: function (xhr, status) {
            console.log("Error:", xhr.responseText);
        }
    });
}

$(document).on('click', '#edit-extension-activity-btn', function(e) {
    var id = $(this).attr('data-id');
    $('#EditExtensionActivityModal').attr('data-id', id);
    $('#EditExtensionActivityModal').modal('show');
    $.ajax({
        url: '/view-extension-activity/' + id,
        type: 'GET',
        success: function(response) {
            $('#view_extension_activity').val(response.extension_activity); 
            $('#view_extensionist').val(response.extensionist);
            $('#view_number_of_beneficiaries').val(response.number_of_beneficiaries);
            $('#view_partner_agency').val(response.partner_agency);
            $('#view_activity_date').val(response.activity_date);
            $('#view_program_id').val(response.program_id);
        },
        error: function (xhr, status) {
            console.log("Error:", xhr.responseText);
        }
    });
});

$('#update-extension-activity-btn').click(function () {
    var id = $('#EditExtensionActivityModal').attr('data-id');
    var form = $('#view-extension-activity-form')[0];
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    }
    form.classList.add('was-validated');
    
    $.ajax({
        url: '/update-extension-activity/' + id, 
        type: 'POST',
        data: $('#view-extension-activity-form').serialize(),
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
            $('#EditExtensionActivityModal').modal('hide');
            fetchExtensionActivity();
        },
        error: function (xhr, status) {
            throwError(xhr, status);
        }
    });
});

$(document).on('click', '#remove-extension-activity-btn', function(){
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
                url: "/remove-extension-activity/"+id,
                type: 'POST',
                success: function (response) {
                    console.log('Success:', response);
                    Swal.fire({
                        title: "Success!",
                        text: response.message,
                        icon: "success"
                    });
                    fetchExtensionActivity();
                },
                error: function (xhr, status) {
                    console.log('Error:', xhr);
                }
            });
        }
    });
}); 

$('#universityResearchCsvSemesterInput').change(function() {
    var semesterValue = $(this).val();
    document.getElementById('universityResearchCsvSemesterInput').value = semesterValue;
});

$('#default_school_year').change(function() {
    var yearValue = $(this).val();
    document.getElementById('universityResearchCsvYearInput').value = yearValue;
});

$('#extensionActivityCsvSemesterInput').change(function() {
    var semesterValue = $(this).val();
    document.getElementById('extensionActivityCsvSemesterInput').value = semesterValue;
});

$('#default_school_year').change(function() {
    var yearValue = $(this).val();
    document.getElementById('extensionActivityCsvYearInput').value = yearValue;
});