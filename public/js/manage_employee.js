$(document).ready(function () {
    employeeTable();
    getEmployees();
});
const employeeTable = () => {
    manageEmployee = new Tabulator("#employee-table", {
        dataTree:true,
        dataTreeSelectPropagate:true,
        layout:"fitColumns",
        maxHeight: "1000px",
        scrollToColumnPosition: "center",
        pagination:"local",
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
            {title:"NO", field:"no", hozAlign:"center",width:75, vertAlign:"middle"},
            {title:"EMPLOYEE ID", field:"employee_id", hozAlign:"left", vertAlign:"middle"},
            {title:"FULLNAME", field:"name", hozAlign:"left", vertAlign:"middle"},
            {title:"EMAIL", field:"email", hozAlign:"left", vertAlign:"middle"},
            {title:"DEPARTMENT", field:"department", hozAlign:"left", vertAlign:"middle"},
            {title:"POSITION", field:"position", hozAlign:"left", vertAlign:"middle"},
            {title:"STATUS", field:"status", hozAlign:"left", formatter:"html", vertAlign:"middle"},
            {title:"ACTION", field:"action", hozAlign:"left", formatter:"html", vertAlign:"middle"},
        ]
    }); 
}

function searchEmployee(value){
    manageEmployee.setFilter([
        [
            {title:'NO', field: 'no'},
            {field:"employee_id", type:"like", value:value.trim()},
            {field:"status", type:"like", value:value.trim()},
            {field:"position", type:"like", value:value.trim()},
            {field:"email", type:"like", value:value.trim()},
        ]
    ]);
}

$('.submit-employee-btn').click(function(){
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        url: "/store-employee",
        type: 'POST',
        data: $('#employee_form').serialize(),
        success: function (response) {
            console.log('Success:', response);
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
            getEmployees();
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
});

$(document).on('click', '.edit-btn', function(){
    var id = $(this).attr('data-id');
    $('#EditEmployee').attr('data-id', id);
    $('#EditEmployee').modal('show');
    $.ajax({
        url: 'edit-employee/' + id,
        method: 'GET',
        dataType: 'json',
        success: function (response) {
            console.log("gg");
            $('#firstname').val(response.firstname);
            $('#lastname').val(response.lastname);
            $('#email').val(response.email);
            $('#position').val(response.position);
            $('#department').val(response.department);
        },
        error: function (xhr, status) {
            console.log('Error:', xhr);
        }
    });
});

$('#update-btn').click(function(){
    var id = $('#EditEmployee').attr('data-id');
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, update it!"
      }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                url: "/update-employee/" + id,
                type: 'POST',
                data: $('#edit_employee_form').serialize(),
                success: function (response) {
                    console.log('Success:', response);
                    Swal.fire({
                        title: "Success!",
                        text: response.message,
                        icon: "success"
                    });
                    getEmployees();
                    $('#EditEmployee').modal('hide');
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

const getEmployees = () =>{
    $.ajax({
        url: "/get-employees",
        type: 'GET',
        success: function (response) {
            manageEmployee.setData(response);
        },
        error: function (xhr, status) {
            console.log('Error:', xhr);
        }
    });
}

$(document).on('click', '.activate-btn', function(){
    var id = $(this).attr('data-id');
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, activate it!"
      }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: "/activate-employee/"+id,
                type: 'GET',
                success: function (response) {
                    console.log('Success:', response);
                    Swal.fire({
                        title: "Success!",
                        text: response.message,
                        icon: "success"
                    });
                    getEmployees();
                },
                error: function (xhr, status) {
                    console.log('Error:', xhr);
                }
            });
        }
    });
});

$(document).on('click', '.deactivate-btn', function(){
    var id = $(this).attr('data-id');
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, deactivate it!"
      }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: "/deactivate-employee/"+id,
                type: 'GET',
                success: function (response) {
                    console.log('Success:', response);
                    Swal.fire({
                        title: "Success!",
                        text: response.message,
                        icon: "success"
                    });
                    getEmployees();
                },
                error: function (xhr, status) {
                    console.log('Error:', xhr);
                }
            });
        }
    });
});  




