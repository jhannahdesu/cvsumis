$('.login-btn').click(function(){
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        url: "/login-account",
        type: 'POST',
        data: $('#login_form').serialize(),
        success: function (response) {
            console.log('Success:', response);
            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success"
            });
            setTimeout(function() {
                if(response.role == 4){
                    window.location.href = "/faculy-staff-profile";
                }else if(response.role == 2 || response.role == 3){
                    window.location.href = "/curriculum";
                }else{
                    window.location.href = "/";
                }
                
            }, 2000);
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

$(document).on('keypress', function(e) {
    if (e.which === 13) {  // 13 is the keycode for Enter
        $('.login-btn').trigger('click');
    }
});