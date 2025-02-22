@extends('layouts.app')
@section('content')

    <div class="container">
        <div class="row">
            <section class="col-lg-12">    
                <article class="card">
                    <div class="card-body">
                        <h5 class="card-title">Enrollment List</h5>
                        <div class="d-flex justify-content-between mb-3">
                            <form class="form-inline">
                                <input class="form-control mr-sm-2" type="search" oninput="searchEnrollment(value)" placeholder="Search" aria-label="Search">
                            </form>
                        
                            <form class="form-inline">
                                <select class="form-select ml-2" id="filter-status">
                                    <option value="" selected>Filter Academic Year</option>
                                    @foreach ($enrollmentYears as $academicYear)
                                        <option value="{{ $academicYear->school_year}}">{{ $academicYear->school_year}}</option>
                                    @endforeach
                                    
                                    
                                </select>
                            </form>
                        
                            
                            <div class="ms-auto d-flex">
                            @if(Auth::user()->position != 5)
                                <button type="button" class="btn btn-outline-primary me-2" id="graduate-modal">
                                    <i class="bi bi-plus-circle-fill"></i>
                                </button>
                            @endif
                                <form id="graduateCsvDownloadForm" class="form-inline" method="GET" action="{{ route('GraduateCSV') }}">
                                    <input type="hidden" name="year" id="graduateCsvYearInput">
                                    <input type="hidden" name="semester" id="graduateCsvSemesterInput">
                                    @if(Auth::user()->position == 1)
                                    <button type="submit" class="btn btn-outline-info">
                                        <i class="bi bi-printer-fill"> CSV </i>
                                    </button>
                                    @endif
                                </form>
                            </div>
                        </div>
                        <div id="enrollment-table"></div>
                    </div>
                </article>
            </section>
        </div>
    </div>

@include('layouts.modals.student_profile_modals.enrollment_modal')
@endsection
@section('scripts')
<script src="{{ asset('js/student_profile/enrollment.js') }}"> </script>
@endsection