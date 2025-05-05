@extends('layouts.app')
@section('content')
<!-- <script src="https://cdn.jsdelivr.net/npm/dayjs@1.10.7/dayjs.min.js"></script> -->
<script>
    window.userPosition = {{ Auth::user()->position }};
</script>

    <div class="container">
        <div class="row">
            <section class="col-lg-12">    
                <article class="card">
                    <div class="card-body">
                        <h5 class="card-title">Enrollment distribution</h5>
                        <div class="d-flex justify-content-between mb-3">
                            <form class="form-inline">
                                <input class="form-control mr-sm-2" type="search" oninput="searchEnrollment(value)" placeholder="Search" aria-label="Search">
                            </form>
                            <div class="d-flex justify-content-between">
                                <select id="filter-type" class="form-select ms-2 me-1">
                                    <option value="all" disabled selected>Date Filter  </option>
                                    <option value="all">All</option>
                                    <option value="monthly">Monthly</option>
                                    <option value="quarterly">Quarterly</option>
                                    <option value="yearly">Yearly</option>
                                </select>

                                <select id="filter-year" style="display:none;" class="form-select me-1"></select>
                                <select id="filter-value" style="display:none;" class="form-select me-1"></select>
                            </div>                         
                            <div class="ms-auto d-flex justify-content-between">
                            @if(Auth::user()->position != 5)
                                <button type="button" class="btn btn-outline-dark-orange me-2" id="enrollment-modal">
                                    <i class="bi bi-plus-circle-fill"></i>
                                </button>
                            @endif
                                <button id="download-csv" type="button" class="btn btn-outline-info">
                                    <i class="bi bi-printer-fill"> CSV </i>
                                </button>
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