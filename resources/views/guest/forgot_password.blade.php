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

                <div class="title-container" style="display: flex; justify-content: center; align-items: center; margin-top: -200px; margin-bottom: 5px;">
                    <img src="{{ asset('images/logo/titlelogo.png') }}" alt="System Title Logo" style="max-width: 450px; width: 100%; height: auto;">
                </div>


                <!-- Right logo -->
                <img src="{{ asset('images/background/ceit.png') }}" alt="CEIT Logo" class="logo-right">
            </div>

            <div class="row justify-content-center mt-5"> <!-- Add small top margin -->
                        <div class="col-lg-4 col-md-2 d-flex flex-column align-items-center justify-content-start" style="margin-top: -80px;"> <!-- Adjust width & position -->
                            <div class="card mb-1" style="width: 120%;"> 
                                <div class="card-body p-4">
                            <div class="pt-2 pb-4 text-center">
                                <h5 class="card-title text-center pb-0 fs-4">Reset Password</h5>
                                <p class="text-center text-muted">Enter your email to receive password reset instructions</p>
                            </div>

                            <form class="row g-3 needs-validation" id="reset-password-form">
                                <div class="col-12">
                                    <label for="email" class="form-label">Email Address</label>
                                    <div class="input-group has-validation">
                                        <input type="email" id="email" name="email" class="form-control" placeholder="Enter your email address">
                                        <div class="invalid-feedback">Please enter a valid email.</div>
                                    </div>
                                </div>

                                <div class="col-12">
                                    <button class="btn btn-primary w-100" id="reset-password-btn" type="button">
                                        <i class="bi bi-envelope me-2"></i>Send Reset Link
                                    </button>
                                </div>

                                <div class="col-12 text-center">
                                    <p class="text-muted mb-0">Remember your password? <a href="{{ route('login.index') }}">Back to Login</a></p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</div>

<script src="{{ asset('js/forgot_password.js') }}"></script>
<script>
    $(document).ready(function () {
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

        // Form input validation
        $('.form-control').on('input', function() {
            if ($(this).val().length > 0) {
                $(this).removeClass('is-invalid').addClass('is-valid');
            } else {
                $(this).removeClass('is-valid').addClass('is-invalid');
            }
        });

        // Handle form submission
        $('#reset-password-btn').on('click', function() {
            const email = $('#email').val();

            // Basic validation
            if (!email) {
                $('#email').addClass('is-invalid');
                return;
            }

            // Show loading animation on button
            $(this).html('<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Sending...');

            // Submit form
            setTimeout(function() {
                $('#reset-password-form').submit();
            }, 1000);
        });
    });
</script>
@endsection