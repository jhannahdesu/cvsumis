$(document).ready(function () {
    rolesTable();
    fetchRoles();
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

const loadingSwal = () => {
    return Swal.fire({
        title: 'Sending...',
        text: 'Please wait while we send the password in the email.',
        allowEscapeKey: false,
        allowOutsideClick: false,
        onOpen: () => {
            Swal.showLoading(); // Show loading spinner
        }
    });
};

// function searcRoles(value){
//     roles.setFilter([
//         [
//             //{title:'NO', field: 'no'},
//             {field:"name", type:"like", value:value.trim()},
//             {field:"position", type:"like", value:value.trim()},
//             {field:"employee_number", type:"like", value:value.trim()},
//         ]
//     ]);
    
// }

function searcRoles(value) {
    let searchTerms = value.trim().toLowerCase().split(/\s+/);

    if (searchTerms.length === 0 || searchTerms[0] === "") {
        roles.clearFilter();
        return;
    }

    roles.setFilter(function(data) {
        let matches = true;

        searchTerms.forEach(term => {
            if (
                //!data.no.toString().toLowerCase().includes(term) &&
                !data.name.toLowerCase().includes(term) &&
                !data.position.toLowerCase().includes(term) &&
                !data.employee_number.toLowerCase().includes(term)
            ) {
                matches = false;
            }
        });

        return matches;
    });
}

const rolesTable = () => {
    roles = new Tabulator("#roles-table", {
        dataTree: true,
        dataTreeSelectPropagate: true,
        layout: "fitColumns",
        maxHeight: "1000px",
        scrollToColumnPosition: "center",
        pagination: "local",
        paginationSize: 10,
        paginationSizeSelector: [10, 50, 100],
        selectable: 1,
        rowFormatter: function (dom) {
            const data = dom.getData();
            const statusText = data.status?.replace(/<[^>]*>/g, '').trim().toLowerCase();

            if (statusText === "inactive") {
                dom.getElement().classList.add("table-warning"); // yellow background for inactive
            } else {
                dom.getElement().classList.add("table-light"); // default for active
            }
        },
        columns: [
            { title: "EMPLOYEE ID", 
                titleFormatter: () => `
                <div style="line-height: 2.5;">
                    <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                        EMPLOYEE ID
                    </strong>
                </div>`,
                field: "employee_number",
                headerHozAlign: "center",
                headerSort: false,
                hozAlign: "center",
                vertAlign: "middle",
            },
            { title: "FULLNAME", 
                titleFormatter: () => `
                <div style="line-height: 2.5;">
                    <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                        FULLNAME
                    </strong>
                </div>`,
                field: "name",
                headerHozAlign: "center",
                headerSort: false,
                hozAlign: "center",
                vertAlign: "middle",
            },
            { title: "POSITION", 
                titleFormatter: () => `
                <div style="line-height: 2.5;">
                    <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                        POSITION
                    </strong>
                </div>`,
                field: "position", 
                headerHozAlign: "center",
                headerSort: false,
                hozAlign: "center",
                vertAlign: "middle",
            },
            { title: "STATUS",
                titleFormatter: () => `
                <div style="line-height: 2.5;">
                    <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                        STATUS
                    </strong>
                </div>`,
                field: "status",
                headerHozAlign: "center",
                headerSort: false,
                hozAlign: "center",
                vertAlign: "middle",
                formatter: "html", 
            },
            { title: "ACTION", 
                titleFormatter: () => `
                <div style="line-height: 2.5;">
                    <strong style="background: linear-gradient(45deg, rgb(254, 160, 37), rgb(255, 186, 96)); -webkit-background-clip: text; color: transparent;">
                        ACTION
                    </strong>
                </div>`,
                field: "action", 
                formatter: "html", 
                headerHozAlign: "center",
                headerSort: false,
                hozAlign: "center",
                vertAlign: "middle",
            },
            
        ]
    });

    // Default filter: show only Active users on load
    roles.setFilter((data) => {
        const cleanStatus = data.status?.replace(/<[^>]*>/g, '').trim().toLowerCase();
        return cleanStatus === "active";
    });

    // Default dropdown value if applicable
    const statusDropdown = document.getElementById('statusFilter');
    if (statusDropdown) {
        statusDropdown.value = "Active";
        statusDropdown.addEventListener('change', function () {
            const selected = this.value.toLowerCase();
            if (selected === "active" || selected === "inactive") {
                roles.setFilter((data) => {
                    const clean = data.status?.replace(/<[^>]*>/g, '').trim().toLowerCase();
                    return clean === selected;
                });
            } else {
                roles.clearFilter(true);
                roles.setSort("status", "dsc");
            }
        });
    }
};

function fetchRoles(){
    $.ajax({
        url: '/fetch-roles-access',
        type: 'GET',
        success: function(response) {
            // console.log(response);
            roles.setData(response);
            
        },
        error: function (xhr, status) {
            console.log("Error:", xhr.responseText);
        }
    });
}

$('#add-user-modal').click(function(){
    $('#AddAccountModal').modal('show');
});

$('#submit-user-btn').on('click', function(event) {
    var form = $('#add-user-form')[0];
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    }
    form.classList.add('was-validated');
    const loadingAlert = loadingSwal(); // Create the loading Swal instance
    $.ajax({
        url: '/store-user',
        type: 'POST',
        data: $('#add-user-form').serialize(),
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
            loadingAlert.close();
            $('#add-user-form')[0].reset();
            $('#AddAccountModal').modal('hide');
            fetchRoles();
        },
        error: function (xhr, status) {
            loadingAlert.close();
            throwError(xhr, status);
        }
    });
})

