@extends('layouts.app')

@section('content')

<section class="section dashboard">
    {{-- ADMIN DASHBOARD --}}
    <div class="row mb-4">
        <!-- Left side columns -->
        <div class="col-lg-12">
            <div class="row">
                <!-- Total Programs -->
                <div class="col-md-6 col-xl-6 mb-4">
                    <div class="card info-card revenue-card">
                        <div class="card-body">
                            <h5 class="card-title">Programs</h5>
                            <div class="d-flex align-items-center">
                                <div class="card-icon rounded-circle d-flex align-items-center justify-content-center">
                                    <i class="bi bi-display"></i>
                                </div>
                                <div class="ps-3">
                                    <h6>{{ $program_count }}</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Total Departments -->
                <div class="col-md-6 col-xl-6 mb-4">
                    <div class="card info-card revenue-card">
                        <div class="card-body">
                            <h5 class="card-title">Departments</h5>
                            <div class="d-flex align-items-center">
                                <div class="card-icon rounded-circle d-flex align-items-center justify-content-center">
                                    <i class="bi bi-building text-warning"></i>
                                </div>
                                <div class="ps-3">
                                    <h6>{{ $department_count - 1 }}</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

    <!-- Number of Faculty -->
    <!-- <div class="col-lg-4 col-md-6">
        <div class="card info-card revenue-card">
            <div class="card-body">
                <h5 class="card-title">Number of Faculty</h5>
                <div class="d-flex align-items-center">
                    <div class="card-icon rounded-circle d-flex align-items-center justify-content-center">
                        <i class="bi bi-people"></i>
                    </div>
                    <div class="ps-3">
                        <h6>{{ $faculty_count }}</h6>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div> -->
<!-- End -->

<!--Enrollees Reports -->
<div class="col-12">
  <div class="card">
    <div class="card-body">
      <h5 class="card-title">Enrollees Report | <span class="enrolees-text"></span></h5>
      <div class="d-flex justify-content-start mb-2">
        <div class="form-group me-2">
          <label class="form-label">Filter Mode</label>
          <select id="filterMode" class="form-select">
            <option value="academic_year" selected>By Academic Year</option>
            <option value="program">By Program</option>
          </select>
        </div>

        <!-- By Academic Year Filters -->
        <div id="academicYearFilters" class="d-flex">
          <div class="form-group me-2">
            <label for="school_year" class="form-label">Academic Year</label>
            <select id="school_year" class="form-select">
              <option disabled selected value="">Academic Year</option>
              @foreach ($schoolYears as $schoolYear)
                <option value="{{ $schoolYear->school_year }}">{{ $schoolYear->school_year }}</option>
              @endforeach
            </select>
          </div>

          <div class="form-group me-2">
            <label for="semester" class="form-label">Semester</label>
            <select id="semester" class="form-select">
              <option disabled selected value="">Semester</option>
              <option value="1st Semester">1st Semester</option>
              <option value="2nd Semester">2nd Semester</option>
            </select>
          </div>
        </div>

        <!-- By Program Filters -->
        <div id="programFilters" style="display: none;">
          <div class="form-group me-2">
            <label for="programSelect" class="form-label">Program</label>
            <select id="programSelect" class="form-select">
              <option disabled selected value="">Select Program</option>
              @foreach ($programs as $program)
                <option value="{{ $program->id }}">{{ $program->abbreviation }}</option>
              @endforeach
            </select>
          </div>
        </div>
      </div>

      <!-- Chart -->
      <div id="enrolees-chart"></div>
    </div>
  </div>
</div><!-- End Reports -->

<script>
  document.getElementById('filterMode').addEventListener('change', function () {
    var filterMode = this.value;
    var academicYearFilters = document.getElementById('academicYearFilters');
    var programFilters = document.getElementById('programFilters');

    // Adjust visibility based on the selected filter mode
    if (filterMode === 'program') {
      academicYearFilters.classList.add('d-none');  // Hide academic year filters
      programFilters.classList.remove('d-none');  // Show program filters
    } else {
      academicYearFilters.classList.remove('d-none');  // Show academic year filters
      programFilters.classList.add('d-none');  // Hide program filters
    }
  });
</script>


