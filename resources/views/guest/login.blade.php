@extends('layouts.guest')
@section('content')

<!-- Import Poppins font from Google Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">

<style>
    :root {
        --primary-color: #3464eb;
        --primary-hover: #2855d6;
        --secondary-color: #6c757d;
        --text-dark: #333333;
        --text-muted: #6c757d;
        --background-light: #f8f9fa;
        --border-color: #e9ecef;
        --touch-orange: #FF6B35; /* Added Touch Orange color */
    }

    body {
        font-family: 'Poppins', sans-serif;
        margin: 0;
        padding: 0;
        height: 100vh;
        overflow: hidden;
    }

    .bg-slideshow {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
    }

    .bg-slide {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-size: cover;
        background-position: center;
        opacity: 0;
        transition: opacity 1s ease-in-out;
    }

    .content-container {
        position: relative;
        z-index: 2;
        width: 100%;
        height: 100vh;
        background-color: rgba(255, 255, 255, 0.5);
        backdrop-filter: blur(3px);
    }

    .header-container {
        text-align: center;
        margin-bottom: 2rem;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        border-radius: 12px;
        padding: 1rem;
        max-width: 650px;
        margin-left: auto;
        margin-right: auto;
    }

    .logos-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
        width: 100%;
        padding: 0 30px;
    }

    .logo {
        height: 50px;
        margin: 0;
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
    }

    .system-title {
        font-size: 30px;
        font-weight: 700;
        color: var(--text-dark);
        border-bottom: 2px solid var(--primary-color);
        padding-bottom: 8px;
        display: inline-block;
        margin-bottom: 0.5rem;
        letter-spacing: 0.5px;
    }

    .system-subtitle {
        font-size: 20px;
        color: var(--text-dark);
        font-weight: 500;
        margin-top: 0.5rem;
    }

    .login-divider {
        height: 1px;
        background: linear-gradient(to right, transparent, var(--primary-color), transparent);
        width: 100%;
        margin: 10px 0 20px;
    }

    .card {
        border: none;
        border-radius: 12px;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        background-color: rgba(255, 255, 255, 0.95);
    }

    .card-body {
        padding: 1.8rem;
    }

    .card-title {
        font-weight: 600;
        color: var(--text-dark);
        margin-bottom: 0.5rem;
    }

    .form-label {
        font-weight: 500;
        color: var(--text-dark);
        margin-bottom: 0.5rem;
    }

    .form-control {
        border-radius: 8px;
        padding: 0.6rem 0.8rem;
        border: 1px solid var(--border-color);
        transition: all 0.3s ease;
    }

    .form-control:focus {
        box-shadow: 0 0 0 3px rgba(52, 100, 235, 0.2);
        border-color: var(--primary-color);
    }

    .input-group-text {
        background-color: white;
        border-radius: 0 8px 8px 0;
        cursor: pointer;
        transition: background 0.3s ease;
    }

    .input-group-text:hover {
        background-color: var(--background-light);
    }

    .btn-primary {
        background: linear-gradient(45deg, var(--touch-orange), #FF8C42); /* Updated to Touch Orange */
        border: none;
        border-radius: 8px;
        padding: 0.6rem 1.2rem;
        font-weight: 600;
        transition: all 0.3s ease;
        margin-top: 1rem;
        margin-bottom: 1rem;
    }

    .btn-primary:hover {
        background: linear-gradient(45deg, #FF5A1F, #FF8C42); /* Darker shade for hover */
        transform: translateY(-2px);
        box-shadow: 0 4px 10px rgba(255, 107, 53, 0.3); /* Updated shadow color */
    }

    .btn-secondary {
        background: var(--secondary-color);
        border: none;
        border-radius: 8px;
        padding: 0.7rem 1.5rem;
        font-weight: 600;
        transition: all 0.3s ease;
    }

    .btn-secondary:hover {
        background: #5a6268;
        transform: translateY(-2px);
    }

    .form-check-input:checked {
        background-color: var(--primary-color);
        border-color: var(--primary-color);
    }

    a {
        color: var(--primary-color);
        font-weight: 500;
        transition: color 0.3s ease;
    }

    a:hover {
        color: var(--primary-hover);
        text-decoration: underline;
    }

    .col-12 {
        margin-bottom: 1rem;
    }

    /* Privacy Modal Styles */
    .modal-privacy {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: none;
        z-index: 1000;
        overflow-y: auto;
    }

    .modal-privacy.show {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .modal-content {
        background-color: #fff;
        border-radius: 12px;
        width: 90%;
        max-width: 800px;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        animation: modalFadeIn 0.3s ease;
    }

    @keyframes modalFadeIn {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .modal-header {
        padding: 1.5rem;
        border-bottom: 1px solid var(--border-color);
        position: sticky;
        top: 0;
        background-color: #fff;
        z-index: 10;
    }

    .modal-title {
        font-weight: 700;
        color: var(--text-dark);
        margin: 0;
    }

    .modal-body {
        padding: 1.5rem;
    }

    .modal-body strong {
        color: var(--text-dark);
    }

    .modal-body em {
        font-style: italic;
    }

    .col-lg-5 {
        max-width: 400px; /* Limit max width */
    }

    .modal-body h4 {
        margin-top: 1.5rem;
        margin-bottom: 0.75rem;
        color: var(--text-dark);
    }

    .modal-footer {
        padding: 1rem 1.5rem;
        border-top: 1px solid var(--border-color);
        display: flex;
        justify-content: flex-end;
        position: sticky;
        bottom: 0;
        background-color: #fff;
        z-index: 10;
    }

    .modal-footer button {
        margin-left: 0.5rem;
    }

    .privacy-section {
        margin-bottom: 1.5rem;
    }

    .privacy-checkbox-container {
        margin-top: 1rem;
        padding: 1rem;
        background-color: var(--background-light);
        border-radius: 8px;
        display: flex;
        align-items: center;
    }

    .privacy-checkbox {
        margin-right: 10px;
        width: 20px;
        height: 20px;
    }

    @media (max-width: 768px) {
        .card-body {
            padding: 1.5rem;
        }

        .system-title {
            font-size: 20px;
        }

        .system-subtitle {
            font-size: 14px;
        }

        .logo {
            height: 50px;
            margin: 0 10px;
        }

        .modal-content {
            width: 95%;
            max-height: 85vh;
        }
    }
</style>

<div class="bg-slideshow">
    <!-- Background images will be added via JavaScript -->
</div>

<div class="content-container">
    <section class="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
        <div class="container">
            <!-- HEADER TITLE + LOGOS -->
            <div class="header-container">
                <!-- Left logo -->
                <img src="{{ asset('images/background/cvsu1.png') }}" alt="Cavite State University Logo" class="logo-left">

                <!-- Center title -->
                <div class="title-container">
                    <div class="system-title">MANAGEMENT INFORMATION SYSTEM</div>
                    <div class="login-divider"></div>
                    <div class="system-subtitle">for College of Engineering and Information Technology</div>
                </div>

                <!-- Right logo -->
                <img src="{{ asset('images/background/ceit.png') }}" alt="CEIT Logo" class="logo-right">
            </div>

            <div class="row justify-content-center">
                <div class="col-lg-5 col-md-8 d-flex flex-column align-items-center justify-content-center">
                    <div class="card mb-4">
                        <div class="card-body">
                            <div class="pt-2 pb-4 text-center">
<<<<<<< HEAD
                                <h5 class="card-title text-center pb-0 fs-4">Welcome!</h5>
=======
                                <h5 class="card-title text-center pb-0 fs-4">Welcome Back</h5>
>>>>>>> 454afcf06fcc35e03427b716300fa4460de3be36
                                <p class="text-center text-muted">Sign in to access your account</p>
                            </div>

                            <form class="row g-3 needs-validation" id="login_form">
                                <div class="col-12">
                                    <label for="yourUsername" class="form-label">Email Address</label>
                                    <div class="input-group has-validation">
                                        <input type="email" name="email" class="form-control" placeholder="Enter your email address">
                                        <div class="invalid-feedback">Please enter a valid email.</div>
                                    </div>
                                </div>

                                <div class="col-12">
                                    <label for="yourPassword" class="form-label">Password</label>
                                    <div class="input-group has-validation">
                                        <input type="password" name="password" class="form-control" id="password" placeholder="Enter your password">
                                        <span class="input-group-text" id="show-password">
                                            <i class="bi bi-eye" id="eye-icon"></i>
                                        </span>
                                        <div class="invalid-feedback">Please enter your password!</div>
                                    </div>
                                </div>
                                <div class="col-12 d-flex justify-content-between align-items-center">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" name="remember" value="true" id="rememberMe">
                                        <label class="form-check-label" for="rememberMe">Remember me</label>
                                    </div>
                                    <a href="{{ route('forgot_password.index') }}" class="text-end">Forgot Password?</a>
                                </div>

                                <div class="col-12">
                                    <button class="btn btn-primary w-100 login-btn" type="button" id="show-privacy-btn">
                                        <i class="bi bi-box-arrow-in-right me-2"></i>Sign In
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</div>

<!-- Data Privacy Modal -->
<div class="modal-privacy" id="privacyModal">
    <div class="modal-content">
        <div class="modal-header">
            <h3 class="modal-title">Data Privacy Act of 2012 - Consent Confirmation</h3>
        </div>
        <div class="modal-body">
            <p><em>Before proceeding with entering your personal data into the system, we require that you carefully review and confirm your agreement to the <strong>Data Privacy Act of 2012 (Republic Act No. 10173)</strong>, a law that ensures the protection and proper handling of your personal information. By confirming your consent, you acknowledge the following details regarding the collection, processing, storage, and security of your data:</em></p>

            <div class="privacy-section">
                <h4><strong>Overview of the Data Privacy Act of 2012:</strong></h4>
                <p>The <strong>Data Privacy Act</strong> was enacted to uphold and protect your fundamental right to privacy. This law imposes strict requirements on how organizations, like ours, must handle personal data. It also ensures transparency, accountability, and security in processing and storing personal information. Our commitment is to make sure that your data is used in a lawful and secure manner.</p>
            </div>

            <div class="privacy-section">
                <h4><strong>How Your Personal Data Will Be Used:</strong></h4>
                <p><em>Collection and Purpose</em></p>
                <p>The personal data you provide will be used solely for legitimate purposes, such as facilitating the use of our <strong>Management Information System (MIS)</strong>, processing requests, or providing necessary updates related to your account or interactions with our system.</p>
                <p><em>Data Processing and Storage</em></p>
                <p>Your data will be processed in a fair, transparent, and legal manner. It will be stored securely, and access will be limited to authorized personnel only. We take all reasonable steps to protect your information from unauthorized access, misuse, or disclosure.</p>
            </div>

            <div class="privacy-section">
                <h4><strong>Rights to Your Data:</strong></h4>
                <p><strong><em>Right to Access:</em></strong> You have the right to request access to the personal data we hold about you.</p>
                <p><strong><em>Right to Rectification:</em></strong> If any of your personal data is incorrect or incomplete, you may request corrections or updates.</p>
                <p><strong><em>Right to Deletion:</em></strong> You may request the deletion of your personal data under specific circumstances, as outlined by the law.</p>
                <p><strong><em>Right to Restriction:</em></strong> You have the right to limit the processing of your data in certain situations.</p>
            </div>

            <div class="privacy-section">
                <h4><strong>Why We Process Your Data:</strong></h4>
                <p>The primary legal basis for processing your data is your consent. In addition, data may be processed for the performance of our contractual obligations, or to fulfill legal and regulatory requirements. Rest assured, your data will not be shared with third parties without your explicit consent unless required by law.</p>
            </div>

            <div class="privacy-section">
                <h4><strong>Data Security and Protection Measures:</strong></h4>
                <p>We implement strong technical, physical, and administrative measures to protect your personal data. These steps are designed to ensure that your information is safe from unauthorized access, alteration, or destruction.</p>
            </div>

            <div class="privacy-section">
                <h4><strong>Duration of Data Retention:</strong></h4>
                <p>Your personal data will only be retained for as long as necessary to achieve the purpose for which it was collected. Once the data is no longer needed, it will be securely deleted in accordance with our data retention policies.</p>
            </div>

            <div class="privacy-section">
                <h4><strong><em>What Happens If You Do Not Provide Consent:</em></strong></h4>
                <p>Please <em>note</em> that your consent is required for the lawful processing of your personal data. If you choose not to provide consent, some features or services of the system may be unavailable, as they require the processing of personal data.</p>
            </div>

            <div class="privacy-section">
                <h4><strong><em>Why Your Consent Matters:</em></strong></h4>
                <p>The <strong>Data Privacy Act of 2012</strong> is in place to ensure that your personal data is protected and handled responsibly. <strong>By confirming</strong> your consent, you are helping us fulfill our legal obligations while maintaining the privacy and security of your data. Your trust is essential to us, and we are committed to safeguarding your personal information throughout its lifecycle.</p>
            </div>

            <p><em>Please review the information above carefully. By clicking <strong>'Confirm'</strong>, you acknowledge that you have read, understood, and consent to the collection, processing, and storage of your personal data as described.</em></p>

            <div class="privacy-checkbox-container">
                <input type="checkbox" class="privacy-checkbox" id="privacyConsent">
                <label for="privacyConsent">I have read, understood, and agree to the data privacy terms outlined above.</label>
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" id="cancel-privacy-btn">Cancel</button>
            <button type="button" class="btn btn-primary" id="confirm-privacy-btn" disabled>Confirm</button>
        </div>
    </div>
</div>

<script>
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
            const passwordField = $('#password');
            const eyeIcon = $('#eye-icon');

            if (passwordField.attr('type') === 'password') {
                passwordField.attr('type', 'text');
                eyeIcon.removeClass('bi-eye').addClass('bi-eye-slash');
            } else {
                passwordField.attr('type', 'password');
                eyeIcon.removeClass('bi-eye-slash').addClass('bi-eye');
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
</script>
@endsection