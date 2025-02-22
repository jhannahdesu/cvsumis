$(document).ready(function() {
   
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
        text: 'Please wait while we send the link in your email.',
        allowEscapeKey: false,
        allowOutsideClick: false,
        showConfirmButton: false, 
        didOpen: () => {
            Swal.showLoading(); 
        }
    });
};

$('#reset-password-btn').click( function(event) {
    event.preventDefault();
    var form = $('#reset-password-form')[0]; // Get the form element
    var email = $('#email').val(); // Get the email value

    if (form.checkValidity() === false) { // Validate the entire form
        form.classList.add('was-validated'); // Apply Bootstrap validation styling
        return; // Exit if form is invalid
    }

    const loadingAlert = loadingSwal(); // Create the loading Swal instance

    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        url: '/reset-password',
        type: 'POST',
        data: {email : email},
        dataType: 'json',
        success: function(response) {
            console.log(response);
            loadingAlert.close(); // Close loading Swal
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
        },
        error: function (xhr, status) {
            loadingAlert.close(); // Close loading Swal
            throwError(xhr, status);
        }
    });
});