@extends('layouts.app')
@section('content')
<script>
    window.userPosition = {{ Auth::user()->position }};
</script>

    <div class="container">
        <div class="row">
            <section class="col-lg-12">    
                <article class="card">
                    <div class="card-body">
                        <h5 class="card-title">Scholarship List</h5>
                        <div class="d-flex justify-content-between mb-3">
                            <form class="form-inline">
                                <input class="form-control mr-sm-2" type="search" oninput="searchScholarship(value)" placeholder="Search" aria-label="Search">
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
                                <button type="button" class="btn btn-outline-primary me-2" id="add-scholarship-modal">
                                    <i class="bi bi-plus-circle-fill"></i>
                                </button>
                            @endif
                                <form id="scholarshipCsvDownloadForm" class="form-inline" method="GET" action="{{ route('ScholarshipCSV') }}">
                                    <input type="hidden" name="year" id="scholarshipCsvYearInput">
                                    <input type="hidden" name="semester" id="scholarshipCsvSemesterInput">
                                    
                                    <button type="submit" class="btn btn-outline-info">
                                        <i class="bi bi-printer-fill"> CSV </i>
                                    </button>
                                    
                                </form>
                            </div>
                        </div>
                        <div id="scholarship-table"></div>
                    </div>
                </article>
            </section>
        </div>
    </div>
@include('layouts.modals.student_profile_modals.scholarship_modal')
@endsection
@section('scripts')
<script src="{{ asset('js/student_profile/scholarship.js') }}"> </script>
@endsection