$(document).ready(function () {
    programTable();
    fetchPrograms();
    academicYearTable();
    fetchAcademicYear();
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

let programTable = () => {
    programs = new Tabulator("#program-table", {
        dataTree:true,
        dataTreeSelectPropagate:true,
        layout:"fitColumns",
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
            //{title:"ADDED BY", field:"name", hozAlign:"left", vertAlign:"middle"},
            {title:"PROGRAM", field:"program", hozAlign:"left", vertAlign:"middle"},
            {title:"ABBREVIATION", field:"abbreviation", hozAlign:"left", vertAlign:"middle"},
            {title:"ACTION", field:"action", hozAlign:"left", formatter:"html", vertAlign:"middle"},
        ]
    }); 
}

// function searchprogram(value){
//     programs.setFilter([
//         [
//             //{title:'NO', field: 'no'},
//             {field:"abbreviation", type:"like", value:value.trim()},
//             {field:"program", type:"like", value:value.trim()},
//         ]
//     ]);
// }
function searchprogram(value) {
    let searchTerms = value.trim().toLowerCase().split(/\s+/);

    if (searchTerms.length === 0 || searchTerms[0] === "") {
        programs.clearFilter();
        return;
    }

    programs.setFilter(function(data) {
        let matches = true;

        searchTerms.forEach(term => {
            if (
                !data.program.toLowerCase().includes(term) &&
                !data.abbreviation.toLowerCase().includes(term)
            ) {
                matches = false;
            }
        });

        return matches;
    });
}

$('#program-modal').click(function() {
    $('#AddProgramModal').modal('show');
});

$('#submit-program-btn').click(function(event) {
    var form = $('#program-form')[0];
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    }
    form.classList.add('was-validated');
    
    $.ajax({
        url: '/store-program',
        type: 'POST',
        data: $('#program-form').serialize(),
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
            $('#program-form')[0].reset();
            $('#AddProgramModal').modal('hide');
            fetchPrograms();
        },
        error: function (xhr, status) {
            throwError(xhr, status);
        }
    });
});

let fetchPrograms = () => {
    $.ajax({
        url: '/fetch-program',
        type: 'GET',
        success: function(response) {
            programs.setData(response);
        },
        error: function (xhr, status) {
            throwError(xhr, status);
        }
    });
}

$(document).on('click', '#edit-program-btn', function(){
    var id = $(this).attr('data-id');
    $('#EditProgramModal').modal('show');
    $('#EditProgramModal').attr('data-id', id);

    $.ajax({
        url: '/view-program/' + id,
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            $('#view_program').val(response.program);
            $('#view_abbreviation').val(response.abbreviation);
        },
    });
});

$('#update-program-btn').click(function(event) {
    var id = $('#EditProgramModal').attr('data-id');
    var form = $('#view-program-form')[0];
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    }
    form.classList.add('was-validated');
    
    $.ajax({
        url: '/update-program/' + id,
        type: 'POST',
        data: $('#view-program-form').serialize(),
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
            $('#program-form')[0].reset();
            $('#EditProgramModal').modal('hide');
            fetchPrograms();
        },
        error: function (xhr, status) {
            throwError(xhr, status);
        }
    });
});

$(document).on('click', '#remove-program-btn', function(){
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
                url: "/remove-program/"+id,
                type: 'POST',
                success: function (response) {
                    console.log('Success:', response);
                    Swal.fire({
                        title: "Success!",
                        text: response.message,
                        icon: "success"
                    });
                    fetchPrograms();
                },
                error: function (xhr, status) {
                    console.log('Error:', xhr);
                }
            });
        }
    });
}); 


let academicYearTable = () => {
    academic_years = new Tabulator("#academic-year-table", {
        dataTree:true,
        dataTreeSelectPropagate:true,
        layout:"fitColumns",
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
            {title:"ACADEMIC YEAR", field:"academic_year", hozAlign:"left", vertAlign:"middle"},
            {title:"ACTION", field:"action", hozAlign:"left", formatter:"html", vertAlign:"middle"},
        ]
    }); 
}

$('#submit-academic-year').click(function(event){
    var form = $('#academic-year-form')[0];
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    }
    form.classList.add('was-validated');
    
    $.ajax({
        url: '/store-academic-year',
        type: 'POST',
        data: $('#academic-year-form').serialize(),
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
            $('#academic-year-form')[0].reset();
            fetchAcademicYear();
        },
        error: function (xhr, status) {
            throwError(xhr, status);
        }
    });
});

let fetchAcademicYear = () => {
    $.ajax({
        url: '/fetch-academic-year',
        type: 'GET',
        success: function(response) {
            academic_years.setData(response);
        },
        error: function (xhr, status) {
            throwError(xhr, status);
        }
    });
}

$(document).on('click', '#remove-academic-year-btn', function(){
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
                url: "/remove-academic-year/"+id,
                type: 'POST',
                success: function (response) {
                    console.log('Success:', response);
                    Swal.fire({
                        title: "Success!",
                        text: response.message,
                        icon: "success"
                    });
                    fetchAcademicYear();
                },
                error: function (xhr, status) {
                    console.log('Error:', xhr);
                }
            });
        }
    });
})

$('#submit-default-acad').on('click', function(event) {
    var form = $('#default_acad_form')[0];
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    }
    form.classList.add('was-validated');
    
    $.ajax({
        headers:{
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        url: '/store-default-academic-year-semester',
        type: 'POST',
        data: $('#default_acad_form').serialize(),
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
            $('#default_acad_form')[0].reset();
        },
        error: function (xhr, status) {
            throwError(xhr, status);
        }
    });
});

//Default
$(document).ready(function () {
    $.ajax({
        url: '/get-default-academic-year',
        method: 'GET',
        dataType: 'json',
        success: function (response) {
            let defaultAcademicYear = response.academic_year;
            let defaultSemester = response.semester;
            
            $('.default-text').text(defaultAcademicYear + ' of ' + defaultSemester);
            
            enroleesAnnualReport(defaultAcademicYear, defaultSemester);
        },
        error: function () {
            console.error('Failed to fetch default academic year and semester.');
        }
    });
});
//Academic Year
$(document).ready(function () {
    $.ajax({
        url: '/get-default-academic-year',
        method: 'GET',
        dataType: 'json',
        success: function (response) {
            let defaultAcademicYear = response.academic_year;
            
            $('.academic-year-default-text').text(defaultAcademicYear);
            
            enroleesAnnualReport(defaultAcademicYear);
        },
        error: function () {
            console.error('Failed to fetch default academic year and semester.');
        }
    });
});
//Semester
$(document).ready(function () {
    $.ajax({
        url: '/get-default-academic-year',
        method: 'GET',
        dataType: 'json',
        success: function (response) {
            let defaultSemester = response.semester;
            
            $('.semester-default-text').text(defaultSemester);
            
            enroleesAnnualReport(defaultSemester);
        },
        error: function () {
            console.error('Failed to fetch default academic year and semester.');
        }
    });
});

//Default Select
