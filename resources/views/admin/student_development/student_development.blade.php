@extends('layouts.app')
@section('content')

    <div class="container">
    @if(Auth::user()->position != 5)
        <div class="row">
            <section class="col-lg-12">    
                <article class="card">
                    <div class="card-body">
                        <h5 class="card-title">Organzation Form</h5>
                        <form class="row g-3 needs-validation" id="organization-form" novalidate>
                            @csrf
                    
                            <div class="col-md-12">
                                <label for="org_abbrev" class="form-label">Organization Abbreviation</label>
                                <input type="text" class="form-control" id="org_abbrev" name="org_abbrev" placeholder="ex.ELITS"  required>
                                <div class="valid-feedback">
                                    Looks good!
                                </div>
                            </div>
            
                            <div class="col-md-12">
                                <label for="program_abbrev" class="form-label">Program Abbreviation</label>
                                <input type="text" class="form-control" id="program_abbrev" name="program_abbrev" placeholder="ex.BSIT" required>
                                <div class="valid-feedback">
                                    Looks good!
                                </div>
                            </div>

                            <div class="col-md-12">
                                <label for="org_name" class="form-label">Organization Name</label>
                                <input type="text" class="form-control" id="org_name" name="org_name" placeholder="ex.Elite league of Information Technology Students" required>
                                <div class="valid-feedback">
                                    Looks good!
                                </div>
                            </div>
                            
                            <div class="col-md-6">
                                <button type="button" class="btn btn-outline-info btn-sm px-4" id="submit-organization-btn">
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
                        <h5 class="card-title">Organzation List</h5>
                        <div class="d-flex justify-content-between mb-3">
                            <form class="form-inline">
                                <input class="form-control mr-sm-2" type="search" oninput="searchorganizations(value)" placeholder="Search" aria-label="Search">
                            </form>

                            
                            <div class="ms-auto d-flex">                  
                                <form id="studentDevelopmentCsvDownloadForm" class="form-inline" method="GET" action="{{ route('StudentDevelopmentCSV') }}">
                                    <input type="hidden" name="school_year" id="studentDevelopmentCsvYearInput">
                                    <input type="hidden" name="semester" id="studentDevelopmentCsvSemesterInput">
                                    
                                    <button type="submit" class="btn btn-outline-info">
                                        <i class="bi bi-printer-fill"> CSV </i>
                                    </button>
                                    
                                </form>
                            </div>
                        </div>
                        <div id="organization-table"></div>
                    </div>
                </article>
            </section>
        </div>
    </div>


<script>
    // FOR RESET VALIDATION FOR ORGANIZATION FORM :D
    document.addEventListener("DOMContentLoaded", function () {
        const form = document.getElementById("organization-form");

        form?.addEventListener("reset", function () {
            form.classList.remove("was-validated");
        });
    });
</script>


@include('layouts.modals.student_development_modals.student_development_modal')
@endsection
@section('scripts')
<script src="{{ asset('js/student_development/student_development.js') }}"> </script>
@endsection