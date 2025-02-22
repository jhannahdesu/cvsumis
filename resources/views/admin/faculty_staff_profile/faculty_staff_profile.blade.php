@extends('layouts.app')
@section('content')

    <div class="container">
        {{-- <div class="row">
            <div class="col-md-6">
                <label for="semester" class="form-label">Semester</label>
                <select class="form-select" id="default_semester" name="default_semester" required>
                    <option selected disabled >Select Semester</option>
                    <option value="1st Semester">1st</option>
                    <option value="2nd Semester">2nd</option>
                </select>
                <div class="valid-feedback">
                    Looks good!
                </div>
            </div>

            <div class="col-md-6">
                <label for="school_year" class="form-label">School Year</label>
                <select class="form-select" id="default_school_year" name="default_school_year" required>
                    <option selected disabled >Select Academic Year</option>
                    @foreach ($academicYears as $academicYear)
                        <option value="{{ $academicYear->year_start.'-'.$academicYear->year_end }}">{{ $academicYear->year_start.'-'.$academicYear->year_end  }}</option>
                    @endforeach
                </select>
                <div class="valid-feedback">
                    Looks good!
                </div>
            </div>
        </div> --}}
        
        {{-- Faculty profile by educational attainment  --}}
@if(Auth::user()->position != 4)
    <div class="row mt-2">
        <div class="accordion accordion-flush" id="accordionFlushExample">
            <div class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#Faculty-profile-by-educational-attainment" aria-expanded="false" aria-controls="Faculty-profile-by-educational-attainment">
                        Faculty profile by educational attainment 
                    </button>
                </h2>
                <div id="Faculty-profile-by-educational-attainment" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                    <section class="col-lg-12">    
                        <article class="card">
                            <div class="card-body">
                                <h5 class="card-title">Faculty profile by educational attainment List</h5>
                                <div class="d-flex justify-content-between mb-3">
                                    <form class="form-inline">
                                        <input class="form-control mr-sm-2" type="search" oninput="searcheducationalAttainments(value)" placeholder="Search" aria-label="Search">
                                    </form>

                                    <form class="form-inline">
                                        <select class="form-select ml-2" id="default_semester">
                                            <option value="" selected disabled>Select Semester</option>
                                            <option value="1st Semester">1st Semester</option>
                                            <option value="2nd Semester">2nd Semester</option>
                                        </select>
                                    </form>

                                    <div class="ms-auto d-flex">
                                    @if(Auth::user()->position != 5)
                                        <button type="button" class="btn btn-outline-primary me-2" id="education-attainment-modal">
                                            <i class="bi bi-plus-circle-fill"></i>
                                        </button>
                                    @endif
                                        <form id="educationalAttainmentCsvDownloadForm" class="form-inline" method="GET" action="{{ route('EducationalAttainmentCSV') }}">
                                            <input type="hidden" name="school_year" id="educationalAttainmentCsvYearInput">
                                            <input type="hidden" name="semester" id="educationalAttainmentCsvSemesterInput">
                                            @if(Auth::user()->position == 1)
                                            <button type="submit" class="btn btn-outline-info">
                                                <i class="bi bi-printer-fill"> CSV </i>
                                            </button>
                                            @endif
                                        </form>
                                    </div>
                                </div>
                                <div id="educational-attainment-table"></div>
                            </div>
                        </article>
                    </section>
                </div>
            </div>
        </div>
    </div>

        {{-- Faculty profile by nature of appointment   --}}
        <div class="row">
            <div class="accordion accordion-flush" id="accordionFlushExample">
                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#Faculty-profile-by-nature-of-appointment" aria-expanded="false" aria-controls="Faculty-profile-by-nature-of-appointment">
                            Faculty profile by nature of appointment  
                        </button>
                    </h2>
                    <div id="Faculty-profile-by-nature-of-appointment" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                        <section class="col-lg-12">    
                            <article class="card">
                                <div class="card-body">
                                    <h5 class="card-title">Faculty profile by nature of appointment List</h5>
                                    <div class="d-flex justify-content-between mb-3">
                                        <form class="form-inline">
                                            <input class="form-control mr-sm-2" type="search" oninput="searchnatureAppointments(value)" placeholder="Search" aria-label="Search">
                                        </form>
                                    
                                        <form class="form-inline">
                                        <select class="form-select ml-2" id="nature_default_semester">
                                            <option value="" selected>Select Semester</option>
                                            <option value="1st Semester">1st Semester</option>
                                            <option value="2nd Semester">2nd Semester</option>
                                        </select>
                                        </form>
                                        <div class="ms-auto d-flex">
                                        @if(Auth::user()->position != 5)
                                            <button type="button" class="btn btn-outline-primary me-2" id="nature-appointment-modal">
                                                <i class="bi bi-plus-circle-fill"></i>
                                            </button>
                                        @endif
                                            <form id="natureAppointmentCsvDownloadForm" class="form-inline" method="GET" action="{{ route('NatureAppointmentCSV') }}">
                                                <input type="hidden" name="school_year" id="natureAppointmentCsvYearInput">
                                                <input type="hidden" name="semester" id="natureAppointmentCsvSemesterInput">
                                                @if(Auth::user()->position == 1)
                                                <button type="submit" class="btn btn-outline-info">
                                                    <i class="bi bi-printer-fill"> CSV </i>
                                                </button>
                                                @endif
                                            </form>
                                        </div>
                                    </div>
                                    <div id="nature-appointment-table"></div>
                                </div>
                            </article>
                        </section>
                    </div>
                </div>
            </div>
        </div>

        {{--  Faculty profile by academic rank --}}
        <div class="row">
            <div class="accordion accordion-flush" id="accordionFlushExample">
                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#Faculty-profile-by-academic-rank" aria-expanded="false" aria-controls="Faculty-profile-by-academic-rank">
                            Faculty profile by academic rank
                        </button>
                    </h2>
                    <div id="Faculty-profile-by-academic-rank" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                        <section class="col-lg-12">    
                            <article class="card">
                                <div class="card-body">
                                    <h5 class="card-title">Faculty profile by academic rank List</h5>
                                    <div class="d-flex justify-content-between mb-3">
                                        <form class="form-inline">
                                            <input class="form-control mr-sm-2" type="search" oninput="searchacademicRanks(value)" placeholder="Search" aria-label="Search">
                                        </form>

                                        <form class="form-inline">
                                    <select class="form-select ml-2" id="academic_rank_semester">
                                        <option value="" selected>Select Semester</option>
                                        <option value="1st Semester">1st Semester</option>
                                        <option value="2nd Semester">2nd Semester</option>
                                    </select>
                                </form>

                                <div class="ms-auto d-flex">
                                @if(Auth::user()->position != 5)
                                    <button type="button" class="btn btn-outline-primary me-2" id="academic-rank-modal">
                                        <i class="bi bi-plus-circle-fill"></i>
                                    </button>
                                @endif
                                    <form id="academicRankCsvDownloadForm" class="form-inline" method="GET" action="{{ route('AcademicRankCSV') }}">
                                        <input type="hidden" name="school_year" id="academicRankCsvYearInput">
                                        <input type="hidden" name="semester" id="academicRankCsvSemesterInput">
                                        @if(Auth::user()->position == 1)
                                        <button type="submit" class="btn btn-outline-info">
                                            <i class="bi bi-printer-fill"> CSV </i>
                                        </button>
                                        @endif
                                    </form>
                                </div>
                                    </div>
                                    <div id="academic-rank-table"></div>
                                </div>
                            </article>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    @endif
        {{--  List of faculty scholars --}}
        <div class="row">
            <div class="accordion accordion-flush" id="accordionFlushExample">
                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#List-of-faculty-scholars" aria-expanded="false" aria-controls="List-of-faculty-scholars">
                            Faculty scholars
                        </button>
                    </h2>
                    <div id="List-of-faculty-scholars" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                        <section class="col-lg-12">    
                            <article class="card">
                                <div class="card-body">
                                    <h5 class="card-title"> List of faculty scholars</h5>
                                    <div class="d-flex justify-content-between mb-3">
                                        <form class="form-inline">
                                            <input class="form-control mr-sm-2" type="search" oninput="searchfacultyScholars(value)" placeholder="Search" aria-label="Search">
                                        </form>
                                        <div class="ms-auto d-flex">
                                        @if(Auth::user()->position != 5)
                                            <button type="button" class="btn btn-outline-primary me-2" id="faculty-scholar-modal">
                                                <i class="bi bi-plus-circle-fill"></i>
                                            </button>
                                        @endif
                                            <form id="facultyScholarCsvDownloadForm" class="form-inline" method="GET" action="{{ route('FacultyScholarCSV') }}">
                                                <input type="hidden" name="school_year" id="facultyScholarCsvYearInput">
                                                <input type="hidden" name="semester" id="facultyScholarCsvSemesterInput">
                                                @if(Auth::user()->position == 1)
                                                <button type="submit" class="btn btn-outline-info">
                                                    <i class="bi bi-printer-fill"> CSV </i>
                                                </button>
                                                @endif
                                            </form>
                                        </div>
                                    </div>
                                    <div id="faculty-scholar-table"></div>
                                </div>
                            </article>
                        </section>
                    </div>
                </div>
            </div>
        </div>

        {{--  List of faculty Members who completed their Graduated Studies  --}}
        <div class="row">
            <div class="accordion accordion-flush" id="accordionFlushExample">
                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#List-of-faculty-Members-who-completed-their-Graduated-Studies" aria-expanded="false" aria-controls="List-of-faculty-Members-who-completed-their-Graduated-Studies">
                            Graduated Studies 
                        </button>
                    </h2>
                    <div id="List-of-faculty-Members-who-completed-their-Graduated-Studies" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                        <section class="col-lg-12">    
                            <article class="card">
                                <div class="card-body">
                                    <h5 class="card-title"> Graduated Studies </h5>
                                    <div class="d-flex justify-content-between mb-3">
                                        <form class="form-inline">
                                            <input class="form-control mr-sm-2" type="search" oninput="searchfacultyGraduateStudies(value)" placeholder="Search" aria-label="Search">
                                        </form>
                                
                                        <div class="ms-auto d-flex">
                                    @if(Auth::user()->position != 5)
                                    <button type="button" class="btn btn-outline-primary me-2" id="faculty-graduate-studies-modal">
                                        <i class="bi bi-plus-circle-fill"></i>
                                    </button>
                                    @endif
                                    <form id="facultyGraduateStudiesCsvDownloadForm" class="form-inline" method="GET" action="{{ route('FacultyGraduateStudiesCSV') }}">
                                        <input type="hidden" name="school_year" id="facultyGraduateStudiesCsvYearInput">
                                        <input type="hidden" name="semester" id="facultyGraduateStudiesCsvSemesterInput">
                                        @if(Auth::user()->position == 1)
                                        <button type="submit" class="btn btn-outline-info">
                                            <i class="bi bi-printer-fill"> CSV </i>
                                        </button>
                                        @endif
                                    </form>
                                </div>
                                    </div>
                                    <div id="faculty-graduate-studies-table"></div>
                                </div>
                            </article>
                        </section>
                    </div>
                </div>
            </div>
        </div>

        {{--  List of local seminars and trainings attended by faculty members  --}}
        <div class="row">
            <div class="accordion accordion-flush" id="accordionFlushExample">
                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#List-of-local-seminars-and-trainings-attended-by-faculty-members" aria-expanded="false" aria-controls="List-of-local-seminars-and-trainings-attended-by-faculty-members">
                            Seminars and trainings attended
                        </button>
                    </h2>
                    <div id="List-of-local-seminars-and-trainings-attended-by-faculty-members" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                        <section class="col-lg-12">    
                            <article class="card">
                                <div class="card-body">
                                    <h5 class="card-title">  List of seminars and trainings attended </h5>
                                    <div class="d-flex justify-content-between mb-3">
                                        <form class="form-inline">
                                            <input class="form-control mr-sm-2" type="search" oninput="searchseminarTrainings(value)" placeholder="Search" aria-label="Search">
                                        </form>

                                        <div class="ms-auto d-flex">
                                    @if(Auth::user()->position != 5)
                                    <button type="button" class="btn btn-outline-primary me-2" id="seminar-training-modal">
                                        <i class="bi bi-plus-circle-fill"></i>
                                    </button>
                                    @endif
                                    <form id="seminarTrainingCsvDownloadForm" class="form-inline" method="GET" action="{{ route('SeminarsAndTrainingCSV') }}">
                                        <input type="hidden" name="school_year" id="seminarTrainingCsvYearInput">
                                        <input type="hidden" name="semester" id="seminarTrainingCsvSemesterInput">
                                        @if(Auth::user()->position == 1)
                                        <button type="submit" class="btn btn-outline-info">
                                            <i class="bi bi-printer-fill"> CSV </i>
                                        </button>
                                        @endif
                                    </form>
                                </div>
                                    </div>
                                    <div id="seminar-training-table"></div>
                                </div>
                            </article>
                        </section>
                    </div>
                </div>
            </div>
        </div>

        {{-- List of recognition and award received by the faculty members --}}
        <div class="row">
            <div class="accordion accordion-flush" id="accordionFlushExample">
                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#List-of-recognition-and-award-received-by-the-faculty-members" aria-expanded="false" aria-controls="List-of-recognition-and-award-received-by-the-faculty-members">
                            Recognition and award received
                        </button>
                    </h2>
                    <div id="List-of-recognition-and-award-received-by-the-faculty-members" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                        <section class="col-lg-12">    
                            <article class="card">
                                <div class="card-body">
                                    <h5 class="card-title">  List of recognition and award received </h5>
                                    <div class="d-flex justify-content-between mb-3">
                                        <form class="form-inline">
                                            <input class="form-control mr-sm-2" type="search" oninput="searchrecognitions(value)" placeholder="Search" aria-label="Search">
                                        </form>

                                        <div class="ms-auto d-flex">
                                    @if(Auth::user()->position != 5)
                                    <button type="button" class="btn btn-outline-primary me-2" id="recognition-modal">
                                        <i class="bi bi-plus-circle-fill"></i>
                                    </button>
                                    @endif
                                    <form id="recognitionCsvDownloadForm" class="form-inline" method="GET" action="{{ route('RecognitionAndAwardCSV') }}">
                                        <input type="hidden" name="school_year" id="recognitionCsvYearInput">
                                        <input type="hidden" name="semester" id="recognitionCsvSemesterInput">
                                        @if(Auth::user()->position == 1)
                                        <button type="submit" class="btn btn-outline-info">
                                            <i class="bi bi-printer-fill"> CSV </i>
                                        </button>
                                        @endif
                                    </form>
                                </div>
                                    </div>
                                    <div id="recognition-table"></div>
                                </div>
                            </article>
                        </section>
                    </div>
                </div>
            </div>
        </div>

        {{-- List of paper presentations of the faculty members   --}}
        <div class="row">
            <div class="accordion accordion-flush" id="accordionFlushExample">
                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#List-of-paper-presentations-of-the-faculty-members" aria-expanded="false" aria-controls="List-of-paper-presentations-of-the-faculty-members">
                           Paper presentations
                        </button>
                    </h2>
                    <div id="List-of-paper-presentations-of-the-faculty-members" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                        <section class="col-lg-12">    
                            <article class="card">
                                <div class="card-body">
                                    <h5 class="card-title">  List of paper presentations </h5>
                                    <div class="d-flex justify-content-between mb-3">
                                        <form class="form-inline">
                                            <input class="form-control mr-sm-2" type="search" oninput="searchpresentations(value)" placeholder="Search" aria-label="Search">
                                        </form>
                                    
                                        <div class="ms-auto d-flex">
                                    @if(Auth::user()->position != 5)
                                    <button type="button" class="btn btn-outline-primary me-2" id="presentation-modal">
                                        <i class="bi bi-plus-circle-fill"></i>
                                    </button>
                                    @endif
                                    <form id="presentationCsvDownloadForm" class="form-inline" method="GET" action="{{ route('PresentationCSV') }}">
                                        <input type="hidden" name="school_year" id="presentationCsvYearInput">
                                        <input type="hidden" name="semester" id="presentationCsvSemesterInput">
                                        @if(Auth::user()->position == 1)
                                        <button type="submit" class="btn btn-outline-info">
                                            <i class="bi bi-printer-fill"> CSV </i>
                                        </button>
                                        @endif
                                    </form>
                                </div>
                                    </div>
                                    <div id="presentation-table"></div>
                                </div>
                            </article>
                        </section>
                    </div>
                </div>
            </div>
        </div>

    </div>
@include('layouts.modals.faculty_staff_profile_modals.faculty_staff_profile_modal')
@endsection
@section('scripts')
<script src="{{ asset('js/faculty_staff_profile/faculty_staff_profile.js') }}"> </script>
@endsection