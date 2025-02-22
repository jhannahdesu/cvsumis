<div class="modal fade" id="EnrollmentModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="staticBackdropLabel">Enrollment</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <form class="row g-3 needs-validation" id="enrollment-form" novalidate>
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
                
                <div class="col-md-4">
                    <label for="number_of_student" class="form-label">Number of Student</label>
                    <input type="number" class="form-control" id="number_of_student" name="number_of_student" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-4">
                    <label for="semester" class="form-label">Semester</label>
                    <select class="form-select" id="semester" name="semester" required>
                        <option selected @readonly(true) value="{{ $defaultAcademicYears->semester }}">{{ $defaultAcademicYears->semester }}</option>
                        <option value="1st Semester">1st Semester</option>
                        <option value="2nd Semester">2nd Semester</option>
                    </select>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

                <div class="col-md-4">
                    <label for="school_year" class="form-label">School Year</label>
                    <select class="form-select" id="school_year" name="school_year" required>
                        <option selected @readonly(true) value="{{ $defaultAcademicYears->school_year }}">{{ $defaultAcademicYears->school_year }}</option>
                        @foreach ($academicYears as $academicYear)
                            <option value="{{ $academicYear->year_start.'-'.$academicYear->year_end }}">{{ $academicYear->year_start.'-'.$academicYear->year_end  }}</option>
                        @endforeach
                    </select>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>
            </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary btn-sm px-3" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary btn-sm px-3" id="submit-enrollment-btn">Submit</button>
        </div>
      </div>
    </div>
</div>

<div class="modal fade" id="EditEnrollmentModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="staticBackdropLabel">Update Enrollment</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <div class="d-flex justify-content-center">
                <div class="spinner-border text-primary" id="loading" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
            </div>
            <form class="row g-3 needs-validation" id="view-enrollment-form" novalidate>
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
                
                <div class="col-md-4">
                    <label for="number_of_student" class="form-label">Number of Student</label>
                    <input type="number" class="form-control" id="view_number_of_student" name="number_of_student" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>

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
            </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary btn-sm px-3" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary btn-sm px-3" id="update-enrollment-btn">Submit</button>
        </div>
      </div>
    </div>
</div>


<script>
    // FOR RESET VALIDATION FOR MULTIPLE FORMS :D
    document.addEventListener("DOMContentLoaded", function () {
        const formModalPairs = [
            { formId: "enrollment-form", modalId: "EnrollmentModal" },
            { formId: "enrollment-form", modalId: "EditEnrollmentModal" }
        ];

        formModalPairs.forEach(function(pair) {
            const form = document.getElementById(pair.formId);
            const modal = document.getElementById(pair.modalId);

            modal?.addEventListener("hidden.bs.modal", function () {
                form.classList.remove("was-validated");
                form.reset();
            });
        });
    });
</script>
