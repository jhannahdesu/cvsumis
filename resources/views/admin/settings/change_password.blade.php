@extends('layouts.app')

@section('content')

    <div class="container">
        <div class="row">
            <form class="row g-3 needs-validation" id="change-password-form" novalidate>
                @csrf

                @if(!empty(auth()->user()->change_password_at))
                    <div class="col-md-12">
                        <label for="current_password" class="form-label">Current password</label>
                        <input type="password" class="form-control" id="current_password" name="current_password" required>
                        <div class="valid-feedback">
                            Looks good!
                        </div>
                    </div>
                @endif
                
                <div class="col-md-12">
                    <label for="new_password" class="form-label">New password</label>
                    <input type="password" class="form-control" id="new_password" name="new_password" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-12">
                    <label for="new_password_confirmation" class="form-label">Confirm Password</label>
                    <input type="password" class="form-control" id="new_password_confirmation" name="new_password_confirmation" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-12">
                    <button type="button" class="btn btn-outline-primary" id="update-password-btn">
                        Submit
                    </button>
                </div>

            </form>
        </div>
    </div>
@endsection
@section('scripts')
  <script src="{{ asset('js/settings/change_password.js') }}"></script>
@endsection