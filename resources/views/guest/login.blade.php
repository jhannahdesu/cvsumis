@extends('layouts.guest')
@section('content')
<div class="container">
  <section class="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
    
      <div class="container">

          <div class="row justify-content-center">
              <div class="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">
                <div class="card mb-3">
                    <div class="card-body">
                        <div class="pt-4 pb-2">
                            <h5 class="card-title text-center pb-0 fs-4">Login to Your Account</h5>
                            <p class="text-center small">Enter your username & password to login</p>
                        </div>

                        <form class="row g-3 needs-validation" id="login_form">
                          
                            <div class="col-12">
                                <label for="yourUsername" class="form-label">Email</label>
                                <div class="input-group has-validation">
                                    <input type="email" name="email" class="form-control" placeholder="example@gmail.com">
                                    <div class="invalid-feedback">Please enter your email.</div>
                                </div>
                            </div>

                            <div class="col-12">
                                <label for="yourPassword" class="form-label">Password</label>
                                <div class="input-group has-validation">
                                    <input type="password" name="password" class="form-control" id="password" placeholder="password">
                                    <span class="input-group-text" id="show-password">
                                        <i class="bi bi-eye" id="eye-icon"></i>
                                    </span>
                                    <div class="invalid-feedback">Please enter your password!</div>
                                </div>
                            </div>

                            <div class="col-12">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" name="remember" value="true" id="rememberMe">
                                    <label class="form-check-label" for="rememberMe">Remember me</label>
                                </div>
                            </div>
                            
                            <div class="col-12">
                                <button class="btn btn-primary w-100 login-btn" type="button">Login</button>
                            </div>
                            
                            {{-- <div class="col-12">
                                <p class="small mb-0">Don't have an account? <a href="{{ route('register.index') }}">Create an account</a></p>
                            </div> --}}
                            <div class="col-12">
                                <p class="small mb-0">Forgot Password? <a href="{{ route('forgot_password.index') }}">Reset my password</a></p>
                            </div>
                        </form>
                    </div>
                </div>
              </div>
          </div>
      </div>
  </section>
</div>

<script src="{{ asset('js/login.js') }} "></script>
<script>
    $(document).ready(function() {
        $('#show-password').on('click', function() {
            if ($('#password').attr('type') === 'password') {
                $('#password').attr('type', 'text');
                $('#eye-icon').removeClass('bi-eye').addClass('bi-eye-slash');
            } else {
                $('#password').attr('type', 'password');
                $('#eye-icon').removeClass('bi-eye-slash').addClass('bi-eye');
            }
        });
    });
</script>
@endsection