$(document).on('click', '#edit-user-modal', function(){
    $('#EditAccountModal').modal('show');
    var id = $(this).attr('data-id');
    $('#EditAccountModal').attr('data-id', id);
    $.ajax({
        url: '/view-user/'+ id,
        type: 'GET',
        success: function(response) {
            // console.log(response);
            $('#view_position').val(response.position);
            $('#view_firstname').val(response.firstname);
            $('#view_middlename').val(response.middlename);
            $('#view_lastname').val(response.lastname);
            $('#view_department').val(response.department);
            $('#view_email').val(response.email);
        },
        error: function (xhr, status) {
            console.log("Error:", xhr.responseText);
        }
    })
});

$('#update-user-btn').click(function (event) {
    var id = $('#EditAccountModal').attr('data-id');
    var form = $('#add-user-form')[0];
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    }
    form.classList.add('was-validated');
    $.ajax({
        url: '/update-user/' + id,
        type: 'POST',
        data: $('#update-user-form').serialize(),
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
            $('#update-user-form')[0].reset();
            $('#EditAccountModal').modal('hide');
            fetchRoles();
        },
        error: function (xhr, status) {
            throwError(xhr, status);
        }
    });
});

$(document).on('click', '#deactivate-user-btn', function(){
    var id = $(this).attr('data-id');
    Swal.fire({
        title: "Are you sure?",
        text: "This account will be deactivated.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, deactivate it!"
      }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                headers:{
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                url: '/deactivate-user/' + id,
                type: 'POST',
                dataType: 'json',
                success: function(response) {
                    Swal.fire({
                        title: "Success!",
                        text: response.message,
                        icon: "success"
                    });
                    fetchRoles();
                },
                error: function (xhr, status) {
                    throwError(xhr, status);
                }   
            });
        }
    });
});

$(document).on('click', '#activate-user-btn', function(){
    var id = $(this).attr('data-id');
    Swal.fire({
        title: "Are you sure?",
        text: "This account will be activated.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, activate it!"
      }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                headers:{
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                url: '/activate-user/' + id,
                type: 'POST',
                dataType: 'json',
                success: function(response) {
                    Swal.fire({
                        title: "Success!",
                        text: response.message,
                        icon: "success"
                    });
                    fetchRoles();
                },
                error: function (xhr, status) {
                    throwError(xhr, status);
                }   
            });
        }
    });
});

$('#submit-user-btn').click(function () {
    let form = $('#add-user-form');
    if (form[0].checkValidity()) {
        let data = {
            firstname: $('#firstname').val(),
            middlename: $('#middlename').val(),
            lastname: $('#lastname').val(),
            email: $('#email').val(),
            department: $('#department').val(),
            position: $('#position').val(),
            _token: $('input[name="_token"]').val()
        };

        $.ajax({
            url: '{{ route("your-user-create-route") }}', // Palitan ng tamang route
            type: 'POST',
            data: data,
            success: function (response) {
                Swal.fire('Success', 'Account created!', 'success');
                $('#AddAccountModal').modal('hide');
                form[0].reset();
            },
            error: function (xhr) {
                Swal.fire('Error', 'Something went wrong.', 'error');
            }
        });
    } else {
        form.addClass('was-validated');
    }
});

const researcherInput = document.getElementById('researcher-input');
if (researcherInput) {
    researcherInput.addEventListener('input', function() {
        // Allow letters, spaces, commas, and periods
        this.value = this.value.replace(/[^A-Za-z\s.,]/g, '');
    });
}
