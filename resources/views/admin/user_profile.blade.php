@extends('layouts.app')
@section('content')

    <section class="section profile">
        <div class="row">
            <div class="col-xl-4">
                <div class="card">
                    <div class="card-body profile-card pt-4 d-flex flex-column align-items-center">
                        <img id="user-profile-image" src="{{ asset('images/user_image/'. Auth::user()->user_image) }}" alt="Profile" class="rounded-circle">
                        <h2>{{ Auth::user()->firstname.' '.Auth::user()->lastname }}</h2>
                        <h3>{{ Auth::user()->position_dtls->position }}</h3>
                        {{-- <div class="social-links mt-2">
                            <a href="#" class="twitter"><i class="bi bi-twitter"></i></a>
                            <a href="#" class="facebook"><i class="bi bi-facebook"></i></a>
                            <a href="#" class="instagram"><i class="bi bi-instagram"></i></a>
                            <a href="#" class="linkedin"><i class="bi bi-linkedin"></i></a>
                        </div> --}}
                    </div>
                </div>
            </div>

            <div class="col-xl-8">
                <div class="card">
                    <div class="card-body pt-3">
                        <!-- Bordered Tabs -->
                        <ul class="nav nav-tabs nav-tabs-bordered">
                            <li class="nav-item">
                                <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#profile-overview">Overview</button>
                            </li>
                            <li class="nav-item">
                                <button class="nav-link" data-bs-toggle="tab" data-bs-target="#profile-edit">Edit Profile</button>
                            </li>
                        </ul>

                        <div class="tab-content pt-2">
                            <div class="tab-pane fade show active profile-overview" id="profile-overview">
                                {{-- <h5 class="card-title">About</h5>
                                <p class="small fst-italic">Hehehe</p> --}}

                                <h5 class="card-title">Profile Details</h5>

                                <div class="row">
                                    <div class="col-lg-3 col-md-4 label">Full Name</div>
                                    <div class="col-lg-9 col-md-8">{{ Auth::user()->firstname.' '.Auth::user()->lastname }}</div>
                                </div>

                                <div class="row">
                                    <div class="col-lg-3 col-md-4 label">Company</div>
                                    <div class="col-lg-9 col-md-8">Cavite State University - Indang</div>
                                </div>

                                <div class="row">
                                    <div class="col-lg-3 col-md-4 label">Position</div>
                                    <div class="col-lg-9 col-md-8">{{ Auth::user()->position_dtls->position }}</div>
                                </div>

                                <div class="row">
                                    <div class="col-lg-3 col-md-4 label">Country</div>
                                    <div class="col-lg-9 col-md-8">Philippines</div>
                                </div>

                                <div class="row">
                                    <div class="col-lg-3 col-md-4 label">Email</div>
                                    <div class="col-lg-9 col-md-8">{{ Auth::user()->email }}</div>
                                </div>
                            </div>

                            <div class="tab-pane fade profile-edit pt-3" id="profile-edit">
                                <!-- Profile Edit Form -->
                                <form id="user_profile_form">
                                    <div class="row mb-3">
                                        <label for="profileImage" class="col-md-4 col-lg-3 col-form-label">Profile Image</label>
                                        <div class="col-md-8 col-lg-9">
                                            <img id="user-profile-image2" src="{{ asset('images/user_image/'. Auth::user()->user_image) }}" alt="Profile" class="img-thumbnail">
                                            <div class="pt-2">
                                                <!-- Trigger Button -->
                                                <a href="javascript:void(0)" class="btn btn-primary btn-sm" id="upload-trigger" title="Upload new profile image">
                                                    <i class="bi bi-upload"></i>
                                                </a>
                                                <a href="#" class="btn btn-danger btn-sm" title="Remove my profile image">
                                                    <i class="bi bi-trash"></i>
                                                </a>
                                            </div>
                                            <!-- Hidden File Input -->
                                            <input type="file" id="profileImageInput" style="display: none;" accept="image/*">
                                        </div>
                                    </div>

                                    <div class="row mb-3">
                                        <label for="fullName" class="col-md-4 col-lg-3 col-form-label">First Name</label>
                                        <div class="col-md-8 col-lg-9">
                                            <input name="firstname" type="text" class="form-control" id="firstname" value="{{ Auth::user()->firstname }}">
                                        </div>
                                    </div>

                                    <div class="row mb-3">
                                        <label for="middle_initial" class="col-md-4 col-lg-3 col-form-label">Middle Initial</label>
                                        <div class="col-md-8 col-lg-9">
                                            <input name="middle_initial" type="text" class="form-control" id="middle_initial" value="{{ Auth::user()->middle_initial }}">
                                        </div>
                                    </div>


                                    <div class="row mb-3">
                                        <label for="fullName" class="col-md-4 col-lg-3 col-form-label">Last Name</label>
                                        <div class="col-md-8 col-lg-9">
                                            <input name="lastname" type="text" class="form-control" id="lastname" value="{{ Auth::user()->lastname }}">
                                        </div>
                                    </div>

                                    <div class="row mb-3">
                                        <label for="Email" class="col-md-4 col-lg-3 col-form-label">Email</label>
                                        <div class="col-md-8 col-lg-9">
                                            <input name="email" type="email" class="form-control" id="Email" value="{{ Auth::user()->email }}">
                                        </div>
                                    </div>

                                    <div class="text-center">
                                        <button type="button" id="update-user-btn" class="btn btn-primary">Save Changes</button>
                                    </div>
                                </form><!-- End Profile Edit Form -->
                            </div>
                        </div><!-- End Bordered Tabs -->
                    </div>
                </div>
            </div>
        </div>
    </section>


@endsection
@section('scripts')
<script>

$('#upload-trigger').on('click', function () {
    $('#profileImageInput').click();
});

$('#profileImageInput').on('change', function () {
    const file = this.files[0];
    if (file) {
        const formData = new FormData();
        formData.append('user_image', file);
        $.ajax({
            url: '/update-user-profile-image', 
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function (response) {
                Swal.fire({
                    title: "Success!",
                    text: response.message,
                    icon: "success"
                });
                $('#user-profile-image').attr('src', response.image_url);
                $('#user-profile-image2').attr('src', response.image_url);
            },
            error: function (xhr) {
                alert('An error occurred while updating the image. Please try again.');
                console.error(xhr.responseText);
            }
        });
    }
});


</script>
  <script src="{{ asset('js/admin_index.js') }}"></script>
@endsection