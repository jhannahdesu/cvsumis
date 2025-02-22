
let user_id;
$(document).ready(function() {
    var urlPath = window.location.pathname;
    user_id = urlPath.split("/").pop(); // Get the last segment of the URL

});

$('#reset-password-btn').click( function(event) {
    event.preventDefault();
    var form = $('#reset-password-form')[0]; // Get the form element

    if (form.checkValidity() === false) { // Validate the entire form
        form.classList.add('was-validated'); // Apply Bootstrap validation styling
        return; // Exit if form is invalid
    }
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        url: '/update-new-password/' + user_id,
        type: 'POST',
        data: $('#reset-password-form').serialize(),
        dataType: 'json',
        success: function(response) {
            console.log(response);
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });

            setTimeout(function() {
                window.location.href = '/login';
            }, 2000);
        },
        error: function (xhr, status) {
            throwError(xhr, status);
        }
    });
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