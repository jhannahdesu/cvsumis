@extends('layouts.app')
@section('content')
<script>
    window.userPosition = {{ Auth::user()->position }};
</script>
<meta name="csrf-token" content="{{ csrf_token() }}">
<div class="container" >
    <div class="row">
        <div class="accordion" id="accordionFlushExample">

            {{-- Accordion Item: Accreditation Status --}}
            <div class="accordion-item">
                <h2 class="accordion-header" id="headingOne">
                    <button class="accordion-button collapsed custom-orange" class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#Accreditation-status-of-academic-programs" aria-expanded="false" aria-controls="Accreditation-status-of-academic-programs">
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
                                        <input class="form-control mr-sm-2" type="search" oninput="searchAcademicProgram(value)" placeholder="Search" aria-label="Search" style="width: 200px;">
                                    </form>

                                    <div class="d-flex">
                                        <select id="accreditation-filter-type" class="form-select ms-2 me-1">
                                            <option value="all" disabled selected>Date Filter</option>
                                            <option value="all">All</option>
                                            <option value="monthly">Monthly</option>
                                            <option value="quarterly">Quarterly</option>
                                            <option value="yearly">Yearly</option>
                                        </select>

                                        <select id="accreditation-filter-year" style="display:none;" class="form-select me-1"></select>
                                        <select id="accreditation-filter-value" style="display:none;" class="form-select me-1"></select>
                                    </div>

                                    <div class="ms-auto d-flex">
                                        @if(Auth::user()->position != 5)
                                        <button type="button" class="btn btn-outline-dark-orange me-2" id="accreditation-status-modal">
                                            <i class="bi bi-plus-circle-fill"></i>
                                        </button>
                                        @endif
                                        <button type="button" id="accreditation-download-csv" class="btn btn-outline-info">
                                            <i class="bi bi-printer-fill"> CSV </i>
                                        </button>
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
                    <button class="accordion-button collapsed custom-orange"class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#Academic-programs-with-Government-Recognition" aria-expanded="false" aria-controls="Academic-programs-with-Government-Recognition">
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
                                        <input class="form-control mr-sm-2" type="search" oninput="searchRecognition(value)" placeholder="Search" aria-label="Search" style="width: 200px;">
                                    </form>

                                    <div class="d-flex justify-content-between">
                                        <select id="gov-filter-type" class="form-select ms-2 me-1">
                                            <option value="all" disabled selected>Date Filter</option>
                                            <option value="all">All</option>
                                            <option value="monthly">Monthly</option>
                                            <option value="quarterly">Quarterly</option>
                                            <option value="yearly">Yearly</option>
                                        </select>

                                        <select id="gov-filter-year" style="display:none;" class="form-select me-1"></select>
                                        <select id="gov-filter-value" style="display:none;" class="form-select me-1"></select>
                                    </div>

                                    <div class="ms-auto d-flex">
                                        @if(Auth::user()->position != 5)
                                            <button type="button" class="btn btn-outline-dark-orange me-2" id="gov-recognition-modal">
                                                <i class="bi bi-plus-circle-fill"></i>
                                            </button>
                                        @endif
                                        <button id="gov-recognition-csv" class="btn btn-outline-info">
                                            <i class="bi bi-printer-fill"> CSV </i>
                                        </button>
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
                    <button class="accordion-button collapsed custom-orange"class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#Performance-in-the-licensure-examination" aria-expanded="false" aria-controls="Performance-in-the-licensure-examination">
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
                                        <!-- <input class="form-control mr-sm-2" type="search" oninput="searchLicensureExam(value)" placeholder="Search" aria-label="Search"> -->
                                        <input class="form-control mr-sm-2" id="licensure-search" type="search" placeholder="Search" aria-label="Search" />
                                    </form>

                                    <div class="d-flex justify-content-between">
                                        <select id="licensure-filter-type" class="form-select ms-2 me-1">
                                            <option value="all" disabled selected>Date Filter</option>
                                            <option value="all">All</option>
                                            <option value="monthly">Monthly</option>
                                            <option value="quarterly">Quarterly</option>
                                            <option value="yearly">Yearly</option>
                                        </select>
                                        <select id="licensure-filter-year" style="display:none;" class="form-select me-1"></select>
                                        <select id="licensure-filter-value" style="display:none;" class="form-select me-1"></select>
                                    </div>

                                    <div class="ms-auto d-flex">
                                        @if(Auth::user()->position != 5)
                                            <button type="button" class="btn btn-outline-dark-orange me-2" id="licensure-exam-modal">
                                                <i class="bi bi-plus-circle-fill"></i>
                                            </button>
                                        @endif
                                        <button id="licensure-exam-csv" type="submit" class="btn btn-outline-info">
                                            <i class="bi bi-printer-fill"> CSV </i>
                                        </button>
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
                    <button class="accordion-button collapsed custom-orange"class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#List-of-faculty-members-with-national-TVET" aria-expanded="false" aria-controls="List-of-faculty-members-with-national-TVET">
                        List of faculty members with national TVET qualification and certification 
                    </button>
                </h2>
                <div id="List-of-faculty-members-with-national-TVET" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                    <section class="col-lg-12">    
                        <article class="card">
                            <div class="card-body">
                                <h5 class="card-title">List of faculty members with national TVET qualification and certification</h5>
                                <div class="d-flex justify-content-between mb-3">
                                    <form class="form-inline">
                                        <input class="form-control mr-sm-2" type="search" oninput="searchfacultyTvets(value)" placeholder="Search" aria-label="Search" style="width: 250px;">
                                    </form>
                                    
                                    <div class="d-flex justify-content-between">
                                        <select id="filter-type" class="form-select ms-2 me-1">
                                            <option value="all" disabled selected>Date Filter</option>
                                            <option value="all">All</option>
                                            <option value="monthly">Monthly</option>
                                            <option value="quarterly">Quarterly</option>
                                            <option value="yearly">Yearly</option>
                                        </select>

                                        <select id="filter-year" style="display:none;" class="form-select me-1"></select>
                                        <select id="filter-value" style="display:none;" class="form-select me-1"></select>
                                    </div> 

                                    <div class="ms-auto d-flex">
                                        @if(Auth::user()->position != 5)
                                            <button type="button" class="btn btn-outline-dark-orange me-2" id="faculty-tvet-modal">
                                                <i class="bi bi-plus-circle-fill"></i>
                                            </button>
                                        @endif
                                        <button id="faculty-withTVET-csv" class="btn btn-outline-info">
                                            <i class="bi bi-printer-fill"> CSV </i>
                                        </button>
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
                    <button class="accordion-button collapsed custom-orange"class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#Number-of-students-with-national-TVET" aria-expanded="false" aria-controls="Number-of-students-with-national-TVET">
                        Number of students with national TVET qualification and certification 
                    </button>
                </h2>
                <div id="Number-of-students-with-national-TVET" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                    <section class="col-lg-12">    
                        <article class="card">
                            <div class="card-body">
                                <h5 class="card-title">Number of students with national TVET qualification and certification</h5>
                                <div class="d-flex justify-content-between mb-3">
                                    <form class="form-inline">
                                        <input class="form-control mr-sm-2" type="search" oninput="searchstudentTvets(value)" placeholder="Search" aria-label="Search">
                                    </form>
                                    <div class="d-flex justify-content-between">
                                        <select id="student-filter-type" class="form-select ms-2 me-1">
                                            <option value="all" disabled selected>Date Filter</option>
                                            <option value="all">All</option>
                                            <option value="monthly">Monthly</option>
                                            <option value="quarterly">Quarterly</option>
                                            <option value="yearly">Yearly</option>
                                        </select>

                                        <select id="student-filter-year" style="display:none;" class="form-select me-1"></select>
                                        <select id="student-filter-value" style="display:none;" class="form-select me-1"></select>
                                    </div>
                                    <div class="ms-auto d-flex justify-content-between">
                                        @if(Auth::user()->position != 5)
                                            <button type="button" class="btn btn-outline-dark-orange me-2" id="student-tvet-modal">
                                                <i class="bi bi-plus-circle-fill"></i>
                                            </button>
                                        @endif
                                        <button id="student-withTVET-csv" class="btn btn-outline-info">
                                            <i class="bi bi-printer-fill"> CSV </i>
                                        </button>
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