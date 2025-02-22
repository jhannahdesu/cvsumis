
<div class="modal fade" id="EditGraduateHeaderModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="staticBackdropLabel">Update Graduate</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <div class="d-flex justify-content-center">
                <div class="spinner-border text-primary" id="loading" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
            </div>
            <form class="row g-3 needs-validation" id="view-graduate-hdr-form" novalidate>
                @csrf
                <div class="col-md-4">
                    <label for="semester" class="form-label">Semester</label>
                    <select class="form-select" id="view_semester" name="semester" required>
                        <option selected disabled value="">Select Semester</option>
                        <option value="1st Semester">1st</option>
                        <option value="2nd Semester">2nd</option>
                    </select>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-4">
                    <label for="school_year" class="form-label">School Year</label>
                    <select class="form-select" id="view_school_year" name="school_year" required>
                        <option selected disabled value="">Select Academic Year</option>
                        @foreach ($academicYears as $academicYear)
                        <option value="{{ $academicYear->year_start.'-'.$academicYear->year_end }}">{{ $academicYear->year_start.'-'.$academicYear->year_end  }}</option>
                        @endforeach
                    </select>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-4">
                    <label for="school_year" class="form-label">Date</label>
                    <input type="date" class="form-control" id="view_graduate_date" name="graduate_date" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                

                <div class="col-md-6">
                    <label for="program_id" class="form-label">Program</label>
                    <select class="form-select" id="view_program_id" name="program_id" required>
                        <option selected disabled value="">Select Program</option>
                        @foreach ($programs as $program)
                            <option value="{{ $program->id }}">{{ ucwords($program->program) }}</option>
                        @endforeach
                    </select>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>
                
                <div class="col-md-6">
                    <label for="number_of_student" class="form-label">Number of Student</label>
                    <input type="number" class="form-control" id="view_number_of_student" name="number_of_student" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>
            </form>
            </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary btn-sm px-3" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary btn-sm px-3" id="update-graduate-hdr-btn">Submit</button>
        </div>
      </div>
    </div>
</div>

<div class="modal fade" id="ViewGraduateHeaderModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="staticBackdropLabel">Graduate</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <article class="card">
                <div class="card-body">
                    <h5 class="card-title">Graduate List</h5>
                    <div class="d-flex justify-content-between">
                        <div class="ms-auto d-flex">
                            <button type="button" class="btn btn-outline-primary me-2" id="add-graduate-dtls-modal">
                                <i class="bi bi-plus-circle-fill"></i>
                            </button>
            
                        </div>
                    </div>
                    <div id="graduate-details-table"></div>
                </div>
            </article>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary btn-sm px-3" data-bs-dismiss="modal">Close</button>
          {{-- <button type="button" class="btn btn-primary btn-sm px-3" id="submit-graduate-btn">Submit</button> --}}
        </div>
      </div>
    </div>
</div>

<div class="modal fade" id="AddGraduateDetailsModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-md">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="staticBackdropLabel">Add Graduate Details</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <form class="row g-3 needs-validation" id="graduate-dtls-form" novalidate>
                @csrf
                <div class="col-md-12">
                    <label for="program" class="form-label">Program</label>
                    <select class="form-select" id="program_id" name="program_id" required>
                        <option selected disabled value="">Select Program</option>
                        @foreach ($programs as $program)
                            <option value="{{ $program->id }}">{{ ucwords($program->program) }}</option>
                        @endforeach
                    </select>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>
                
                <div class="col-md-12">
                    <label for="number_of_student" class="form-label">Number of Student</label>
                    <input type="number" class="form-control" id="number_of_student" name="number_of_student" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>
            </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary btn-sm px-3" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary btn-sm px-3" id="submit-graduate-dtls-btn">Submit</button>
        </div>
      </div>
    </div>
</div>

<div class="modal fade" id="EditGraduateDetailsModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-md">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="staticBackdropLabel">Add Graduate Details</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <form class="row g-3 needs-validation" id="view-graduate-dtls-form" novalidate>
                @csrf
                <div class="col-md-12">
                    <label for="program_id" class="form-label">Program</label>
                    <select class="form-select" id="view_program_id" name="program_id" required>
                        <option selected disabled value="">Select Program</option>
                        @foreach ($programs as $program)
                            <option value="{{ $program->id }}">{{ ucwords($program->program) }}</option>
                        @endforeach
                    </select>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>
                
                <div class="col-md-12">
                    <label for="number_of_student" class="form-label">Number of Student</label>
                    <input type="number" class="form-control" id="view_number_of_student" name="number_of_student" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>
            </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary btn-sm px-3" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary btn-sm px-3" id="update-graduate-dtls-btn">Submit</button>
        </div>
      </div>
    </div>
</div>