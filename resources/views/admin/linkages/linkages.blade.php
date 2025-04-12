@extends('layouts.app')
@section('content')

    <div class="container">
    @if(Auth::user()->position != 5)
        <div class="row">
            <section class="col-lg-12">    
                <article class="card">
                    <div class="card-body">
                        <h5 class="card-title">Linkages Form</h5>
                        <form class="row g-3 needs-validation" id="linkages-form" novalidate>
                            @csrf
                            <div class="col-md-6">
                                <label for="agency" class="form-label">Agency</label>
                                <input type="text" class="form-control" id="agency" name="agency" required>
                                <div class="valid-feedback">
                                    Looks good!
                                </div>
                            </div>
            
                            <div class="col-md-6">
                                <label for="linkage_nature" class="form-label">Nature of Linkage</label>
                                <input type="text" class="form-control" id="linkage_nature" name="linkage_nature" required>
                                <div class="valid-feedback">
                                    Looks good!
                                </div>
                            </div>

                            <div class="col-md-6">
                                <label for="activity_title" class="form-label">Activity Title</label>
                                <input type="text" class="form-control" id="activity_title" name="activity_title" required>
                                <div class="valid-feedback">
                                    Looks good!
                                </div>
                            </div>

                            <div class="col-md-6">
                                <label for="date" class="form-label">Date</label>
                                <input type="date" class="form-control" id="date" name="date" required>
                                <div class="valid-feedback">
                                    Looks good!
                                </div>
                            </div>

                            <div class="col-md-6">
                                <label for="venue" class="form-label">Venue</label>
                                <input type="text" class="form-control" id="venue" name="venue" required>
                                <div class="valid-feedback">
                                    Looks good!
                                </div>
                            </div>

                            <div class="col-md-6">
                                <label for="attendees" class="form-label">Attendees</label>
                                <input type="text" class="form-control" id="attendees" name="attendees" required>
                                <div class="valid-feedback">
                                    Looks good!
                                </div>
                            </div>

                            <div class="col-md-12">
                                <label for="view_facilitators" class="form-label">Facilitators</label>
                                <input type="text" class="form-control" id="view_facilitators" name="facilitators" placeholder="Surname, First Name Middle Initial.," required>
                                <div class="valid-feedback">
                                    Looks good!
                                </div>
                                <div class="invalid-feedback" id="facilitators-error-message" style="display:none;">Please enter a valid name.</div>
                            </div>

                            <div class="col-md-6">
                                <button type="button" class="btn btn-outline-info btn-sm px-4" id="submit-linkages-btn">
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
                        <h5 class="card-title">List of partner agencies and nature of linkages </h5>
                        <div class="d-flex justify-content-between mb-3">
                            <form class="form-inline">
                                <input class="form-control mr-sm-2" type="search" oninput="searchlinkages(value)" placeholder="Search" aria-label="Search">
                            </form>
                            
                            <div class="ms-auto d-flex">
                        
                        <form id="linkagesCsvDownloadForm" class="form-inline" method="GET" action="{{ route('LinkagesCSV') }}">
                            <input type="hidden" name="school_year" id="linkagesCsvYearInput">
                            <input type="hidden" name="semester" id="linkagesCsvSemesterInput">
                            @if(Auth::user()->position == 1)
                            <button type="submit" class="btn btn-outline-info">
                                <i class="bi bi-printer-fill"> CSV </i>
                            </button>
                            @endif
                        </form>
                    </div>

                        </div>
                        <div id="linkages-table"></div>
                    </div>
                </article>
            </section>
        </div>
    </div>


@include('layouts.modals.linkages_modals.linkages_modal')
@endsection
@section('scripts')

<script>
    document.getElementById('view_facilitators').addEventListener('input', function() {
        // Allow letters, spaces, commas, and periods
        this.value = this.value.replace(/[^A-Za-z\s.,]/g, '');
    });

    function validateFacilitatorsForm() {
        const facilitatorsName = document.getElementById('view_facilitators').value;
        const errorMessage = document.getElementById('facilitators-error-message');

        // Check if the input is valid
        if (!/^[A-Za-z\s.,]+$/.test(facilitatorsName)) {
            errorMessage.style.display = 'block';
            return false; // Prevent form submission
        }

        errorMessage.style.display = 'none'; // Hide error message
        return true; // Allow form submission
    }
</script>
<script src="{{ asset('js/linkages/linkages.js') }}"> </script>
@endsection

