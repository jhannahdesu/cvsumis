@extends('layouts.app')
@section('content')
<script>
    window.userPosition = {{ Auth::user()->position }};
</script>

    <div class="container">
    @if(Auth::user()->position != 5)
        <div class="row">
            <section class="col-lg-12">    
                <article class="card">
                    <div class="card-body">
                        <h5 class="card-title">Infrastructure Development Form</h5>
                        <form class="row g-3 needs-validation" id="infrastracture-form" novalidate>
                            @csrf
                    
                            <div class="col-md-6">
                                <label for="infrastracture" class="form-label">Infrastructure</label>
                                <input type="text" class="form-control" id="infrastracture" name="infrastracture" required>
                                <div class="valid-feedback">
                                    Looks good!
                                </div>
                            </div>
            
                            <div class="col-md-6">
                                <label for="status" class="form-label">Status</label>
                                <select class="form-select" id="status" name="status" required>
                                    <option selected disabled value="">Select Status</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Ongoing">Ongoing</option>
                                </select>
                                <div class="valid-feedback">
                                    Looks good!
                                </div>
                            </div>
    
                            <div class="col-md-6">
                                <button type="button" class="btn btn-outline-info btn-sm px-4" id="submit-infrastracture-btn">
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
                        <h5 class="card-title">Infrastructure Development List</h5>
                        <div class="d-flex justify-content-between mb-3">
                            <form class="form-inline">
                                <input class="form-control mr-sm-2" type="search" oninput="searchinfrastructures(value)" placeholder="Search" aria-label="Search">
                            </form>
                            
                        <div class="ms-auto d-flex">
                            <form id="infrastructureCsvDownloadForm" class="form-inline" method="GET" action="{{ route('InfrastructureCSV') }}">
                                <input type="hidden" name="school_year" id="infrastructureCsvYearInput">
                                <input type="hidden" name="semester" id="infrastructureCsvSemesterInput">
                               
                                <button type="submit" class="btn btn-outline-info">
                                    <i class="bi bi-printer-fill"> CSV </i>
                                </button>
                                
                            </form>
                        </div>
                        </div>
                        <div id="infrastracture-table"></div>
                    </div>
                </article>
            </section>
        </div>
    </div>
@include('layouts.modals.infrastracture_development_modals.infrastracture_development_modal')
@endsection
@section('scripts')
<script src="{{ asset('js/infrastracture_development/infrastracture_development.js') }}"> </script>
@endsection