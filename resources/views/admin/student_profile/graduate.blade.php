@extends('layouts.app')
@section('content')

    <div class="container">
    @if(Auth::user()->position != 5)
        <div class="row">
            <section class="col-lg-12">    
                <article class="card">
                    <div class="card-body">
                        <h5 class="card-title">Distribution of Graduates by Program</h5>
                        <form class="row g-3 needs-validation" id="graduate-hdr-form" novalidate>
                            @csrf
                    
                            <div class="col-md-4">
                                <label for="semester" class="form-label">Semester</label>
                                <select class="form-select" id="semester" name="semester" required>
                                    <option selected @readonly(true) value="{{ $defaultAcademicYears->semester }}">{{ $defaultAcademicYears->semester }}</option>
                                    <option value="1st Semester">1st</option>
                                    <option value="2nd Semester">2nd</option>
                                </select>
                                <div class="valid-feedback">
                                    Looks good!
                                </div>
                            </div>
            
                            <div class="col-md-4">
                                <label for="school_year" class="form-label">School Year</label>
                                <select class="form-select" id="school_year" name="school_year" required>
                                    <option selected @readonly(true) value="{{ $defaultAcademicYears->school_year }}">{{ $defaultAcademicYears->school_year }}</option>
                                    @foreach ($academicYears as $academicYear)
                                    <option value="{{ $academicYear->year_start.'-'.$academicYear->year_end }}">{{ $academicYear->year_start.'-'.$academicYear->year_end  }}</option>
                                    @endforeach
                                </select>
                                <div class="valid-feedback">
                                    Looks good!
                                </div>
                            </div>
            
                            <div class="col-md-4">
                                <label for="school_year" class="form-label">Date</label>
                                <input type="date" class="form-control" id="graduate_date" name="graduate_date" required>
                                <div class="valid-feedback">
                                    Looks good!
                                </div>
                            </div>

                            <div class="col-md-6">
                                <label for="school_year" class="form-label">Program</label>
                                <select class="form-select" id="program_id" name="program_id" required>
                                    <option selected disabled value="">Select Program</option>
                                    @foreach ($programs as $program)
                                        <option value="{{ $program->id }}">{{ ucwords($program->program) }}</option>
                                    @endforeach
                                </select>
                                <div class="valid-feedback">
                                    Looks good!
                                </div>
                            </div>

                            <div class="col-md-6">
                                <label for="number_of_student" class="form-label">Number of Student</label>
                                <input type="number" class="form-control" id="number_of_student" name="number_of_student" required>
                                <div class="valid-feedback">
                                    Looks good!
                                </div>
                            </div>
                            <div class="col-md-6">
                                <button type="button" class="btn btn-outline-info btn-sm px-4" id="submit-graduate-hdr-btn">
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
                        <h5 class="card-title">Graduate List</h5>
                        <div class="d-flex justify-content-between mb-3">
                            <form class="form-inline">
                                <input class="form-control mr-sm-2" type="search" oninput="searchGraduate(value)" placeholder="Search" aria-label="Search">
                            </form>
                        
                            <!-- <form class="form-inline">
                                <select class="form-select ml-2" id="filter-status">
                                    <option value="" selected>Filter Semester</option>
                                    <option value="1st Semester">1st Semester</option>
                                    <option value="2nd Semester">2nd Semester</option>
                                </select>
                            </form> -->
                            <!-- <div class="ms-auto d-flex">
                                <button type="button" class="btn btn-outline-info" id="print-graduate">
                                    <i class="bi bi-printer-fill"></i>
                                </button>
                            </div> -->
                            <form class="form-inline ms-2">
                                <select class="form-select" id="graduate-years" aria-label="Filter Academic Year">
                                    <option value="" selected>Filter Academic Year</option>
                                    @foreach ($academicYears as $defaultAcademicYears)
                                        <option value="{{ $academicYear->school_year }}">{{ $academicYear->school_year }}</option>
                                    @endforeach
                                </select>
                            </form>

                            <div class="ms-auto d-flex">
                                <form id="graduateCsvDownloadForm" class="from-inline" method="GET" action="{{ route('GraduateCSV') }}">
                                    <input type="hidden" name="year" id="graduateCsvYearInput">
                                    @if(Auth::user()->position == 1)
                                    <button type="submit" class="btn btn-outline-info">
                                        <i class="bi bi-printer-fill"> CSV </i>
                                    </button>
                                    @endif
                                </form>
                            </div>

                        </div>
                        <div id="graduate-header-table"></div>
                    </div>
                </article>
            </section>
        </div>
    </div>


<script>
    // FOR RESET VALIDATION FOR GRADUATE HDR FORM :D
    document.addEventListener("DOMContentLoaded", function () {
        const form = document.getElementById("graduate-hdr-form");

        form?.addEventListener("reset", function () {
            form.classList.remove("was-validated");
        });
    });
</script>



@include('layouts.modals.student_profile_modals.graduate_modal')
@endsection
@section('scripts')
<script src="{{ asset('js/student_profile/graduate.js') }}"> </script>
@endsection