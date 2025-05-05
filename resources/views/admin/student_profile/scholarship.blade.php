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
                        <h5 class="card-title">Distribution of scholars by type of scholarship</h5>
                        <div class="d-flex justify-content-between mb-3">
                            <form class="form-inline">
                                <input class="form-control mr-sm-2" type="search" oninput="searchScholarship(value)" placeholder="Search" aria-label="Search">
                            </form>
                        
                            <div class="d-flex">
                                <select id="scholar-filter-type" class="form-select ms-2 me-1">
                                    <option value="all" disabled selected>Date Filter</option>
                                    <option value="all">All</option>
                                    <option value="monthly">Monthly</option>
                                    <option value="quarterly">Quarterly</option>
                                    <option value="yearly">Yearly</option>
                                </select>

                                <select id="scholar-filter-year" style="display:none;" class="form-select me-1"></select>
                                <select id="scholar-filter-value" style="display:none;" class="form-select me-1"></select>
                            </div>
                        
                            <div class="ms-auto d-flex">
                            @if(Auth::user()->position != 5)
                                <button type="button" class="btn btn-outline-dark-orange me-2" id="add-scholarship-modal">
                                    <i class="bi bi-plus-circle-fill"></i>
                                </button>
                            @endif
                                <button type="button" id="scholar-download-csv" class="btn btn-outline-info">
                                    <i class="bi bi-printer-fill"> CSV </i>
                                </button>
                                    
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