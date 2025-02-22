@extends('layouts.app')
@section('content')

    <div class="container">
        <div class="row">
            <section class="col-lg-12">    
                <article class="card">
                    <div class="card-body">
                        <h5 class="card-title">Attachment Form</h5>
                        <form class="row g-3 needs-validation" id="report-attachment-form" enctype="multipart/form-data" novalidate>
                            @csrf

                            <div class="col-md-12">
                                <label for="module_id" class="form-label">Module</label>
                                <select class="form-select" id="module_id" name="module_id" required>
                                    <option selected disabled value="">Select Module</option>
                                    @foreach ($modules as $module)
                                        @if($module->id != 10)
                                            <option value="{{ $module->id }}">{{ ucwords(strtolower($module->module)) }}</option>
                                        @endif
                                    @endforeach
                                </select>
                                <div class="valid-feedback">
                                    Looks good!
                                </div>
                            </div>

                            <div class="col-md-12">
                                <label for="attachment_detail" class="form-label">Attachment File</label>
                                <input type="file" class="form-control" name="attachment[]" id="attachment" multiple required>
                                <div class="valid-feedback">
                                    Looks good!
                                </div>
                            </div>

                            <div class="col-md-12">
                                <label for="attachment_detail" class="form-label">Attachment Detail</label>
                                <input type="text" class="form-control" id="attachment_detail" name="attachment_detail" required>
                                <div class="valid-feedback">
                                    Looks good!
                                </div>
                            </div>
                            <div class="col-md-6">
                                <button type="button" class="btn btn-outline-info btn-sm px-4" id="submit-attachment-btn">
                                    Submit
                                </button>
                            </div>
                            
                        </form>
                    </div>
                </article>
            </section>
        </div>
        <div class="row">
            <section class="col-lg-12">    
                <article class="card">
                    <div class="card-body">
                        <h5 class="card-title">Attachment List</h5>
                        <div class="d-flex justify-content-between mb-3">
                            <form class="form-inline">
                                <input class="form-control mr-sm-2" type="search" oninput="searchEnrollment(value)" placeholder="Search" aria-label="Search">
                            </form>
                        </div>
                        <div id="attachment-header-table"></div>
                    </div>
                </article>
            </section>
        </div>
    </div>


<script>
    // FOR RESET VALIDATION FOR REPORT ATTACHMENT FORM :D
    document.addEventListener("DOMContentLoaded", function () {
        const form = document.getElementById("report-attachment-form");

        form?.addEventListener("reset", function () {
            form.classList.remove("was-validated");
        });
    });
</script>

@include('layouts.modals.report_attachment_modal')
@endsection
@section('scripts')
<script src="{{ asset('js/report_attachment.js') }}"> </script>
@endsection