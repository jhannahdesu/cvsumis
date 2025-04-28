@extends('layouts.app')
@section('content')

<div class="container">
    <div class="row">
        <div class="accordion mt-2" id="accordionFlushExample">

            {{-- PROGRAM LIST --}}
            <div class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button collapsed custom-orange" type="button" data-bs-toggle="collapse" data-bs-target="#program-list" aria-expanded="false" aria-controls="program-list">
                        Add Programs
                    </button>
                </h2>
                <div id="program-list" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                    <section class="col-lg-12">    
                        <article class="card">
                            <div class="card-body">
                                <h5 class="card-title">Program List</h5>
                                <div class="d-flex justify-content-between mb-3">
                                    <form class="form-inline">
                                        <input class="form-control mr-sm-2" type="search" oninput="searchprogram(value)" placeholder="Search" aria-label="Search">
                                    </form>
                                    
                                    <div class="ms-auto d-flex">
                                        <button type="button" class="btn btn-outline-primary me-2" id="program-modal">
                                            <i class="bi bi-plus-circle-fill"></i>
                                        </button>
                                    </div>
                                </div>
                                <div id="program-table"></div>
                            </div>
                        </article>
                    </section>
                </div>
            </div>

            {{-- ADD ACADEMIS YEAR --}}
            <div class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button collapsed custom-orange" type="button" data-bs-toggle="collapse" data-bs-target="#academic-year-list" aria-expanded="false" aria-controls="academic-year-list">
                        Add Academic Year
                    </button>
                </h2>
                <div id="academic-year-list" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                    <section class="col-lg-12">    
                        <article class="card">
                            <div class="card-body">
                                <h5 class="card-title">Academic Year List</h5>
                                <form class="row g-2 needs-validation" id="academic-year-form" novalidate>
                                    @csrf
                                    <div class="col-md-6">
                                        <label for="year_start" class="form-label">Year Start</label>
                                        <input type="text" class="form-control" id="year_start" name="year_start" required>
                                        <div class="valid-feedback">
                                            Looks good!
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <label for="year_end" class="form-label">Year End</label>
                                        <input type="text" class="form-control" id="year_end" name="year_end" required>
                                        <div class="valid-feedback">
                                            Looks good!
                                        </div>
                                    </div>
                                    <div class="col-md-8">
                                    <button type="button" class="btn btn-primary px-2 mb-2" id="submit-academic-year">Submit</button>
                                    </div>
                                </form>
                                </hr>
                                <div id="academic-year-table"></div>
                            </div>
                        </article>
                    </section>
                </div>
            </div>

            {{-- DEFAULT --}}
            <div class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button collapsed custom-orange" type="button" data-bs-toggle="collapse"
                        data-bs-target="#default-academic-year-list" aria-expanded="false"
                        aria-controls="default-academic-year-list">
                        Default Academic Year and Semester
                    </button>
                </h2>
                <div id="default-academic-year-list" class="accordion-collapse collapse"
                    data-bs-parent="#accordionFlushExample">
                    <section class="col-lg-12">
                        <article class="card">
                            <div class="card-body">
                                <h5 class="card-title">
                                    Default Academic Year and Semester | <span class="default-text"></span>
                                </h5>
                                <form class="row g-3 needs-validation" id="default_acad_form" novalidate>
                                    @csrf
                                    <div class="col-md-6">
                                        <label for="school_year" class="form-label">School Year | 
                                            <span class="academic-year-default-text"></span>
                                        </label>
                                        <select class="form-select" id="school_year" name="school_year" required>
                                            <option selected disabled value="">Select Academic Year</option>
                                            @foreach ($academicYears as $academicYear)
                                                <option value="{{ $academicYear->year_start.'-'.$academicYear->year_end }}">
                                                    {{ $academicYear->year_start.'-'.$academicYear->year_end }}
                                                </option>
                                            @endforeach
                                        </select>
                                        <div class="invalid-feedback"></div>
                                    </div>

                                    <div class="col-md-6">
                                        <label for="semester" class="form-label">Semester | 
                                            <span class="semester-default-text"></span>
                                        </label>
                                        <select class="form-select" id="semester" name="semester" required>
                                            <option selected disabled value="">Select Semester</option>
                                            <option value="1st Semester">1st</option>
                                            <option value="2nd Semester">2nd</option>
                                        </select>
                                        <div class="invalid-feedback"></div>
                                    </div>

                                    <div class="col-md-6 mt-3">
                                        <button type="button" class="btn btn-primary px-2" id="submit-default-acad">
                                            Set as Default
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </article>
                    </section>
                </div>
            </div>

        </div>
    </div>
</div>


<script>
    // FOR RESET VALIDATION FOR ACADEMIC YEAR FORM :D
    document.addEventListener("DOMContentLoaded", function () {
        const form = document.getElementById("academic-year-form");

        form?.addEventListener("reset", function () {
            form.classList.remove("was-validated");
        });
        
        const schoolYear = document.getElementById("school_year");
        
        schoolYear?.addEventListener("reset", function () {
            schoolYear.classList.remove("was-validated");
        });
    });


    document.addEventListener("DOMContentLoaded", function () {
        const form = document.getElementById("default_acad_form");

        form?.addEventListener("reset", function () {
            form.classList.remove("was-validated");
        });

        const schoolYear = document.getElementById("school_year");
        const semester = document.getElementById("semester");

        schoolYear?.addEventListener("reset", function () {
            schoolYear.classList.remove("was-validated");
        });

        semester?.addEventListener("reset", function () {
            semester.classList.remove("was-validated");
        });

        const submitButton = document.getElementById("submit-default-acad");
        submitButton?.addEventListener("click", function () {
            form.classList.remove("was-validated");
            schoolYear.classList.remove("is-invalid");
            schoolYear.classList.remove("is-valid");
            semester.classList.remove("is-invalid");
            semester.classList.remove("is-valid");

            form.classList.add("was-validated");
        });
    });
</script>




@include('layouts.modals.settings_modal')
@endsection
@section('scripts')
<script src="{{ asset('js/settings.js') }}"> </script>
@endsection