function isStrongPassword(password) {
    const minLength = 12;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasSpecialChar = /[\W_]/.test(password);
    return password.length >= minLength && hasUpperCase && hasLowerCase && hasSpecialChar;
}

// Real-time password validation
$('#new_password').on('input', function () {
    const password = $(this).val();
    if (isStrongPassword(password)) {
        $(this).removeClass('is-invalid').addClass('is-valid');
        $('#new_password_feedback').text('');
    } else {
        $(this).removeClass('is-valid').addClass('is-invalid');
        $('#new_password_feedback').text('Password must meet the requirements.');
    }
    $('#new_password_confirmation').trigger('input');
});

$('#new_password_confirmation').on('input', function () {
    const password = $('#new_password').val();
    const confirmPassword = $(this).val();
    if (password === confirmPassword && isStrongPassword(password)) {
        $(this).removeClass('is-invalid').addClass('is-valid');
        $('#confirm_password_feedback').text('');
    } else {
        $(this).removeClass('is-valid').addClass('is-invalid');
        $('#confirm_password_feedback').text('Passwords do not match.');
    }
});

// Submit handler
$('#update-password-btn').on('click', function () {
    const form = $('#change-password-form');
    const newPassword = $('#new_password').val();
    const confirmPassword = $('#new_password_confirmation').val();
    const currentPassword = $('#current_password').val();

    let valid = true;

    if (!isStrongPassword(newPassword)) {
        $('#new_password').addClass('is-invalid');
        valid = false;
    }

    if (newPassword !== confirmPassword) {
        $('#new_password_confirmation').addClass('is-invalid');
        valid = false;
    }

    if (!valid) {
        return;
    }

    $.ajax({
        url: changePasswordRoute,
        method: 'POST',
        data: form.serialize(),
        success: function (response) {
            Swal.fire({
                icon: 'success',
                title: 'Password Updated!',
                text: response.message,
                timer: 2000,
                showConfirmButton: false
            }).then(() => {
                window.location.href = redirectRoute;
            });
            form[0].reset();
            $('.form-control').removeClass('is-valid is-invalid');
        },
        error: function (xhr) {
            const errors = xhr.responseJSON.errors;
            $('.form-control').removeClass('is-invalid');

            if (errors) {
                Object.keys(errors).forEach(function (key) {
                    const input = $('#' + key);
                    input.addClass('is-invalid');
                    $('#' + key + '_feedback').text(errors[key][0]);
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops!',
                    text: xhr.responseJSON.message || 'Something went wrong!'
                });
            }
        }
    });
});
