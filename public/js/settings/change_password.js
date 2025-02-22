
function throwError(xhr, status) {
    try {
        var response = JSON.parse(xhr.responseText); // Attempt to parse the JSON response
    } catch (e) {
        // If parsing fails, log the error and show a notification
        console.error("Could not parse JSON response:", e);
        Toastify({
            text: "An unexpected error occurred. Please try again.", // User-friendly message
            duration: 3000, // Duration for the toast notification
            gravity: "top", // Position of the toast
            position: "right", // Position of the toast
            style: {
                background: "linear-gradient(to right, #ff0000, #ff7f50)", // Background style
            }
        }).showToast();
        return; // Exit the function
    }

    // Proceed to handle validation errors if they exist
    if (response.errors) {
        Object.keys(response.errors).forEach(key => {
            Toastify({
                text: response.errors[key], // Show individual error messages
                duration: 3000,
                gravity: "top",
                position: "right",
                style: {
                    background: "linear-gradient(to right, #ff0000, #ff7f50)",
                }
            }).showToast();
            console.log("Error key:", key); // Debug log for the error key
            console.log("Error message:", response.errors[key]); // Debug log for the error message
        });
    }
}


$('#update-password-btn').click(function(event) {
    var form = $('#change-password-form')[0];
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    }
    form.classList.add('was-validated');
    $.ajax({
        url: '/update-password',
        type: 'POST',
        data: $('#change-password-form').serialize(),
        dataType: 'json',
        success: function(response) {
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
            $('#change-password-form')[0].reset();

        },
        error: function (xhr, status) {
            console.error("Error response:", xhr.responseText);
            throwError(xhr, status);
        }
    });
})