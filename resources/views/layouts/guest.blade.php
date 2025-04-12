<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <meta content="width=device-width, initial-scale=1.0" name="viewport">

  <title>myMIS System</title>
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <meta content="" name="description">
  <meta content="" name="keywords">

  <!-- Favicons -->
  <link href="{{ asset('images/background/ceit.png') }}" rel="icon">
  <link href="assets/img/apple-touch-icon.png" rel="apple-touch-icon">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.9.1/font/bootstrap-icons.css">

  <!-- Google Fonts -->
  <link href="https://fonts.gstatic.com" rel="preconnect">
  <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i|Nunito:300,300i,400,400i,600,600i,700,700i|Poppins:300,300i,400,400i,500,500i,600,600i,700,700i" rel="stylesheet">

  <!-- Vendor CSS Files -->
  <link href="{{ asset('libraries/bootstrap-5.0.2-dist/css/bootstrap.min.css') }}" rel="stylesheet">
  <link href="{{ asset('libraries/niceadmin/assets/vendor/bootstrap-icons/bootstrap-icons.css') }}" rel="stylesheet">
  <link href="{{ asset('libraries/niceadmin/assets/vendor/boxicons/css/boxicons.min.css') }}" rel="stylesheet">
  <link href="{{ asset('libraries/niceadmin/assets/vendor/quill/quill.snow.css') }}" rel="stylesheet">
  <link href="{{ asset('libraries/niceadmin/assets/vendor/quill/quill.bubble.css') }}" rel="stylesheet">
  <link href="{{ asset('libraries/niceadmin/assets/vendor/remixicon/remixicon.css') }}" rel="stylesheet">
  <link href="{{ asset('libraries/niceadmin/assets/vendor/simple-datatables/style.css') }}" rel="stylesheet">
  <link rel="stylesheet" type="text/css" href="{{ asset('libraries/toastify/toastify.css') }}">

  <script type="text/javascript" src="{{ asset('libraries/jquery/jquery.min.js') }}"></script>
  <script src="{{ asset('libraries/sweetalert/sweetalert2@11.js') }}"></script>

  <!-- Template Main CSS File -->
  <link href="{{ asset('libraries/niceadmin/assets/css/style.css') }}" rel="stylesheet">

  <style>
    body {
      background-image: url('/images/background/latest_bg1.png');
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
    }

    /* Remove any unintended floating logo styles globally */
    .logo-left, .logo-right, .floating-logo {
      display: none !important;
    }
  </style>
</head>

<body>
  <main>
    @yield('content')
  </main>

  <a href="#" class="back-to-top d-flex align-items-center justify-content-center">
    <i class="bi bi-arrow-up-short"></i>
  </a>

  <!-- Vendor JS Files -->
  <script src="{{ asset('libraries/niceadmin/assets/vendor/apexcharts/apexcharts.min.js') }}"></script>
  <script src="{{ asset('libraries/niceadmin/assets/vendor/bootstrap/js/bootstrap.bundle.min.js') }}"></script>
  <script src="{{ asset('libraries/niceadmin/assets/vendor/chart.js/chart.umd.js') }}"></script>
  <script src="{{ asset('libraries/niceadmin/assets/vendor/echarts/echarts.min.js') }}"></script>
  <script src="{{ asset('libraries/niceadmin/assets/vendor/quill/quill.js') }}"></script>
  <script src="{{ asset('libraries/niceadmin/assets/vendor/simple-datatables/simple-datatables.js') }}"></script>
  <script src="{{ asset('libraries/niceadmin/assets/vendor/tinymce/tinymce.min.js') }}"></script>
  <script src="{{ asset('libraries/niceadmin/assets/vendor/php-email-form/validate.js') }}"></script>
  <script type="text/javascript" src="{{ asset('libraries/toastify/toastify.js') }}"></script>

  <!-- Template Main JS File -->
  <script src="{{ asset('libraries/niceadmin/assets/js/main.js') }}"></script>
  @yield('scripts')
</body>

</html>
