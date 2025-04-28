@extends('layouts.app')
@section('content')
<script>
    window.userPosition = {{ Auth::user()->position }};
</script>

<div class="container">
    <div class="row">
        <div class="accordion mt-2" id="accordionFlushExample">
        <!-- @if(Auth::user()->position != 5) -->
            {{-- Faculty Profile by Educational Attainment --}}
            <div class="accordion-item">
                <h2 class="accordion-header" id="headingEducationalAttainment">
                    <button class="accordion-button collapsed custom-orange" type="button" data-bs-toggle="collapse" data-bs-target="#collapseEducationalAttainment" aria-expanded="false" aria-controls="collapseEducationalAttainment">
                        Educational Attainment
                    </button>
                </h2>
                <div id="collapseEducationalAttainment" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                    <section class="col-lg-12">    
                        <article class="card">
                            <div class="card-body">
                                <h5 class="card-title">List of Educational Attainment</h5>
                                <div class="d-flex justify-content-between mb-3">
                                    <form class="form-inline">
                                        <input class="form-control" type="search" oninput="searcheducationalAttainments(value)" placeholder="Search" aria-label="Search">
                                    </form>

                                    <form class="form-inline ms-2">
                                        <select class="form-select" id="default_semester">
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
                                        <form id="educationalAttainmentCsvDownloadForm" method="GET" action="{{ route('EducationalAttainmentCSV') }}">
                                            <input type="hidden" name="school_year" id="educationalAttainmentCsvYearInput">
                                            <input type="hidden" name="semester" id="educationalAttainmentCsvSemesterInput">
                                            
                                            <button type="submit" class="btn btn-outline-info">
                                                <i class="bi bi-printer-fill"></i> CSV
                                            </button>
                                        </form>
                                    </div>
                                </div>
                                <div id="educational-attainment-table"></div>
                            </div>
                        </article>
                    </section>
                </div>
            </div>

            {{-- Faculty Profile by Nature of Appointment --}}
            <div class="accordion-item">
                <h2 class="accordion-header" id="headingNatureAppointment">
                    <button class="accordion-button collapsed custom-orange" type="button" data-bs-toggle="collapse" data-bs-target="#collapseNatureAppointment" aria-expanded="false" aria-controls="collapseNatureAppointment">
                        Nature of Appointment
                    </button>
                </h2>
                <div id="collapseNatureAppointment" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                    <section class="col-lg-12">    
                        <article class="card">
                            <div class="card-body">
                                <h5 class="card-title">List of Nature of Appointment</h5>
                                <div class="d-flex justify-content-between mb-3">
                                    <form class="form-inline">
                                        <input class="form-control" type="search" oninput="searchnatureAppointments(value)" placeholder="Search" aria-label="Search">
                                    </form>

                                    <form class="form-inline ms-2">
                                        <select class="form-select" id="nature_default_semester">
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
                                        <form id="natureAppointmentCsvDownloadForm" method="GET" action="{{ route('NatureAppointmentCSV') }}">
                                            <input type="hidden" name="school_year" id="natureAppointmentCsvYearInput">
                                            <input type="hidden" name="semester" id="natureAppointmentCsvSemesterInput">
                                            
                                            <button type="submit" class="btn btn-outline-info">
                                                <i class="bi bi-printer-fill"></i> CSV
                                            </button>
                                        </form>
                                    </div>
                                </div>
                                <div id="nature-appointment-table"></div>
                            </div>
                        </article>
                    </section>
                </div>
            </div>

            {{-- Faculty Profile by Academic Rank --}}
            <div class="accordion-item">
                <h2 class="accordion-header" id="headingAcademicRank">
                    <button class="accordion-button collapsed custom-orange" type="button" data-bs-toggle="collapse" data-bs-target="#collapseAcademicRank" aria-expanded="false" aria-controls="collapseAcademicRank">
                        Academic Rank
                    </button>
                </h2>
                <div id="collapseAcademicRank" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                    <section class="col-lg-12">
                        <article class="card">
                            <div class="card-body">
                                <h5 class="card-title">List of Academic Rank</h5>
                                <div class="d-flex justify-content-between mb-3">
                                    <form class="form-inline">
                                        <input class="form-control" type="search" oninput="searchacademicRanks(value)" placeholder="Search" aria-label="Search">
                                    </form>

                                    <form class="form-inline ms-2">
                                        <select class="form-select" id="academic_rank_semester">
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
                                        <form id="academicRankCsvDownloadForm" method="GET" action="{{ route('AcademicRankCSV') }}">
                                            <input type="hidden" name="school_year" id="academicRankCsvYearInput">
                                            <input type="hidden" name="semester" id="academicRankCsvSemesterInput">
                                            
                                            <button type="submit" class="btn btn-outline-info">
                                                <i class="bi bi-printer-fill"></i> CSV
                                            </button>
                                        </form>
                                    </div>
                                </div>
                                <div id="academic-rank-table"></div>
                            </div>
                        </article>
                    </section>
                </div>
            </div>

        <!-- @endif -->

            {{-- Faculty Scholars --}}
            <div class="accordion-item">
                <h2 class="accordion-header" id="headingFacultyScholars">
                    <button class="accordion-button collapsed custom-orange" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFacultyScholars" aria-expanded="false" aria-controls="collapseFacultyScholars">
                        Faculty Scholars
                    </button>
                </h2>
                <div id="collapseFacultyScholars" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                    <section class="col-lg-12">
                        <article class="card">
                            <div class="card-body">
                                <h5 class="card-title">List of Faculty Scholars</h5>
                                <div class="d-flex justify-content-between mb-3">
                                    <form class="form-inline">
                                        <input class="form-control" type="search" oninput="searchfacultyScholars(value)" placeholder="Search" aria-label="Search">
                                    </form>
                                    
                                    <div class="ms-auto d-flex">
                                        @if(Auth::user()->position != 5)
                                            <button type="button" class="btn btn-outline-primary me-2" id="faculty-scholar-modal">
                                                <i class="bi bi-plus-circle-fill"></i>
                                            </button>
                                        @endif
                                        <form id="facultyScholarCsvDownloadForm" method="GET" action="{{ route('FacultyScholarCSV') }}">
                                            <input type="hidden" name="school_year" id="facultyScholarCsvYearInput">
                                            <input type="hidden" name="semester" id="facultyScholarCsvSemesterInput">
                                            
                                            <button type="submit" class="btn btn-outline-info">
                                                <i class="bi bi-printer-fill"></i> CSV
                                            </button>
                                        </form>
                                    </div>
                                </div>
                                <div id="faculty-scholar-table"></div>
                            </div>
                        </article>
                    </section>
                </div>
            </div>

            {{-- Accordion Item: Graduated Studies --}}
            <div class="accordion-item">
                <h2 class="accordion-header" id="headingGraduateStudies">
                    <button class="accordion-button collapsed custom-orange" type="button" data-bs-toggle="collapse" data-bs-target="#collapseGraduateStudies" aria-expanded="false" aria-controls="collapseGraduateStudies">
                        Faculty Members Who Completed Graduated Studies
                    </button>
                </h2>
                <div id="collapseGraduateStudies" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                    <section class="col-lg-12">
                        <article class="card">
                            <div class="card-body">
                                <h5 class="card-title">List of Faculty Members Who Completed Graduated Studies</h5>
                                <div class="d-flex justify-content-between mb-3">
                                    <form class="form-inline">
                                        <input class="form-control" type="search" oninput="searchfacultyGraduateStudies(value)" placeholder="Search" aria-label="Search">
                                    </form>

                                    <div class="ms-auto d-flex">
                                        @if(Auth::user()->position != 5)
                                            <button type="button" class="btn btn-outline-primary me-2" id="faculty-graduate-studies-modal">
                                                <i class="bi bi-plus-circle-fill"></i>
                                            </button>
                                        @endif
                                        <form id="facultyGraduateStudiesCsvDownloadForm" method="GET" action="{{ route('FacultyGraduateStudiesCSV') }}">
                                            <input type="hidden" name="school_year" id="facultyGraduateStudiesCsvYearInput">
                                            <input type="hidden" name="semester" id="facultyGraduateStudiesCsvSemesterInput">
                                            
                                            <button type="submit" class="btn btn-outline-info">
                                                <i class="bi bi-printer-fill"></i> CSV
                                            </button>
                                        </form>
                                    </div>
                                </div>
                                <div id="faculty-graduate-studies-table"></div>
                            </div>
                        </article>
                    </section>
                </div>
            </div>

            <div class="accordion-item">
                <h2 class="accordion-header" id="headingSeminarsTrainings">
                    <button class="accordion-button collapsed custom-orange" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSeminarsTrainings" aria-expanded="false" aria-controls="collapseSeminarsTrainings">
                        Seminars and Trainings Attended
                    </button>
                </h2>
                <div id="collapseSeminarsTrainings" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                    <section class="col-lg-12">
                        <article class="card">
                            <div class="card-body">
                                <h5 class="card-title">List of Seminars and Trainings Attended</h5>
                                <div class="d-flex justify-content-between mb-3">
                                    <form class="form-inline">
                                        <input class="form-control" type="search" oninput="searchseminarTrainings(value)" placeholder="Search" aria-label="Search">
                                    </form>
                                    <div class="ms-auto d-flex">
                                        @if(Auth::user()->position != 5)
                                            <button type="button" class="btn btn-outline-primary me-2" id="seminar-training-modal">
                                                <i class="bi bi-plus-circle-fill"></i>
                                            </button>
                                        @endif
                                        <form id="seminarTrainingCsvDownloadForm" method="GET" action="{{ route('SeminarsAndTrainingCSV') }}">
                                            <input type="hidden" name="school_year" id="seminarTrainingCsvYearInput">
                                            <input type="hidden" name="semester" id="seminarTrainingCsvSemesterInput">
                                            <button type="submit" class="btn btn-outline-info">
                                                <i class="bi bi-printer-fill"></i> CSV
                                            </button>
                                        </form>
                                    </div>
                                </div>
                                <div id="seminar-training-table"></div>
                            </div>
                        </article>
                    </section>
                </div>
            </div>

            <div class="accordion-item">
                <h2 class="accordion-header" id="headingRecognition">
                    <button class="accordion-button collapsed custom-orange" type="button" data-bs-toggle="collapse" data-bs-target="#collapseRecognition" aria-expanded="false" aria-controls="collapseRecognition">
                        Awards and Recognition Received
                    </button>
                </h2>
                <div id="collapseRecognition" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                    <section class="col-lg-12">
                        <article class="card">
                            <div class="card-body">
                                <h5 class="card-title">List of Awards and Recognition Received</h5>
                                <div class="d-flex justify-content-between mb-3">
                                    <form class="form-inline">
                                        <input class="form-control" type="search" oninput="searchrecognitions(value)" placeholder="Search" aria-label="Search">
                                    </form>
                                    <div class="ms-auto d-flex">
                                        @if(Auth::user()->position != 5)
                                            <button type="button" class="btn btn-outline-primary me-2" id="recognition-modal">
                                                <i class="bi bi-plus-circle-fill"></i>
                                            </button>
                                        @endif
                                        <form id="recognitionCsvDownloadForm" method="GET" action="{{ route('RecognitionAndAwardCSV') }}">
                                            <input type="hidden" name="school_year" id="recognitionCsvYearInput">
                                            <input type="hidden" name="semester" id="recognitionCsvSemesterInput">
                                            <button type="submit" class="btn btn-outline-info">
                                                <i class="bi bi-printer-fill"></i> CSV
                                            </button>
                                        </form>
                                    </div>
                                </div>
                                <div id="recognition-table"></div>
                            </div>
                        </article>
                    </section>
                </div>
            </div>

            <div class="accordion-item">
            <h2 class="accordion-header" id="headingPresentations">
                <button class="accordion-button collapsed custom-orange" type="button" data-bs-toggle="collapse" data-bs-target="#collapsePresentations" aria-expanded="false" aria-controls="collapsePresentations">
                    Paper Presentations
                </button>
            </h2>
            <div id="collapsePresentations" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                <section class="col-lg-12">
                    <article class="card">
                        <div class="card-body">
                            <h5 class="card-title">List of Paper Presentations</h5>
                            <div class="d-flex justify-content-between mb-3">
                                <form class="form-inline">
                                    <input class="form-control" type="search" oninput="searchpresentations(value)" placeholder="Search" aria-label="Search">
                                </form>
                                <div class="ms-auto d-flex">
                                    @if(Auth::user()->position != 5)
                                        <button type="button" class="btn btn-outline-primary me-2" id="presentation-modal">
                                            <i class="bi bi-plus-circle-fill"></i>
                                        </button>
                                    @endif
                                    <form id="presentationCsvDownloadForm" method="GET" action="{{ route('PresentationCSV') }}">
                                        <input type="hidden" name="school_year" id="presentationCsvYearInput">
                                        <input type="hidden" name="semester" id="presentationCsvSemesterInput">
                                        <button type="submit" class="btn btn-outline-info">
                                            <i class="bi bi-printer-fill"></i> CSV
                                        </button>
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


@include('layouts.modals.faculty_staff_profile_modals.faculty_staff_profile_modal')
@endsection
@section('scripts')
<script src="{{ asset('js/faculty_staff_profile/faculty_staff_profile.js') }}"> </script>
@endsection