<!-- Research & Extension Reports Row -->
<div class="row">
    <!-- Research Reports -->
    <div class="col-lg-6 col-md-12">
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">Research Report | <span class="research_year_text">All data</span></h5>
                <div class="d-flex justify-content-between align-items-end">
                    <div class="d-flex">
                        <div class="form-group me-2">
                            <label for="research-year" class="form-label">Research Year</label>
                            <select id="research-year" class="form-select" aria-label="Year">
                                <option disabled selected value="">Research Year</option>
                                @foreach ($research_year as $year)
                                    <option value="{{ $year->year }}">{{ $year->year }}</option>
                                @endforeach
                            </select>
                        </div>
                        <div class="form-group me-2">
                            <label for="research-status" class="form-label">Status</label>
                            <select id="research-status" class="form-select" aria-label="Status">
                                <option disabled selected value="">Status</option>
                                <option value="Ongoing">Ongoing</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                    </div>
                    <button class="btn btn-outline-primary" id="reset-research">
                        <i class="bi bi-database"></i> All Data
                    </button>
                </div>
                <!-- Line Chart -->
                <div id="research-report"></div>
            </div>
        </div>
    </div><!-- End Research -->

    <!-- Extension Reports -->
    <div class="col-lg-6 col-md-12">
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">Extension Report | <span class="extension_year_text"> All data</span></h5>
                <div class="d-flex justify-content-between align-items-end">
                    <div class="form-group me-2">
                        <label for="extension-year" class="form-label">Extension Year</label>
                        <select id="extension-year" class="form-select" aria-label="Year">
                            <option disabled selected value="">Extension Year</option>
                            @foreach ($extension_year as $year)
                                <option value="{{$year->year}}">{{$year->year}}</option>
                            @endforeach
                        </select>
                    </div>
                    <button class="btn btn-outline-primary" id="reset-extension">
                        <i class="bi bi-database"></i> All Data
                    </button>
                </div>
                <!-- Line Chart -->
                <div id="extension-report"></div>
            </div>
        </div>
    </div><!-- End Extension -->
</div><!-- End row -->



          <div class="col-12">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Licensure Exam | <span class="licensure_year_text"> All data</span></h5>
                <div class="d-flex justify-content-between align-items-end">
                    <!-- 
                    <div class="form-group me-2">
                      <label for="yearSelect" class="form-label">Exam type</label>
                      <select id="exam-type" class="form-select" aria-label="Select Exam">
                          <option disabled selected value="">Select Exam</option>
                          @foreach ($exam_types as $exam)
                            <option data-name="{{ $exam->type }}" value="{{$exam->id}}">{{$exam->type}}</option>
                          @endforeach
                      </select>
                    </div>
                    -->
                    <div class="form-group me-2">
                      <label for="yearSelect" class="form-label">Year</label>
                      <select id="licensure-year" class="form-select" aria-label="Year">
                          <option disabled selected value="">Year</option>
                          @foreach ($licensure_year as $year)
                            <option value="{{ $year->year }}">{{ $year->year }}</option>
                          @endforeach
                      </select>
                    </div>
                    <button class="btn btn-outline-primary" id="reset-licensure">
                        <i class="bi bi-database"></i> All Data
                    </button>
                </div>
                <!-- Line Chart -->
                <div id="licensure-exam-chart"></div>
              </div>
            </div>
          </div><!-- End Reports -->

        <!-- <div class="card">
            <div class="card-body">
                <h5 class="card-title">Educational Attainment Report</h5>
                <div class="row mb-3">
                    <div class="col-md-4">
                        <select name="school_year" id="school_year" class="form-select" data-default-year="{{ $defaultAcademicYears->school_year }}">
                            @foreach($educational_attainment_years as $year)
                                <option value="{{ $year->school_year }}"
                                    {{ $year->school_year == $defaultAcademicYears->school_year ? 'selected' : '' }}>
                                    {{ $year->school_year }}
                                </option>
                            @endforeach
                        </select>
                    </div>
                    <div class="col-md-4">
                        <select id="semester" class="form-select" data-default-semester="{{ $defaultAcademicYears->semester }}">
                            <option value="1st Semester" {{ $defaultAcademicYears->semester == '1st Semester' ? 'selected' : '' }}>1st Semester</option>
                            <option value="2nd Semester" {{ $defaultAcademicYears->semester == '2nd Semester' ? 'selected' : '' }}>2nd Semester</option>
                        </select>
                    </div>
                </div>
                <div style="max-width: 500px; margin: auto;">
                    <canvas id="educationPieChart" width="300" height="300"></canvas>
                </div>
            </div>
        </div> -->

        </div>
      </div><!-- End Left side columns -->
    </div>
 
    {{-- END ADMIN DASHBOARD --}}

</section>
@endsection

@section('scripts')
  <script src="{{ asset('js/admin_index.js') }}"></script>
@endsection