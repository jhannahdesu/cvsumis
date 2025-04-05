@extends('layouts.guest')
@section('content')
<div class="container">
  <section class="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
      
     

      <div class="container">
          <div class="row justify-content-center">
              <div class="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">
                {{-- <div class="d-flex justify-content-center py-4">
                  <a href="index.html" class="logo d-flex align-items-center w-auto">
                      <img src="{{ asset('images/background/CEIT-LOGO.jpg') }}" alt="Logo" style="width: 150px;  height: 250px; ">
                  </a>
                </div> --}}
                <div class="card mb-3">
                    <div class="card-body">
                        <div class="pt-4 pb-2">
                            <h5 class="card-title text-center pb-0 fs-4">Reset Password</h5>
                            <p class="text-center small">Enter Email</p>
                        </div>

                        <form class="row g-3 needs-validation" id="reset-password-form">
                            <div class="col-12">
                                <label for="yourUsername" class="form-label">Email</label>
                                <div class="input-group has-validation">
                                    <input type="email" id="email" name="email" class="form-control" placeholder="example@gmail.com">
                                    <div class="invalid-feedback">Please enter your email.</div>
                                </div>
                            </div>

                            <div class="col-12">
                                <button class="btn btn-primary w-100" id="reset-password-btn" type="button">Submit</button>
                            </div>
                            
                            <div class="col-12">
                                <p class="small mb-0">Already have an account? <a href="{{ route('login.index') }}">Sign in</a></p>
                            </div>
                        </form>
                    </div>
                </div>
              </div>
          </div>
      </div>
  </section>
</div>

<script src="{{ asset('js/forgot_password.js') }} "></script>
@endsection