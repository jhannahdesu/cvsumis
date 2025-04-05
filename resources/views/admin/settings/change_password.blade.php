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
                    <div class="invalid-feedback" id="current_password_feedback"></div>
                </div>
            @endif
            
            <div class="col-md-12">
                <label for="new_password" class="form-label">New password</label>
                <input type="password" class="form-control" id="new_password" name="new_password" required>
                <div class="form-text text-muted">
                    Must be at least 12 characters, with uppercase, lowercase, and a special character.
                </div>
                <div class="invalid-feedback" id="new_password_feedback"></div>
            </div>

            <div class="col-md-12">
                <label for="new_password_confirmation" class="form-label">Confirm password</label>
                <input type="password" class="form-control" id="new_password_confirmation" name="new_password_confirmation" required>
                <div class="form-text text-muted">Must match the new password.</div>
                <div class="invalid-feedback" id="confirm_password_feedback"></div>
            </div>

            <div class="col-md-12">
                <button type="button" class="btn btn-outline-primary" id="update-password-btn">Submit</button>
            </div>
        </form>
    </div>
</div>

<style>
.form-control.is-invalid {
    border-color: #dc3545;
    box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.25);
}

.form-control.is-valid {
    border-color: #198754;
    box-shadow: 0 0 0 0.25rem rgba(25, 135, 84, 0.25);
}
</style>
@endsection

@section('scripts')
<script>
    const changePasswordRoute = "{{ route('change_password.update') }}";
    const redirectRoute = "{{ 
        Auth::user()->position == 4 ? route('faculty_staff_profile.index') : 
        (Auth::user()->position == 2 || Auth::user()->position == 5 ? route('curriculum.index') : 
        route('admin.index')) 
    }}";
</script>
<script src="{{ asset('js/settings/change_password.js') }}"></script>
@endsection
