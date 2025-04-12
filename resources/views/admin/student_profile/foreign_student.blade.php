@extends('layouts.app')
@section('content')
    <div class="container">
        <div class="row">
            <section class="col-lg-12">    
                <article class="card">
                    <div class="card-body">
                        <h5 class="card-title">Enrollment distribution of foreign students</h5>
                        <div class="d-flex justify-content-between mb-3">
                            <form class="form-inline">
                                <input class="form-control mr-sm-2" type="search" oninput="searchForeignStudent(value)" placeholder="Search" aria-label="Search">
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
                                <button type="button" class="btn btn-outline-primary me-2" id="add-foreign-student-modal">
                                    <i class="bi bi-plus-circle-fill"></i>
                                </button>
                            @endif
                                <form id="foreignStudentCsvDownloadForm" class="form-inline" method="GET" action="{{ route('ForeignStudentCSV') }}">
                                    <input type="hidden" name="year" id="foreignStudentCsvYearInput">
                                    <input type="hidden" name="semester" id="foreignStudentCsvSemesterInput">
                                    @if(Auth::user()->position == 1)
                                    <button type="submit" class="btn btn-outline-info">
                                        <i class="bi bi-printer-fill"> CSV </i>
                                    </button>
                                    @endif
                                </form>
                            </div>
                        </div>
                        <div id="foreign-students-table"></div>
                    </div>
                </article>
            </section>
        </div>
    </div>
@include('layouts.modals.student_profile_modals.foreign_student_modal')
@endsection
@section('scripts')
<script src="{{ asset('js/student_profile/foreign_student.js') }}"> </script>
@endsection