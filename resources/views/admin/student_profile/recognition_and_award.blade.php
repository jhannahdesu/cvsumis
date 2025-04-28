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
                        <h5 class="card-title">Recognition and Award</h5>
                        <form class="row g-3 needs-validation" id="award-header-form" novalidate>
                            @csrf

                            <div class="col-md-12">
                                <label for="award" class="form-label">Name of Recognition / Award</label>
                                <textarea class="form-control" id="award" name="award" placeholder= "ex. University Games" required></textarea>
                                <div class="valid-feedback">
                                    Looks good!
                                </div>
                            </div>
            
                            <div class="col-md-12">
                                <label for="granting_agency" class="form-label">Granting Agency / Institution</label>
                                <input type="text" class="form-control" id="granting_agency" name="granting_agency" placeholder="ex. Cavite State University - Indang Campus"required>
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
                        <h5 class="card-title">List of recognitions and awards of students</h5>
                        <div class="d-flex justify-content-between mb-3">
                            <form class="form-inline">
                                <input class="form-control mr-sm-2" type="search" oninput="searchawardsHeader(value)" placeholder="Search" aria-label="Search">
                            </form>
                            <div class="d-flex justify-content-between">
                                <select id="RecogAwards-filter-type" class="form-select ms-2 me-1">
                                    <option value="all" disabled selected>Date Filter</option>
                                    <option value="all">All</option>
                                    <option value="monthly">Monthly</option>
                                    <option value="quarterly">Quarterly</option>
                                    <option value="yearly">Yearly</option>
                                </select>
                            </div>
                                <select id="RecogAwards-filter-year" style="display:none;" class="form-select me-1"></select>
                                <select id="RecogAwards-filter-value" style="display:none;" class="form-select me-1"></select>

                                <div class="ms-auto d-flex justify-content-between">
                                    <button id="RecogAwards-csv" class="btn btn-outline-info">
                                        <i class="bi bi-printer-fill"> CSV </i>
                                    </button>
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