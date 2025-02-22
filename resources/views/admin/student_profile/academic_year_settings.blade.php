@extends('layouts.app')
@section('content')

<div class="container">
    <form id="default_acad_form">
        <div class="row">
            <div class="col-md-6">
                <label for="semester" class="form-label">Semester</label>
                <select class="form-select" id="semester" name="semester" required>
                    <option selected disabled >Select Semester</option>
                    <option value="1st Semester">1st</option>
                    <option value="2nd Semester">2nd</option>
                </select>
                <div class="valid-feedback">
                    Looks good!
                </div>
            </div>

            <div class="col-md-6">
                <label for="school_year" class="form-label">School Year</label>
                <select class="form-select" id="school_year" name="school_year" required>
                    <option selected disabled >Select Academic Year</option>
                    @foreach ($academicYears as $academicYear)
                        <option value="{{ $academicYear->year_start.'-'.$academicYear->year_end }}">{{ $academicYear->year_start.'-'.$academicYear->year_end  }}</option>
                    @endforeach
                </select>
                <div class="valid-feedback">
                    Looks good!
                </div>
            </div>
            

            <div class="col-md-6 mt-3">
                <button type="button" class="btn btn-info btn-sm px-3" id="submit-default-acad">Set as Default</button>
            </div>
        </div>
    </form>
</div>

@endsection
@section('scripts')
<script src="{{ asset('js/default_acad_year.js') }}"> </script>
@endsection