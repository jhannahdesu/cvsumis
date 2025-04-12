@extends('layouts.app')
@section('content')
<script>
    window.userPosition = {{ Auth::user()->position }};
</script>

<div class="container">
    <div class="row">
        <div class="accordion" id="accordionFlushExample">

            {{-- Accordion Item: Accreditation Status --}}
            <div class="accordion-item">
                <h2 class="accordion-header" id="headingOne">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#Accreditation-status-of-academic-programs" aria-expanded="false" aria-controls="Accreditation-status-of-academic-programs">
                        Accreditation status of academic programs 
                    </button>
                </h2>
                <div id="Accreditation-status-of-academic-programs" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                    <section class="col-lg-12">    
                        <article class="card">
                            <div class="card-body">
                                <h5 class="card-title">Accreditation status of academic programs</h5>
                                <div class="d-flex justify-content-between mb-3">
                                    <form class="form-inline">
                                        <input class="form-control mr-sm-2" type="search" oninput="searchAcademicProgram(value)" placeholder="ex.BS Agricultural And Biosystems Engineering" aria-label="Search">
                                    </form>
                                    <div class="form-group ms-2">
                                        <select id="accreditation-status-years" class="form-select" aria-label="Filter Year">
                                            <option value="" selected>All Data</option>
                                        </select>
                                    </div>
                                    <div class="ms-auto d-flex">
                                        @if(Auth::user()->position != 5)
                                            <button type="button" class="btn btn-outline-primary me-2" id="accreditation-status-modal">
                                                <i class="bi bi-plus-circle-fill"></i>
                                            </button>
                                        @endif
                                        <form id="csvDownloadForm" class="from-inline" method="GET" action="{{ route('AccreditationStatusCSV') }}">
                                            <input type="hidden" name="year" id="csvYearInput">
                                            <button type="submit" class="btn btn-outline-info">
                                                <i class="bi bi-printer-fill"> CSV </i>
                                            </button>
                                        </form>
                                    </div>
                                </div>
                                <div id="accreditation-status-table"></div>
                            </div>
                        </article>
                    </section>
                </div>
            </div>

            {{-- Accordion Item: Government Recognition --}}
            <div class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#Academic-programs-with-Government-Recognition" aria-expanded="false" aria-controls="Academic-programs-with-Government-Recognition">
                        Academic programs with Government Recognition (CoPC) 
                    </button>
                </h2>
                <div id="Academic-programs-with-Government-Recognition" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                    <section class="col-lg-12">    
                        <article class="card">
                            <div class="card-body">
                                <h5 class="card-title">Academic programs with Government Recognition (CoPC)</h5>
                                <div class="d-flex justify-content-between mb-3">
                                    <form class="form-inline">
                                        <input class="form-control me-2" type="search" oninput="searchRecognition(value)" placeholder="ex. BS Information Technology" aria-label="Search" style="width: 250px;">
                                    </form>
                                    <div class="form-group ms-2">
                                        <select id="gov-recognition-years" class="form-select" aria-label="Filter Year">
                                            <option value="" selected>All Data</option>
                                        </select>
                                    </div>
                                    <div class="ms-auto d-flex">
                                        @if(Auth::user()->position != 5)
                                            <button type="button" class="btn btn-outline-primary me-2" id="gov-recognition-modal">
                                                <i class="bi bi-plus-circle-fill"></i>
                                            </button>
                                        @endif
                                        <form id="govRecognitionCsvDownloadForm" class="form-inline" method="GET" action="{{ route('GovRecognitionCSV') }}">
                                            <input type="hidden" name="year" id="govRecognitionCsvYearInput">
                                            <button type="submit" class="btn btn-outline-info">
                                                <i class="bi bi-printer-fill"> CSV </i>
                                            </button>
                                        </form>
                                    </div>
                                </div>
                                <div id="gov-recognition-table"></div>
                            </div>
                        </article>
                    </section>
                </div>
            </div>

            {{-- Performance in the licensure examination --}}
            <div class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#Performance-in-the-licensure-examination" aria-expanded="false" aria-controls="Performance-in-the-licensure-examination">
                        Performance in the licensure examination
                    </button>
                </h2>
                <div id="Performance-in-the-licensure-examination" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                    <section class="col-lg-12">    
                        <article class="card">
                            <div class="card-body">
                                <h5 class="card-title">Performance in the licensure examination</h5>
                                <div class="d-flex justify-content-between mb-3">
                                    <form class="form-inline">
                                        <input class="form-control mr-sm-2" type="search" oninput="searchlicensureExam(value)" placeholder="ex. Architecture" aria-label="Search">
                                    </form>

                                    <div class="form-group ms-2">
                                        <select id="licensure-exam-years" class="form-select" aria-label="Filter Year">
                                            <option value="" selected>All Data</option>
                                        </select>
                                    </div>
                                    <div class="ms-auto d-flex">
                                        @if(Auth::user()->position != 5)
                                            <button type="button" class="btn btn-outline-primary me-2" id="licensure-exam-modal">
                                                <i class="bi bi-plus-circle-fill"></i>
                                            </button>
                                        @endif
                                        <form id="licensureExamCsvDownloadForm" class="form-inline" method="GET" action="{{ route('LicensureExamCSV') }}">
                                            <input type="hidden" name="year" id="licensureExamCsvYearInput">
                                            <button type="submit" class="btn btn-outline-info">
                                                <i class="bi bi-printer-fill"> CSV </i>
                                            </button>
                                        </form>
                                    </div>
                                </div>
                                <div id="licensure-axam-table"></div>
                            </div>
                        </article>
                    </section>
                </div>
            </div>

            {{-- List of faculty members with national TVET qualification and certification --}}
            <div class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#List-of-faculty-members-with-national-TVET" aria-expanded="false" aria-controls="List-of-faculty-members-with-national-TVET">
                        List of faculty members with national TVET qualification and certification 
                    </button>
                </h2>
                <div id="List-of-faculty-members-with-national-TVET" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                    <section class="col-lg-12">    
                        <article class="card">
                            <div class="card-body">
                                <h5 class="card-title">List of faculty members with national TVET qualification and certification </h5>
                                <div class="d-flex justify-content-between mb-3">
                                <form class="form-inline">
                                    <input class="form-control me-2" type="search" oninput="searchfacultyTvets(value)" placeholder="Holder Name" aria-label="Search" style="width: 250px;">
                                </form>
                                    
                                    <div class="form-group ms-2">
                                        <select id="faculty-tvet-years" class="form-select" aria-label="Filter Year">
                                            <option value="" selected>All Data</option>
                                        </select>
                                    </div>
                                    <div class="ms-auto d-flex">
                                    @if(Auth::user()->position != 5)
                                        <button type="button" class="btn btn-outline-primary me-2" id="faculty-tvet-modal">
                                            <i class="bi bi-plus-circle-fill"></i>
                                        </button>
                                    @endif
                                        <form id="csvDownloadForm" class="from-inline" method="GET" action="{{ route('FacultyTvetCSV') }}">
                                            <input type="hidden" name="year" id="facultyTvetYearInput">
                                            
                                            <button type="submit" class="btn btn-outline-info">
                                                <i class="bi bi-printer-fill"> CSV </i>
                                            </button>
                                            
                                        </form>
                                    </div>
                                </div>
                                <div id="faculty-tvet-table"></div>
                            </div>
                        </article>
                    </section>
                </div>
            </div>

            {{-- Number of students with national TVET qualification and certification --}}
            <div class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#Number-of-students-with-national-TVET" aria-expanded="false" aria-controls="Number-of-students-with-national-TVET">
                        Number of students with national TVET qualification and certification 
                    </button>
                </h2>
                <div id="Number-of-students-with-national-TVET" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                    <section class="col-lg-12">    
                        <article class="card">
                            <div class="card-body">
                                <h5 class="card-title">Number of students with national TVET qualification and certification </h5>
                                <div class="d-flex justify-content-between mb-3">
                                    <form class="form-inline">
                                        <input class="form-control mr-sm-2" type="search" oninput="searchstudentTvets(value)" placeholder="ex. National Certificate I" aria-label="Search">
                                    </form>
                                    <div class="form-group ms-2">
                                        <select id="student-tvet-years" class="form-select" aria-label="Filter Year">
                                            <option value="" selected>All Data in Years</option>
                                        </select>
                                    </div>
                                    <div class="ms-auto d-flex">
                                    @if(Auth::user()->position != 5)
                                        <button type="button" class="btn btn-outline-primary me-2" id="student-tvet-modal">
                                            <i class="bi bi-plus-circle-fill"></i>
                                        </button>
                                    @endif
                                        <form id="studentTvetCsvDownloadForm" class="form-inline" method="GET" action="{{ route('StudentTvetCSV') }}">
                                            <input type="hidden" name="year" id="studentTvetCsvYearInput">
                                            <button type="submit" class="btn btn-outline-info">
                                                <i class="bi bi-printer-fill"> CSV </i>
                                            </button>
                                        </form>
                                    </div>
                                </div>
                                <div id="student-tvet-table"></div>
                            </div>
                        </article>
                    </section>
                </div>
            </div>
        </div>
    </div>
</div>



@include('layouts.modals.curriculum_modals.curriculum_modal')
@endsection
@section('scripts')
<script src="{{ asset('js/currcullum/curriculum.js') }}"> </script>
@endsection