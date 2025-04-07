

@extends('layouts.app')
@section('content')

<div class="container">
    <div class="row">
        <section class="col-lg-12">    
            <article class="card">
                <div class="card-body">
                    <h5 class="card-title">File Archive</h5>
                    <div class="d-flex justify-content-between mb-3">
                        <form class="form-inline">
                            <input class="form-control mr-sm-2" type="search" oninput="searchreports(value)" placeholder="Search" aria-label="Search">
                        </form>
                    
                        <div class="form-group ms-2">
                            <button type="button" class="btn btn-outline-info" id="generate-file-report-modal">
                                <i class="bi bi-printer-fill"></i>
                            </button>
                            <button type="button" class="btn btn-outline-danger" id="delete-selected-files">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                    <div id="reports-table"></div>
                </div>
            </article>
        </section>
    </div>
</div>

@include('layouts.modals.file_archive_modal')
@endsection
@section('scripts')
<script src="{{ asset('js/file_archive.js') }}"> </script>
@endsection