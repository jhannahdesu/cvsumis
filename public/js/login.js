$(document).ready(function () {
    let privacyConsentConfirmed = false; // Track if privacy consent is confirmed

    // Background slideshow with enhanced visibility
    const bgImages = [
        '{{ asset("images/background/IT.JPG") }}',
        '{{ asset("images/background/ENG.JPG") }}',
        '{{ asset("images/background/CEITbg.JPG") }}',
        '{{ asset("images/background/ACR.JPG") }}'
    ];

    // Create background slide elements with enhanced contrast and saturation
    const slideshow = $('.bg-slideshow');
    bgImages.forEach((image, index) => {
        const slide = $('<div></div>').addClass('bg-slide');
        // Add filter to make background more noticeable
        slide.css({
            'background-image': `url(${image})`,
            'filter': 'contrast(1.1) brightness(0.95) saturate(1.2)'
        });
        if (index === 0) slide.css('opacity', '1');
        slideshow.append(slide);
    });

    // Function to change background randomly
    let lastIndex = 0;
    function changeBackground() {
        const slides = $('.bg-slide');
        let newIndex;

        // Make sure we don't show the same image twice in a row
        do {
            newIndex = Math.floor(Math.random() * bgImages.length);
        } while (newIndex === lastIndex);

        slides.css('opacity', '0');
        $(slides[newIndex]).css('opacity', '1');
        lastIndex = newIndex;
    }

    // Change background every 5 seconds
    setInterval(changeBackground, 5000);

    // Password visibility toggle
    $('#show-password').on('click', function () {
        if ($('#password').attr('type') === 'password') {
            $('#password').attr('type', 'text');
            $('#eye-icon').removeClass('bi-eye').addClass('bi-eye-slash');
        } else {
            $('#password').attr('type', 'password');
            $('#eye-icon').removeClass('bi-eye-slash').addClass('bi-eye');
        }
    });

    // Privacy Modal Functionality
    const privacyModal = $('#privacyModal');
    const showPrivacyBtn = $('#show-privacy-btn');
    const cancelPrivacyBtn = $('#cancel-privacy-btn');
    const confirmPrivacyBtn = $('#confirm-privacy-btn');
    const privacyConsent = $('#privacyConsent');

    // Show privacy modal when sign in button is clicked
    showPrivacyBtn.on('click', function() {
        const email = $('input[name="email"]').val();
        const password = $('input[name="password"]').val();

        // Basic validation
        if (!email || !password) {
            if (!email) {
                $('input[name="email"]').addClass('is-invalid');
            }
            if (!password) {
                $('input[name="password"]').addClass('is-invalid');
            }
            return;
        }

        // Show privacy modal
        privacyModal.addClass('show');
        // Prevent background scrolling
        $('body').css('overflow', 'hidden');
    });

    // Close privacy modal
    cancelPrivacyBtn.on('click', function() {
        privacyModal.removeClass('show');
        // Re-enable background scrolling
        $('body').css('overflow', '');
        // Reset checkbox
        privacyConsent.prop('checked', false);
        confirmPrivacyBtn.prop('disabled', true);
    });

    // Enable/disable confirm button based on checkbox
    privacyConsent.on('change', function() {
        confirmPrivacyBtn.prop('disabled', !this.checked);
    });

    // Proceed with login after privacy consent
    confirmPrivacyBtn.on('click', function() {
        if (!privacyConsent.prop('checked')) {
            return; // Do nothing if consent not checked
        }

        // Set privacy consent as confirmed
        privacyConsentConfirmed = true;

        // Hide privacy modal
        privacyModal.removeClass('show');
        // Re-enable background scrolling
        $('body').css('overflow', '');

        // Show loading animation on button
        showPrivacyBtn.html('<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Signing in...');

        // Submit login form
        $('#login_form').submit();
    });

    // Handle form submission
    $('#login_form').on('submit', function(e) {
        e.preventDefault();

        // Prevent form submission unless privacy consent was given
        if (!privacyConsentConfirmed) {
            // Show the privacy modal if not already shown
            if (!privacyModal.hasClass('show')) {
                privacyModal.addClass('show');
                $('body').css('overflow', 'hidden');
            }
            return false;
        }

        // Form is valid and privacy consent was given, proceed with submission
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

    // Prevent closing modal by clicking outside
    $(window).on('click', function(event) {
        if (event.target === privacyModal[0]) {
            // Do NOT close modal by clicking outside
            // This prevents users from bypassing the consent checkbox
            return;
        }
    });

    // Form input validation
    $('.form-control').on('input', function() {
        if ($(this).val().length > 0) {
            $(this).removeClass('is-invalid').addClass('is-valid');
        } else {
            $(this).removeClass('is-valid').addClass('is-invalid');
        }
    });
});