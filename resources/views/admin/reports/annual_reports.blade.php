@extends('layouts.app')
@section('content')

    <div class="container">
        <div class="row">
            <section class="col-lg-12">    
                <article class="card">
                    <div class="card-body">
                        <h5 class="card-title">Annual Reports</h5>
                        <div class="d-flex justify-content-between mb-3">
                            <form class="form-inline">
                                <input class="form-control mr-sm-2" type="search" oninput="searchreports(value)" placeholder="Search" aria-label="Search">
                            </form>
                        
                            <div class="ms-auto d-flex">
                                <button type="button" class="btn btn-outline-info" id="generate-annual-report-modal">
                                    <i class="bi bi-printer-fill"></i>
                                </button>
                            </div>
                        </div>
                        <div id="annual-reports-table"></div>
                    </div>
                </article>
            </section>
        </div>
    </div>
@include('layouts.modals.manage_annual_report_modal')
@endsection
@section('scripts')
<script src="{{ asset('js/annual_report.js') }}"> </script>
@endsection