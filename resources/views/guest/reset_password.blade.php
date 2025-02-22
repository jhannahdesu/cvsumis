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
                            <h5 class="card-title text-center pb-0 fs-4">Reset Password</h5>
                            <p class="text-center small">Enter your password</p>
                        </div>

                        <form class="row g-3 needs-validation" id="reset-password-form">
                        
                            <div class="col-12">
                                <label for="yourPassword" class="form-label">New Password</label>
                                <input type="password" name="password" class="form-control">
                                <div class="invalid-feedback">Please enter your password!</div>
                            </div>

                            <div class="col-12">
                                <label for="yourPassword" class="form-label">Confirm Password</label>
                                <input type="password" name="password_confirmation" class="form-control">
                                <div class="invalid-feedback">Please enter your password!</div>
                            </div>
    
                            <div class="col-12">
                                <button class="btn btn-primary w-100" id="reset-password-btn" type="button">Reset Password</button>
                            </div>
                        </form>
                    </div>
                </div>
              </div>
          </div>
      </div>
  </section>
</div>

<script src="{{ asset('js/reset_password.js') }} "></script>
@endsection