@extends('layouts.app')
@section('content')

    <div class="container">
    @if(Auth::user()->position != 5)
        <div class="row">
            <section class="col-lg-12">    
                <article class="card">
                    <div class="card-body">
                        <h5 class="card-title">Recognition and Award Form</h5>
                        <form class="row g-3 needs-validation" id="award-header-form" novalidate>
                            @csrf
                    
                            <div class="col-md-12">
                                <label for="award" class="form-label">Name of Recognition / Award</label>
                                <textarea class="form-control" id="award" name="award" required></textarea>
                                <div class="valid-feedback">
                                    Looks good!
                                </div>
                            </div>
            
                            <div class="col-md-12">
                                <label for="granting_agency" class="form-label">Granting Agency / Institution</label>
                                <input type="text" class="form-control" id="granting_agency" name="granting_agency" required>
                                <div class="valid-feedback">
                                    Looks good!
                                </div>
                            </div>

                            <div class="col-md-6">
                                <label for="start_year" class="form-label">Start Date</label>
                                <input type="date" class="form-control" id="start_year" name="start_year" required>
                                <div class="valid-feedback">
                                    Looks good!
                                </div>
                            </div>

                            <div class="col-md-6">
                                <label for="end_year" class="form-label">End Date</label>
                                <input type="date" class="form-control" id="end_year" name="end_year" required>
                                <div class="valid-feedback">
                                    Looks good!
                                </div>
                            </div>
                            
                            <div class="col-md-6">
                                <button type="button" class="btn btn-outline-info btn-sm px-4" id="submit-award-btn">
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
                        <h5 class="card-title">Recognition and Award List</h5>
                        <div class="d-flex justify-content-between mb-3">
                            <form class="form-inline">
                                <input class="form-control mr-sm-2" type="search" oninput="searchawardsHeader(value)" placeholder="Search" aria-label="Search">
                            </form>
                        
                            <form class="form-inline">
                                <select class="form-select ml-2" id="filter-status">
                                    <option value="" selected>Filter Semester</option>
                                    <option value="1st Semester">1st Semester</option>
                                    <option value="2nd Semester">2nd Semester</option>
                                </select>
                            </form>
                        
                            <div class="ms-auto d-flex">
                            @if(Auth::user()->position != 5)
                                <button type="button" class="btn btn-outline-primary me-2" id="add-award-modal">
                                    <i class="bi bi-plus-circle-fill"></i>
                                </button>
                            @endif
                                <form id="recognitionAwardCsvDownloadForm" class="form-inline" method="GET" action="{{ route('RecognitionAndAwardCSV') }}">
                                    <input type="hidden" name="year" id="recognitionAwardCsvYearInput">
                                    <input type="hidden" name="semester" id="recognitionAwardCsvSemesterInput">
                                    @if(Auth::user()->position == 1)
                                    <button type="submit" class="btn btn-outline-info">
                                        <i class="bi bi-printer-fill"> CSV </i>
                                    </button>
                                    @endif
                                </form>
                            </div>
                        </div>
                        <div id="awards-header-table"></div>
                    </div>
                </article>
            </section>
        </div>
    </div>


<script>
    // FOR RESET VALIDATION FOR AWARD HEADER FORM :D
    document.addEventListener("DOMContentLoaded", function () {
        const form = document.getElementById("award-header-form");

        form?.addEventListener("reset", function () {
            form.classList.remove("was-validated");
        });
    });
</script>


@include('layouts.modals.student_profile_modals.recognition_and_award_modal')
@endsection
@section('scripts')
<script src="{{ asset('js/student_profile/recognition_and_award.js') }}"> </script>
@endsection