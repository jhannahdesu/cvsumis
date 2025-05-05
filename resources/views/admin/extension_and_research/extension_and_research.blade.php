@extends('layouts.app')
@section('content')
<script>
    window.userPosition = {{ Auth::user()->position }};
</script>

<div class="container">
    <div class="row">
        <div class="accordion mt-2" id="accordionFlushExample">

            {{-- List of on-going and completed faculty researches funded by the University  --}}
            <div class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button collapsed custom-orange" type="button" data-bs-toggle="collapse" data-bs-target="#List-of-on-going-and-completed-faculty-researches-funded-by-the-University" aria-expanded="false" aria-controls="List-of-on-going-and-completed-faculty-researches-funded-by-the-University">
                        List of on-going and completed faculty researches funded by the University
                    </button>
                </h2>
                <div id="List-of-on-going-and-completed-faculty-researches-funded-by-the-University" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                    <section class="col-lg-12">    
                        <article class="card">
                            <div class="card-body">
                                <h5 class="card-title">List of on-going and completed faculty researches funded by the University</h5>
                                <div class="d-flex justify-content-between mb-3">
                                    <form class="form-inline">
                                        <input class="form-control mr-sm-2" type="search" oninput="searchuniversityResearchs(value)" placeholder="Title" aria-label="Search">
                                    </form>

                                    <div class="d-flex">
                                        <select id="universityResearchs-filter-type" class="form-select ms-2 me-1">
                                            <option value="all" disabled selected>Date Filter</option>
                                            <option value="all">All</option>
                                            <option value="monthly">Monthly</option>
                                            <option value="quarterly">Quarterly</option>
                                            <option value="yearly">Yearly</option>
                                        </select>

                                        <select id="universityResearchs-filter-year" style="display:none;" class="form-select me-1"></select>
                                        <select id="universityResearchs-filter-value" style="display:none;" class="form-select me-1"></select>
                                    </div>
                                    
                                    <div class="ms-auto d-flex">
                                        @if(Auth::user()->position != 5)
                                        <button type="button" class="btn btn-outline-primary me-2" id="university-research-modal">
                                            <i class="bi bi-plus-circle-fill"></i>
                                        </button>
                                        @endif
                                        <!-- <form id="universityResearchCsvDownloadForm" class="form-inline" method="GET" action="{{ route('UniversityResearchCSV') }}">
                                            <input type="hidden" name="school_year" id="universityResearchCsvYearInput">
                                            <input type="hidden" name="semester" id="universityResearchCsvSemesterInput">
                                                
                                            <button type="submit" class="btn btn-outline-info">
                                                <i class="bi bi-printer-fill"> CSV </i>
                                            </button>  
                                        </form> -->
                                        <button type="button" id="universityResearchs-download-csv" class="btn btn-outline-info">
                                            <i class="bi bi-printer-fill"> CSV </i>
                                        </button>
                                    </div>
                                </div>
                                <div id="university-research-table"></div>
                            </div>
                        </article>
                    </section>
                </div>
            </div>
        

            {{-- List of extension activities conducted  --}}
            <div class="accordion-item">
                <h2 class="accordion-header" id="headingExtension">
                    <button class="accordion-button collapsed custom-orange" type="button" data-bs-toggle="collapse" data-bs-target="#List-of-extension-activities-conducted" aria-expanded="false" aria-controls="List-of-extension-activities-conducted">
                        List of extension activities conducted 
                        </button>
                </h2>
                <div id="List-of-extension-activities-conducted" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                    <section class="col-lg-12">    
                        <article class="card">
                            <div class="card-body">
                                <h5 class="card-title">List of extension activities conducted </h5>
                                    <div class="d-flex justify-content-between mb-3">
                                        <form class="form-inline">
                                            <input class="form-control mr-sm-2" type="search" oninput="searchextensionActvities(value)" placeholder="Activity" aria-label="Search">
                                        </form>

                                        <div class="d-flex">
                                            <select id="extensionActvities-filter-type" class="form-select ms-2 me-1">
                                                <option value="all" disabled selected>Date Filter</option>
                                                <option value="all">All</option>
                                                <option value="monthly">Monthly</option>
                                                <option value="quarterly">Quarterly</option>
                                                <option value="yearly">Yearly</option>
                                            </select>

                                            <select id="extensionActvities-filter-year" style="display:none;" class="form-select me-1"></select>
                                            <select id="extensionActvities-filter-value" style="display:none;" class="form-select me-1"></select>
                                        </div>

                                    <div class="ms-auto d-flex">
                                    @if(Auth::user()->position != 5)
                                        <button type="button" class="btn btn-outline-primary me-2" id="extension-activity-modal">
                                            <i class="bi bi-plus-circle-fill"></i>
                                        </button>
                                    @endif
                                        <button type="button" id="extensionActvities-download-csv" class="btn btn-outline-info">
                                            <i class="bi bi-printer-fill"> CSV </i>
                                        </button>
                                    <!-- <form id="extensionActivityCsvDownloadForm" class="form-inline" method="GET" action="{{ route('ExtensionActivityCSV') }}">
                                        <input type="hidden" name="school_year" id="extensionActivityCsvYearInput">
                                        <input type="hidden" name="semester" id="extensionActivityCsvSemesterInput">
                                        
                                        <button type="submit" class="btn btn-outline-info">
                                            <i class="bi bi-printer-fill"> CSV </i>
                                        </button>
                                        
                                    </form> -->
                                    </div>
                                    </div>
                                <div id="extension-activity-table"></div>
                            </div>
                        </article>
                    </section>
                </div>
            </div>
        </div>
    </div>
</div>
@include('layouts.modals.extension_and_research.extension_and_research_modals')
@endsection
@section('scripts')
<script src="{{ asset('js/extension_and_research/extension_and_research.js') }}"> </script>
@endsection