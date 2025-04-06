$(document).ready(function(){
    infrastractureTable();
    fetchInfrastractureTable();
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

const infrastractureTable = () => {
    infrastructures = new Tabulator("#infrastracture-table", {
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
            {title:"ADDED BY", field:"name", hozAlign:"left", vertAlign:"middle"},
            {title:"INFRASTRUCTURE", field:"infrastracture", hozAlign:"left", vertAlign:"middle"},
            {title:"STATUS", field:"status", hozAlign:"left", vertAlign:"middle"},
            {title:"ACTION", field:"action", hozAlign:"left", formatter:"html", vertAlign:"middle"},
        ]
    }); 
}

// function searchinfrastructures(value){
//     infrastructures.setFilter([
//         [
//             //{title:'NO', field: 'no'},
//             {field:"name", type:"like", value:value.trim()},
//             {field:"infrastracture", type:"like", value:value.trim()},
//             {field:"status", type:"like", value:value.trim()},
//         ]
//     ]);
// }
function searchinfrastructures(value) {
    let searchTerms = value.trim().toLowerCase().split(/\s+/);

    if (searchTerms.length === 0 || searchTerms[0] === "") {
        infrastructures.clearFilter();
        return;
    }

    infrastructures.setFilter(function(data) {
        let matches = true;

        searchTerms.forEach(term => {
            if (
                !data.name.toLowerCase().includes(term) &&
                !data.infrastracture.toLowerCase().includes(term) &&
                !data.status.toLowerCase().includes(term)
            ) {
                matches = false;
            }
        });

        return matches;
    });
}

$('#submit-infrastracture-btn').on('click', function(event) {
    var form = $('#infrastracture-form')[0];
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    }
    form.classList.add('was-validated');
    
    $.ajax({
        url: '/store-infrastructure-development',
        type: 'POST',
        data: $('#infrastracture-form').serialize(),
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
            $('#infrastracture-form')[0].reset();
            fetchInfrastractureTable();
      
        },
        error: function (xhr, status) {
            throwError(xhr, status);
        }
    });
});


function fetchInfrastractureTable(){
    $.ajax({
        url: '/fetch-infrastructure-development',
        type: 'GET',
        success: function(response) {
            // console.log(response);
            infrastructures.setData(response);
            
        },
        error: function (xhr, status) {
            console.log("Error:", xhr.responseText);
        }
    });
}

$(document).on('click', '#edit-infrastructure-btn', function(e) {
    var id = $(this).attr('data-id');
    $('#EditInfrastructureModal').attr('data-id', id);
    $('#EditInfrastructureModal').modal('show');
    $.ajax({
        url: '/view-infrastructure-development/' + id,
        type: 'GET',
        success: function(response) {
            $('#view_infrastracture').val(response.infrastracture); 
            $('#view_status').val(response.status);
            
        },
        error: function (xhr, status) {
            console.log("Error:", xhr.responseText);
        }
    });
});

$('#update-infrastructure-btn').click( function(e){
    var id = $('#EditInfrastructureModal').attr('data-id');
    var form = $('#view-infrastructure-form')[0];
    if (form.checkValidity() === false) {
        e.preventDefault();
        e.stopPropagation();
    }
    form.classList.add('was-validated');
    
    $.ajax({
        url: '/update-infrastructure-development/'+ id,
        type: 'POST',
        data: $('#view-infrastructure-form').serialize(),
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
            $('#EditInfrastructureModal').modal('hide');
            fetchInfrastractureTable();
        },
        error: function (xhr, status) {
            throwError(xhr, status);
        }
    });
});

$(document).on('click', '#remove-infrastructure-btn', function(){
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
                url: "/remove-infrastructure-development/"+id,
                type: 'POST',
                success: function (response) {
                    console.log('Success:', response);
                    Swal.fire({
                        title: "Success!",
                        text: response.message,
                        icon: "success"
                    });
                    fetchInfrastractureTable();
                },
                error: function (xhr, status) {
                    console.log('Error:', xhr);
                }
            });
        }
    });
});

$('#infrastructureCsvSemesterInput').change(function() {
    var semesterValue = $(this).val();
    document.getElementById('infrastructureCsvSemesterInput').value = semesterValue;
});

$('#default_school_year').change(function() {
    var yearValue = $(this).val();
    document.getElementById('infrastructureCsvYearInput').value = yearValue;
});