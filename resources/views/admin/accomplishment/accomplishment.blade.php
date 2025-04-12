@extends('layouts.app')
@section('content')
<script>
    window.userPosition = {{ Auth::user()->position }};
</script>

    <div class="container">
    @if(Auth::user()->position != 5)
        <div class="row">
            <section class="col-lg-12">    
                <article class="card">
                    <div class="card-body">
                        <h5 class="card-title">Other Events / Accomplishments</h5>
                        <form class="row g-3 needs-validation" id="accomplishment-form" novalidate>
                            @csrf

                            <div class="col-md-2">
                                <label for="conference_title" class="form-label">Seminar Category</label>
                                <select class="form-select" id="st_seminar_category" name="seminar_category" required>
                                    <option selected value="">Select Category</option>
                                    <option value="Faculty">Faculty</option>
                                    <option value="Department">Department</option>
                                    <option value="College">College</option>
                                </select>
                                <div class="valid-feedback">
                                    Looks good!
                                </div>
                            </div>

                            <div class="col-md-10">
                                <label for="faculty" class="form-label" id="faculty-label">Select Category first</label>
                                <input type="text" class="form-control" id="faculty" name="faculty" placeholder="" required>
                                <div class="valid-feedback">
                                    Looks good!
                                </div>
                                <div class="invalid-feedback" id="faculty-error-message" style="display:none;">Please enter a valid name.</div>
                            </div>
            
                            <div class="col-md-4">
                                <label for="program_id" class="form-label">Program</label>
                                <select class="form-select" id="program_id" name="program_id" required>
                                    <option disabled selected value="">Select program</option>
                                    @foreach($programs as $program)
                                        <option value="{{$program->id }}">{{ ucwords($program->program) }}</option>
                                    @endforeach
                                </select>
                                <div class="valid-feedback">
                                    Looks good!
                                </div>
                            </div>

                            <div class="col-md-4">
                                <label for="university" class="form-label">University venue</label>
                                <input type="text" class="form-control" id="university" name="university" >
                                <div class="valid-feedback">
                                    Looks good!
                                </div>
                            </div>

                            <div class="col-md-4">
                                <label for="university" class="form-label">Sponsoring agency</label>
                                <input type="text" class="form-control" id="university" name="university">
                                <div class="valid-feedback">
                                    Looks good!
                                </div>
                            </div>

                            <div class="col-md-6">
                                <label for="date" class="form-label">Start Date</label>
                                <input type="date" class="form-control" id="start_date" name="start_date" required>
                                <div class="valid-feedback">
                                    Looks good!
                                </div>
                            </div>

                            <div class="col-md-6">
                                <label for="date" class="form-label">End Date</label>
                                <input type="date" class="form-control" id="end_date" name="end_date" required>
                                <div class="valid-feedback">
                                    Looks good!
                                </div>
                            </div>

                            <div class="col-md-12">
                                <label for="program_dtls" class="form-label">Program Details</label>
                                <input type="text" class="form-control" id="program_dtls" name="program_dtls" required>
                                <div class="valid-feedback">
                                    Looks good!
                                </div>
                            </div>
                            
                            <div class="col-md-6">
                                <button type="button" class="btn btn-outline-info btn-sm px-4" id="submit-accomplishment-btn">
                                    Submit
                                </button>
                            </div>
                            
                        </form>
                    </div>
                </article>
            </section>
        </div>
    @endif
        <div class="row">
            <section class="col-lg-12">    
                <article class="card">
                    <div class="card-body">
                        <h5 class="card-title">Accomplishment / Events List</h5>
                        <div class="d-flex justify-content-between mb-3">
                            <form class="form-inline">
                                <input class="form-control mr-sm-2" type="search" oninput="searchaccomplishments(value)" placeholder="Search" aria-label="Search">
                            </form>
                            <div class="ms-auto d-flex">
                        <form id="eventsAccomplishmentsCsvDownloadForm" class="form-inline" method="GET" action="{{ route('EventsAndAccomplishmentsCSV') }}">
                            <input type="hidden" name="school_year" id="eventsAccomplishmentsCsvYearInput">
                            <input type="hidden" name="semester" id="eventsAccomplishmentsCsvSemesterInput">
                            
                            <button type="submit" class="btn btn-outline-info">
                                <i class="bi bi-printer-fill"> CSV </i>
                            </button>
                            
                        </form>
                    </div>
                        </div>
                        <div id="accomplishment-table"></div>
                    </div>
                </article>
            </section>
        </div>
    </div>
@include('layouts.modals.accomplishment_modals.accomplishment_modal')
@endsection
@section('scripts')
<script src="{{ asset('js/accomplishment/accomplishment.js') }}"> </script>
<script>
    document.getElementById('faculty').addEventListener('input', function() {
        // Allow letters, spaces, commas, and periods
        this.value = this.value.replace(/[^A-Za-z\s.,]/g, '');
    });

    function validateFacultyForm() {
        const facultyName = document.getElementById('faculty').value;
        const errorMessage = document.getElementById('faculty-error-message');

        // Check if the input is valid
        if (!/^[A-Za-z\s.,]+$/.test(facultyName)) {
            errorMessage.style.display = 'block';
            return false; // Prevent form submission
        }

        errorMessage.style.display = 'none'; // Hide error message
        return true; // Allow form submission
    }
</script>
@endsection
